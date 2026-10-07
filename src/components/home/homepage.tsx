import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext } from "@/content/demo";
import { samplePhotography, type PhotoRole } from "@/content/demo/photography";
import { publicRoutes } from "@/i18n/routing";

const tilePhotos: Partial<Record<string, PhotoRole>> = {
  menu: "cafe",
  events: "world",
  booking: "meetings",
  market: "souvenirs",
};

export function Homepage({ locale }: { locale: Locale }) {
  const text = messages[locale];
  const hero = samplePhotography.hero;
  return (
    <div className="compact-home">
      <section
        id="home"
        tabIndex={-1}
        className="photo-hero"
        aria-labelledby="home-title"
      >
        <Image
          className="hero-photograph"
          src={hero.src}
          alt={`${text.art.samplePhoto}: ${hero.alt[locale]}`}
          fill
          sizes="100vw"
          preload
        />
        <div className="hero-signature">
          <h1 id="home-title">
            <span className="sr-only">{demoContext.venueName}</span>
            <Image
              src="/images/logo.png"
              alt=""
              width={3710}
              height={3710}
              sizes="(max-width: 600px) 200px, 280px"
              className="hero-logo"
            />
          </h1>
          <p>{text.eyebrow}</p>
        </div>
        <p className="hero-photo-credit">
          {text.art.samplePhoto} ·{" "}
          <a href={hero.sourceUrl}>
            {hero.creator} / {hero.source}
          </a>
        </p>
      </section>
      <nav
        id="food-coffee"
        tabIndex={-1}
        className="destination-grid"
        aria-label={text.destinations.explore}
      >
        {publicRoutes
          .filter((route) => route.placement === "primary")
          .map((route) => {
            const role = tilePhotos[route.key];
            const photo = role ? samplePhotography[role] : undefined;
            return (
              <Link
                key={route.key}
                className={`destination-tile tile-${route.key} ${photo ? "has-photo" : "type-tile"}`}
                href={`/${locale}${route.path}`}
              >
                {photo && (
                  <Image
                    src={photo.src}
                    alt={`${text.art.samplePhoto}: ${photo.alt[locale]}`}
                    fill
                    sizes="(max-width: 479px) 92vw, (max-width: 800px) 46vw, 31vw"
                  />
                )}
                <span className="tile-title">{text.nav[route.key]}</span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}
