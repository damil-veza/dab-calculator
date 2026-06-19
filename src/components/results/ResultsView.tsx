"use client";

import Link from "next/link";
import { valuationConfig } from "@/config/valuation.config";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/utils";
import type { CalculatorInputs, ValuationResult } from "@/lib/valuation/types";
import { Button } from "@/components/ui/Button";

interface ResultsViewProps {
  result: ValuationResult;
  inputs: CalculatorInputs;
  token?: string;
}

export function ResultsView({ result, inputs, token }: ResultsViewProps) {
  const { flags } = result;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-wider text-gold">Your Lang Multiple</p>
        <h1 className="mt-2 font-display text-4xl italic text-navy sm:text-5xl">
          {formatMultiple(result.finalMultiple)}
        </h1>
        <p className="mt-2 text-lg text-slate-body">{result.band.label}</p>
        <p className="mt-1 text-sm text-slate-500">{result.band.description}</p>
      </div>

      {flags.negativeEbitda ? (
        <NegativeEbitdaBlock />
      ) : flags.suppressDollarValue ? (
        <HighEbitdaBlock result={result} />
      ) : (
        <ValueSection result={result} />
      )}

      {flags.subScaleRevenue && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Sub-scale agencies often trade on seller&apos;s discretionary earnings and owner
          transition terms. Treat this range as directional.
        </div>
      )}

      {flags.implausibleInputs && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Some inputs look unusual. Double-check your numbers for accuracy.
        </div>
      )}

      <MatrixGrid result={result} inputs={inputs} />
      <HeatmapGrid dimensions={result.heatmap} />
      <WaterfallChart result={result} />
      <RecommendationsList recommendations={result.recommendations} />
      <CTABlock leadScore={result.leadScore} />

      {token && (
        <div className="mt-10 text-center">
          <Link href="/calculator">
            <Button variant="secondary">Retake assessment</Button>
          </Link>
        </div>
      )}

      <p className="mt-10 text-xs leading-relaxed text-slate-400">
        {result.durabilityMessage}
      </p>
    </div>
  );
}

function ValueSection({ result }: { result: ValuationResult }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Current enterprise value
        </p>
        {result.currentValueRange ? (
          <p className="mt-2 font-display text-3xl italic text-navy">
            {formatCurrency(result.currentValueRange.low, true)} –{" "}
            {formatCurrency(result.currentValueRange.high, true)}
          </p>
        ) : (
          <p className="mt-2 text-2xl text-navy">—</p>
        )}
        <p className="mt-1 text-sm text-slate-500">
          Midpoint: {result.currentEnterpriseValue ? formatCurrency(result.currentEnterpriseValue) : "—"}
        </p>
      </div>

      <div className="rounded-xl border border-gold/40 bg-gold/5 p-6">
        <p className="text-xs uppercase tracking-wide text-gold-dark">
          Potential enterprise value
        </p>
        <p className="mt-2 font-display text-3xl italic text-gold">
          {result.potentialEnterpriseValue
            ? formatCurrency(result.potentialEnterpriseValue, true)
            : "—"}
        </p>
        <p className="mt-1 text-sm text-slate-body">
          At {formatMultiple(result.potentialMultiple)} with risks fixed
        </p>
      </div>

      {result.gap !== null && result.gap > 0 && (
        <div className="sm:col-span-2 rounded-xl bg-navy p-6 text-center text-white">
          <p className="text-sm uppercase tracking-wider text-gold-light">
            Your multiple expansion gap
          </p>
          <p className="mt-2 font-display text-4xl italic text-gold">
            {formatCurrency(result.gap, true)}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            The same profit, with these risks fixed and this performance sustained, is
            worth {formatCurrency(result.gap, true)} more.
          </p>
        </div>
      )}
    </div>
  );
}

function NegativeEbitdaBlock() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="font-display text-2xl italic text-navy">
        Profitability comes first
      </h2>
      <p className="mt-3 text-slate-body">
        Valuation math starts at profit. Before multiples matter, get to a durable 15
        to 20 percent margin.
      </p>
      <div className="mt-6">
        <Button>Book a valuation review</Button>
      </div>
    </div>
  );
}

function HighEbitdaBlock({ result }: { result: ValuationResult }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
      <h2 className="font-display text-2xl italic text-navy">
        {result.band.label} · {formatMultiple(result.finalMultiple)}
      </h2>
      <p className="mt-3 text-slate-body">
        At your scale, self-serve numbers do more harm than good. Talk to the deal team
        for a proper conversation.
      </p>
      <div className="mt-6">
        <Button>Talk to the deal team</Button>
      </div>
    </div>
  );
}

