import assert from 'node:assert/strict';
import { isLocale } from '../src/i18n/locales.ts';
import { switchLocalePath, publicRoutes } from '../src/i18n/routing.ts';
for (const locale of ['en', 'fi', 'sv']) {
  assert(isLocale(locale));
  for (const path of ['', '/menu', '/calendar?month=2026-10#month-programme']) assert.equal(switchLocalePath(`/en${path}`, locale), `/${locale}${path}`);
}
for (const locale of ['de', 'EN', '', 'en-US', 'constructor']) assert(!isLocale(locale));
assert.equal(switchLocalePath('/unsupported', 'fi'), '/fi');
assert.deepEqual(publicRoutes.filter(route => route.placement === 'primary').map(route => route.key), ['menu', 'events', 'calendar', 'meetingRoom', 'souvenirs', 'contact']);
assert.deepEqual(publicRoutes.filter(route => route.kind === 'page').map(route => route.path), ['/menu', '/calendar', '']);
assert(publicRoutes.filter(route => route.kind === 'section').every(route => route.path.startsWith('#')));
console.log('Routing checks passed: locale validation, Home/Menu/Calendar, query/hash preservation and approved navigation.');
