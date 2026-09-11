import { Fragment } from "react";

const ITEMS = [
  "Runs of 300",
  "Undyed fibres",
  "Cut and sewn in Cairo",
  "Free repairs for three years",
  "Nothing destroyed, ever",
  "Free shipping over $250",
];

/**
 * Infinite ticker. The list is rendered twice and translated by exactly -50%,
 * which is why the loop has no seam. Hovering slows it rather than stopping
 * it dead, and reduced motion parks it (see index.css).
 */
export function Marquee() {
  return (
    <div className="group border-y hairline bg-sand/60 py-5">
      <div className="flex overflow-hidden" role="presentation">
        <div className="anim-marquee flex shrink-0 items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <Fragment key={copy}>
              {ITEMS.map((item) => (
                <span key={`${copy}-${item}`} className="label flex items-center text-ink/70">
                  <span className="px-8">{item}</span>
                  <span aria-hidden="true" className="text-clay">
                    ✳
                  </span>
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
