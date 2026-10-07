"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { cn } from "@/lib/utils/cn";

export interface HomeQuestion {
  id: string;
  question: string;
  answer: ReactNode;
}

export function HomeQuestions({ questions }: { questions: HomeQuestion[] }) {
  const [active, setActive] = useState(questions[0]?.id ?? "");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (questions.length === 0) return null;
  const current = questions.find((q) => q.id === active) ?? questions[0];

  return (
    <section aria-labelledby="questions-title" data-section="questions" className="bg-surface pb-30 pt-18">
      <div className="mx-auto grid max-w-wide grid-cols-12 gap-x-7 gap-y-10 px-gutter">
        <div className="col-span-12 lg:col-span-4">
          <h2 id="questions-title" className="m-0 font-display text-step-4 font-medium leading-[1.12] tracking-[-0.005em] text-ink">
            Questions
          </h2>
          <div role="tablist" aria-label="Questions" aria-orientation="vertical" className="mt-8 hidden flex-col lg:flex">
            {questions.map((q, index) => {
              const on = q.id === current.id;
              return (
                <button
                  key={q.id}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`hq-tab-${q.id}`}
                  aria-selected={on}
                  aria-controls={`hq-panel-${q.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(q.id)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    e.preventDefault();
                    const next = (index + (e.key === "ArrowDown" ? 1 : questions.length - 1)) % questions.length;
                    setActive(questions[next].id);
                    refs.current[next]?.focus();
                  }}
                  className={cn(
                    "relative cursor-pointer border-b border-line py-4 pr-8 text-left text-step-1 leading-[1.3] transition-colors duration-[120ms] first:border-t",
                    on ? "font-medium text-ink" : "text-ink-muted hover-device:hover:text-ink",
                  )}
                >
                  {on ? <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" /> : null}
                  {q.question}
                </button>
              );
            })}
          </div>
          <Link
            href="/faq"
            className="mt-8 inline-flex h-[46px] items-center rounded-control border border-control px-5 font-sans text-ui-md font-semibold uppercase tracking-[0.06em] text-ink transition-colors duration-[120ms] hover-device:hover:border-ink hover-device:hover:bg-surface-1"
          >
            All questions
          </Link>
        </div>

        <div className="col-span-12 hidden min-w-0 lg:col-span-8 lg:block">
          {questions.map((q) => (
            <div
              key={q.id}
              role="tabpanel"
              id={`hq-panel-${q.id}`}
              aria-labelledby={`hq-tab-${q.id}`}
              hidden={q.id !== current.id}
              tabIndex={0}
              className="animate-fade-in"
            >
              <h3 className="m-0 font-display text-step-2 font-medium leading-[1.2] text-ink">{q.question}</h3>
              <div className="measure mt-5 text-step-0 leading-[1.65] text-ink-muted [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4">{q.answer}</div>
            </div>
          ))}
        </div>

        <Accordion className="col-span-12 lg:hidden">
          {questions.map((q) => (
            <AccordionItem key={q.id} title={q.question} headingLevel={3} flush>
              <div className="measure text-step-0 leading-[1.65] text-ink-muted [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4">{q.answer}</div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
