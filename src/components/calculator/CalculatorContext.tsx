"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPartialValuation } from "@/lib/valuation/engine";
import type {
  CalculatorInputs,
  CalculatorStage,
  ProfileData,
  ValuationResult,
} from "@/lib/valuation/types";

const initialInputs: CalculatorInputs = {
  revenue: null,
  ebitda: null,
  growth: null,
  trackRecord: null,
  top2Share: null,
  recurringShare: null,
  clientTenure: null,
  newBusiness: null,
  founderInDelivery: null,
  employeeTenure: null,
  contractRunway: null,
  culture: null,
  largestQuarterShare: null,
  yearsInBusiness: null,
  agencyType: null,
  saleTimeline: null,
};

interface CalculatorContextValue {
  stage: CalculatorStage;
  setStage: (stage: CalculatorStage) => void;
  hookStep: number;
  setHookStep: (step: number) => void;
  diagnosticStep: number;
  setDiagnosticStep: (step: number) => void;
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => void;
  profile: Partial<ProfileData>;
  updateProfile: (data: Partial<ProfileData>) => void;
  liveResult: ValuationResult;
  finalResult: ValuationResult | null;
  setFinalResult: (result: ValuationResult | null) => void;
  resultToken: string | null;
  setResultToken: (token: string | null) => void;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<CalculatorStage>("hook");
  const [hookStep, setHookStep] = useState(0);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [finalResult, setFinalResult] = useState<ValuationResult | null>(null);
  const [resultToken, setResultToken] = useState<string | null>(null);

  const updateInput = useCallback(
    <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateProfile = useCallback((data: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  const liveResult = useMemo(() => getPartialValuation(inputs), [inputs]);

  const value = useMemo(
    () => ({
      stage,
      setStage,
      hookStep,
      setHookStep,
      diagnosticStep,
      setDiagnosticStep,
      inputs,
      updateInput,
      profile,
      updateProfile,
      liveResult,
      finalResult,
      setFinalResult,
      resultToken,
      setResultToken,
    }),
    [
      stage,
      hookStep,
      diagnosticStep,
      inputs,
      updateInput,
      profile,
      updateProfile,
      liveResult,
      finalResult,
      resultToken,
    ]
  );

  return (
    <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
}
