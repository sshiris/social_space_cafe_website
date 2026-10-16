import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

// Uses a separately started isolated Chrome profile; no browser dependency is installed.
// All booking API calls are intercepted, so no bookings or emails are created.
const base = process.env.BOOKING_BROWSER_BASE ?? "http://127.0.0.1:3107";
if (new URL(base).hostname !== "127.0.0.1") throw new Error("Browser smoke tests must target localhost");
const target = await (await fetch(`http://127.0.0.1:9227/json/new?${encodeURIComponent(base)}`, { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
}
const errors = [];
let bookingRequest;
let bookingPayload;
let conflict = false;
let cancellations = 0;
async function fulfill(requestId, status, body) {
  return send("Fetch.fulfillRequest", { requestId, responseCode: status, responseHeaders: [{ name: "Content-Type", value: "application/json" }], body: Buffer.from(JSON.stringify(body)).toString("base64") });
}
ws.onmessage = async ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const callback = pending.get(message.id); pending.delete(message.id);
    if (message.error) callback?.reject(new Error(message.error.message)); else callback?.resolve(message.result);
  } else if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  else if (message.method === "Fetch.requestPaused") {
    const { requestId, request } = message.params;
    try {
      const path = new URL(request.url).pathname;
      if (path === "/api/bookings/cancel") {
        cancellations++;
        await fulfill(requestId, 200, { success: true, code: cancellations > 1 ? "alreadyCancelled" : "cancelled" });
      } else if (request.method === "POST") {
        bookingRequest = requestId;
        bookingPayload = JSON.parse(request.postData);
      } else {
        await fulfill(requestId, 200, { slots: [{ startTime: "09:00:00", endTime: "10:00:00" }, ...(conflict ? [{ startTime: "10:00:00", endTime: "11:00:00" }] : [])] });
      }
    } catch (error) { errors.push(error.message); }
  }
};
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await new Promise((resolve) => setTimeout(resolve, 50)); }
  throw new Error(`Timed out: ${expression}`);
}
async function navigate(path) {
  await send("Page.navigate", { url: `${base}${path}` });
  await waitFor(`location.pathname === ${JSON.stringify(path.split(/[?#]/)[0])} && document.readyState === 'complete'`);
}
async function fill(selector, value) {
  await evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, ${JSON.stringify(value)}); input.dispatchEvent(new Event('input', {bubbles:true})); input.dispatchEvent(new Event('change', {bubbles:true})); })()`);
}
try {
  await send("Page.enable"); await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/bookings*", requestStage: "Request" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate("/en/booking");
  await waitFor(`!!document.querySelector('input[type=date]') && Object.keys(document.querySelector('input[type=date]')).some(key => key.startsWith('__reactProps'))`);
  await fill('input[type="date"]', "2099-07-15");
  await waitFor(`document.querySelectorAll('.booking-slot').length === 7 && !document.querySelector('.booking-times').disabled`);
  assert.equal(await evaluate(`document.querySelector('.booking-slot').disabled`), true);
  await evaluate(`document.querySelectorAll('.booking-slot')[1].click(); document.querySelectorAll('.booking-slot')[5].click();`);
  await fill('input[name="name"]', "Browser Guest");
  await fill('input[name="email"]', "browser@example.invalid");
  await fill('input[name="numberOfPeople"]', "2");
  await evaluate(`document.querySelector('.booking-extra-row button:last-of-type').click()`);
  await waitFor(`!document.querySelector('button[type=submit]').disabled`);
  await evaluate(`document.querySelector('button[type=submit]').click()`);
  await waitFor(`document.querySelector('button[type=submit]').disabled`);
  assert.equal(await evaluate(`[...document.querySelectorAll('.booking-stepper button')].every(button => button.disabled)`), true);
  assert.deepEqual(bookingPayload.selectedSlots, ["10:00", "14:00"]);
  assert.equal(bookingPayload.selectedPackages[0].quantity, 1);
  conflict = true;
  await fulfill(bookingRequest, 409, { error: "Conflict" });
  await waitFor(`!document.querySelector('.booking-times').disabled && document.querySelectorAll('.booking-slot')[1].disabled`);
  assert.equal(await evaluate(`document.querySelectorAll('[aria-pressed=true]').length`), 1);
  assert.equal(await evaluate(`document.querySelector('input[name=name]').value`), "Browser Guest");
  bookingRequest = null;
  await evaluate(`document.querySelector('button[type=submit]').click()`);
  for (let i = 0; !bookingRequest && i < 100; i++) await new Promise((resolve) => setTimeout(resolve, 20));
  await fulfill(bookingRequest, 201, { success: true, cancellationToken: "a".repeat(64), emailQueued: false });
  await waitFor(`!!document.querySelector('.booking-confirmation')`);
  await waitFor(`document.activeElement.id === 'booking-confirmed-title'`);
  assert.equal(await evaluate(`document.querySelector('.booking-confirmation .text-link').getAttribute('href')`), `/en/booking/cancel#token=${"a".repeat(64)}`);
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
  const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  await writeFile("/tmp/salonki-booking-confirmation-mobile.png", Buffer.from(screenshot.data, "base64"));
  for (const locale of ["en", "fi", "sv"]) {
    await navigate(`/${locale}/booking`);
    await waitFor(`!!document.querySelector('.booking-form')`);
    assert.equal(await evaluate(`document.documentElement.lang`), locale);
    assert.equal(await evaluate(`document.querySelectorAll('main').length`), 1);
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
    await navigate(`/${locale}/booking/cancel${locale === "fi" ? "?" : "#"}token=${"a".repeat(64)}`);
    await waitFor(`!!document.querySelector('.booking-cancel-card button')`);
    assert.equal(await evaluate(`document.querySelectorAll('main').length`), 1);
    await evaluate(`document.querySelector('.booking-cancel-card button').click()`);
    await waitFor(`!!document.querySelector('.booking-cancel-card h2')`);
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true);
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await navigate("/fi/booking");
  await waitFor(`!!document.querySelector('.booking-form')`);
  const desktop = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  await writeFile("/tmp/salonki-booking-form-desktop.png", Buffer.from(desktop.data, "base64"));
  assert.deepEqual(errors, []);
  console.log("Browser smoke passed: multi-slot booking, disabled submission controls, conflict refresh, confirmation focus, fragment/query cancellation, all locales, and mobile overflow. APIs mocked; no data writes or email.");
} finally { await send("Page.close").catch(() => {}); ws.close(); }
