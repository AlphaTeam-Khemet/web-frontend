# KHEMET Web Frontend

KHEMET Web Frontend is the React/Vite client for the KHEMET Smart Guide experience, a museum-style web app focused on ancient Egyptian artifacts, AI-assisted exploration, artifact scanning, multilingual navigation, and saved user collections.

The interface is built around an immersive Egyptian visual identity with authentication, onboarding, collections, artifact details, protected AI scan/chat tools, favorites, profile/settings, and a guided tour page.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Backend Integration](#backend-integration)
- [State and Storage](#state-and-storage)
- [Internationalization](#internationalization)
- [Assets](#assets)
- [Build and Deployment](#build-and-deployment)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features

- Splash and welcome experience with guest and authenticated flows.
- Authentication screens for sign in, sign up, forgot password, OTP verification, reset password, and new password creation.
- Language selector on the welcome screen and global language switching.
- Home page with hero gallery, stats, feature cards, CTA, and footer links.
- Guided tour page at `/tour` using the local splash video asset.
- Collections page with search, category filters, pagination-style "show more", and artifact cards.
- Artifact details page with overview content and direct "Ask Khemet AI" handoff.
- Protected Scan AI page for image upload/camera capture and backend artifact recognition.
- Protected Chat AI page with session-based chat history, recent conversations, AI responses, and artifact prompt handoff.
- Voice Tour Guide: the `VoiceGuideButton` component allows users to hear AI-generated, multilingual artifact narrations (in English and Arabic).
- Favorites page for authenticated users, with search/filter support and artifact-detail navigation.
- Profile/settings pages with language, profile, logout, and activity-related UI.
- Multilingual UI support for English, Arabic, Spanish, French, German, and Chinese.

## Tech Stack

- React
- Vite
- React Router DOM
- TanStack React Query
- Axios
- i18next and react-i18next
- Tailwind CSS/PostCSS
- Feature-scoped CSS
- Lucide React
- React Icons
- Framer Motion

## Requirements

- Node.js
- npm

The repository includes `package-lock.json`, so install dependencies with npm.

## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173/
```

To bind explicitly to localhost:

```bash
npm run dev -- --host 127.0.0.1
```

## Environment Variables

The frontend reads the backend URL from:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If this variable is missing, the Axios client falls back to:

```text
http://localhost:3000/api
```

Vite only exposes variables prefixed with `VITE_`.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in `dist/`.

```bash
npm run preview
```

Serves the production build locally.

There are currently no configured lint, format, or test scripts in `package.json`.

## Routes

Routes are defined in `src/constants/routes.js` and wired in `src/routes/AppRoutes.jsx`.

| Route | Component | Access | Purpose |
| --- | --- | --- | --- |
| `/` | `Splash` | Public | Initial splash screen |
| `/welcome` | `Welcome` | Public | Onboarding and language selection |
| `/tour` | `Tour` | Public | Video-based guided tour page |
| `/sign-in` | `SignIn` | Guest only | Login form |
| `/sign-up` | `SignUp` | Guest only | Register form with full name |
| `/forgot-password` | `ForgotPassword` | Guest only | Password recovery |
| `/verification-code` | `VerificationCode` | Guest only | OTP verification |
| `/reset-password` | `ResetPassword` | Guest only | Password reset |
| `/create-new-password` | `CreateNewPassword` | Guest only | New password form |
| `/email-verification-choice` | `EmailVerificationChoice` | Guest only | Email verification choice |
| `/home` | `Home` | Main layout | Home page |
| `/collections` | `Collections` | Main layout | Artifact collection browsing |
| `/artifact-details/:id` | `ArtifactDetails` | Main layout | Artifact detail page |
| `/translate` | `Translate` | Main layout | Translation placeholder |
| `/scan` | `ScanAI` | Protected | AI artifact scan |
| `/chat-ai` | `ChatAI` | Protected | AI guide chat |
| `/settings` | `Settings` | Protected | Account/settings page |
| `/favorites` | `Favorites` | Protected | Saved artifacts |
| `/profile` | `Profile` | Protected | Profile page |

`GuestRoute` redirects authenticated users to `/home`.  
`ProtectedRoute` redirects unauthenticated users to `/sign-in`.

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- api/                 # Axios instance and backend resource wrappers
|   |-- assets/              # Images, logos, and videos bundled by Vite
|   |-- components/          # Reusable UI grouped by feature
|   |-- constants/           # Routes, endpoint constants, color constants
|   |-- context/             # Auth, favorites, language, and user profile state
|   |-- data/                # Mock/fallback data
|   |-- hooks/               # Shared hooks
|   |-- i18n/                # i18next setup
|   |-- locales/             # Translation JSON files
|   |-- pages/               # Route-level screens
|   |-- routes/              # Route tree and route guards
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

## Backend Integration

The shared Axios client lives in:

```text
src/api/axiosInstance.js
```

It:

- Uses `VITE_API_BASE_URL`.
- Adds `Authorization: Bearer <token>` when `khemet_token` exists in `localStorage`.
- Uses endpoint constants from `src/constants/apiEndpoints.js`.

Main API wrappers:

| File | Purpose |
| --- | --- |
| `src/api/authApi.js` | Login, register, refresh, logout, forgot/reset password |
| `src/api/artifactsApi.js` | Monuments, artifact details, favorites |
| `src/api/scanApi.js` | Artifact scan and scan history |
| `src/api/aiGuideApi.js` | AI guide ask/describe/identify endpoints |
| `src/api/galleryApi.js` | User gallery save/list/remove |
| `src/api/reviewsApi.js` | Monument reviews |
| `src/api/userApi.js` | User profile |
| `src/api/translationApi.js` | Translation upload/result endpoints |

Important backend endpoint groups:

- `/auth/*`
- `/monuments`
- `/favorites`
- `/scan/*`
- `/ai-guide/*`
- `/gallery`
- `/reviews`
- `/users/profile`

## State and Storage

Local browser storage is used for client state and persistence.

| Key | Storage | Purpose |
| --- | --- | --- |
| `khemet_token` | localStorage | Access token |
| `khemet_refresh_token` | localStorage | Refresh token |
| `khemet_user` | localStorage | Authenticated user payload |
| `khemet_guest` | localStorage | Guest mode flag |
| `khemet-user-profile` | localStorage | Local profile/avatar state |
| `khemet-favorites` | localStorage | Favorite artifacts cache |
| `language` | localStorage | Selected language |
| `khemet-recent-chats` | localStorage | Chat session list and messages |
| `khemet-active-chat-id` | localStorage | Active chat session |
| `khemet-chat-messages` | sessionStorage | Compatibility/current chat cache |

Providers are composed in `src/main.jsx`:

- `LanguageProvider`
- `UserProfileProvider`
- `FavoritesProvider`
- `QueryClientProvider`
- `BrowserRouter`
- `AuthProvider`

## Internationalization

i18n is configured in:

```text
src/i18n/index.js
```

Supported locale files:

- `src/locales/en.json`
- `src/locales/ar.json`
- `src/locales/es.json`
- `src/locales/fr.json`
- `src/locales/de.json`
- `src/locales/zh.json`

Language behavior:

- Reads the selected language from `localStorage`.
- Defaults to English.
- Updates `document.documentElement.lang`.
- Sets `dir="rtl"` for Arabic and `dir="ltr"` for other languages.

When adding text, update all locale files so the UI stays complete across languages.

## Assets

Bundled assets live under:

```text
src/assets/
```

Examples:

- `src/assets/images/`
- `src/assets/images/home/`
- `src/assets/logo/`
- `src/assets/videos/splash-bg.mp4`

The redesigned Chat AI page supports a runtime background image from:

```text
public/chat-ai-bg.png
```

If this file is missing, the page still works and falls back to the CSS background color.

## Build and Deployment

Create a production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

Deploy the generated `dist/` folder to a static hosting provider that supports SPA routing. Configure unknown route rewrites to `index.html`, otherwise direct refreshes like `/collections` or `/chat-ai` may return 404.

For production, set:

```env
VITE_API_BASE_URL=https://your-api-domain.example/api
```

## Development Notes

- `/scan`, `/chat-ai`, `/favorites`, `/settings`, and `/profile` are protected routes.
- Home feature cards link to Collections, Scan, and Chat AI.
- Artifact details can hand off an artifact name to Chat AI through the `artifact` query parameter.
- Scan results can also hand off the detected artifact name to Chat AI.
- Favorites require authentication. Guest users are redirected to sign in before saving artifacts.
- Chat sessions are stored locally and keep a stable order. New chats appear at the top; selecting older chats does not reorder them.
- Chat session titles are automatically shortened to the first three words.
- `/translate`, `/media-gallery`, and some profile-related pages remain lightweight placeholders or future expansion points.

## VoiceGuideButton Component

Located at `src/components/common/VoiceGuideButton.jsx`.

Renders a gold-styled button that generates and plays an AI narration for an artifact.

### Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `artifactId` | `string` | ✅ | The monument/artifact ID used to cache the narration in the backend. |
| `artifactName` | `string` | ✅ | Human-readable artifact name passed to the LLM for narration. |
| `artifactDescription` | `string` | ✅ | Artifact description passed to the LLM for narration context. |

The component reads the current language (`"en"` or `"ar"`) automatically from `useLanguage()`. Arabic narrations are generated using Modern Standard Arabic (فصحى).

### Behaviour

1. On first click — shows a spinner and POSTs to `/api/voice/narrate` via the backend proxy.
2. If `audio_url` is returned — fetches the audio securely and auto-plays it, showing a Pause button.
3. If `cached: true` — plays immediately without a loading spinner on the next call.
4. If audio generation fails — shows the first ~120 characters of the narration text as fallback.
5. Audio state resets automatically when `artifactId` or `language` changes.

### Configuration

No special configuration is needed. The `VoiceGuideButton` uses the same `VITE_API_BASE_URL` as the rest of the application since the backend securely routes narration requests to the isolated `voice_tour_guide` microservice.

### Usage Example

```jsx
import VoiceGuideButton from '../components/common/VoiceGuideButton';

// Inside your component, where artifact data is already loaded:
<VoiceGuideButton
  artifactId={artifact.id}
  artifactName={artifact.name}
  artifactDescription={artifact.description}
/>
```

The component is already rendered in `ArtifactDetails.jsx` and `ScanResult.jsx`.


## Troubleshooting

### Backend requests fail

Check `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Restart the Vite server after changing environment variables.

### Protected pages redirect to Sign In

Protected routes require a stored auth token. Sign in again or inspect localStorage for:

```text
khemet_token
```

### Direct refresh returns 404 after deployment

Configure the host to rewrite unknown routes to `index.html`.

### Chat background does not appear

Make sure the image exists at:

```text
public/chat-ai-bg.png
```

### UI language looks wrong

Clear or update the `language` key in localStorage, then reload the page.

### Build output changes in Git

`npm run build` regenerates files in `dist/`. Commit build output only if your deployment workflow requires tracking `dist/`.

## Repository

```text
https://github.com/AlphaTeam-Khemet/web-frontend
```
