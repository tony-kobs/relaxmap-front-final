# Природні Мандри

Клієнт платформи **Relax Map**: місця відпочинку в Україні, пошук, профілі мандрівників і відгуки.

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

Браузер спілкується лише з маршрутами `app/api`. Далі Next.js пересилає запит на [бекенд](https://github.com/tony-kobs/relaxmap-back-final).

## Зміст

1. [Що на екрані](#що-на-екрані)
2. [Стек](#стек)
3. [Сторінки](#сторінки)
4. [Як зібраний застосунок](#як-зібраний-застосунок)
5. [Проксі](#проксі)
6. [Запуск](#запуск)

## Що на екрані

| Розділ | Поведінка |
| --- | --- |
| Головна | Пошук, три переваги, карусель популярних місць і слайдер відгуків |
| Каталог | Пошук, регіон, типи, сортування. Наступна порція — кнопка «Показати ще» |
| Місце | Рейтинг, автор, галерея, опис і відгуки цього місця |
| Профіль | Публічна сторінка з місцями людини. Порожній профіль має свій стан |
| Вхід і реєстрація | Помилки валідації біля полів, помилка запиту — тост |
| Сесія | Після перезавантаження авторизований стан лишається в хедері |
| Відгук | Модалка поверх сторінки місця. Новий відгук іде на модерацію |

Головна складається з чотирьох блоків: `HeroBlock`, `AdvantagesBlock`, `PopularLocationsBlock`, `ReviewsBlock`. Хедер і футер живуть у кореневому layout, а не в окремій групі маршрутів.

## Стек

| Для чого | Чим |
| --- | --- |
| Каркас | Next.js 16, App Router, React 19, TypeScript |
| Стилі | CSS Modules, `modern-normalize`, шрифт Montserrat |
| Дані | TanStack Query і Axios |
| Сесія в клієнті | Zustand |
| Форми | Formik і Yup |
| Сповіщення | react-hot-toast |
| Адаптив | mobile first, `min-width`: 375, 768, 1440 |

## Сторінки

Публічні маршрути відкриті всім.

| Шлях | Екран |
| --- | --- |
| `/` | Головна |
| `/locations` | Каталог |
| `/locations/[locationId]` | Сторінка місця |
| `/profile/[userId]` | Публічний профіль |
| `/login` | Вхід |
| `/register` | Реєстрація |

Приватні лише два: `/locations/add` і `/locations/[locationId]/edit`. Гостя з них веде на `/login`. Авторизованого з `/login` і `/register` веде на `/profile`, а та сторінка переводить на `/profile/[свій id]`.

Оверлеї відкриваються паралельним слотом `@modal` і мають повноекранний запасний маршрут.

| Оверлей | Запасна сторінка | Навіщо |
| --- | --- | --- |
| `/logout` | `app/logout` | Підтвердження виходу |
| `/auth-prompt` | `app/auth-prompt` | Гостю пропонують увійти або зареєструватися |
| `/locations/[locationId]/review` | той самий шлях без слота | Форма нового відгуку |

Захист маршрутів і спроба оновити сесію зібрані в `proxy.ts`. У Next.js 16 це файл middleware: експорт називається `proxy`.

## Як зібраний застосунок

```text
app/
├── layout.tsx                  хедер, футер, провайдери, слот modal
├── page.tsx                    чотири секції головної
├── (auth)/login | register
├── locations/                  каталог, картка, додавання, редагування
├── profile/                    редірект і публічний профіль
├── @modal/                     вихід, підказка входу, форма відгуку
└── api/                        route handlers, проксі на Express

components/                     секції, форми, картки, модалки
lib/api/                        clientApi і serverApi
lib/store/authStore.ts          авторизований користувач
styles/globals.css              кольори і загальні змінні
types/                          користувач, локація, відгук
proxy.ts                        приватні шляхи і refresh сесії
```

## Проксі

Клієнт не знає адресу Render і не читає httpOnly-куки. Ланцюжок такий:

```text
браузер  →  /api/...  →  route handler  →  Express
```

Хендлер у `app/api` забирає cookie з вхідного запиту, кличе бекенд і повертає тіло разом із `Set-Cookie`. Базова адреса сервера — `BACKEND_URL`.

## Запуск

Потрібні Node.js 20.9+ і запущений бекенд на `http://localhost:4000`.

```bash
git clone https://github.com/tony-kobs/relaxmap-front-final.git
cd relaxmap-front-final
npm install
cp .env.template .env
npm run dev
```

Сайт відкривається на `http://localhost:3000`.

Файл `.env`:

```env
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` потрібен для `metadataBase` і Open Graph.

| Команда | Результат |
| --- | --- |
| `npm run dev` | режим розробки |
| `npm run build` | продакшн-збірка |
| `npm start` | запуск зібраного застосунку |
| `npm run lint` | ESLint |

API, сід і Swagger описані в репозиторії [relaxmap-back-final](https://github.com/tony-kobs/relaxmap-back-final).
