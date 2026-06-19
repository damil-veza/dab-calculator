import { valuationConfig as config } from "@/config/valuation.config";
import type {
  AdjustmentLine,
  CalculatorInputs,
  HeatmapDimension,
  Recommendation,
  TrackRecord,
  ValuationResult,
} from "./types";

const cfg = config;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getBreakpointIndex(
  value: number,
  breakpoints: readonly number[],
  floor?: number
): { low: number; high: number; t: number } {
  const v = floor !== undefined ? Math.max(value, floor) : value;
  if (v <= breakpoints[0]) return { low: 0, high: 0, t: 0 };
  if (v >= breakpoints[breakpoints.length - 1]) {
    const last = breakpoints.length - 1;
    return { low: last, high: last, t: 0 };
  }
  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (v >= breakpoints[i] && v <= breakpoints[i + 1]) {
      const t = (v - breakpoints[i]) / (breakpoints[i + 1] - breakpoints[i]);
      return { low: i, high: i + 1, t };
    }
  }
  const last = breakpoints.length - 1;
  return { low: last, high: last, t: 0 };
}

export function getMatrixMultiple(margin: number, growth: number): number {
  const marginClamped = Math.max(margin, cfg.matrix.marginBreakpoints[0]);
  const growthClamped = Math.max(growth, cfg.matrix.growthBreakpoints[0]);

  const mIdx = getBreakpointIndex(marginClamped, cfg.matrix.marginBreakpoints);
  const gIdx = getBreakpointIndex(growthClamped, cfg.matrix.growthBreakpoints);

  const v00 = cfg.matrix.values[mIdx.low][gIdx.low];
  const v01 = cfg.matrix.values[mIdx.low][gIdx.high];
  const v10 = cfg.matrix.values[mIdx.high][gIdx.low];
  const v11 = cfg.matrix.values[mIdx.high][gIdx.high];

  const top = lerp(v00, v01, gIdx.t);
  const bottom = lerp(v10, v11, gIdx.t);
  return lerp(top, bottom, mIdx.t);
}

export function getDurabilityFactor(trackRecord: TrackRecord | null): number {
  switch (trackRecord) {
    case "5plus":
      return cfg.durability["5plus"];
    case "3to4":
      return cfg.durability["3to4"];
    case "2years":
      return cfg.durability["2years"];
    case "first_year":
      return cfg.durability.firstYear;
    default:
      return cfg.durability.unknown;
  }
}

function bracketValue(
  value: number | null,
  brackets: ReadonlyArray<{ max: number; min?: number; value: number }>
): number {
  if (value === null) return 0;
  for (const b of brackets) {
    const min = b.min ?? -Infinity;
    if (value > min && value <= b.max) return b.value;
    if (b.min !== undefined && value >= b.min && value <= b.max) return b.value;
  }
  for (const b of brackets) {
    if (b.min !== undefined && value >= b.min) return b.value;
  }
  return 0;
}

function bracketValueRecurring(
  value: number | null,
  _brackets: ReadonlyArray<{ max: number; min?: number; value: number }>
): number {
  if (value === null) return 0;
  if (value >= 0.75) return 0.5;
  if (value >= 0.50) return 0;
  if (value >= 0.25) return -0.25;
  return -0.5;
}

