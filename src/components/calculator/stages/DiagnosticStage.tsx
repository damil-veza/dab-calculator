"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCalculator } from "../CalculatorContext";
import {
  ContinueButton,
  NumberInput,
  OptionButton,
  PercentInput,
  ProgressBar,
  QuestionShell,
  UnknownButton,
} from "../QuestionComponents";

const DIAGNOSTIC_QUESTIONS = 9;

export function DiagnosticStage() {
  const {
    diagnosticStep,
    setDiagnosticStep,
    inputs,
    updateInput,
    setStage,
    liveResult,
  } = useCalculator();

  const goNext = () => {
    if (diagnosticStep < DIAGNOSTIC_QUESTIONS - 1) {
      setDiagnosticStep(diagnosticStep + 1);
    } else {
      setStage("gate");
    }
  };

  const goBack = () => {
    if (diagnosticStep > 0) {
      setDiagnosticStep(diagnosticStep - 1);
    } else {
      setStage("teaser");
    }
  };

  const hasAnswer = (step: number): boolean => {
    switch (step) {
      case 0: return inputs.top2Share !== null;
      case 1: return inputs.recurringShare !== null;
      case 2: return inputs.clientTenure !== null;
      case 3: return inputs.newBusiness !== null;
      case 4: return inputs.founderInDelivery !== null;
      case 5: return inputs.employeeTenure !== null;
      case 6: return inputs.contractRunway !== null;
      case 7: return inputs.culture !== null;
      case 8: return inputs.largestQuarterShare !== null;
      default: return false;
    }
  };

  return (
    <>
      <ProgressBar
        current={diagnosticStep}
        total={DIAGNOSTIC_QUESTIONS}
        label="Diagnostic"
      />

      {diagnosticStep === 0 && (
        <QuestionShell
          title="Share of revenue from your top 2 clients?"
          hint="Count your fees, not your clients' media budgets."
          onBack={goBack}
        >
          <PercentInput
            value={inputs.top2Share}
            onChange={(v) => updateInput("top2Share", v)}
          />
          <UnknownButton onClick={() => { updateInput("top2Share", null); goNext(); }} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(0)} />
        </QuestionShell>
      )}

      {diagnosticStep === 1 && (
        <QuestionShell
          title="Share of revenue on recurring monthly agreements?"
          onBack={goBack}
        >
          <PercentInput
            value={inputs.recurringShare}
            onChange={(v) => updateInput("recurringShare", v)}
          />
          <UnknownButton onClick={() => { updateInput("recurringShare", null); goNext(); }} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(1)} />
        </QuestionShell>
      )}

      {diagnosticStep === 2 && (
        <QuestionShell
          title="Average client relationship length?"
          onBack={goBack}
        >
          <NumberInput
            value={inputs.clientTenure}
            onChange={(v) => updateInput("clientTenure", v)}
            suffix="yrs"
          />
          <UnknownButton onClick={() => { updateInput("clientTenure", null); goNext(); }} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(2)} />
        </QuestionShell>
      )}

      {diagnosticStep === 3 && (
        <QuestionShell
          title="Who primarily drives new business?"
          onBack={goBack}
        >
          <div className="space-y-3">
            {[
              { value: "founder_only" as const, label: "Founder only" },
              { value: "founder_plus_team" as const, label: "Founder plus team" },
              { value: "sales_team" as const, label: "Sales team" },
            ].map((opt) => (
              <OptionButton
                key={opt.value}
                selected={inputs.newBusiness === opt.value}
                onClick={() => updateInput("newBusiness", opt.value)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
          <UnknownButton onClick={() => updateInput("newBusiness", "unknown")} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(3)} />
        </QuestionShell>
      )}

      {diagnosticStep === 4 && (
        <QuestionShell
          title="Is the founder essential to client delivery?"
          onBack={goBack}
        >
          <div className="space-y-3">
            {[
              { value: "yes" as const, label: "Yes" },
              { value: "no" as const, label: "No" },
            ].map((opt) => (
              <OptionButton
                key={opt.value}
                selected={inputs.founderInDelivery === opt.value}
                onClick={() => updateInput("founderInDelivery", opt.value)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
          <UnknownButton onClick={() => updateInput("founderInDelivery", "unknown")} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(4)} />
        </QuestionShell>
      )}

      {diagnosticStep === 5 && (
        <QuestionShell
          title="Average employee tenure?"
          onBack={goBack}
        >
          <NumberInput
            value={inputs.employeeTenure}
            onChange={(v) => updateInput("employeeTenure", v)}
            suffix="yrs"
          />
          <UnknownButton onClick={() => { updateInput("employeeTenure", null); goNext(); }} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(5)} />
        </QuestionShell>
      )}

      {diagnosticStep === 6 && (
        <QuestionShell
          title="Average months remaining on client contracts?"
          onBack={goBack}
        >
          <NumberInput
            value={inputs.contractRunway}
            onChange={(v) => updateInput("contractRunway", v)}
            suffix="mo"
          />
          <UnknownButton onClick={() => { updateInput("contractRunway", null); goNext(); }} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(6)} />
        </QuestionShell>
      )}

      {diagnosticStep === 7 && (
        <QuestionShell
          title="Team culture, self-rated 1 to 10?"
          onBack={goBack}
        >
          <NumberInput
            value={inputs.culture}
            onChange={(v) => updateInput("culture", v)}
          />
          <UnknownButton onClick={() => { updateInput("culture", null); goNext(); }} />
          <ContinueButton onClick={goNext} disabled={!hasAnswer(7)} />
        </QuestionShell>
      )}

      {diagnosticStep === 8 && (
        <QuestionShell
          title="Share of annual revenue in your biggest quarter?"
          onBack={goBack}
        >
          <PercentInput
            value={inputs.largestQuarterShare}
            onChange={(v) => updateInput("largestQuarterShare", v)}
          />
          <UnknownButton onClick={() => { updateInput("largestQuarterShare", null); goNext(); }} />
          <ContinueButton
            onClick={goNext}
            disabled={!hasAnswer(8)}
            label="Continue to results →"
          />
        </QuestionShell>
      )}

      {liveResult.adjustments.length > 0 && (
        <div className="mt-8 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Latest adjustment
          </p>
          {liveResult.adjustments.slice(-1).map((adj) => (
            <p key={adj.id} className="mt-1 text-sm text-navy">
              {adj.label}:{" "}
              <span className={adj.value >= 0 ? "text-emerald-600" : "text-red-600"}>
                {adj.value >= 0 ? "+" : ""}
                {adj.value.toFixed(2)}x
              </span>
            </p>
          ))}
        </div>
      )}
    </>
  );
}

export function GateStage() {
  const router = useRouter();
  const { inputs, profile, updateProfile, updateInput, setFinalResult, setResultToken } =
    useCalculator();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    profile.firstName &&
    profile.email &&
    profile.company &&
    inputs.yearsInBusiness !== null &&
    inputs.agencyType &&
    inputs.saleTimeline &&
    profile.reportConsent;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs,
          profile: {
            firstName: profile.firstName,
            email: profile.email,
            company: profile.company,
            phone: profile.phone,
            marketingConsent: profile.marketingConsent ?? false,
            reportConsent: profile.reportConsent ?? false,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      const data = await res.json();
      setFinalResult(data.result);
      setResultToken(data.token);
      router.push(`/results/${data.token}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QuestionShell
      title="Get your full results"
      subtitle="Enter your details to unlock your valuation report. We will email you a copy."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-navy">
            First name *
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            value={profile.firstName ?? ""}
            onChange={(e) => updateProfile({ firstName: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-navy">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            value={profile.email ?? ""}
            onChange={(e) => updateProfile({ email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-navy">
            Company *
          </label>
          <input
            id="company"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            value={profile.company ?? ""}
            onChange={(e) => updateProfile({ company: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-navy">
            Agency type *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "full_service" as const, label: "Full service" },
              { value: "specialized" as const, label: "Specialized" },
              { value: "performance" as const, label: "Performance" },
              { value: "creative" as const, label: "Creative" },
            ].map((opt) => (
              <OptionButton
                key={opt.value}
                selected={inputs.agencyType === opt.value}
                onClick={() => updateInput("agencyType", opt.value)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="years" className="mb-1 block text-sm font-medium text-navy">
            Years in business *
          </label>
          <NumberInput
            id="years"
            value={inputs.yearsInBusiness}
            onChange={(v) => updateInput("yearsInBusiness", v)}
            suffix="yrs"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-navy">
            Target-to-sale timeline *
          </label>
          <div className="space-y-2">
            {[
              { value: "within_12" as const, label: "Within 12 months" },
              { value: "13_to_24" as const, label: "13 to 24 months" },
              { value: "25_to_48" as const, label: "25 to 48 months" },
              { value: "4plus" as const, label: "4 years plus" },
            ].map((opt) => (
              <OptionButton
                key={opt.value}
                selected={inputs.saleTimeline === opt.value}
                onClick={() => updateInput("saleTimeline", opt.value)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-navy">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Text me my results link"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            value={profile.phone ?? ""}
            onChange={(e) => updateProfile({ phone: e.target.value })}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-slate-body">
          <input
            type="checkbox"
            className="mt-1 accent-gold"
            checked={profile.reportConsent ?? false}
            onChange={(e) => updateProfile({ reportConsent: e.target.checked })}
          />
          <span>
            Send me my valuation report by email. *
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-slate-body">
          <input
            type="checkbox"
            className="mt-1 accent-gold"
            checked={profile.marketingConsent ?? false}
            onChange={(e) => updateProfile({ marketingConsent: e.target.checked })}
          />
          <span>
            Keep me updated on agency M&A insights and DAB resources.
          </span>
        </label>

        <p className="text-xs text-slate-500">
          By continuing you agree to our privacy policy and terms of service.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <ContinueButton
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          label={submitting ? "Calculating..." : "Reveal my valuation →"}
        />
      </div>
    </QuestionShell>
  );
}
