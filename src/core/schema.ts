// Проверка Schema / JSON-LD по адресу: блоки, типы, ошибки. Ответ на русском или английском (lang).
// Источник: сервер инструментов hitz.agency (https://hitz.agency/tools).
import { documentLink, jsonLdHasRelativeUrl, jsonLdTypeList, parseJsonLdBlocks, readHtmlDocument, type HtmlDocument } from './html.ts';
import { fetchBrandPage } from './net.ts';

const COPY = {
  en: {
    status: (status: number) => 'The page returned status ' + status,
    notHtml: 'The URL does not return an HTML page',
    empty: 'The URL returns an empty HTML page',
    noJsonTitle: 'JSON-LD not found',
    noJsonCopy: 'Add at least one script type="application/ld+json" block to the page.',
    syntaxTitle: 'JSON-LD syntax error',
    syntaxMany: (count: number) => 'Could not parse blocks: ' + count + '.',
    noTypesTitle: 'Schema.org types not found',
    noTypesCopy: 'Add @type to the entities in JSON-LD.',
    relativeTitle: 'Relative URL found',
    relativeCopy: 'Use absolute https:// URLs for links, logos, and images.',
    tooLargeTitle: 'Structured data is too large',
    tooLargeCopy: 'The total JSON-LD size exceeds the safe validation limit.',
    cleanTitle: 'No critical errors found',
    cleanCopy: 'Every JSON-LD block was parsed and all detected types are listed.',
    titleOk: 'The markup is valid',
    titleImprove: 'The markup needs improvement',
    titleFix: 'The markup needs fixes',
    summaryFound: (blocks: number, types: number) => `JSON-LD blocks checked: ${blocks}. Types found: ${types}.`,
    summaryEmpty: 'No JSON-LD structured data was found on the page.',
  },
  ru: {
    status: (status: number) => 'Страница отвечает кодом ' + status,
    notHtml: 'По адресу открывается не HTML-страница',
    empty: 'По адресу открывается пустая HTML-страница',
    noJsonTitle: 'JSON-LD не найден',
    noJsonCopy: 'Добавьте на страницу хотя бы один блок script type="application/ld+json".',
    syntaxTitle: 'Ошибка синтаксиса JSON-LD',
    syntaxMany: (count: number) => 'Не удалось разобрать блоков: ' + count + '.',
    noTypesTitle: 'Типы Schema.org не найдены',
    noTypesCopy: 'Укажите @type у сущностей в JSON-LD.',
    relativeTitle: 'Найден относительный URL',
    relativeCopy: 'Для URL, логотипов и изображений используйте абсолютные адреса с https://.',
    tooLargeTitle: 'Разметка слишком большая',
    tooLargeCopy: 'Общий объем JSON-LD превысил безопасный лимит проверки.',
    cleanTitle: 'Критичных ошибок не найдено',
    cleanCopy: 'Все блоки JSON-LD разобраны, найденные типы перечислены полностью.',
    titleOk: 'Разметка собрана корректно',
    titleImprove: 'Разметку нужно усилить',
    titleFix: 'Разметка требует исправлений',
    summaryFound: (blocks: number, types: number) => `Проверено блоков JSON-LD: ${blocks}. Найдено типов: ${types}.`,
    summaryEmpty: 'На странице не найдено структурированных данных JSON-LD.',
  },
};

export async function checkSchemaPage(rawUrl: string, rawLang: string | null) {
  const isEnglish = String(rawLang || '').toLowerCase().startsWith('en');
  const copy = isEnglish ? COPY.en : COPY.ru;
  const { response, finalUrl, finish } = await fetchBrandPage(rawUrl);
  const contentType = (response.headers.get('Content-Type') || '').toLowerCase();
  if (!response.ok) {
    finish();
    throw new Error(copy.status(response.status));
  }
  if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    finish();
    throw new Error(copy.notHtml);
  }

  let document: HtmlDocument;
  try {
    document = await readHtmlDocument(response, finalUrl, 'schema');
  } finally {
    finish();
  }
  if (!document.sourceBytes) throw new Error(copy.empty);

  const parsed = parseJsonLdBlocks(document.jsonld);
  const types = jsonLdTypeList(parsed.blocks);
  const uniqueTypes = [...new Set(types)];
  const issues: Array<{ severity: 'ok' | 'warning' | 'error'; title: string; copy: string }> = [];

  if (!document.jsonld.length) {
    issues.push({ severity: 'error', title: copy.noJsonTitle, copy: copy.noJsonCopy });
  }
  if (parsed.errors.length) {
    issues.push({ severity: 'error', title: copy.syntaxTitle, copy: parsed.errors.length === 1 ? (parsed.errors[0] ?? '') : copy.syntaxMany(parsed.errors.length) });
  }
  if (parsed.blocks.length && !types.length) {
    issues.push({ severity: 'warning', title: copy.noTypesTitle, copy: copy.noTypesCopy });
  }
  if (jsonLdHasRelativeUrl(parsed.blocks)) {
    issues.push({ severity: 'warning', title: copy.relativeTitle, copy: copy.relativeCopy });
  }
  if (document.structuredDataTruncated) {
    issues.push({ severity: 'warning', title: copy.tooLargeTitle, copy: copy.tooLargeCopy });
  }
  if (!issues.length) {
    issues.push({ severity: 'ok', title: copy.cleanTitle, copy: copy.cleanCopy });
  }

  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  const score = Math.max(0, Math.min(100, 100 - errorCount * 35 - warningCount * 10));
  const title = score >= 85 ? copy.titleOk : score >= 60 ? copy.titleImprove : copy.titleFix;
  const summary = document.jsonld.length ? copy.summaryFound(document.jsonld.length, types.length) : copy.summaryEmpty;
  const generatedValue = parsed.blocks.length === 1 ? parsed.blocks[0] : parsed.blocks;

  return {
    url: rawUrl,
    finalUrl: finalUrl.href,
    status: response.status,
    score,
    title,
    summary,
    types,
    uniqueTypes,
    jsonldBlocks: document.jsonld.length,
    parsedBlocks: parsed.blocks.length,
    invalidBlocks: parsed.errors.length,
    issues,
    generated: JSON.stringify(generatedValue, null, 2),
    truncated: document.structuredDataTruncated,
    contentTruncated: document.truncated,
    structuredDataTruncated: document.structuredDataTruncated,
    evidence: {
      title: document.title,
      h1: document.h1s[0] || '',
      canonical: documentLink(document, 'canonical'),
    },
  };
}
