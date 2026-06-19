import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="font-display text-4xl font-light leading-tight text-navy sm:text-5xl lg:text-[3.25rem]">
            Most agency owners are off by{" "}
            <span className="italic text-gold">7 figures</span> about what their
            agency is worth.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-body sm:text-lg">
            The #1 source for owners who want to use M&A as a continuous capability
            rather than a one-time event, enabling you to persistently pursue
            profitable growth, exit, or build a portfolio of companies.
          </p>
          <p className="mt-4 text-sm text-slate-body">
            <strong className="font-semibold text-navy">Mission:</strong> Making
            Buyers Better Buyers &amp; Sellers Better Sellers
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/calculator">
              <Button arrow>Find Your Valuation</Button>
            </Link>
            <Link href="/calculator">
              <Button variant="secondary">Prepare for a Sale</Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Free. Under 3 minutes. No contact info required to start.
          </p>
        </div>

        <div className="relative">
          <div className="aspect-video overflow-hidden rounded-lg bg-navy shadow-xl">
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-navy to-slate-800 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-gold" />
              </div>
              <p className="font-display text-2xl italic text-white">
                The Lang Method
              </p>
              <p className="mt-2 max-w-sm text-sm text-slate-300">
                See your current enterprise value, your potential value, and the gap
                between them. Built on the same framework used by the DAB deal team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-8 sm:grid-cols-3">
        {[
          {
            title: "Two numbers, not one",
            body: "Current value and potential value. The gap shows your multiple expansion opportunity.",
          },
          {
            title: "Eleven factors explained",
            body: "Watch your multiple move in real time. See exactly what is helping and hurting your value.",
          },
          {
            title: "A path forward",
            body: "Personalized recommendations mapped to DAB resources. Turn insight into action.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-slate-100 bg-slate-50/50 p-6"
          >
            <h3 className="font-display text-xl italic text-gold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-body">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