function MatrixGrid({
  result,
  inputs,
}: {
  result: ValuationResult;
  inputs: CalculatorInputs;
}) {
  const cfg = valuationConfig.matrix;
  const margin = result.ebitdaMargin ?? 0;
  const growth = inputs.growth ?? 0;

  const marginIdx = cfg.marginBreakpoints.findIndex(
    (b, i) =>
      margin >= b &&
      (i === cfg.marginBreakpoints.length - 1 ||
        margin < cfg.marginBreakpoints[i + 1])
  );
  const growthIdx = cfg.growthBreakpoints.findIndex(
    (b, i) =>
      growth >= b &&
      (i === cfg.growthBreakpoints.length - 1 ||
        growth < cfg.growthBreakpoints[i + 1])
  );

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl italic text-navy">Margin × Growth matrix</h2>
      <p className="mt-2 text-sm text-slate-body">
        Your position: {result.ebitdaMargin !== null ? formatPercent(result.ebitdaMargin) : "—"}{" "}
        margin, {inputs.growth !== null ? formatPercent(inputs.growth) : "—"} growth →{" "}
        {formatMultiple(result.matrixMultiple)} base
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-500">Margin \ Growth</th>
              {cfg.growthBreakpoints.map((g) => (
                <th key={g} className="p-2 text-slate-500">
                  {(g * 100).toFixed(0)}%
                </th>
              ))}
              <th className="p-2 text-slate-500">50%+</th>
            </tr>
          </thead>
          <tbody>
            {cfg.values.map((row, ri) => (
              <tr key={ri}>
                <td className="p-2 text-left font-medium text-slate-600">
                  {(cfg.marginBreakpoints[ri] * 100).toFixed(0)}%
                  {ri === cfg.marginBreakpoints.length - 1 ? "+" : ""}
                </td>
                {row.map((val, ci) => {
                  const isHighlighted = ri === Math.max(marginIdx, 0) && ci === Math.max(growthIdx, 0);
                  return (
                    <td
                      key={ci}
                      className={`p-2 rounded ${
                        isHighlighted
                          ? "bg-gold text-white font-bold ring-2 ring-gold-dark"
                          : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {val.toFixed(1)}x
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeatmapGrid({
  dimensions,
}: {
  dimensions: ValuationResult["heatmap"];
}) {
  const colors = {
    green: "bg-emerald-100 border-emerald-300 text-emerald-800",
    amber: "bg-amber-100 border-amber-300 text-amber-800",
    red: "bg-red-100 border-red-300 text-red-800",
  };

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl italic text-navy">Health heatmap</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dimensions.map((d) => (
          <div
            key={d.name}
            className={`rounded-lg border p-4 ${colors[d.status]}`}
          >
            <p className="font-semibold">{d.name}</p>
            <p className="mt-1 text-xs opacity-80">{d.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WaterfallChart({ result }: { result: ValuationResult }) {
  const items = [
    { label: "Effective base", value: result.effectiveBase },
    ...result.adjustments.filter((a) => a.value !== 0),
    { label: "Final multiple", value: result.finalMultiple },
  ];

  const maxVal = valuationConfig.clamps.multipleMax;

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl italic text-navy">Multiple waterfall</h2>
      <div className="mt-6 space-y-3">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`} className="flex items-center gap-4">
            <span className="w-36 shrink-0 text-sm text-slate-600">{item.label}</span>
            <div className="flex-1">
              <div
                className={`h-8 rounded ${
                  i === 0
                    ? "bg-navy"
                    : i === items.length - 1
                      ? "bg-gold"
                      : item.value >= 0
                        ? "bg-emerald-400"
                        : "bg-red-400"
                }`}
                style={{ width: `${Math.max((Math.abs(item.value) / maxVal) * 100, 8)}%` }}
              />
            </div>
            <span className="w-16 text-right text-sm font-medium text-navy">
              {typeof item.value === "number" && item.label !== "Final multiple"
                ? `${item.value >= 0 ? "+" : ""}${item.value.toFixed(2)}x`
                : `${item.value.toFixed(2)}x`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecommendationsList({
  recommendations,
}: {
  recommendations: ValuationResult["recommendations"];
}) {
  if (recommendations.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl italic text-navy">Top three moves</h2>
      <div className="mt-6 space-y-4">
        {recommendations.map((rec, i) => (
          <div
            key={rec.id}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-gold">
              Move {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-navy">{rec.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-body">{rec.body}</p>
            <p className="mt-3 text-xs text-slate-500">{rec.resource}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABlock({ leadScore }: { leadScore: ValuationResult["leadScore"] }) {
  return (
    <section className="mt-14 rounded-xl bg-navy p-8 text-center text-white">
      {leadScore === "hot" ? (
        <>
          <h2 className="font-display text-2xl italic text-gold">
            Ready for a deeper conversation?
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Based on your timeline and profile, a valuation review could be valuable.
          </p>
          <div className="mt-6">
            <Button className="bg-gold text-white hover:bg-gold-dark">
              Book a valuation review
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-display text-2xl italic text-gold">
            Join the Agency M&amp;A Community
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            $99/month. Learn the systems that close the gap between current and potential
            value.
          </p>
          <div className="mt-6">
            <Button className="bg-gold text-white hover:bg-gold-dark">
              Explore the community
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
