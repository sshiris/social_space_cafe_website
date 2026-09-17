# Satama Social — Milestone 2

Multilingual routing and a shared public shell for the fictional Satama Social venue
in Vaasa / Vasa. English, Finnish and Swedish are supported. The home route is a
minimal shell preview, not the complete home page. Menu, bar, event, souvenir, room
and contact pages are not implemented. No database, admin or transaction features.

## Run locally

Use Node.js 22.18+ and npm. No environment variables or accounts are needed.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. It redirects to `/en`. Dependencies are already installed;
`npm ci` is only necessary for a fresh installation. Stop the server with Ctrl+C.
For production testing: `npm run build`, then `npm start`.

## Routing and translations

- `next.config.ts` redirects exactly `/` to `/en` with a temporary 307 redirect.
- `src/app/[locale]/layout.tsx` is the root layout. It sets the correct HTML language,
  validates locales, and wraps every future public page with the header and footer.
- Only `en`, `fi`, `sv` are generated; unsupported locales return 404. Locale checks
  also run in the layout, metadata generation and preview page.
- `src/i18n/routing.ts` lists the seven agreed routes with language-independent names.
  Only Home is enabled. Other entries are explicitly unavailable with a translated
  coming-soon description; they are not links to missing pages.
- `src/i18n/messages/{en,fi,sv}.json` contains interface and temporary shell-preview
  translations. `messages.ts` enforces a matching shape. Owner-editable fixture
  content remains separate in `src/content/demo/`.
- The language switcher replaces only the locale prefix. Future nested paths and
  event slugs are retained. On activation it also retains the current query and hash.
  Language links use normal document navigation so the HTML language and entire shell
  update together. Their initial hrefs preserve paths even before hydration; query/hash
  preservation on activation requires JavaScript.

## Shared layout

- `header.tsx`: provisional wordmark, desktop navigation, language controls and a mobile
  disclosure menu. Escape closes the menu and returns focus to its button; selecting
  Home closes it. Language navigation reloads with a closed menu.
- `language-switcher.tsx`: native language names in accessible labels, compact EN/FI/SV
  controls and current-language indication.
- `footer.tsx`: translated location, tagline and preview label.
- `globals.css`: adjustable color/font/width tokens, system fonts, responsive layouts,
  focus styles and a skip link. Navigation collapses below 900px. No external fonts,
  photography or new UI dependencies are required.
- `[locale]/page.tsx`: small translated shell preview and decorative typographic motif.

## Manual checks

1. Visit `/`: expect `/en`. Directly open `/en`, `/fi`, `/sv` and compare labels.
2. Switch languages with EN/FI/SV; inspect the document's `lang` attribute.
3. Open `/en?preview=1#main-content`, then choose FI. Query and fragment should remain.
4. Open `/de` or `/en-US`: expect 404. `/en/menu` also returns 404 until its milestone.
5. At desktop width, see all seven navigation entries. Only Home is enabled.
6. At 390px and 320px width, open/close the menu, press Escape and check keyboard focus.
7. Tab from the top: the skip link appears and moves focus to the main content.
8. Check there is no horizontal scrolling in any language.

```sh
npm run routing:check
npm run content:check
npm run typecheck
npm run lint
npm run build
npm run content:inspect -- fi
```

The inspection command also accepts `en` and `sv`; it intentionally includes drafts.

## Content model

- `src/i18n/locales.ts` defines `en`, `fi`, `sv` and `Localized<T>`. Every localized
  field requires all three languages at compile time. This does not implement routing.
- `src/content/types.ts` defines opening hours, weekly menus, bar, events, souvenirs
  and meeting room. Stable IDs connect related content.
- Shared facts are stored once, with translations under `text.en`, `text.fi` and
  `text.sv`. Simple labels use `{ en, fi, sv }` directly. A future database can store
  translation rows without changing the shape used by pages.
- Prices are integer cents in EUR. Arrays determine display order. Dietary labels
  are stable codes translated in `shared.ts`. They describe the dish, not included
  bread or sides. Demo dietary claims and translations need owner review.
- Menu dates are local `YYYY-MM-DD` strings. The sample week is 14–18 September 2026
  with two dishes per day. Items can override the day's serving times.
- Hours use ISO weekdays (Monday 1 through Sunday 7). Empty intervals mean closed.
  Exceptions replace that date's regular schedule. `closingDayOffset: 1` means
  closing on the next day. All local hours use Europe/Helsinki.
- Events have explicit-offset timestamps, stable language-independent slugs,
  draft/published state and a separate cancellation flag. Prices can be free,
  fixed, or described on an external website. There are two published demo events
  and one draft. The example.com booking link is not a real service.
- Souvenir availability is descriptive copy, not stock tracking. Room hours and
  availability notes are descriptive, not bookable slots. The contact email is a
  dummy example.com address; replace it before accepting real enquiries.
- Images are explicit placeholder descriptors with translated alt text and
  photography briefs. No real photos, image files or broken asset URLs are added.
- Dates are fixed for reproducible reviews, not automatically shifted. Update them
  deliberately for later demos; future pages must handle expired content.
- `satisfies` checks fixture shapes while preserving inferred types. The inspection
  script checks additional invariants. These developer checks do not replace future
  admin-input validation or database constraints.

## Milestone 2 file changes

Created:
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/globals.css`
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/language-switcher.tsx`
- `src/i18n/messages.ts`
- `src/i18n/messages/en.json`
- `src/i18n/messages/fi.json`
- `src/i18n/messages/sv.json`
- `src/i18n/routing.ts`
- `scripts/check-routing.mjs`

Changed: `next.config.ts`, `src/i18n/locales.ts`, `package.json`, `README.md`.
Removed: `src/app/layout.tsx`, `src/app/page.tsx` (replaced by locale-aware versions).
Build/typecheck regenerate ignored `.next/`, `next-env.d.ts` and `tsconfig.tsbuildinfo`.
The Milestone 1 content model and fixtures are unchanged.

Milestone 2 stops here. Further page implementation requires approval.

## Verification completed

Production-browser checks passed for all three locales, the root 307 redirect,
unsupported-locale 404s, query/hash-preserving language switches, desktop navigation,
and mobile navigation at 390px and 320px. Escape/focus return, skip-link behavior,
no horizontal overflow and no browser runtime errors were verified. TypeScript,
ESLint, production build, routing checks and existing content checks passed.
Browser tooling and screenshots were kept in `/tmp`, outside project dependencies.
