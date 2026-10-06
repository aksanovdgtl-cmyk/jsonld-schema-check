// Тесты API в Miniflare: GET /api/tools/schema-check?url=...&lang=... с подставными страницами.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { html, startWorker } from './helpers/worker.mjs';

const page = (...blocks) =>
  `<!doctype html><html><head><title>Example</title><link rel="canonical" href="https://example.com/">${blocks
    .map((b) => `<script type="application/ld+json">${b}</script>`)
    .join('')}</head><body><h1>Example</h1></body></html>`;

const ORG = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Example', url: 'https://example.com/', logo: 'https://example.com/logo.png' });
const PAGE = JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', url: 'https://example.com/' }, { '@type': 'BreadcrumbList', itemListElement: [] }] });

let worker;

before(async () => {
  worker = await startWorker({
    sites: {
      'https://example.com/': () => html(page(ORG, PAGE)),
      'https://broken.example/': () => html(page(ORG, '{"@type": "Article",}')),
      'https://relative.example/': () => html(page(JSON.stringify({ '@type': 'Organization', name: 'Example', logo: '/logo.png' }))),
      'https://untyped.example/': () => html(page(JSON.stringify({ name: 'Example' }))),
      'https://none.example/': () => html(page()),
    },
  });
});

after(() => worker.dispose());

const check = async (url, lang) => {
  const response = await worker.fetch(`/api/tools/schema-check?url=${encodeURIComponent(url)}${lang ? `&lang=${lang}` : ''}`);
  return { status: response.status, body: await response.json() };
};

test('корректная разметка: блоки, типы, 100 баллов, готовый код', async () => {
  const { status, body } = await check('https://example.com/');
  assert.equal(status, 200);
  assert.equal(body.score, 100);
  assert.equal(body.title, 'Разметка собрана корректно');
  assert.equal(body.jsonldBlocks, 2);
  assert.equal(body.invalidBlocks, 0);
  assert.deepEqual(body.types, ['Organization', 'WebPage', 'BreadcrumbList']);
  assert.deepEqual(body.issues, [
    { severity: 'ok', title: 'Критичных ошибок не найдено', copy: 'Все блоки JSON-LD разобраны, найденные типы перечислены полностью.' },
  ]);
  assert.equal(JSON.parse(body.generated).length, 2);
  assert.equal(body.evidence.canonical, 'https://example.com/');
});

test('ошибка синтаксиса в одном блоке - error, -35 баллов', async () => {
  const { body } = await check('https://broken.example/');
  assert.equal(body.score, 65);
  assert.equal(body.invalidBlocks, 1);
  assert.equal(body.issues[0].severity, 'error');
  assert.equal(body.issues[0].title, 'Ошибка синтаксиса JSON-LD');
});

test('относительный адрес логотипа и блок без @type - предупреждения', async () => {
  assert.equal((await check('https://relative.example/')).body.issues[0].title, 'Найден относительный URL');
  assert.equal((await check('https://untyped.example/')).body.issues[0].title, 'Типы Schema.org не найдены');
});

test('страница без JSON-LD', async () => {
  const { body } = await check('https://none.example/');
  assert.equal(body.score, 65);
  assert.equal(body.summary, 'На странице не найдено структурированных данных JSON-LD.');
});

test('lang=en: результат и ошибки по-английски', async () => {
  const { body } = await check('https://example.com/', 'en');
  assert.equal(body.title, 'The markup is valid');
  assert.equal(body.summary, 'JSON-LD blocks checked: 2. Types found: 3.');
  const error = await check('https://none.example/missing', 'en');
  assert.deepEqual(error, { status: 502, body: { error: 'The page returned status 404' } });
});
