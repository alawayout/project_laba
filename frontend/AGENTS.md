<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Конвенции проекта LABBOR

## Монорепозиторий

Это клиентское приложение — **один из воркспейсов монорепозитория** `labbor-studio`.

- Корень репозитория (и git) на уровень выше: `../`. Там лежат корневой `package.json`
  (npm workspaces), общая дизайн-система и git-хуки.
- Этот пакет — `@labbor/frontend` в `frontend/`. Команды запускай из корня
  (`npm run dev|build|lint --workspace=frontend`) или из `frontend/`.
- Не дублируй и не ставь зависимости, которые уже есть в корне; помни про хойстинг
  `node_modules` в корень.

## Качество кода и коммиты

- Линтер — **ESLint flat config** ([`eslint.config.mjs`](./eslint.config.mjs)) на базе
  `eslint-config-next` (`next lint` в Next 16 удалён — используй `npm run lint`).
- **Pre-commit** (husky в корне репозитория) запускает `lint-staged` + `next build`.
  **Коммит не пройдёт без успешной сборки.** Не обходи хук флагом `--no-verify`.
- Перед коммитом код должен проходить `npm run lint` и `npm run build` без ошибок.

## Стилизация — только Tailwind

- Стилизуй **исключительно через Tailwind** (v4). Никакого CSS-in-JS, styled-components,
  inline `style={{…}}` (кроме реально динамических значений) и отдельных `.css`-модулей.
- Используй **только токены дизайн-системы** через Tailwind-утилиты
  (`bg-surface-2`, `text-accent`, `rounded-card`, `rounded-pill` и т.д.). Не вставляй
  «магические» значения цветов/радиусов/отступов хардкодом.
- Классы объединяй через `cn()` из [`src/lib/utils.ts`](./src/lib/utils.ts).

## UI-компоненты — shadcn/ui

- Инициализирован shadcn ([`components.json`](./components.json)): стиль `base-nova`
  на **Base UI** (`@base-ui/react`) + Tailwind, base color `neutral`, иконки `lucide`.
  `cn()` — из [`src/lib/utils.ts`](./src/lib/utils.ts) (clsx + tailwind-merge).
- Базовые UI-примитивы добавляй через CLI: `npx shadcn@latest add <name>`. Не копируй
  вручную и не тяни сторонние UI-киты.
- Каждый компонент shadcn **адаптируй под дизайн-систему LABBOR** (токены, радиусы,
  тёмная тема), а не оставляй дефолтные стили.
- Переиспользуй то, что уже есть в [`src/components/ui/`](./src/components/ui/), прежде
  чем добавлять новый компонент.
- ⚠️ Существующие кастомные компоненты в `ui/` — PascalCase (`Button.tsx`, `Modal.tsx`),
  shadcn кладёт kebab-case (`button.tsx`, `dialog.tsx`). На macOS (case-insensitive FS)
  `button.tsx` затрёт `Button.tsx`. Перед `shadcn add` проверь, нет ли коллизии имени с
  существующим компонентом, и при необходимости ставь с `-p`/переименовывай.
- Тёмная тема включена классом `dark` на `<html>` ([`layout.tsx`](./src/app/layout.tsx)) —
  shadcn-токены (`--background`, `--primary`, …) берут значения из `.dark`. Не убирай его.

## Дизайн-система

- Источник правды — [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md), токены в
  [`../tokens.json`](../tokens.json), Tailwind v4 — в [`../theme.css`](../theme.css).
- Тёмная тема, единый лаймовый акцент `#bdff67`, шрифт Montserrat, крупные радиусы,
  без градиентов/эмодзи/теней (кроме оверлеев). Сверяйся с DESIGN_SYSTEM перед версткой.

## Архитектура — SRP, хуки, мелкие компоненты

- **Single Responsibility:** один модуль/компонент/хук — одна ответственность. Если файл
  делает несколько вещей — разбей его.
- **Логику выноси в хуки.** Компоненты отвечают за разметку; стейт, эффекты, запросы,
  вычисления и бизнес-логику держи в кастомных хуках в [`src/hooks/`](./src/hooks/)
  (см. примеры: `useOrderForm`, `useGlobalSearch`, `usePayroll`).
- **Дроби на мелкие компоненты.** Большие экраны собирай из маленьких presentational-
  компонентов. Раскладка существующего кода: страницы — `src/app/`, переиспользуемые
  блоки — `src/components/<домен>/`, примитивы — `src/components/ui/`.
- Чистые утилиты и типы — в [`src/lib/`](./src/lib/), не внутри компонентов.
