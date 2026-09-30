"use client";

import { useEffect, useRef } from "react";

/** Original dry-brush pigment: clipped away from copy, without capturing input. */
export function InkTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    const context = node?.getContext("2d");
    if (!node || !context) return;
    const allowed = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let marks: { x: number; y: number; born: number; angle: number }[] = [];
    let surfaces: DOMRect[] = [];
    let protectedAreas: DOMRect[] = [];
    const clear = () => {
      cancelAnimationFrame(frame); frame = 0; marks = []; surfaces = [];
      context.clearRect(0, 0, innerWidth, innerHeight);
    };
    const resize = () => {
      clear();
      const scale = Math.min(devicePixelRatio, 1.5);
      node.width = innerWidth * scale; node.height = innerHeight * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };
    const paint = (now: number) => {
      context.clearRect(0, 0, innerWidth, innerHeight);
      marks = marks.filter(mark => now - mark.born < 950);
      context.save();
      context.beginPath();
      for (const rect of surfaces) context.rect(rect.x, rect.y, rect.width, rect.height);
      context.clip();
      for (const mark of marks) {
        context.fillStyle = `rgba(195, 143, 75, ${0.19 * (1 - (now - mark.born) / 950)})`;
        for (let bristle = 0; bristle < 9; bristle++) {
          context.beginPath();
          context.ellipse(mark.x + (bristle - 4) * 4, mark.y + (bristle - 4) * 5, 42 + bristle % 3 * 7, 1.8 + bristle % 2, mark.angle, 0, Math.PI * 2);
          context.fill();
        }
      }
      // Erase a generous margin around text and controls, including earlier marks.
      for (const rect of protectedAreas) context.clearRect(rect.x - 8, rect.y - 8, rect.width + 16, rect.height + 16);
      context.restore();
      frame = marks.length ? requestAnimationFrame(paint) : 0;
    };
    const move = (event: PointerEvent) => {
      if (!allowed.matches || event.pointerType !== "mouse" || !(event.target instanceof Element) || !event.target.closest("[data-ink-surface]") || event.target.closest("a, button, input, h1, h2, p, dl, figcaption")) return;
      if (!surfaces.length) {
        surfaces = Array.from(document.querySelectorAll("[data-ink-surface]"), element => element.getBoundingClientRect());
        protectedAreas = Array.from(document.querySelectorAll("[data-ink-surface] :is(h1,h2,p,dl,a,button,figcaption)"), element => element.getBoundingClientRect());
      }
      const last = marks.at(-1);
      if (last && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 10) return;
      marks.push({ x: event.clientX, y: event.clientY, born: performance.now(), angle: last ? Math.atan2(event.clientY - last.y, event.clientX - last.x) * 0.3 - 0.4 : -0.4 });
      marks = marks.slice(-20);
      if (!frame) frame = requestAnimationFrame(paint);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", clear, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    allowed.addEventListener("change", clear);
    return () => { clear(); window.removeEventListener("resize", resize); window.removeEventListener("scroll", clear); window.removeEventListener("pointermove", move); allowed.removeEventListener("change", clear); };
  }, []);
  return <canvas ref={canvas} className="ink-trail" aria-hidden="true" />;
}
