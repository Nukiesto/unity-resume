# Портфолио — Алексей Батанов · Unity Developer

Персональный сайт-резюме и библиотека проектов на GitHub Pages.
Чистая статика: HTML + CSS + JS, без сборки и зависимостей.

**Сайт:** https://nukiesto.github.io/unity-resume/

## Что внутри

- Резюме: обо мне, навыки, опыт, образование, достижения, контакты
- Библиотека из 48 проектов: фильтры по типу, сортировка по году/названию, поиск по тегам
- Играбельное WebGL-демо SurvMine прямо в браузере

## Структура

```
index.html                  главная страница
serve.bat                   локальный запуск (двойной клик)
screenshots.bat             обновить список скриншотов
tools/serve.ps1             логика запуска: порт, сервер, браузер
tools/dev-server.js         резервный сервер на Node.js
tools/screenshots.js        сборка data/screenshots.json
assets/css/styles.css       тёмная тема оформления
assets/js/icons.js          SVG-иконки
assets/js/app.js            рендер данных, фильтры, поиск, модальные окна
assets/js/demo.js           ленивая загрузка WebGL-демо
assets/img/favicon.svg      иконка сайта
assets/img/screenshots/     48 папок — по одной на проект (скриншоты)
data/profile.json           имя, навыки, опыт, образование, контакты
data/projects.json          каталог проектов
data/screenshots.json       индекс скриншотов (генерируется)
demo/survmine/              WebGL-сборка SurvMine (gzip)
.nojekyll                   отключает обработку Jekyll на GitHub Pages
```

## Как редактировать

Контент вынесен в JSON — правки не требуют трогать код.

**`data/profile.json`** — контакты, навыки, опыт, образование.
**`data/projects.json`** — проекты. Поля одного проекта:

```json
{
  "id": "survmine",
  "title": "SurvMine",
  "subtitle": "Короткий подзаголовок",
  "category": "games",
  "featured": true,
  "status": "В разработке",
  "year": "2025–2026",
  "engine": "Unity 6000.6.0f1",
  "tags": ["VContainer", "Netcode"],
  "description": "Описание проекта.",
  "highlights": ["Пункт 1", "Пункт 2"],
  "links": { "github": "https://…", "demo": "#demo", "registry": "https://…", "registryPdf": "https://…" },
  "cover": { "gradient": ["#22c55e", "#0ea5e9"], "icon": "blocks", "monogram": "SM" }
}
```

Поле `year` принимает как одно значение (`"2026"`), так и диапазон
(`"2025–2026"`) — сортировка по году берёт наибольший год из строки.

Порядок опыта в резюме задаётся полем `year` (число) в `data/profile.json`:
записи сортируются по убыванию, поэтому новые проекты оказываются сверху.

## Скриншоты

Скриншоты складываются в `assets/img/screenshots/<id-проекта>/`, где `id`
совпадает с `id` из `data/projects.json` — например `survmine`, `quest`, `train`.

```powershell
# положил картинки -> пересобрать индекс
.\screenshots.bat
```

Что происходит:

- `tools/screenshots.js` сканирует папки и пишет `data/screenshots.json`;
- первый файл становится обложкой карточки, остальные — галереей в модалке;
- файл, начинающийся с `cover` или `обложка`, принудительно становится обложкой;
- пустая папка ничего не ломает — остаётся прежняя градиентная обложка.

`serve.bat` пересобирает индекс автоматически при каждом запуске (если есть Node.js).

**Важно для GitHub Pages:** после добавления скриншотов нужно закоммитить
и сами картинки, и `data/screenshots.json` — Pages не запускает генератор.

Подробнее — в `assets/img/screenshots/README.md`.

Доступные категории: `games`, `vr`, `media`, `sdk`, `tools`, `backend`, `apps`, `archive`.
Статусы: `Готовый продукт`, `В разработке`, `Прототип`, `Архив` и др.
Иконки обложек перечислены в `assets/js/icons.js`.

### Что стоит дозаполнить

- реальные скриншоты проектов вместо градиентных обложек
- при необходимости — уточнить роли и сроки в `data/profile.json`

## WebGL-демо

Билд `demo/survmine/` лежит в сжатом виде (`.gz`, суммарно ≈41 МБ).
Распакованный `.wasm` весит ≈194 МБ — он не коммитится, поэтому браузер
распаковывает `.gz`-файлы сам через `DecompressionStream`.

Загрузчик (`demo/survmine/index.html`) устойчив к обоим вариантам ответа сервера:

- хостинг отдаёт `.gz` как есть → распаковываем сами через `DecompressionStream('gzip')`;
- хостинг сам ставит `Content-Encoding: gzip` → определяем по магическим байтам
  `1f 8b`, что данные уже распакованы, и используем их напрямую.

Требования к браузеру: Chrome 80+, Edge, Firefox 113+, Safari 16.4+.

Обновить демо: пересобрать проект в Unity (WebGL), затем положить
`Build/*.loader.js` и `StreamingAssets/` как есть, а `framework.js`, `wasm`
и `data` — сжать в gzip (`.gz`) в `demo/survmine/Build/`.

## Публикация на GitHub Pages

1. Запушить содержимое в ветку `main`.
2. Открыть репозиторий → **Settings → Pages**.
3. **Source:** `Deploy from a branch`, **Branch:** `main`, папка `/ (root)`.
4. Сохранить и дождаться сборки — сайт появится на
   `https://nukiesto.github.io/unity-resume/`.

## Локальный запуск

Самый простой способ — двойной клик по **`serve.bat`** в корне репозитория.
Скрипт сам найдёт свободный порт, поднимет сервер и откроет браузер.

```powershell
.\serve.bat          # порт по умолчанию 8080
.\serve.bat 9000     # свой порт
```

Остановить: `Ctrl+C` в окне или просто закрыть окно.

Скрипт использует Python (`py -3` / `python`), а если его нет — Node.js
(`tools/dev-server.js`). Ставить ничего дополнительно не нужно, если есть
любой из них.

### Вручную, без bat-файла

```powershell
python -m http.server 8080 --bind 127.0.0.1
# или
node tools/dev-server.js 8080
# или
npx serve -l 8080 .
```

Затем открыть http://127.0.0.1:8080/

> Открывать `index.html` двойным кликом (`file://`) нельзя: страница
> загружает JSON через `fetch`, а браузер блокирует такие запросы для
> локальных файлов. Нужен именно HTTP-сервер.

## Замечание по безопасности

В `.git/config` проектов `quest`, `train` и `FirstAidTraining` ранее были
вшиты GitLab-токены. Рекомендуется их отозвать и перейти на credential helper.
В этот репозиторий секреты не попадали.
