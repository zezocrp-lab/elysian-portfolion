import { Media } from "@/components/Media";
import { Eyebrow, Reveal } from "@/components/ui";
import { STATS } from "@/data/catalog";
import { useParallax } from "@/lib/hooks";

const PARAGRAPHS = [
  "We started KHAMSIN because the clothes we wanted did not exist at a price a working person could justify. Not fast, not luxury — just well-made, in fabrics that behave properly in forty degrees.",
  "Every season is small on purpose. Three hundred pieces of a style, then it is gone until we can make it better. That constraint decides everything downstream: which mills answer our calls, how carefully a pattern gets revised, whether a seam is worth the extra minute.",
  "What we will not do: bleach linen that has its own colour, blend fibres we cannot name, or burn stock to protect a price. Anything unsold is repaired, re-dyed and returned to the shelf.",
];

export function Manifesto() {
  const strip = useParallax<HTMLDivElement>(0.07);

  return (
    <section className="mx-auto max-w-[100rem] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal mode="fade">
              <Eyebrow>Our position</Eyebrow>
            </Reveal>
            <Reveal index={1} className="overflow-hidden">
              <p className="display mt-7 text-[clamp(2.25rem,5vw,4rem)]">
                Clothes that get
                <br />
                <span className="italic text-clay">better</span> at being
                <br />
                worn, not newer.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="space-y-8">
            {PARAGRAPHS.map((paragraph, index) => (
              <Reveal key={index} index={index} as="p" className="text-lg leading-relaxed text-smoke">
                {paragraph}
              </Reveal>
            ))}
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-8 border-t hairline pt-10 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} index={index}>
                <dt className="display text-5xl text-ink">{stat.value}</dt>
                <dd className="label mt-3 max-w-[14ch] text-smoke">{stat.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <Reveal mode="mask" className="mt-24 overflow-hidden md:mt-32">
        <div className="overflow-hidden">
          <div ref={strip} className="will-change-transform">
            <Media seed="manifesto-strip" tint="#b6a68c" ratio="wide" className="scale-110" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default Manifesto;
