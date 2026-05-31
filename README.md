# Khemet Web Frontend

Khemet Web is the React frontend for the KHEMET Smart Guide experience. The app presents an ancient-Egypt themed museum interface with onboarding, authentication screens, collections, artifact details, AI scan and chat experiences, settings, language switching, and local user/favorites state.

The project is built with Vite, React, React Router, React Query, i18next, Tailwind CSS, custom CSS modules by feature, and Axios API wrappers for future backend integration.

## Table of Contents

- [Current Status](#current-status)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Application Routes](#application-routes)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Feature Overview](#feature-overview)
- [API Layer](#api-layer)
- [State and Storage](#state-and-storage)
- [Internationalization](#internationalization)
- [Styling and Assets](#styling-and-assets)
- [Mock Data and Backend Integration Notes](#mock-data-and-backend-integration-notes)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)

## Current Status

The app currently runs successfully with Vite at:

```bash
http://127.0.0.1:5173/
```

The production build also completes successfully with `npm run build`.

The main app flows are connected to the Node.js backend at `http://localhost:3000/api`: authentication, monuments, artifact details, AI chat, scan upload, gallery save, favorites, reviews, and profile updates.

## Tech Stack

- React
- Vite
- React Router DOM
- TanStack React Query
- Axios
- i18next and react-i18next
- Tailwind CSS
- Feature-scoped CSS files
- Framer Motion
- Lucide React icons
- React Icons

## Requirements

- Node.js
- npm

This project includes a `package-lock.json`, so use `npm install` for dependency installation.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, if `cp` is unavailable:

```powershell
Copy-Item .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite. By default it is usually:

```bash
http://localhost:5173/
```

To bind the server explicitly to localhost:

```bash
npm run dev -- --host 127.0.0.1
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

```bash
npm run build
```

Creates a production build in `dist/`.

```bash
npm run preview
```

Serves the production build locally for preview.

There are currently no configured lint, format, or test scripts in `package.json`.

## Environment Variables

The app reads the API base URL from:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If the variable is not set, the Axios instance falls back to:

```text
http://localhost:3000/api
```

Environment variables used by Vite must start with `VITE_`.

## Application Routes

Routes are defined in `src/constants/routes.js` and wired in `src/routes/AppRoutes.jsx`.

| Route | Component | Access | Purpose |
| --- | --- | --- | --- |
| `/` | `Splash` | Public | Initial splash screen |
| `/welcome` | `Welcome` | Public | Welcome/onboarding page |
| `/sign-in` | `SignIn` | Guest only | Sign-in form and guest entry |
| `/sign-up` | `SignUp` | Guest only | Account registration flow |
| `/forgot-password` | `ForgotPassword` | Guest only | Password recovery entry |
| `/verification-code` | `VerificationCode` | Guest only | Verification code entry |
| `/reset-password` | `ResetPassword` | Guest only | Password reset flow |
| `/create-new-password` | `CreateNewPassword` | Guest only | New password creation |
| `/email-verification-choice` | `EmailVerificationChoice` | Guest only | Email verification option selection |
| `/home` | `Home` | Public layout | Main marketing and feature page |
| `/collections` | `Collections` | Public layout | Artifact collection browsing |
| `/artifact-details/:id` | `ArtifactDetails` | Public layout | Individual artifact details |
| `/scan` | `ScanAI` | Public layout | Backend artifact scan upload |
| `/chat-ai` | `ChatAI` | Public layout | Backend AI guide chat |
| `/settings` | `Settings` | Public layout | Profile/settings screen |
| `/translate` | `Translate` | Public layout | Placeholder hieroglyph translation page |
| `/favorites` | `Favorites` | Protected | Backend saved artifacts |
| `/profile` | `Profile` | Protected | User profile screen |

`GuestRoute` redirects authenticated users to `/home`. `ProtectedRoute` redirects unauthenticated users to `/sign-in`.

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- api/                 # Axios instance and API resource wrappers
|   |-- assets/              # Images, logos, and videos
|   |-- components/          # Reusable UI grouped by feature/domain
|   |-- constants/           # Routes, colors, endpoint constants
|   |-- context/             # Auth, favorites, language, and profile providers
|   |-- data/                # Mock collections, chat, scan, and home content
|   |-- hooks/               # Shared hooks and API mutations/queries
|   |-- i18n/                # i18next setup
|   |-- locales/             # Translation JSON files
|   |-- pages/               # Route-level pages
|   |-- routes/              # Route guards and route tree
|   |-- styles/              # Global and feature-scoped CSS
|   |-- App.jsx
|   `-- main.jsx
|-- .env.example
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
`-- vite.config.js
```

## Architecture Overview

The app starts in `src/main.jsx`, where global providers are composed:

- `LanguageProvider`
- `UserProfileProvider`
- `FavoritesProvider`
- `React.StrictMode`
- `QueryClientProvider`
- `BrowserRouter`
- `AuthProvider`

`src/App.jsx` renders the application route tree through `AppRoutes`.

The codebase separates concerns by directory:

- Route-level screens live in `src/pages`.
- Reusable visual and interaction pieces live in `src/components`.
- Shared client state lives in `src/context`.
- Server communication wrappers live in `src/api`.
- Route strings and endpoint strings live in `src/constants`.
- Mock domain content lives in `src/data`.
- Translation dictionaries live in `src/locales`.

## Feature Overview

### Splash and Welcome

The splash and welcome screens introduce the Khemet experience using themed imagery and video assets.

### Authentication

The auth flow includes:

- Sign in
- Sign up
- Forgot password
- Verification code
- Email verification choice
- Reset password
- Create new password
- Continue as guest

Sign-in, registration, forgot-password OTP verification, and reset-password submit to the backend auth APIs.

### Home

The home page includes:

- Hero image gallery
- Museum-themed feature messaging
- Stats
- Feature cards
- Call-to-action section
- Footer

Home content is driven partly by `src/data/homeData.js` and translations.

### Collections and Artifact Details

Collections provide:

- Search
- Category filters
- Incremental "show more" display
- Backend favorite toggling for authenticated users
- Links to artifact details

Artifact details provide:

- Artifact image
- Category, period, and location metadata
- Overview/history tabs
- Not-found fallback

Collection and artifact-detail data comes from `/api/monuments`. Local collection data is only a brief fallback while the backend request is loading.

### Scan AI

The scan page supports:

- Image selection
- Preview generation
- Image removal
- Backend analysis loading state
- AI result display from `/api/scan/artifact`
- Retry and save-to-gallery actions

Scan results come from `/api/scan/artifact` using multipart field `image`.

### Chat AI

The chat page includes:

- Initial AI welcome message
- User messages
- Backend AI responses
- Typing indicator
- Suggestion chips
- Session persistence through `sessionStorage`

Responses come from `/api/ai-guide/ask`.

### Settings and Profile

The settings screen includes:

- Local user profile display
- Avatar update from a selected file
- Profile name editing
- Activity stats
- Current language label
- Logout navigation
- Delete-account confirmation placeholder

User profile state is currently stored in `localStorage`.

### Favorites

Favorites are stored locally through `FavoritesContext`. The protected `/favorites` page currently contains a placeholder view.

### Translation

The `/translate` route currently renders a placeholder page for future hieroglyph upload/capture and translation functionality.

## API Layer

The shared Axios instance is in `src/api/axiosInstance.js`.

Behavior:

- Uses `VITE_API_BASE_URL` when available.
- Falls back to `http://localhost:3000/api`.
- Sends `Content-Type: application/json` by default.
- Adds `Authorization: Bearer <token>` when `khemet_token` is present in `localStorage`.

API wrappers:

| File | Purpose |
| --- | --- |
| `src/api/authApi.js` | Login, register, current user, forgot password, reset password |
| `src/api/artifactsApi.js` | List artifacts, get artifact by ID, favorites |
| `src/api/translationApi.js` | Upload image, fetch translation result |
| `src/api/userApi.js` | Get/update profile and settings |

Endpoint constants are centralized in `src/constants/apiEndpoints.js`.

## State and Storage

### Auth

`AuthContext` stores:

- `user`
- `token`
- `isGuest`
- `isAuthenticated`

Auth persistence keys:

```text
khemet_token
khemet_user
```

### Favorites

`FavoritesContext` persists favorited artifacts under:

```text
khemet-favorites
```

### User Profile

`UserProfileContext` persists profile data under:

```text
khemet-user-profile
```

The default local profile is:

```text
Hossam Hassan
hossam@khemet.ai
```

### Language

`LanguageContext` stores the selected language under:

```text
language
```

It also updates:

- `document.documentElement.lang`
- `document.documentElement.dir`

Arabic switches the document direction to `rtl`; other languages use `ltr`.

### Chat

Chat messages persist for the browser session under:

```text
khemet-chat-messages
```

## Internationalization

i18n is configured in `src/i18n/index.js`.

Supported locale files:

- Arabic: `src/locales/ar.json`
- English: `src/locales/en.json`
- Spanish: `src/locales/es.json`
- German: `src/locales/de.json`
- French: `src/locales/fr.json`
- Chinese: `src/locales/zh.json`

Default language behavior:

- Uses `localStorage.getItem('language')` when present.
- Falls back to English.

When adding a language:

1. Add the new locale JSON file in `src/locales`.
2. Import it in `src/i18n/index.js`.
3. Add it to the `resources` object.
4. Update language selectors and labels where needed.

## Styling and Assets

Styling is split between Tailwind and feature CSS files.

Global styling:

- `src/styles/index.css`
- CSS variables for Khemet colors
- Tailwind import

Tailwind theme extensions are defined in `tailwind.config.js`:

- Khemet color palette
- Display, ancient, and body font families

Feature styles live in files such as:

- `src/styles/home.css`
- `src/styles/auth.css`
- `src/styles/register.css`
- `src/styles/collections.css`
- `src/styles/artifactDetails.css`
- `src/styles/scan-ai.css`
- `src/styles/chat-ai.css`
- `src/styles/settings.css`

Assets are stored in:

- `src/assets/images`
- `src/assets/logo`
- `src/assets/videos`

## Mock Data and Backend Integration Notes

The following areas still contain placeholder or local-only behavior:

- Avatar image changes are previewed locally.
- Account deletion is still a placeholder.
- `/translate` is a placeholder page, although `translationApi.uploadImage` points to `/api/scan/translate`.
- Local mock data files remain in `src/data/` only as fallback/development fixtures.

Connected API files:

- `src/api/authApi.js`
- `src/api/artifactsApi.js`
- `src/api/translationApi.js`
- `src/api/userApi.js`
- `src/constants/apiEndpoints.js`
- `src/hooks/useArtifacts.js`
- `src/api/scanApi.js`
- `src/api/aiGuideApi.js`
- `src/api/galleryApi.js`
- `src/api/reviewsApi.js`
- `src/hooks/useTranslation.js`

## Build and Deployment

Create a production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

Deploy the generated `dist/` folder to any static hosting provider that supports client-side routing. Configure the host to return `index.html` for unknown routes so direct navigation to paths like `/collections` or `/artifact-details/1` works.

For production, set:

```env
VITE_API_BASE_URL=https://your-api-domain.example/api
```

## Troubleshooting

### The app cannot reach the backend

Check `VITE_API_BASE_URL=http://localhost:3000/api` in `.env`. Restart the Vite dev server after changing environment variables.

### Direct page refresh returns 404 in production

Configure the static host to rewrite unknown paths to `index.html`.

### Authentication appears reset

Auth state is stored in `localStorage`. Clearing browser storage removes:

- `khemet_token`
- `khemet_user`
- `khemet-user-profile`
- `khemet-favorites`
- `language`

### Chat history disappears

Chat history uses `sessionStorage`, so it resets when the browser session ends.

### Styles are missing

Confirm `src/styles/index.css` is imported by `src/main.jsx` and that Vite is running with dependencies installed.

## Repository

Original repository reference:

```text
https://github.com/AlphaTeam-Khemet/web-frontend
```
