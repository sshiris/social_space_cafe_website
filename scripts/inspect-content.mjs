import assert from "node:assert/strict";
import * as content from "../src/content/demo/index.ts";
import { locales } from "../src/i18n/locales.ts";

const { weeklyMenus, openingHours, bar, events, souvenirs, meetingRoom } = content;
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const locale = args.find((arg) => !arg.startsWith("--")) ?? "en";
assert(locales.includes(locale), `Choose a supported locale: ${locales.join(", ")}`);

function minutes(time) {
  assert(/^([01]\d|2[0-3]):[0-5]\d$/.test(time), `Invalid local time: ${time}`);
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function localDate(value) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value), `Invalid date format: ${value}`);
  const parsed = new Date(`${value}T00:00:00Z`);
  assert(!Number.isNaN(parsed.valueOf()), `Invalid date: ${value}`);
  assert.equal(parsed.toISOString().slice(0, 10), value, `Invalid date: ${value}`);
  return parsed;
}

function inspect(value, path = "content") {
  if (!value || typeof value !== "object") return;
  if (locales.some((language) => Object.hasOwn(value, language))) {
    for (const language of locales) assert(Object.hasOwn(value, language), `${path}: missing ${language}`);
    const shape = (entry) => typeof entry === "string" ? "string" : Object.keys(entry).sort().join(",");
    assert(locales.every((language) => shape(value[language]) === shape(value.en)), `${path}: translation fields differ`);
  }
  if (Object.hasOwn(value, "amountCents")) {
    assert(Number.isSafeInteger(value.amountCents) && value.amountCents >= 0, `${path}: invalid cents`);
    assert.equal(value.currency, "EUR");
  }
  if (Object.hasOwn(value, "opens")) {
    assert([0, 1].includes(value.closingDayOffset), `${path}: invalid closing day`);
    const duration = minutes(value.closes) + value.closingDayOffset * 1440 - minutes(value.opens);
    assert(duration > 0 && duration <= 1440, `${path}: invalid interval`);
  }
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string") assert(child.trim().length > 0, `${path}.${key}: empty content`);
    if (["date", "weekStart", "referenceDate"].includes(key)) localDate(child);
    inspect(child, `${path}.${key}`);
  }
}

function uniqueIds(records, label) {
  assert.equal(new Set(records.map((record) => record.id)).size, records.length, `${label}: duplicate IDs`);
}

inspect(content);
for (const [label, records] of Object.entries({ weeklyMenus, openingHours, events, souvenirs })) uniqueIds(records, label);
uniqueIds(bar.categories, "drink categories");
uniqueIds(bar.categories.flatMap((category) => category.drinks), "drinks");
assert.equal(new Set(events.map((event) => event.slug)).size, events.length, "Duplicate event slugs");
assert.deepEqual(openingHours.map((area) => area.id).sort(), ["bar", "cafe", "food-service", "meeting-room", "souvenir-shop"]);

for (const area of openingHours) {
  assert.deepEqual(Object.keys(area.regular).sort(), ["1", "2", "3", "4", "5", "6", "7"]);
  assert.equal(new Set(area.exceptions.map((exception) => exception.date)).size, area.exceptions.length);
  for (const intervals of [...Object.values(area.regular), ...area.exceptions.map((exception) => exception.intervals)]) {
    let previousEnd = -1;
    for (const interval of intervals) {
      assert(minutes(interval.opens) >= previousEnd, `${area.id}: overlapping or unordered intervals`);
      previousEnd = minutes(interval.closes) + interval.closingDayOffset * 1440;
    }
  }
}
for (const menu of weeklyMenus) {
  assert.equal(localDate(menu.weekStart).getUTCDay(), 1, "Menu must start on Monday");
  assert.equal(menu.days.length, 5, "Demo menu must contain Monday–Friday");
  uniqueIds(menu.days.flatMap((day) => day.items), menu.id);
  menu.days.forEach((day, index) => {
    const expected = localDate(menu.weekStart);
    expected.setUTCDate(expected.getUTCDate() + index);
    assert.equal(day.date, expected.toISOString().slice(0, 10));
    assert(day.items.length >= 2, `${day.date}: demonstrate multiple options`);
    for (const item of day.items) {
      assert(item.dietaryLabels.every((label) => Object.hasOwn(content.dietaryLabels, label)));
      if (item.servingTime) {
        assert.equal(item.servingTime.closingDayOffset, 0);
        assert(minutes(item.servingTime.opens) >= minutes(day.servingTime.opens));
        assert(minutes(item.servingTime.closes) <= minutes(day.servingTime.closes));
      }
    }
  });
}
for (const event of events) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug));
  for (const timestamp of [event.startsAt, event.endsAt]) {
    assert(/T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(timestamp), "Event timestamp needs an offset");
    assert(Number.isFinite(Date.parse(timestamp)), "Invalid event timestamp");
  }
  assert(Date.parse(event.endsAt) > Date.parse(event.startsAt), "Event must end after it starts");
  if (event.externalBookingUrl) assert.equal(new URL(event.externalBookingUrl).protocol, "https:");
}
assert(openingHours.some((area) => area.id === bar.areaId));
assert(openingHours.some((area) => area.id === meetingRoom.areaId));
assert(Number.isInteger(meetingRoom.seatedCapacity) && meetingRoom.seatedCapacity > 0);

console.log("Content checks passed: three languages, prices, dates, hours, menu structure and event references.");
if (!checkOnly) {
  console.log(`\n${content.demoContext.venueName} — ${locale} — DEMO ONLY`);
  console.log(content.demoContext.notice[locale]);
  console.log(`Reference date: ${content.demoContext.referenceDate}; fixtures do not move with today's date.`);
  const localized = (value) => {
    if (Array.isArray(value)) return value.map(localized);
    if (!value || typeof value !== "object") return value;
    if (locales.every((language) => Object.hasOwn(value, language))) return localized(value[locale]);
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, localized(child)]));
  };
  console.log(JSON.stringify(localized({ openingHours, weeklyMenus, bar, events, souvenirs, meetingRoom }), null, 2));
}