function computeAdjustments(inputs: CalculatorInputs): AdjustmentLine[] {
  const lines: AdjustmentLine[] = [];

  const a1 = cfg.adjustments.A1;
  if (inputs.top2Share !== null) {
    let val = 0;
    const s = inputs.top2Share;
    if (s < 0.20) val = 0.25;
    else if (s <= 0.30) val = 0;
    else if (s <= 0.40) val = -0.75;
    else if (s <= 0.50) val = -1.25;
    else val = -2.0;
    lines.push({ id: "A1", label: a1.label, value: val, fixable: true });
  }

  const a2 = cfg.adjustments.A2;
  if (inputs.recurringShare !== null) {
    lines.push({
      id: "A2",
      label: a2.label,
      value: bracketValueRecurring(inputs.recurringShare, a2.brackets),
      fixable: true,
    });
  }

  const a3 = cfg.adjustments.A3;
  if (inputs.clientTenure !== null) {
    let val = 0;
    if (inputs.clientTenure > 2) val = 0.25;
    else if (inputs.clientTenure >= 1) val = 0;
    else val = -0.5;
    lines.push({ id: "A3", label: a3.label, value: val, fixable: true });
  }

  const a4 = cfg.adjustments.A4;
  if (inputs.newBusiness) {
    lines.push({
      id: "A4",
      label: a4.label,
      value: a4.options[inputs.newBusiness as keyof typeof a4.options] ?? 0,
      fixable: true,
    });
  }

  const a5 = cfg.adjustments.A5;
  if (inputs.founderInDelivery) {
    lines.push({
      id: "A5",
      label: a5.label,
      value: a5.options[inputs.founderInDelivery as keyof typeof a5.options] ?? 0,
      fixable: true,
    });
  }

  const a6 = cfg.adjustments.A6;
  if (inputs.employeeTenure !== null) {
    let val = 0;
    if (inputs.employeeTenure > 3) val = 0.25;
    else if (inputs.employeeTenure >= 1) val = 0;
    else val = -0.5;
    lines.push({ id: "A6", label: a6.label, value: val, fixable: true });
  }

  const a7 = cfg.adjustments.A7;
  if (inputs.contractRunway !== null) {
    let val = 0;
    const m = inputs.contractRunway;
    if (m >= 24) val = 0.5;
    else if (m >= 12) val = 0.25;
    else if (m >= 6) val = 0;
    else val = -0.5;
    lines.push({ id: "A7", label: a7.label, value: val, fixable: true });
  }

  const a8 = cfg.adjustments.A8;
  if (inputs.culture !== null) {
    let val = 0;
    if (inputs.culture >= 9) val = 0.25;
    else if (inputs.culture >= 6) val = 0;
    else val = -0.5;
    lines.push({ id: "A8", label: a8.label, value: val, fixable: true });
  }

  const a9 = cfg.adjustments.A9;
  if (inputs.largestQuarterShare !== null) {
    let val = 0;
    const s = inputs.largestQuarterShare;
    if (s <= 0.35) val = 0;
    else if (s <= 0.50) val = -0.25;
    else if (s <= 0.75) val = -0.5;
    else val = -0.75;
    lines.push({ id: "A9", label: a9.label, value: val, fixable: true });
  }

  const a10 = cfg.adjustments.A10;
  if (inputs.yearsInBusiness !== null) {
    let val = 0;
    if (inputs.yearsInBusiness >= 3) val = 0;
    else if (inputs.yearsInBusiness >= 2) val = -0.5;
    else val = -1.0;
    lines.push({ id: "A10", label: a10.label, value: val, fixable: false });
  }

  if (inputs.growth !== null && inputs.growth < 0) {
    lines.push({
      id: "A11",
      label: cfg.adjustments.A11.label,
      value: cfg.adjustments.A11.value,
      fixable: true,
    });
  }

  return lines;
}

function getBand(multiple: number): { label: string; description: string } {
  for (const band of cfg.bands) {
    if (multiple < band.max) {
      return { label: band.label, description: band.description };
    }
  }
  const last = cfg.bands[cfg.bands.length - 1];
  return { label: last.label, description: last.description };
}

function buildHeatmap(inputs: CalculatorInputs, margin: number | null): HeatmapDimension[] {
  const growth = inputs.growth;
  const recurring = inputs.recurringShare;
  const runway = inputs.contractRunway;
  const top2 = inputs.top2Share;
  const clientTen = inputs.clientTenure;
  const newBiz = inputs.newBusiness;
  const founderDel = inputs.founderInDelivery;
  const empTen = inputs.employeeTenure;
  const culture = inputs.culture;

  let profitability: HeatmapDimension["status"] = "amber";
  if (margin !== null) {
    if (margin > 0.20) profitability = "green";
    else if (margin < 0.15) profitability = "red";
  }

  let growthStatus: HeatmapDimension["status"] = "amber";
  if (growth !== null) {
    if (growth > 0.30) growthStatus = "green";
    else if (growth < 0.10) growthStatus = "red";
  }

  let revenueQuality: HeatmapDimension["status"] = "amber";
  if (recurring !== null && runway !== null) {
    if (recurring > 0.75 && runway >= 12) revenueQuality = "green";
    else if (recurring < 0.50 || runway < 6) revenueQuality = "red";
  }

  let clientRisk: HeatmapDimension["status"] = "amber";
  if (top2 !== null && clientTen !== null) {
    if (top2 < 0.20 && clientTen > 2) clientRisk = "green";
    else if (top2 > 0.40 || clientTen < 1) clientRisk = "red";
  }

  let founderIndep: HeatmapDimension["status"] = "amber";
  if (newBiz && founderDel) {
    if (newBiz === "sales_team" && founderDel === "no") founderIndep = "green";
    else if (newBiz === "founder_only" || founderDel === "yes") founderIndep = "red";
  }

  let team: HeatmapDimension["status"] = "amber";
  if (empTen !== null && culture !== null) {
    if (empTen > 3 && culture >= 9) team = "green";
    else if (empTen < 1 || culture <= 5) team = "red";
  }

  return [
    { name: "Profitability", status: profitability, detail: "EBITDA margin vs benchmarks" },
    { name: "Growth", status: growthStatus, detail: "LTM revenue growth" },
    { name: "Revenue quality", status: revenueQuality, detail: "Recurring share and contract runway" },
    { name: "Client risk", status: clientRisk, detail: "Concentration and client tenure" },
    { name: "Founder independence", status: founderIndep, detail: "New business and delivery" },
    { name: "Team", status: team, detail: "Employee tenure and culture" },
  ];
}

