import assert from 'node:assert/strict';
import { isLocale } from '../src/i18n/locales.ts';
import { switchLocalePath, publicRoutes } from '../src/i18n/routing.ts';
for (const locale of ['en', 'fi', 'sv']) {
  assert(isLocale(locale));
  for (const path of ['', '/menu', '/takeaway', '/booking', '/market', '/calendar?month=2026-10#month-programme']) assert.equal(switchLocalePath(`/en${path}`, locale), `/${locale}${path}`);
}
for (const locale of ['de', 'EN', '', 'en-US', 'constructor']) assert(!isLocale(locale));
assert.equal(switchLocalePath('/unsupported', 'fi'), '/fi');
assert.deepEqual(publicRoutes.filter(route => route.placement === 'primary').map(route => route.key), ['menu', 'takeaway', 'events', 'calendar', 'booking', 'market']);
assert.deepEqual(publicRoutes.filter(route => route.placement === 'primary').map(route => route.path), ['/menu','/takeaway','/calendar#month-programme','/calendar','/booking','/market']);
assert(publicRoutes.filter(route => route.kind === 'section').every(route => route.path.startsWith('#')));
console.log('Routing checks passed: locales, six destinations and path/query/hash preservation.');
