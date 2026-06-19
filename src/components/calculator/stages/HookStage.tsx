"use client";

import { useCalculator } from "../CalculatorContext";
import {
  ContinueButton,
  CurrencyInput,
  OptionButton,
  PercentInput,
  ProgressBar,
  QuestionShell,
  UnknownButton,
} from "../QuestionComponents";

const HOOK_STEPS = 4;

export function HookStage() {
  const {
    hookStep,
    setHookStep,
    inputs,
    updateInput,
    setStage,
    liveResult,
  } = useCalculator();

  const goNext = () => {
    if (hookStep < HOOK_STEPS - 1) {
      setHookStep(hookStep + 1);
    } else {
      setStage("teaser");
    }
  };

  const goBack = () => {
    if (hookStep > 0) setHookStep(hookStep - 1);
  };

  const canContinue = () => {
    switch (hookStep) {
      case 0:
        return inputs.revenue !== null && inputs.revenue > 0;
      case 1:
        return inputs.ebitda !== null;
      case 2:
        return inputs.growth !== null;
      case 3:
        return inputs.trackRecord !== null;
      default:
        return false;
    }
  };

  return (
    <>
      <ProgressBar current={hookStep} total={HOOK_STEPS} label="Quick start" />

      {hookStep === 0 && (
        <QuestionShell
          title="What was your trailing 12-month revenue?"
          subtitle="Count your fees, not your clients' media budgets. Exclude pass-through client media spend."
          onBack={hookStep > 0 ? goBack : undefined}
        >
          <CurrencyInput
            id="revenue"
            value={inputs.revenue}
            onChange={(v) => updateInput("revenue", v)}
          />
          <ContinueButton onClick={goNext} disabled={!canContinue()} />
        </QuestionShell>
      )}

      {hookStep === 1 && (
        <QuestionShell
          title="What was your trailing 12-month EBITDA?"
          subtitle="Earnings before interest, taxes, depreciation, and amortization."
          onBack={goBack}
        >
          <CurrencyInput
            id="ebitda"
            value={inputs.ebitda}
            onChange={(v) => updateInput("ebitda", v)}
          />
          <ContinueButton onClick={goNext} disabled={!canContinue()} />
        </QuestionShell>
      )}

      {hookStep === 2 && (
        <QuestionShell
          title="How much did revenue grow in the last 12 months?"
          subtitle="Compared to the prior 12 months."
          onBack={goBack}
        >
          <PercentInput
            id="growth"
            value={inputs.growth}
            onChange={(v) => updateInput("growth", v)}
          />
          <ContinueButton onClick={goNext} disabled={!canContinue()} />
        </QuestionShell>
      )}

      {hookStep === 3 && (
        <QuestionShell
          title="How long at this level?"
          subtitle="Has your agency performed at roughly this level (growth and profit) for multiple years, or is this a recent step up?"
          onBack={goBack}
        >
          <div className="space-y-3">
            {[
              { value: "first_year" as const, label: "First year at this level" },
              { value: "2years" as const, label: "2 years" },
              { value: "3to4" as const, label: "3-4 years" },
              { value: "5plus" as const, label: "5+ years" },
            ].map((opt) => (
              <OptionButton
                key={opt.value}
                selected={inputs.trackRecord === opt.value}
                onClick={() => updateInput("trackRecord", opt.value)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
          <UnknownButton onClick={() => updateInput("trackRecord", "unknown")} />
          <ContinueButton onClick={goNext} disabled={!canContinue()} label="See my teaser" />
        </QuestionShell>
      )}
    </>
  );
}

export function TeaserStage() {
  const { liveResult, setStage } = useCalculator();

  return (
    <QuestionShell title="Your starting point">
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
        <p className="text-sm text-slate-body">{liveResult.durabilityMessage}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Matrix base
            </p>
            <p className="font-display text-2xl italic text-gold">
              {liveResult.matrixMultiple.toFixed(1)}x
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Your band today
            </p>
            <p className="font-display text-2xl italic text-navy">
              {liveResult.band.label}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-6 text-sm text-slate-body">
        Eleven factors move it from here. About 90 seconds to see your full picture.
      </p>
      <ContinueButton
        onClick={() => setStage("diagnostic")}
        label="Continue diagnostic →"
      />
    </QuestionShell>
  );
}
