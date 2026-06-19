"use client";

import { useCalculator } from "./CalculatorContext";
import { LiveTicker } from "./LiveTicker";
import { HookStage, TeaserStage } from "./stages/HookStage";
import { DiagnosticStage, GateStage } from "./stages/DiagnosticStage";

export function CalculatorFlow() {
  const { stage, liveResult } = useCalculator();

  const showTicker = stage === "diagnostic";

  return (
    <div className="min-h-[70vh]">
      <LiveTicker multiple={liveResult.finalMultiple} show={showTicker} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {stage === "hook" && <HookStage />}
        {stage === "teaser" && <TeaserStage />}
        {stage === "diagnostic" && <DiagnosticStage />}
        {stage === "gate" && <GateStage />}
      </div>
    </div>
  );
}
