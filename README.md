# Test SPA

SPA для управления контентом: посты, теги и авторы. Авторизация по email и паролю, защищённые маршруты, CRUD для всех сущностей.

## Стек

- React 17, TypeScript, Vite
- Redux, Redux Saga, redux-dynamic-modules
- React Router 5, connected-react-router
- Ant Design, react-hook-form

## Быстрый старт

```bash
npm install
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер на порту 3000 |
| `npm run build` | Сборка для production |
| `npm run preview` | Просмотр production-сборки |
| `npm run lint` | Проверка ESLint |

## API

В режиме разработки запросы проксируются на URL из `VITE_API_BASE_URL` (по умолчанию `https://rest-test.machineheads.ru`):

- `/backend-auth` → `/auth` — авторизация
- `/backend-manage` → `/manage` — посты, теги, авторы

Для входа нужны учётные данные тестового API.

Для смены API отредактируйте `.env`:

```env
VITE_API_BASE_URL=https://rest-test.machineheads.ru
```

## Разделы приложения

- `/login` — вход
- `/posts` — список постов, создание и редактирование
- `/posts/:postId` — просмотр поста
- `/tags` — теги
- `/authors` — авторы

## Архитектура

Проект организован по [Feature-Sliced Design](https://feature-sliced.design/):

```
src/
├── app/         # провайдеры, точка входа
├── processes/   # роутинг
├── pages/       # страницы
├── widgets/     # композиции UI
├── features/    # пользовательские сценарии
├── entities/    # бизнес-сущности
└── shared/      # API, UI-kit, утилиты
```
