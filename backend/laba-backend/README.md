# laba-backend

NestJS API платформы LABBOR Studio: авторизация, мультитенантность (лаборатории),
подписки. Общее описание системы и логика ролей — в README корня репозитория.

Проще всего запускать всё разом из корня: `docker compose up --build`. Этот файл —
про то, что нужно, если хочется работать с бэкендом отдельно.

## Запуск без Docker

```bash
docker compose up -d postgres   # из корня репозитория — только база
cd backend/laba-backend
cp .env.example .env            # DATABASE_URL уже указывает на localhost:5432
npm install
npx prisma migrate deploy       # применить существующие миграции
npm run start:dev
```

API: `http://localhost:3000/api`. Swagger: `http://localhost:3000/docs`.

## Prisma

- Схема разбита по доменам внутри папки `prisma/` — Prisma склеивает все
  `.prisma` в ней, связи между файлами работают без импортов:
  - `schema.prisma` — только `generator` и `datasource`;
  - `auth.prisma` — аккаунты и сессии;
  - `tenancy.prisma` — лаборатории, членство, приглашения, подписки;
  - `production.prisma` — пациенты, наряды, этапы-задачи, фото;
  - `inventory.prisma` — склад расходников.

  Путь задан в `prisma.config.ts` как `schema: 'prisma'` — именно папка, а не
  файл: если указать один файл, Prisma молча прочитает только его.
- Клиент генерируется в `generated/prisma` (не в `node_modules` — Prisma 7,
  `prisma-client` generator).
- `npx prisma generate` — перегенерировать клиент после правки схемы.
- `npx prisma migrate dev --name <имя>` — новая миграция в dev-режиме.
- `npx prisma migrate deploy` — применить существующие миграции (используется в
  Docker-образе при старте контейнера).

**Известный баг тулинга:** `prisma migrate dev` в Prisma 7 иногда падает с
`Error [ERR_REQUIRE_ESM]` из-за пакета `@prisma/dev` (ESM/CJS конфликт в `zeptomatch`,
специфично для некоторых версий Node). Если словили это — сгенерируйте и примените
миграцию в обход:

```bash
mkdir -p prisma/migrations/<timestamp>_<name>
npx prisma migrate diff --from-empty --to-schema-datamodel prisma \
  --script > prisma/migrations/<timestamp>_<name>/migration.sql
npx prisma db execute --file prisma/migrations/<timestamp>_<name>/migration.sql \
  --schema prisma
npx prisma migrate resolve --applied <timestamp>_<name>
```

## Первичная инициализация (без seed)

Платформенный администратор создаётся не seed-скриптом, а через API — один раз,
пока в системе нет ни одного суперадмина:

- `GET /api/public/setup/status` → `{ initialized: boolean }`
- `POST /api/public/setup` → создаёт суперадмина, сразу возвращает токены. После
  первого успешного вызова навсегда отвечает 403.

Фронтенд дёргает эти эндпоинты на странице `/setup` автоматически.

## Структура

```
src/auth/         логин/refresh/logout, JWT-стратегия, гварды
src/setup/        первичный бутстрап суперадмина (см. выше)
src/labs/         создание лаб (только суперадмин), список "моих" лаб, блокировка сотрудников
src/invites/      приглашения в лабу + их принятие
src/subscriptions/ фоновая задача истечения подписок (каждые 5 минут)
src/users/        профиль текущего пользователя
src/common/       декораторы/гварды, общие для модулей (@Roles, @Public, @CurrentUser…)
```

Все эндпоинты и их назначение подробно описаны в Swagger (`/docs`) —
там же указано, какая роль нужна для каждого запроса.

## Тесты

```bash
npm run test       # unit
npm run test:e2e   # e2e
npm run test:cov   # покрытие
```
