# Портфолио — Алексей Батанов · Unity Developer

Персональный сайт-резюме и библиотека проектов на GitHub Pages.
Чистая статика: HTML + CSS + JS, без сборки и зависимостей.

**Сайт:** https://nukiesto.github.io/unity-resume/

## Что внутри

- Резюме: обо мне, навыки, опыт, образование, достижения, контакты
- Библиотека из 50 проектов с фильтрами по типу и поиском по тегам
- Играбельное WebGL-демо SurvMine прямо в браузере

## Структура

```
index.html                  главная страница
assets/css/styles.css       тёмная тема оформления
assets/js/icons.js          SVG-иконки
assets/js/app.js            рендер данных, фильтры, поиск, модальные окна
assets/js/demo.js           ленивая загрузка WebGL-демо
assets/img/favicon.svg      иконка сайта
data/profile.json           имя, навыки, опыт, образование, контакты
data/projects.json          каталог проектов
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

```powershell
python -m http.server 4173
# или
npx serve -l 4173 .
```

Открыть http://127.0.0.1:4173/

## Замечание по безопасности

В `.git/config` проектов `quest`, `train` и `FirstAidTraining` ранее были
вшиты GitLab-токены. Рекомендуется их отозвать и перейти на credential helper.
В этот репозиторий секреты не попадали.
