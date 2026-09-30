# Salonki — compact photographic homepage

Run `npm run dev` and open http://localhost:3000. The root redirects to `/en`.
Use Node 22.18+ and `npm ci` for a fresh checkout. Production: `npm run build`, then `npm start`.

## Homepage

A near-viewport photographic hero carries the unchanged official logo and one short
venue label. Navigation overlays the photograph on Home and uses a solid background
on detail pages. A symmetrical six-destination grid follows immediately: three columns
on desktop, two on tablet, one below 480px. Photography alternates with restrained
Takeaway and Calendar typography tiles. The ending contains only contact/location,
compact demo-day hours and the shared footer. No animation or cursor effect remains.

The earlier long identity, café, event-list, atmosphere, meeting and souvenir sections
are no longer rendered. Their useful fixtures and source images remain available.

## Destinations

| Label | Route / temporary behavior |
| --- | --- |
| Menu | `/{locale}/menu`, existing full weekly menu |
| Takeaway | `/{locale}/takeaway`, informational future-function preview |
| Events | `/{locale}/calendar#month-programme`, existing shared event programme |
| Calendar | `/{locale}/calendar`, existing month view |
| Booking | `/{locale}/booking`, room preview with existing demo capacity |
| Market | `/{locale}/market`, souvenir concept preview |

The three preview pages share `src/app/[locale]/[destination]/page.tsx`, with an explicit
allowlist. Unsupported destinations return 404. No ordering, live booking or commerce
is implied. Existing Calendar and Menu routes/data flow remain intact. The Menu return
anchor `#food-coffee` now targets the destination grid. Language switching preserves
routes, queries and fragments. EN/FI/SV interface labels live in `src/i18n/messages/`.

## Content and photography

`Homepage` uses the route registry, localized messages and centralized photo metadata.
Visit reads `venueText`, `demoContext` and `openingHours` through `hoursOnDate(...)`.
Shared `Hours` renders intervals, closed labels and next-day closing information.
Preview pages use existing meeting-room and venue content. Events continue to use the
same existing event dataset through Calendar; no calendar fixtures were duplicated.

The fixed demo date is **14 September 2026**, not the current date. Schedules, prices,
events and capacity are unconfirmed demo information; address/contact caveats remain.

All photographs are temporary Pexels visual references and do **not** depict Salonki,
its staff, products or events. No reference-site assets were used. The registry
`src/content/demo/photography.ts` retains local sources, original URLs, creators,
descriptions, section roles and localized alt text. Replace its asset/source entries
when real venue photography is available. Original credits are listed below.

| Role / local asset | Photographer | Original source / purpose |
| --- | --- | --- |
| `hero.webp` | Nadia Vasil’eva | [Sunlight across a wooden café and green table](https://www.pexels.com/photo/cafe-table-in-a-wooden-interior-lit-by-the-sunlight-13696472/) |
| `cafe.webp` | Liza Summer | [Conversation over coffee at a wooden table](https://www.pexels.com/photo/best-friends-speaking-at-table-with-cups-of-coffee-6382453/) |
| `events.webp` | Kampus Production | [People making pottery together](https://www.pexels.com/photo/people-doing-pottery-6023597/) |
| `world.webp` | Darlene Alderson | [Friends sharing ideas in evening light](https://www.pexels.com/photo/friends-discussing-at-the-table-4384993/) |
| `meetings.webp` | Ketut Subiyanto | [Friends gathered around a small table](https://www.pexels.com/photo/a-group-of-friends-sitting-near-the-table-while-having-conversation-5054659/) |
| `souvenirs.webp` | Pavel Danilyuk | [Ceramic cups and vessels on a shelf](https://www.pexels.com/photo/white-ceramic-bowl-on-the-shelf-7674533/) |


Images are local optimized WebP files in `public/images/demo/`. Next Image provides
responsive sizes; only the hero is preloaded. No remote image configuration was expanded.
The grid uses café, workshop, gathering and ceramics samples. Takeaway uses typography;
its preview page uses the existing café sample. The previous evening image is retained
in the registry but not displayed on Home. Hero attribution is visible on the image;
a localized sample notice is shown in the essentials, and sample alt text identifies
all illustrative photographs. [Pexels license](https://www.pexels.com/license/).

## Preserved implementation

`weeklyMenus → publishedMenuForDate(...) → MenuPage → WeeklyMenuView`

The Menu route, Menu components, presentation helper, Calendar files, core fixtures
and photography registry were checksum-verified unchanged during this restructuring.
Menu-specific CSS remains intact. No logo asset modification or new dependency.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm run routing:check
npm run content:check
```

Browser review: Home and all six destinations in EN/FI/SV; desktop, tablet, 390px and
320px; language preservation, mobile menu/Escape, images, grid columns, root redirect,
unsupported routes and horizontal overflow.

## Future only

Food selection, pickup ordering and payment; live room booking with meeting/coffee
packages and payment; possible souvenir ecommerce. None is implemented. No database,
admin, authentication, ticket purchasing or new calendar functionality. No commit/push.

Verification completed: typecheck, lint, production build, routing/content checks and
`git diff --check` passed. Chromium checked EN/FI/SV at 1440, 768, 390 and 320px,
including all six tile destinations, Menu return, mobile navigation/Escape, image
loading, language switching on all routes, redirects and unsupported-route 404s.
No horizontal overflow or browser runtime errors. Desktop and 320px screenshots were
visually reviewed. No changes committed or pushed.
