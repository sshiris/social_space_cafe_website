# Salonki — paper, ink & hospitality prototype

## Run and inspect

Node 22.18+; `npm ci` for a fresh checkout, then `npm run dev`.
Open http://localhost:3000 (redirects to `/en`). EN/FI/SV are supported.
Production: `npm run build`, then `npm start`.

## Composition and content

Home moves through a charcoal café/lounge introduction with Menu CTA and demo-day hours, a short identity statement,
cultural programme, evening atmosphere, gathering, a smaller souvenir vignette and
compact Visit information. Charcoal, aged paper, wine and olive surfaces, serif type, offset photographic prints and original
CSS ink contours create an editorial rhythm. The official Salonki logo is unchanged.
These are proposed art direction and editorial copy, not confirmed business claims.

- Hero, identity, café, atmosphere, gathering and souvenir copy: `src/content/demo/story.ts`.
- Localized location/contact: `venue.ts` and `shared.ts`.
- Events: `events.ts` → existing `upcomingEvents(...)` → homepage (up to three).
- Meeting capacity/enquiry label: `meeting-room.ts`.
- Visit: `opening-hours.ts` → `hoursOnDate(...)`; only the five areas' demo-day hours.
- Interface labels: `src/i18n/messages/{en,fi,sv}.json` (`art` adds new labels).
- Components compose these sources; the domain content types are unchanged.

The reference date is **14 September 2026**, not today. Prices, schedules, room capacity,
events and editorial copy remain demo content. Existing address/contact caveats are retained.
The sample workshop photo is an atmosphere reference, not a claim that Salonki offers pottery.

## Temporary photography — NOT Salonki

