import { Media } from "@/components/Media";
import { Reveal, SectionHeading } from "@/components/ui";
import { CRAFT_STEPS } from "@/data/catalog";
import { useParallax } from "@/lib/hooks";

export function Craft() {
  const art = useParallax<HTMLDivElement>(0.08);

  return (
    <section id="craft" className="grain relative overflow-hidden bg-ink text-bone">
      {/* Faint drawn field so the dark panel is not a flat block. */}
      <div aria-hidden="true" className="absolute inset-0 opacity-25">
        <Media seed="craft-field" tint="#4a4238" ratio="fill" className="h-full" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

      <div className="relative mx-auto max-w-[100rem] px-6 py-28 md:px-10 md:py-40">
        <SectionHeading
          tone="light"
          eyebrow="How it is made"
          title={
            <>
              Three rules we
              <br />
              <span className="italic text-clay">have not broken.</span>
            </>
          }
          aside="No certification schemes, no offset purchases. Just decisions we can explain in a sentence each."
        />

        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="lg:col-span-7">
            {CRAFT_STEPS.map((step, index) => (
              <Reveal
                key={step.index}
                as="li"
                index={index}
                className="grid grid-cols-[3rem_1fr] gap-6 border-t hairline-inverse py-10 first:border-t-0 first:pt-0 md:grid-cols-[4.5rem_1fr] md:gap-10"
              >
                <span className="label pt-1 text-clay">{step.index}</span>
                <div>
                  <h3 className="display text-3xl text-bone md:text-4xl">{step.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-bone/60">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="lg:col-span-4 lg:col-start-9">
            <div ref={art} className="will-change-transform">
              <Reveal mode="mask">
                <Media seed="craft-detail" tint="#8d7a5f" ratio="tall" />
                <p className="label mt-4 text-bone/55">
                  Fayoum, March — flax on the loom, third pass
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Craft;
