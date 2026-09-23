# Café / social venue — revised Milestone 3

A one-page-first, multilingual public prototype for owner review. `/en`, `/fi` and
`/sv` contain the venue introduction, today's demo opening hours, Food & Coffee,
weekly lunch menu, bar, upcoming events, souvenirs, meeting room and visit/contact.
There are no detail pages, admin tools, databases, payments or booking systems.

## Run locally

Use Node.js 22.18+ and npm. No accounts or environment variables are needed.
Dependencies are already installed; use `npm ci` for a fresh checkout.

```sh
npm run dev
```

Open http://localhost:3000 (redirects to `/en`). Stop with Ctrl+C.
For production testing: `npm run build`, then `npm start`.

## Demo information, not confirmed business facts

- **Demo clock:** `demoContext.referenceDate` is 14 September 2026. The opening panel,
  current weekly menu and upcoming-event selection consistently use that fixed day.
  The page explicitly says this is not the actual current date. There is no live
  open-now status. Before launch, replace this demo clock with a real Helsinki clock
  and appropriate rendering/cache behavior.
- The venue name, S. mark, slogans, palette and all imagery are prototype placeholders.
  The header/footer and metadata receive the name from `demoContext.venueName`.
  The mark is in `header.tsx`; visual tokens are at the start of `globals.css`.
- All menu items, dietary claims, prices, schedules, events, products and room facts
  are illustrative and require owner approval. Translations also need review.
- Images are CSS placeholder panels with labels and translated alternative text from
  the existing image descriptors. They are not photographs of a real venue.
- Vaasa / Vasa is the project location. No street address, phone number, directions
  or accessibility claims have been invented. These await owner confirmation.
- `hello@example.com` is displayed as an example, not an active enquiry address.
  The room CTA scrolls to contact information. No form or booking flow exists.
- Example event booking URLs are not active links. No ticket checkout is offered.
- Prices are EUR cents. Menu dates are calendar dates; event timestamps include
  offsets and are displayed in Europe/Helsinki. Room availability and souvenir
  availability are descriptive text, not booking slots or tracked inventory.

## Structure and data flow

`src/app/[locale]/page.tsx` validates the language and renders the server component
`src/components/home/homepage.tsx`. The shared `[locale]/layout.tsx` still owns the
HTML language, metadata, header and footer. `/` redirects to `/en`; unknown locales
return 404. Detail routes such as `/en/menu` remain unimplemented.

The homepage reads from `src/content/demo/` rather than copying business facts into
page components:

| Section | Source |
| --- | --- |
| Introduction, coffee and contact notes | New `venue.ts`; coffee reuses the existing `Drink` shape |
| Today's demo hours and regular schedules | Existing `opening-hours.ts`, including date exceptions |
| Weekly menu | Existing `weekly-menus.ts`, prices and dietary translations from `shared.ts` |
| Bar | Existing `bar.ts`, linked to its opening-hours record |
| Upcoming events | Existing `events.ts`, filtered to published, non-cancelled upcoming records |
| Souvenirs | Existing `souvenirs.ts`, filtered by visibility |
| Meeting room | Existing `meeting-room.ts`, including price, facilities and hours |

`src/content/presentation.ts` provides price/date formatting, date-specific hours,
published-week selection and event filtering. Date exceptions replace regular hours;
overnight closures are marked as the following day. Expired menus are not silently
shown as current. The six existing content-area types and their fixtures are unchanged.

Shared interface labels live in `src/i18n/messages/en.json`, `fi.json`, and `sv.json`.
Business introduction/contact copy moved out of the previous shell's interface text
and into the separate translated demo fixture. `Localized<T>` requires all languages.

The menu opens the demo day's dishes initially. Visitors can expand any other day
without leaving the page. Regular hours use native expandable sections. These work
without adding client-side data fetching or a UI library.

## Section navigation

`src/i18n/routing.ts` defines seven stable fragment links:
`#home`, `#food-coffee`, `#bar`, `#events`, `#souvenirs`, `#meeting-room`, `#contact`.
They link to `/{locale}#section`, so future detail pages can link back to the homepage.
The additional opening-information panel has its own `#opening-hours` target.

On the homepage, clicking navigation closes the mobile menu before scrolling,
updates the URL fragment, and focuses the destination section for keyboard users.
Modified clicks retain native browser behavior. All links have real fragment hrefs.
No scroll-tracking indicator or sticky header is added in this milestone.

The existing language switcher replaces only the locale segment and preserves the
section, nested route paths, and (on activation) query strings and fragments. All
three homepages share the same section IDs.

## Verify locally

```sh
npm run typecheck
npm run lint
npm run build
npm run routing:check
npm run content:check
npm run content:inspect -- en
npm run content:inspect -- fi
npm run content:inspect -- sv
```

The content inspection command includes drafts intentionally. Public rendering filters
them. Checks now also cover exceptional closures, overnight hours, draft/expired menus,
and cancellation/expiry filtering for events.

Manual review:

1. Visit `/en`, `/fi`, `/sv` and scroll through all eight sections.
2. Use all seven navigation links. URLs should end in the corresponding fragment.
3. Visit `/en?preview=1#meeting-room`, then choose FI. The section and query remain.
4. At 390px or 320px, open navigation, select a section, and verify the menu closes.
   Escape closes the menu and returns focus to its button.
5. Expand the other lunch days, bar hours and contact-area opening schedules.
6. Verify that only two published events are shown, not the October draft.
7. Check the room CTA leads to contact; no example email or ticket link is actionable.
8. Confirm `/de`, `/en/menu`, and `/en/events/example` return 404.

Production-browser verification passed for all locales at desktop and mobile widths
of 390px and 320px: all section targets, menu/hour disclosures, language/fragment
preservation, menu closing, focus transfer, no horizontal overflow and no runtime
errors. Desktop/mobile screenshots were reviewed. Browser tooling and screenshots
remain under `/tmp`, not in the project dependencies.

## Exact revised Milestone 3 file changes

Created:
- `src/components/home/homepage.tsx` — eight sections and small shared presentation components.
- `src/content/demo/venue.ts` — translated editorial demo copy and coffee drinks.
- `src/content/presentation.ts` — content selection and localized formatting helpers.

Changed:
- `src/app/[locale]/page.tsx` — renders the homepage instead of the shell preview.
- `src/app/[locale]/layout.tsx` — demo-based metadata and shared venue name props.
- `src/app/globals.css` — responsive section, card, menu and schedule styles.
- `src/components/layout/header.tsx` — section navigation, focus/scroll handling, shared venue name.
- `src/components/layout/footer.tsx` — shared venue name.
- `src/content/demo/index.ts` — exports the new venue and coffee fixtures.
- `src/i18n/routing.ts` — homepage fragment destinations.
- `src/i18n/messages/en.json` — English section/interface labels.
- `src/i18n/messages/fi.json` — Finnish section/interface labels.
- `src/i18n/messages/sv.json` — Swedish section/interface labels.
- `scripts/check-routing.mjs` — one-page destinations and section-preserving language checks.
- `scripts/inspect-content.mjs` — new fixture inspection and presentation-rule checks.
- `README.md` — current scope, data flow, demo limitations and verification steps.

No files were deleted. No packages were added. Ignored build/type artifacts are
regenerated by verification. No commit is created by this milestone.

Stop here: further milestones and detail pages require approval.
