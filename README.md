# Schema / JSON-LD Checker

**Проверка и генератор Schema / JSON-LD** · [English](#english) · [Русский](#русский)

[![test](https://github.com/aksanovdgtl-cmyk/jsonld-schema-check/actions/workflows/test.yml/badge.svg)](https://github.com/aksanovdgtl-cmyk/jsonld-schema-check/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-22f360.svg)](LICENSE) [![Live tool](https://img.shields.io/badge/live-hitz.agency-232323.svg)](https://hitz.agency/en/tools/schema-check)

## English

Check the Schema.org structured data of a page. Enter a URL and the tool finds every `<script type="application/ld+json">` block, parses it, lists the Schema.org types (including nodes inside `@graph`), flags syntax errors, missing types and relative URLs, and returns the markup as clean formatted JSON-LD to copy or download. Or paste JSON-LD directly: that mode runs entirely in the browser.

- **Live tool:** [hitz.agency/en/tools/schema-check](https://hitz.agency/en/tools/schema-check) (Russian: [hitz.agency/tools/schema-check](https://hitz.agency/tools/schema-check))
- **This repository:** the same page and the same server check that run on hitz.agency, ready to self-host on Cloudflare Workers.

Structured data helps search engines and AI systems understand what a page is about: an organization, a service, an article, a product, an FAQ. Google's guide: [Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Vocabulary: [schema.org](https://schema.org/docs/gs.html). Format: [JSON-LD](https://json-ld.org/).

### Check by URL (server)

| Issue | Severity | Score |
|---|---|---|
| No JSON-LD on the page | error | -35 |
| A block does not parse as JSON | error | -35 |
| Blocks parse, but no `@type` is found | warning | -10 |
| A relative address in `url`, `image`, `logo`, `sameAs`, `contentUrl`, `thumbnailUrl` or `mainEntityOfPage` | warning | -10 |
| JSON-LD on the page is over 384,000 characters | warning | -10 |

The score starts at 100. 85+ means the markup is valid, 60-84 needs improvement, below 60 needs fixes. The response also returns the page title, H1 and canonical for comparison with the markup.

### Check pasted code (browser)

Pasted JSON-LD (with or without the `<script>` tag) is checked without a request to the server: missing `@context` (-15), a node without `@type` (-20), a node without `name` or `headline` (-10), a relative `url`, `image` or `logo` (-6 each).

### API

```http
GET /api/tools/schema-check?url=https://example.com/&lang=en
```

```json
{
  "url": "https://example.com/",
  "finalUrl": "https://example.com/",
  "status": 200,
  "score": 100,
  "title": "The markup is valid",
  "summary": "JSON-LD blocks checked: 2. Types found: 3.",
  "types": ["Organization", "WebPage", "BreadcrumbList"],
  "uniqueTypes": ["Organization", "WebPage", "BreadcrumbList"],
  "jsonldBlocks": 2,
  "parsedBlocks": 2,
  "invalidBlocks": 0,
  "issues": [
    { "severity": "ok", "title": "No critical errors found", "copy": "Every JSON-LD block was parsed and all detected types are listed." }
  ],
  "generated": "[\n  {\n    \"@context\": \"https://schema.org\", ...",
  "truncated": false,
  "contentTruncated": false,
  "structuredDataTruncated": false,
  "evidence": { "title": "Example", "h1": "Example", "canonical": "https://example.com/" }
}
```

`lang=en` returns English texts, without it the texts are in Russian. `severity` is `ok`, `warning` or `error`.

| Status | When |
|---|---|
| 400 | no `url`; not http(s); login or password in the URL; non-standard port; IP address, localhost or a host that resolves to a private network |
| 403 | browser request from another origin |
| 429 | more than 10 requests per minute from one IP, or 300 in total |
| 502 | the page returned an error code, is not HTML, is empty, timed out (5 seconds) or redirected too many times |

### Limits and safety

The first 160 KB of HTML are read for the title, H1 and canonical; JSON-LD is collected from the whole page, up to 384,000 characters, streamed through HTMLRewriter. Only public websites are fetched: before every request, including up to 3 redirects, the hostname is resolved through DNS over HTTPS and rejected if it points to a private, loopback, link-local or reserved address. The check does not change anything on the site and stores nothing.

### Related guides (in Russian)

- [Schema.org для нейросетей: какие типы разметки работают](https://hitz.agency/blog/schema-org-dlya-neyrosetey)
- [Микроразметка Schema.org для сайта: что работает в 2026](https://hitz.agency/blog/mikrorazmetka-dlya-snippetov)

### Run locally

Requires Node.js 22.18 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:8787 for the Russian interface or http://localhost:8787/en/ for English. The page calls the API on the same origin: `GET /api/tools/schema-check`.

### Deploy to Cloudflare Workers

```sh
npx wrangler login
npm run deploy
```

One Worker serves `public/` as static assets and answers `/api/tools/schema-check`. The free Workers plan is enough. HTML is parsed with [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/), which is built into the Workers runtime.

### Tests

`npm test` runs unit tests and API tests. API tests build the Worker with Wrangler and run it in Miniflare, the local Cloudflare runtime. DNS lookups and site responses come from fixtures, so no request leaves your machine. `npm run check` type-checks the TypeScript.

### Project structure

```text
public/              page (Russian at /, English at /en/), styles, scripts, fonts
src/worker.ts        Worker entry: /api/* goes to the API, everything else to static assets
src/api.ts           route, Origin check, rate limit, error messages
src/core/            the checks themselves (net.ts, html.ts, schema.ts)
test/                unit tests and API tests in Miniflare
provenance.json      where each file comes from on hitz.agency, with checksums
CITATION.cff         citation metadata
```

### More free GEO tools by HITZ

| Tool | Live version | Source |
|---|---|---|
| AI Crawler Access Checker | [hitz.agency/en/tools/ai-crawler-check](https://hitz.agency/en/tools/ai-crawler-check) | [ai-crawler-check](https://github.com/aksanovdgtl-cmyk/ai-crawler-check) |
| llms.txt Checker and Generator | [hitz.agency/en/tools/llms-txt](https://hitz.agency/en/tools/llms-txt) | [llms-txt-generator](https://github.com/aksanovdgtl-cmyk/llms-txt-generator) |
| Prompt Map Generator | [hitz.agency/en/tools/prompt-map](https://hitz.agency/en/tools/prompt-map) | [geo-prompt-map](https://github.com/aksanovdgtl-cmyk/geo-prompt-map) |
| GEO Page Audit | [hitz.agency/en/tools/geo-audit](https://hitz.agency/en/tools/geo-audit) | [geo-audit](https://github.com/aksanovdgtl-cmyk/geo-audit) |
| Brand Entity Check | [hitz.agency/en/tools/brand-entity](https://hitz.agency/en/tools/brand-entity) | [brand-entity-check](https://github.com/aksanovdgtl-cmyk/brand-entity-check) |

Catalog with guides: [hitz-geo-tools](https://github.com/aksanovdgtl-cmyk/hitz-geo-tools) · [hitz.agency/en/tools](https://hitz.agency/en/tools)

### How to cite

Use **Cite this repository** on GitHub ([CITATION.cff](CITATION.cff)) or:

> HITZ. Schema / JSON-LD Checker. https://hitz.agency/en/tools/schema-check

A link to the live tool is appreciated when you mention it in an article or a talk. The MIT license only requires keeping the copyright notice in copies of the code.

### About HITZ

[HITZ](https://hitz.agency/en) is a GEO agency based in Almaty and Tashkent. We help brands get mentioned and cited in answers from ChatGPT, Gemini, Perplexity, Claude, Google AI Overviews and Yandex Alice. This tool is part of our free [GEO toolkit](https://hitz.agency/en/tools).

### License

[MIT](LICENSE) © 2026 HITZ. The fonts in `public/assets/fonts` are under the SIL Open Font License 1.1. The HITZ name and logo are not covered by the MIT license.

---

## Русский

Проверка структурированных данных Schema.org на странице. Укажите адрес, и инструмент найдет все блоки `<script type="application/ld+json">`, разберет их, перечислит типы Schema.org (включая узлы внутри `@graph`), отметит ошибки синтаксиса, блоки без типа и относительные адреса и вернет разметку в виде аккуратного JSON-LD, который можно скопировать или скачать. Можно вставить JSON-LD напрямую: такая проверка идет целиком в браузере.

- **Онлайн-версия:** [hitz.agency/tools/schema-check](https://hitz.agency/tools/schema-check) (английская: [hitz.agency/en/tools/schema-check](https://hitz.agency/en/tools/schema-check))
- **Этот репозиторий:** та же страница и та же серверная проверка, что работают на hitz.agency. Можно развернуть у себя в Cloudflare Workers.

Структурированные данные помогают поиску и нейросетям понять, о чем страница: организация, услуга, статья, товар, FAQ. Руководство Google: [Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Словарь: [schema.org](https://schema.org/docs/gs.html). Формат: [JSON-LD](https://json-ld.org/).

### Проверка по адресу (на сервере)

| Проблема | Уровень | Баллы |
|---|---|---|
| На странице нет JSON-LD | ошибка | -35 |
| Блок не разбирается как JSON | ошибка | -35 |
| Блоки разобраны, но `@type` не найден | предупреждение | -10 |
| Относительный адрес в `url`, `image`, `logo`, `sameAs`, `contentUrl`, `thumbnailUrl` или `mainEntityOfPage` | предупреждение | -10 |
| JSON-LD на странице больше 384 000 символов | предупреждение | -10 |

Отсчет от 100 баллов. От 85 разметка собрана корректно, 60-84 ее нужно усилить, ниже 60 нужны исправления. В ответе также есть title, H1 и canonical страницы, чтобы сверить их с разметкой.

### Проверка вставленного кода (в браузере)

Вставленный JSON-LD (с тегом `<script>` или без) проверяется без запроса к серверу: нет `@context` (-15), узел без `@type` (-20), узел без `name` или `headline` (-10), относительный `url`, `image` или `logo` (-6 за каждый).

### API

```http
GET /api/tools/schema-check?url=https://example.com/
```

Ответ: адрес, код ответа, балл, вывод, найденные типы, число блоков (всего, разобрано, с ошибкой), список проблем `issues`, готовый JSON-LD `generated` и данные страницы `evidence`. Пример в английском разделе. Без `lang` тексты на русском, с `lang=en` на английском. Поле `severity`: `ok`, `warning` или `error`.

| Код | Когда |
|---|---|
| 400 | нет `url`; не http(s); логин или пароль в адресе; нестандартный порт; IP-адрес, localhost или имя, которое указывает во внутреннюю сеть |
| 403 | запрос браузера с чужого домена |
| 429 | больше 10 запросов в минуту с одного IP или 300 на всех |
| 502 | страница ответила кодом ошибки, это не HTML, она пустая, не ответила за 5 секунд или перенаправлений слишком много |

### Лимиты и безопасность

Title, H1 и canonical берутся из первых 160 КБ HTML, JSON-LD собирается со всей страницы, до 384 000 символов, потоком через HTMLRewriter. Загружаются только публичные сайты: перед каждым запросом, включая до 3 перенаправлений, имя сайта проверяется через DNS over HTTPS, частные, локальные, служебные и зарезервированные адреса отклоняются. Проверка ничего не меняет на сайте и ничего не сохраняет.

### Разборы по теме

- [Schema.org для нейросетей: какие типы разметки работают](https://hitz.agency/blog/schema-org-dlya-neyrosetey)
- [Микроразметка Schema.org для сайта: что работает в 2026](https://hitz.agency/blog/mikrorazmetka-dlya-snippetov)

### Запуск

Нужен Node.js 22.18 или новее.

```sh
npm install
npm run dev
```

Откройте http://localhost:8787 (русский интерфейс) или http://localhost:8787/en/ (английский). Страница обращается к API на своем домене: `GET /api/tools/schema-check`.

### Публикация в Cloudflare Workers

```sh
npx wrangler login
npm run deploy
```

Один Worker отдает статику из `public/` и отвечает на `/api/tools/schema-check`. Бесплатного тарифа Workers достаточно. HTML разбирается через [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/), он встроен в среду Workers.

### Проверки

`npm test` запускает модульные тесты и тесты API. Для тестов API Worker собирается Wrangler и работает в Miniflare, локальной среде Cloudflare. DNS и ответы сайтов подставляются из фикстур: запросы в интернет не уходят. `npm run check` проверяет типы TypeScript.

### Структура

```text
public/              страница (русская на /, английская на /en/), стили, скрипты, шрифты
src/worker.ts        вход Worker: /api/* в API, остальное в статику
src/api.ts           маршрут, проверка Origin, лимит запросов, тексты ошибок
src/core/            сами проверки (net.ts, html.ts, schema.ts)
test/                модульные тесты и тесты API в Miniflare
provenance.json      откуда взят каждый файл на hitz.agency, контрольные суммы
CITATION.cff         данные для цитирования
```

### Другие бесплатные инструменты HITZ

| Инструмент | Онлайн | Исходный код |
|---|---|---|
| Проверка доступа AI-краулеров | [hitz.agency/tools/ai-crawler-check](https://hitz.agency/tools/ai-crawler-check) | [ai-crawler-check](https://github.com/aksanovdgtl-cmyk/ai-crawler-check) |
| Проверка и генератор llms.txt | [hitz.agency/tools/llms-txt](https://hitz.agency/tools/llms-txt) | [llms-txt-generator](https://github.com/aksanovdgtl-cmyk/llms-txt-generator) |
| Генератор карты промтов | [hitz.agency/tools/prompt-map](https://hitz.agency/tools/prompt-map) | [geo-prompt-map](https://github.com/aksanovdgtl-cmyk/geo-prompt-map) |
| GEO-аудит страницы | [hitz.agency/tools/geo-audit](https://hitz.agency/tools/geo-audit) | [geo-audit](https://github.com/aksanovdgtl-cmyk/geo-audit) |
| Проверка сущности бренда | [hitz.agency/tools/brand-entity](https://hitz.agency/tools/brand-entity) | [brand-entity-check](https://github.com/aksanovdgtl-cmyk/brand-entity-check) |

Каталог с разборами: [hitz-geo-tools](https://github.com/aksanovdgtl-cmyk/hitz-geo-tools) · [hitz.agency/tools](https://hitz.agency/tools)

### Как сослаться

Кнопка GitHub **Cite this repository** ([CITATION.cff](CITATION.cff)) или строка:

> HITZ. Проверка и генератор Schema / JSON-LD. https://hitz.agency/tools/schema-check

Если упоминаете инструмент в статье или докладе, будем рады ссылке на онлайн-версию. Лицензия MIT требует только сохранить уведомление об авторстве в копиях кода.

### О HITZ

[HITZ](https://hitz.agency/) - GEO-агентство из Алматы и Ташкента. Помогаем брендам попадать в ответы ChatGPT, Gemini, Perplexity, Claude, Google AI Overviews и Алисы. Инструмент входит в набор [бесплатных GEO-инструментов](https://hitz.agency/tools).

### Лицензия

[MIT](LICENSE) © 2026 HITZ. Шрифты в `public/assets/fonts` распространяются по SIL Open Font License 1.1. Название и логотип HITZ под лицензию MIT не подпадают.
