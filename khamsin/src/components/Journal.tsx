import { Media } from "@/components/Media";
import { Reveal, SectionHeading } from "@/components/ui";
import { JOURNAL } from "@/data/catalog";

export function Journal() {
  return (
    <section id="journal" className="mx-auto max-w-[100rem] px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="Journal"
        title={
          <>
            Notes from
            <br />
            <span className="italic">the workshop.</span>
          </>
        }
        aside="Occasional writing about fabric, weather and the people who make what we sell."
      />

      <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNAL.map((entry, index) => (
          <Reveal key={entry.id} as="article" index={index} className="group">
            <a href="#journal" className="block">
              <div className="overflow-hidden">
                <Media
                  seed={entry.id}
                  tint={entry.tint}
                  ratio="wide"
                  variant={index + 2}
                  className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
              </div>

              <p className="label mt-5 flex items-center gap-3 text-ash">
                <span>{entry.date}</span>
                <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
                <span>{entry.kind}</span>
              </p>

              <h3 className="display mt-3 text-2xl leading-tight text-ink md:text-[1.75rem]">
                <span className="link-underline">{entry.title}</span>
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-smoke">{entry.excerpt}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Journal;
