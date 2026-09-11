import { Media } from "@/components/Media";
import { Reveal, SectionHeading } from "@/components/ui";
import { LOOKBOOK } from "@/data/catalog";
import { cx } from "@/lib/format";
import { useHorizontalRail } from "@/lib/hooks";

export function Lookbook() {
  const { ref, progress, atStart, atEnd, scrollByCards } = useHorizontalRail<HTMLDivElement>();

  return (
    <section id="lookbook" className="py-24 md:py-32">
      <div className="mx-auto max-w-[100rem] px-6 md:px-10">
        <SectionHeading
          eyebrow="Lookbook — SS26"
          title={
            <>
              Six days,
              <br />
              <span className="italic">one wind.</span>
            </>
          }
          aside="Shot across a week in March, between Cairo and the Fayoum, on the days the khamsin was actually blowing."
        />
      </div>

      <Reveal mode="fade" className="mt-14">
        <div
          ref={ref}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto scroll-smooth px-6 pb-2 md:scroll-px-10 md:px-10"
          tabIndex={0}
          role="region"
          aria-label="Lookbook, scroll horizontally"
        >
          {LOOKBOOK.map((look, index) => (
            <figure
              key={look.id}
              data-rail-item=""
              className="w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[28vw]"
            >
              <div className="overflow-hidden">
                <Media
                  seed={look.id}
                  tint={look.tint}
                  silhouette={look.silhouette}
                  ratio="tall"
                  variant={index}
                  className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-sm text-ink">{look.title}</p>
                  <p className="label mt-1.5 text-ash">{look.caption}</p>
                </div>
                <span className="label text-ash tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          ))}
          <div aria-hidden="true" className="w-2 shrink-0" />
        </div>
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-[100rem] items-center gap-6 px-6 md:px-10">
        <div className="h-px flex-1 bg-ink/10">
          <div
            className="h-px origin-left bg-ink transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
          />
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scrollByCards(direction)}
              disabled={direction === -1 ? atStart : atEnd}
              aria-label={direction === -1 ? "Previous looks" : "Next looks"}
              className={cx(
                "grid h-11 w-11 place-items-center border transition-colors duration-300",
                "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-bone",
                "disabled:pointer-events-none disabled:opacity-25",
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d={direction === -1 ? "M10 2.5 4.5 8l5.5 5.5" : "M6 2.5 11.5 8 6 13.5"}
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="square"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Lookbook;
