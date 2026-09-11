import { useEffect, useRef } from "react";

import { Media } from "@/components/Media";
import { Button } from "@/components/ui";
import { usePrefersReducedMotion, useParallax } from "@/lib/hooks";

const META = [
  { label: "Made in", value: "Cairo" },
  { label: "Runs of", value: "300 max" },
  { label: "Repairs", value: "3 years free" },
];

/** A word that rises out of its own line box on load. */
function Word({ children, delay, italic }: { children: string; delay: number; italic?: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <span
        className={italic ? "anim-rise inline-block italic text-clay" : "anim-rise inline-block"}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const frame = useParallax<HTMLDivElement>(0.06);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Pointer parallax, desktop only, kept deliberately small.
  useEffect(() => {
    const node = inner.current;
    if (!node || reduced || !window.matchMedia("(pointer: fine)").matches) return;

    let frameId = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 18;
      targetY = (event.clientY / window.innerHeight - 0.5) * 12;
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        node.style.transform = `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0)`;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      node.style.transform = "";
    };
  }, [reduced]);

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-bone">
      {/* Ambient field — texture, not photography. */}
      <div className="absolute inset-0 opacity-70">
        <Media seed="hero-field" tint="#3b342a" ratio="fill" className="anim-drift h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/80 to-ink/30" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[100rem] flex-col justify-between px-6 pb-8 pt-28 md:px-10 md:pt-32">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p
              className="anim-fade-up label flex items-center gap-3 text-bone/65"
              style={{ animationDelay: "120ms" }}
            >
              <span aria-hidden="true" className="h-px w-10 shrink-0 bg-bone/40" />
              <span className="sm:hidden">SS26 — Collection 004</span>
              <span className="hidden sm:inline">Spring / Summer 26 — Collection 004</span>
            </p>

            <h1 className="display mt-7 text-[clamp(2.75rem,7.6vw,6.75rem)]">
              <span className="block">
                <Word delay={220}>Dressed</Word> <Word delay={300}>for</Word>
              </span>
              <span className="block">
                <Word delay={380}>the</Word> <Word delay={440} italic>
                  dry
                </Word>{" "}
                <Word delay={520}>season</Word>
              </span>
            </h1>

            <p
              className="anim-fade-up mt-7 max-w-md text-base md:text-lg leading-relaxed text-bone/70"
              style={{ animationDelay: "660ms" }}
            >
              Linen, canvas and undyed cotton, cut for heat and wind. Made in runs of three hundred,
              repaired free for three years, and never sent to landfill.
            </p>

            <div
              className="anim-fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-1"
              style={{ animationDelay: "760ms" }}
            >
              <Button
                variant="light"
                size="lg"
                onClick={() =>
                  document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Shop the collection
              </Button>
              <a
                href="#craft"
                className="link-underline label px-1 py-4 text-bone/70 transition-colors hover:text-bone"
              >
                Read the craft notes
              </a>
            </div>
          </div>

          {/* Floating frame — scroll parallax outside, pointer parallax inside. */}
          <div className="lg:col-span-5">
            <div ref={frame} className="will-change-transform">
              <div ref={inner} className="transition-transform duration-500 ease-out">
                <figure
                  className="anim-fade-up relative mx-auto w-full max-w-[19rem] lg:ml-auto lg:mr-0"
                  style={{ animationDelay: "560ms" }}
                >
                  <Media seed="hero-frame" tint="#d8cdb8" silhouette="overshirt" ratio="tall" />
                  <figcaption className="label mt-4 flex items-baseline justify-between text-bone/60">
                    <span>Field Overshirt / Undyed</span>
                    <span>01</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>

        <dl
          className="anim-fade-up mt-10 grid grid-cols-1 gap-x-10 overflow-hidden border-t hairline-inverse sm:grid-cols-3"
          style={{ animationDelay: "880ms" }}
        >
          {META.map((item) => (
            <div key={item.label} className="flex items-baseline gap-3 py-4">
              <dt className="label text-bone/55">{item.label}</dt>
              <dd className="text-sm text-bone/85">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Hero;
