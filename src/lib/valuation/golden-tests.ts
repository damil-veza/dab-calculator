import { calculateValuation } from "./engine";
import type { CalculatorInputs } from "./types";

const goldenCase1: CalculatorInputs = {
  revenue: 3_000_000,
  ebitda: 600_000,
  growth: 0.25,
  trackRecord: "2years",
  top2Share: 0.45,
  recurringShare: 0.60,
  clientTenure: 3,
  newBusiness: "founder_only",
  founderInDelivery: "yes",
  employeeTenure: 2,
  contractRunway: 6,
  culture: 7,
  largestQuarterShare: 0.40,
  yearsInBusiness: 8,
  agencyType: "full_service",
  saleTimeline: "25_to_48",
};

function assertClose(actual: number, expected: number, label: string, tolerance = 0.01) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function runGoldenCase1() {
  const result = calculateValuation(goldenCase1);

  assertClose(result.matrixMultiple, 7.0, "Matrix multiple");
  assertClose(result.durabilityFactor, 0.7, "Durability factor");
  assertClose(result.effectiveBase, 5.5, "Effective base");
  assertClose(result.finalMultiple, 3.25, "Final multiple");
  assertClose(result.potentialMultiple, 7.25, "Potential multiple");
  assertClose(result.currentEnterpriseValue!, 1_950_000, "Current EV", 1000);
  assertClose(result.potentialEnterpriseValue!, 4_350_000, "Potential EV", 1000);
  assertClose(result.gap!, 2_400_000, "Gap", 1000);
  assertClose(result.currentValueRange!.low, 1_657_500, "Range low", 5000);
  assertClose(result.currentValueRange!.high, 2_242_500, "Range high", 5000);

  if (result.band.label !== "Founder-Centric") {
    throw new Error(`Expected Founder-Centric band, got ${result.band.label}`);
  }

  console.log("✓ Golden case 1 passed");
  console.log(JSON.stringify(result, null, 2));
}

runGoldenCase1();