function buildRecommendations(
  inputs: CalculatorInputs,
  adjustments: AdjustmentLine[],
  durabilityFactor: number,
  ebitda: number | null
): Recommendation[] {
  const recs: Recommendation[] = [];

  const a1 = adjustments.find((a) => a.id === "A1");
  if (a1 && (a1.value <= -1.25)) {
    recs.push({
      id: "conc",
      title: "Diversify client revenue",
      body: "Two clients dominate your revenue. To a buyer that is one resignation letter away from a broken deal. Set a 24-month diversification target: no client over 20%.",
      resource: "Agency M&A Community; concentration playbook",
      priority: Math.abs(a1.value) * 10,
    });
  }

  if (durabilityFactor < 1.0) {
    recs.push({
      id: "dur",
      title: "Build your track record",
      body: "Your margin and growth support a higher base than your track record has earned. Buyers pay for proof. Hold this level for three to five years and the full multiple is yours.",
      resource: "Agency M&A Community; operating cadence content",
      priority: (1 - durabilityFactor) * 10,
    });
  }

  const a4 = adjustments.find((a) => a.id === "A4");
  if (a4 && a4.value <= -0.5) {
    recs.push({
      id: "sales",
      title: "Build a sales engine beyond you",
      body: "You are the sales team. Buyers discount what leaves in your car. Document the pipeline, hire or promote one seller, and get founder-sourced revenue under half.",
      resource: "First-Time Buyer Cohort; new business systems",
      priority: 5,
    });
  }

  const a5 = adjustments.find((a) => a.id === "A5");
  if (a5 && a5.value <= -0.5) {
    recs.push({
      id: "delivery",
      title: "Make delivery transferable",
      body: "If the work stops when you stop, you own a job, not an asset. Codify delivery into documented systems someone else can run.",
      resource: "Agency M&A Community; operations content",
      priority: 5,
    });
  }

  const a2 = adjustments.find((a) => a.id === "A2");
  const a7 = adjustments.find((a) => a.id === "A7");
  if ((a2 && a2.value < 0) || (a7 && a7.value < 0)) {
    recs.push({
      id: "recurring",
      title: "Stabilize revenue quality",
      body: "Project revenue resets to zero every January. Convert your top accounts to 12-month recurring agreements and the same dollars are worth more.",
      resource: "Newsletter series; contract templates",
      priority: 4,
    });
  }

  if (ebitda !== null && ebitda <= 0) {
    recs.push({
      id: "profit",
      title: "Profitability first",
      body: "Valuation math starts at profit. Before multiples matter, get to a durable 15 to 20 percent margin.",
      resource: "Book a valuation review",
      priority: 100,
    });
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

function getDurabilityMessage(
  matrixMultiple: number,
  durabilityFactor: number,
  effectiveBase: number,
  trackRecord: TrackRecord | null
): string {
  if (durabilityFactor >= 1.0) {
    return `Your numbers support a ${matrixMultiple.toFixed(1)}x base and your track record earns the full multiple.`;
  }
  const trackLabel =
    trackRecord === "2years"
      ? "Two years"
      : trackRecord === "first_year"
        ? "First year"
        : trackRecord === "3to4"
          ? "Three to four years"
          : "Your track record";
  return `Your numbers support a ${matrixMultiple.toFixed(1)}x base. ${trackLabel} of track record earns ${effectiveBase.toFixed(1)}x of it today. Hold this performance and the rest is yours.`;
}

function getLeadScore(
  timeline: CalculatorInputs["saleTimeline"],
  ebitda: number | null
): "hot" | "nurture" | "long_term" {
  if (timeline === "within_12" || (ebitda !== null && ebitda > 1_000_000)) {
    return "hot";
  }
  if (timeline === "13_to_24" || timeline === "25_to_48") {
    return "nurture";
  }
  return "long_term";
}

export function calculateValuation(inputs: CalculatorInputs): ValuationResult {
  const revenue = inputs.revenue;
  const ebitda = inputs.ebitda;
  const growth = inputs.growth ?? 0;
  const margin =
    revenue && ebitda !== null && revenue > 0 ? ebitda / revenue : null;

  const matrixMultiple =
    margin !== null ? getMatrixMultiple(margin, growth) : cfg.matrix.floorMultiple;
  const durabilityFactor = getDurabilityFactor(inputs.trackRecord);
  const effectiveBase =
    cfg.matrix.floorMultiple +
    durabilityFactor * (matrixMultiple - cfg.matrix.floorMultiple);

  const adjustments = computeAdjustments(inputs);
  const adjustmentSum = adjustments.reduce((s, a) => s + a.value, 0);
  const finalMultiple = clamp(
    effectiveBase + adjustmentSum,
    cfg.clamps.multipleMin,
    cfg.clamps.multipleMax
  );

  const potentialAdjustmentSum = adjustments.reduce((s, a) => {
    if (!a.fixable && a.value < 0) return s + a.value;
    if (a.fixable && a.value < 0) return s;
    return s + a.value;
  }, 0);
  const potentialMultiple = clamp(
    matrixMultiple + potentialAdjustmentSum,
    cfg.clamps.multipleMin,
    cfg.clamps.multipleMax
  );

  const negativeEbitda = ebitda !== null && ebitda <= 0;
  const highEbitda = ebitda !== null && ebitda > cfg.clamps.ebitdaHighThreshold;
  const subScaleRevenue =
    revenue !== null && revenue < cfg.clamps.revenueSubScaleThreshold;
  const implausibleInputs =
    (margin !== null && margin > cfg.clamps.marginImplausibleThreshold) ||
    (inputs.growth !== null && inputs.growth > cfg.clamps.growthImplausibleThreshold);

  const suppressDollarValue = highEbitda;

  let currentEnterpriseValue: number | null = null;
  let currentValueRange: { low: number; high: number } | null = null;
  let potentialEnterpriseValue: number | null = null;
  let gap: number | null = null;

  if (ebitda !== null && ebitda > 0 && !suppressDollarValue) {
    currentEnterpriseValue = ebitda * finalMultiple;
    const range = currentEnterpriseValue * cfg.clamps.valueRangePercent;
    currentValueRange = {
      low: currentEnterpriseValue - range,
      high: currentEnterpriseValue + range,
    };
    potentialEnterpriseValue = ebitda * potentialMultiple;
    gap = potentialEnterpriseValue - currentEnterpriseValue;
  }

  return {
    configVersion: cfg.version,
    ebitdaMargin: margin,
    matrixMultiple,
    durabilityFactor,
    effectiveBase,
    adjustments,
    finalMultiple,
    potentialMultiple,
    band: getBand(finalMultiple),
    currentEnterpriseValue,
    currentValueRange,
    potentialEnterpriseValue,
    gap,
    heatmap: buildHeatmap(inputs, margin),
    recommendations: buildRecommendations(inputs, adjustments, durabilityFactor, ebitda),
    flags: {
      negativeEbitda,
      highEbitda,
      subScaleRevenue,
      implausibleInputs,
      suppressDollarValue,
    },
    leadScore: getLeadScore(inputs.saleTimeline, ebitda),
    durabilityMessage: getDurabilityMessage(
      matrixMultiple,
      durabilityFactor,
      effectiveBase,
      inputs.trackRecord
    ),
  };
}

export function getPartialValuation(inputs: Partial<CalculatorInputs>): ValuationResult {
  return calculateValuation({
    revenue: inputs.revenue ?? null,
    ebitda: inputs.ebitda ?? null,
    growth: inputs.growth ?? null,
    trackRecord: inputs.trackRecord ?? null,
    top2Share: inputs.top2Share ?? null,
    recurringShare: inputs.recurringShare ?? null,
    clientTenure: inputs.clientTenure ?? null,
    newBusiness: inputs.newBusiness ?? null,
    founderInDelivery: inputs.founderInDelivery ?? null,
    employeeTenure: inputs.employeeTenure ?? null,
    contractRunway: inputs.contractRunway ?? null,
    culture: inputs.culture ?? null,
    largestQuarterShare: inputs.largestQuarterShare ?? null,
    yearsInBusiness: inputs.yearsInBusiness ?? null,
    agencyType: inputs.agencyType ?? null,
    saleTimeline: inputs.saleTimeline ?? null,
  });
}

export { config as valuationConfig };
