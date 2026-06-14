# LABBOR Frontend — Зуботехническая STUDIO (SaaS CMS)

Реализация фронтенда по макету Figma. Стек: **Next.js (App Router) · TypeScript · Tailwind v4 · lucide-react**, базовые UI-компоненты — в духе **reactbits**, переписаны под дизайн-код.

> Реализован срез **администратора лаборатории**: дашборд нарядов → просмотр наряда (зубная карта, этапы, модалки «Отчёт / Замена техника / Штраф»). Mobile-first, адаптив до desktop.

## Запуск
```bash
npm install
npm run dev      # http://localhost:3000
npm run typecheck
```
Зависит от инициализированного Next-проекта. Если папка вливается в существующий проект — перенесите `src/`, `public/`, `tsconfig` paths (`@/* → ./src/*`) и Tailwind v4 (`postcss.config.mjs` + `@theme` в `globals.css`).

## Архитектура
```
src/
├─ app/                      # роуты (App Router)
│  ├─ layout.tsx             # шрифт Montserrat (next/font) + ToasterProvider
│  ├─ page.tsx               # /            → DashboardView
│  └─ orders/[id]/page.tsx   # /orders/:id  → OrderDetailView
│
├─ components/
│  ├─ ui/                    # БАЗОВЫЕ компоненты (без бизнес-логики)
│  │  Button · IconButton · Badge · Avatar · Field · Toggle
│  │  Select · AmountInput · SearchInput · Modal · Toast · CountUp
│  ├─ layout/                # оболочка приложения
│  │  AppShell · NavRail · TopBar · Logo · DatePill · NotificationBell · ProfileChip
│  └─ orders/                # СОСТАВНЫЕ компоненты с логикой (домен «наряды»)
│     DashboardView · StatsRow · StatItem · OrderCard · OrdersGrid
│     OrderDetailView · OrderInfoPanel · OrderScheduleFields · OrderPhotos
│     ToothChart · ToothShape · StageList · StageRow
│     modals/ ReportModal · ReplaceTechModal · FineModal
│
├─ hooks/                    # БИЗНЕС-ЛОГИКА
│  useOrders · useOrderDetail · useToothSelection · useDisclosure · useToaster
│
└─ lib/
   ├─ types/                 # типы по категориям (common · order · staff · stats)
   ├─ mocks/                 # моки по категориям (orders · staff · stats · user · order-detail)
   ├─ assets/                # tooth-path.ts (геометрия зуба из Figma)
   ├─ status-meta.ts         # маппинг статус → label + цвет
   └─ utils.ts               # cn · formatRub · formatDelta
```

## Правила, которым следует код
- **Базовые UI отделены от составных**: `components/ui` (тупые, переиспользуемые) vs `components/orders` (с данными и логикой).
- **Бизнес-логика — в хуках** (`hooks/`). Компоненты только рендерят и вызывают колбэки.
- **Моки разбиты по категориям**, а не свалены в один файл. Типизированы — **никакого `any`**.
- **Компоненты компактные** (ориентир ≤ ~200 строк); крупные экраны разбиты на панели.
- **Mobile-first**: базовые стили — для мобильного, `md:`/`lg:` расширяют до desktop. Навигация — нижний таб-бар на мобильном, левый rail на desktop.

## Иконки
Иконки из макета **не импортируются** — используются аналоги из `lucide-react`. Таблица соответствий: [`ICONS.md`](./ICONS.md).

## Дизайн-токены
Источник правды — `/design-system` в корне репозитория (`tokens.json`, `theme.css`, `DESIGN_SYSTEM.md`). В этом проекте токены живут в `@theme` внутри `src/app/globals.css` и доступны как утилиты Tailwind (`bg-surface-3`, `text-fg-muted`, `rounded-card`, `text-stat`, статусы `bg-done text-done-fg` и т.д.).

## Glass-дизайн (актуальная Figma)
Адаптирован «стеклянный» стиль Apple из новой мобильной Figma:
- Утилиты `glass` / `glass-soft` / `glass-nav` в `globals.css` (`@utility`): полупрозрачный фон + `backdrop-blur` + hairline-border.
- Плавающий стеклянный таб-бар на мобильном (`NavRail`), карточки и панели — на `glass-soft`.
- Палитра графиков (`--color-chart-fixed/orders/fines`) для разбивки доходов и диаграмм.
- Превью новых экранов: [`preview/glass-screens.html`](./preview/glass-screens.html).

## Разделы
- `/` — Наряды (дашборд)  · `/orders/[id]` — Просмотр наряда
- `/analytics` — **Аналитика** (KPI, тренд нарядов, распределение по статусам/видам)
- `/salary` — **Зарплаты** (доходы периода: Фиксированная/Наряды/Штрафы, график выполненных, таблица техников)
- `/work-types` — **Виды работ** (каталог: цена, срок, этапы; поиск + фильтр по категориям)

Новые домены повторяют ту же архитектуру: `lib/types/{payroll,analytics,work-type}.ts`, `lib/mocks/{payroll,analytics,work-types}.mock.ts`, `hooks/{usePayroll,useAnalytics,useWorkTypes}.ts`, `components/{salary,analytics,work-types}/`.

## Что дальше (вне текущего среза)
Роли super-admin / lab-admin / tech; мобильное приложение техника (экраны наряда/отчёта из новой Figma); реальный API вместо моков (хуки уже изолируют источник данных).
