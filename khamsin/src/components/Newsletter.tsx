import { useState, type FormEvent } from "react";

import { Eyebrow, Reveal } from "@/components/ui";
import { cx } from "@/lib/format";

type Status = "idle" | "error" | "done";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }
    // No backend in this build — the interaction is the deliverable.
    setStatus("done");
  }

  return (
    <section className="border-y hairline bg-sand/70">
      <div className="mx-auto grid max-w-[100rem] gap-12 px-6 py-24 md:grid-cols-12 md:px-10 md:py-28">
        <div className="md:col-span-5">
          <Reveal mode="fade">
            <Eyebrow>Restocks and drops</Eyebrow>
          </Reveal>
          <Reveal index={1} className="overflow-hidden">
            <h2 className="display mt-6 text-[clamp(2.25rem,5vw,3.75rem)]">
              Three hundred pieces
              <br />
              go fast. <span className="italic text-clay">Get warned.</span>
            </h2>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:self-end">
          <Reveal index={2}>
            {status === "done" ? (
              <div className="border-t hairline pt-8">
                <p className="display text-3xl text-ink">You are on the list.</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-smoke">
                  One email per drop, one when something you looked at comes back. Nothing else, and
                  unsubscribing takes a single click.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="border-t hairline pt-8">
                <label htmlFor="newsletter-email" className="label text-smoke">
                  Email address
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className={cx(
                      "h-14 flex-1 border-b bg-transparent px-1 text-lg text-ink outline-none transition-colors placeholder:text-ash/70",
                      status === "error" ? "border-clay" : "border-ink/25 focus:border-ink",
                    )}
                  />
                  <button
                    type="submit"
                    className="label h-14 shrink-0 bg-ink px-8 text-bone transition-colors duration-300 hover:bg-clay"
                  >
                    Join the list
                  </button>
                </div>

                <p
                  id="newsletter-error"
                  role={status === "error" ? "alert" : undefined}
                  className={cx(
                    "mt-3 text-xs transition-opacity",
                    status === "error" ? "text-clay opacity-100" : "text-ash opacity-100",
                  )}
                >
                  {status === "error"
                    ? "That does not look like an email address — check it and try again."
                    : "One email per drop. No promotions, no sharing your address."}
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
