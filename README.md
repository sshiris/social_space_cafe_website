# Salonki — venue-first homepage prototype

A multilingual hospitality and cultural venue prototype. Home introduces Salonki as
a place, with events and atmosphere leading the story. Only Home and the existing
weekly Menu detail page are implemented. No further milestone is started.

## Run locally

Use Node.js 22.18+ and npm. No accounts or environment variables are required.

```sh
npm run dev
```

Open http://localhost:3000 (redirects to `/en`). Use `npm ci` for a fresh install.
Production preview: `npm run build`, then `npm start`. Stop the server with Ctrl+C.

## Homepage hierarchy

1. **Hero:** Salonki's name, a short venue statement and a large abstract photo-ready
   background. The supplied Salonki logo remains unchanged in the header.
2. **Identity:** one short editorial paragraph about time spent together, not a
   collection of services.
3. **What's happening:** two currently published upcoming demo events, led by large
   dates and event titles. The selector supports up to three. No ticket flow.
4. **Eat & drink:** one hospitality story covering coffee, lunch and evening drinks,
   paired with a large photo slot. The CTA goes to `/{locale}/menu`.
5. **More than a café:** a large typographic section about conversation, music,
   dancing and belonging. No feature cards or lists of icons.
6. **Gathering:** editorial text, a photo slot and the existing room capacity. The
   enquiry CTA leads to Visit; no availability/booking system is implied.
7. **Visit:** practical location/contact caveats, demo-day hours, regular schedules
   and exceptions. Souvenirs appear only as a small note here.
8. **Footer:** existing branding and translated text, with secondary Bar/Souvenirs links.

Different compositions create the rhythm: a wide atmospheric hero, a text-only
introduction, editorial event entries, a split hospitality section, a full-width
statement and a gathering image/text section. There is no separate Bar section,
product grid, drinks catalogue, dish preview or equally weighted service grid.

## Data and components

| Area | Source |
| --- | --- |
| Hero / identity / hospitality / atmosphere / gathering / souvenir note | `src/content/demo/story.ts`: proposed copy in EN/FI/SV using `Localized<T>` |
| Hero and hospitality photo briefs | `storyImages` in the same fixture, using the existing `DemoImage` type |
| Events | Existing `events.ts` via unchanged `upcomingEvents(...)`, with date/price formatting |
| Gathering capacity and image descriptor | Existing `meeting-room.ts` |
| Visit | Existing `venue.ts`, `shared.ts`, `opening-hours.ts`, `hoursOnDate(...)` |
| Labels and CTAs | Existing `src/i18n/messages/{en,fi,sv}.json`, under `story` |

`homepage.tsx` composes the story from fixtures. `photo-space.tsx` renders explicitly
abstract, labelled photo placeholders. `visit.tsx` extracts the practical visit and
hours presentation from the previous homepage. No domain models were rewritten.
The content inspection command includes the new story fixtures and validates their
three-language structure alongside existing content.

## Photography and demo status

No photos were downloaded from references or generated to represent Salonki. The
photo slots are abstract CSS compositions labelled “Photography to come” in each
language, with translated alternative text. Approved images can later replace the
interior of `PhotoSpace` without changing the surrounding editorial layout. The
supplied real logo is untouched.

All new story text is proposed editorial copy for owner review. Existing menus,
prices, events, room capacity, hours and contact caveats remain demo information.
The fixed demo date is **14 September 2026**. Event filtering and displayed opening
hours use that date, not the current date. No new street address, operational promise,
booking channel or permanent business fact has been invented.

References were reviewed only for high-level principles: FRÖJ's simplicity, de la
finca's café/creative-house storytelling, and Triple C's culture/community emphasis.
The FRÖJ direct request was blocked; its indexed content had been reviewed in the
preceding pass. No reference wording, photographs, assets, layouts or code were copied.

## Navigation

`src/i18n/routing.ts` specifies both destination kind and placement:

| Entry | Placement | Destination |
| --- | --- | --- |
| Home | Primary header | `/{locale}` |
| Menu | Primary header | `/{locale}/menu` |
| Events | Primary header | `/{locale}#events` |
| Gatherings | Primary header | `/{locale}#meeting-room` |
| Visit / Contact | Primary header | `/{locale}#contact` |
| Bar | Secondary footer | `/{locale}#bar` (inside Eat & Drink) |
| Souvenirs | Secondary footer | `/{locale}#souvenirs` (small Visit note) |

All anchors work from Home or Menu. `#food-coffee` is retained for the menu page's
return link. “Explore the programme” points to the actual inline `#event-programme`
list, not a nonexistent Events page; event enquiries point to Visit. Change these
links to detail routes only in the appropriate future milestone.

The existing language switcher preserves the current Home/Menu path, query and
fragment. Unsupported locales and unimplemented detail routes return 404. Mobile
primary navigation retains Escape-to-close and section-focus behavior.

## Menu preservation

The flow is unchanged:

`weeklyMenus → publishedMenuForDate(...) → MenuPage → WeeklyMenuView`

The menu route, both menu components and `content/presentation.ts` were checksummed
before and after this task and remain identical. The domain fixtures and types are
unchanged. Menu typography/layout styles are retained; new homepage styles are scoped
to story-specific classes. The shared layout only gains the footer locale prop.

## Verification

```sh
npm run typecheck
npm run lint
npm run build
npm run routing:check
npm run content:check
npm run content:inspect -- fi
```

Check Home and Menu in EN/FI/SV, switch languages on both routes, and use every header
and footer link. Verify the programme anchor, Menu CTA and Visit opening-hour
expanders. Review at 1440px desktop, 768px tablet, 390px and 320px mobile.
Browser checks cover the new section order, five primary/two secondary links, all
six Home/Menu routes, the logo, Menu's ten dishes, language preservation, no horizontal
overflow, root redirect, unbuilt-route 404s and no browser runtime errors.

## Exact files for this redesign

Created:
- `src/content/demo/story.ts`
- `src/components/home/photo-space.tsx`
- `src/components/home/visit.tsx`

Changed:
- `src/components/home/homepage.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/app/[locale]/layout.tsx`
- `src/app/globals.css`
- `src/content/demo/index.ts`
- `src/i18n/routing.ts`
- `src/i18n/messages/en.json`
- `src/i18n/messages/fi.json`
- `src/i18n/messages/sv.json`
- `scripts/check-routing.mjs`
- `scripts/inspect-content.mjs`
- `README.md`

No files removed, no dependencies added, no new detail routes. Pre-existing M4 work
is preserved. Temporary browser scripts/screenshots live under `/tmp`; build/type
artifacts are generated and ignored. Stop here pending homepage approval.

Final verification passed: typecheck, lint, build, routing and content checks; browser
checks in EN/FI/SV at 1440px, 768px, 390px and 320px. Screenshots were reviewed and the
final build rechecked after correcting date formatting and mobile placeholder-caption
contrast. No horizontal overflow or runtime errors. Menu preservation checksums pass.