The six stored photographs are temporary visual references from Pexels; five are now displayed. The café image remains available in the registry but its duplicate homepage section was removed. They do **not** depict
Salonki's premises, people, products or events. Visible localized captions and alt text
identify them as samples. No reference-site assets were used. Sources are licensed under
[Pexels' license](https://www.pexels.com/license/); source records checked 2026-09-30.

The single replacement registry is `src/content/demo/photography.ts`: local source,
dimensions, photographer, original page, license, description, section and EN/FI/SV alt text.
`SamplePhoto` uses Next Image with responsive sizes; only the hero is preloaded. Local
WebP files total about 518 KiB. No remote-image host permissions were added. Replace a
registry entry and its local asset to insert approved venue photography without changing layouts.

| Role / local asset | Photographer | Original source / purpose |
| --- | --- | --- |
| `hero.webp` | Nadia Vasil’eva | [Sunlight across a wooden café and green table](https://www.pexels.com/photo/cafe-table-in-a-wooden-interior-lit-by-the-sunlight-13696472/) |
| `cafe.webp` | Liza Summer | [Conversation over coffee at a wooden table](https://www.pexels.com/photo/best-friends-speaking-at-table-with-cups-of-coffee-6382453/) |
| `events.webp` | Kampus Production | [People making pottery together](https://www.pexels.com/photo/people-doing-pottery-6023597/) |
| `world.webp` | Darlene Alderson | [Friends sharing ideas in evening light](https://www.pexels.com/photo/friends-discussing-at-the-table-4384993/) |
| `meetings.webp` | Ketut Subiyanto | [Friends gathered around a small table](https://www.pexels.com/photo/a-group-of-friends-sitting-near-the-table-while-having-conversation-5054659/) |
| `souvenirs.webp` | Pavel Danilyuk | [Ceramic cups and vessels on a shelf](https://www.pexels.com/photo/white-ceramic-bowl-on-the-shelf-7674533/) |

Assets live in `public/images/demo/`. The unused earlier `PhotoSpace` component and
photo briefs remain available; the new homepage no longer renders them.

## Ink interaction

`InkTrail` is a small custom canvas component, active only over the hero and atmosphere.
Mouse motion deposits up to 20 larger ochre dry-brush marks which fade within 950 ms. Nine irregular bristles form each mark. Drawing is clipped to the intended surfaces, with text and control rectangles erased plus an 8px margin.
It does not change the cursor, intercept clicks, or prevent scrolling. Animation frames
stop when the marks disappear. Scroll/resize clears the canvas, and listeners are cleaned
up on unmount. No animation dependency was added. Touch/coarse pointers and reduced-motion
preferences disable the effect; preference changes clear existing marks immediately.
The static print composition remains available on every device.

## Navigation and calendar

Approved header: Menu, Events, Calendar, Meetings & Booking, Souvenirs,
Visit. Logo and footer Home return to `/{locale}`.

- Menu: `/{locale}/menu` (unchanged).
- Calendar: `/{locale}/calendar?month=YYYY-MM` (new, server-rendered).
- Events, Meetings, Souvenirs and Visit: existing homepage section anchors.
- `#food-coffee` now identifies the hero copy, preserving Menu’s return link without a duplicate café section.
- All events: calendar's month programme, a useful temporary destination until Events exists.
- Meeting enquiry and in-person souvenirs CTA: Visit. No booking or checkout.

Calendar defaults to the demo month. Invalid/duplicate month parameters fall back safely;
accepted years are 1900–2199. The Monday-first grid links marked dates to an accessible
programme below it. Events appear on their **start date**, with start/end times displayed
in Europe/Helsinki. Overnight events are not duplicated on the following date.
`events → monthView(...) → CalendarView` reuses `upcomingEvents(...)` for publication,
cancellation and ordering rules. There are no separate calendar fixtures. Empty months
have translated feedback. Month links preserve the locale; language switching preserves
Home/Menu/Calendar, month query and fragment.

Menu flow is preserved byte-for-byte:
`weeklyMenus → publishedMenuForDate(...) → MenuPage → WeeklyMenuView`.
No Menu source, shared presentation helper or menu-specific styles were changed.

## Verification

```sh
npm run typecheck
npm run lint
npm run build
npm run routing:check
npm run content:check
```

Content checks include calendar month geometry, leap years, empty months, draft/cancelled
filtering, Helsinki date boundaries, query validation and local photo provenance.
Review Home/Menu/Calendar in every language at 1440, 768, 390 and 320px. Check the Menu CTA,
all six navigation links, language switching on the selected month, mobile menu Escape,
photo captions, keyboard focus and reduced-motion/touch behavior.

## Future requirements — documentation only

- Menu: choose food → order → pickup time → payment → collection.
- Meetings: date/time → room or meeting/food/coffee package → booking → payment.
- Souvenirs: possible future online purchasing.

No ordering, payments, database, Drizzle, admin, accounts, ticketing, live availability,
booking or additional detail pages are implemented. Stop here for owner review.

Verification completed for this revision: typecheck, lint, production build, routing,
content checks and `git diff --check` passed. Headless Chromium checked all three
routes in EN/FI/SV at 1440/768/390/320px with no horizontal overflow or runtime errors.
Home screenshots and the 320px calendar were visually reviewed. Browser checks also
covered image decoding, menu CTA, temporary anchors, language/month preservation,
root redirect, unsupported locale, empty/invalid months, Escape, keyboard skip link,
calendar date links, reduced motion, touch suppression and actual ink painting/fading.
The original Menu route/components/presentation-helper checksums still match.


## Focused homepage refinement

The duplicate Café & Lounge photo/copy/Menu section was removed, along with its header
entry and hero anchor action. The hero now introduces everyday café/lounge life, links
directly to Menu and displays café/food-service/bar demo-day hours from the existing
fixtures via `hoursOnDate(...)`. `Hours` is shared with Visit; closed and overnight
intervals keep their localized labels. Weekly menus and opening-hour fixtures are intact.

Palette: charcoal #252622, header/footer ink #20211e, aged paper #dfcba6, tobacco stock
#c9ad7f, wine #512f32, olive #30352a and ochre accents. Grain layers, uneven photo crops
and a painted programme mark add materiality. The official black logo is unchanged;
the charcoal header, hero and footer connect it with the broader composition.
