export type TrackRecord =
  | "first_year"
  | "2years"
  | "3to4"
  | "5plus"
  | "unknown";

export type NewBusinessEngine =
  | "founder_only"
  | "founder_plus_team"
  | "sales_team"
  | "unknown";

export type YesNoUnknown = "yes" | "no" | "unknown";

export type AgencyType =
  | "full_service"
  | "specialized"
  | "performance"
  | "creative"
  | "other";

export type SaleTimeline =
  | "within_12"
  | "13_to_24"
  | "25_to_48"
  | "4plus";

export interface CalculatorInputs {
  revenue: number | null;
  ebitda: number | null;
  growth: number | null;
  trackRecord: TrackRecord | null;
  top2Share: number | null;
  recurringShare: number | null;
  clientTenure: number | null;
  newBusiness: NewBusinessEngine | null;
  founderInDelivery: YesNoUnknown | null;
  employeeTenure: number | null;
  contractRunway: number | null;
  culture: number | null;
  largestQuarterShare: number | null;
  yearsInBusiness: number | null;
  agencyType: AgencyType | null;
  saleTimeline: SaleTimeline | null;
}

export interface ProfileData {
  firstName: string;
  email: string;
  company: string;
  phone?: string;
  marketingConsent: boolean;
  reportConsent: boolean;
}

export interface AdjustmentLine {
  id: string;
  label: string;
  value: number;
  fixable: boolean;
}

export interface HeatmapDimension {
  name: string;
  status: "green" | "amber" | "red";
  detail: string;
}

export interface Recommendation {
  id: string;
  title: string;
  body: string;
  resource: string;
  priority: number;
}

export interface ValuationResult {
  configVersion: string;
  ebitdaMargin: number | null;
  matrixMultiple: number;
  durabilityFactor: number;
  effectiveBase: number;
  adjustments: AdjustmentLine[];
  finalMultiple: number;
  potentialMultiple: number;
  band: { label: string; description: string };
  currentEnterpriseValue: number | null;
  currentValueRange: { low: number; high: number } | null;
  potentialEnterpriseValue: number | null;
  gap: number | null;
  heatmap: HeatmapDimension[];
  recommendations: Recommendation[];
  flags: {
    negativeEbitda: boolean;
    highEbitda: boolean;
    subScaleRevenue: boolean;
    implausibleInputs: boolean;
    suppressDollarValue: boolean;
  };
  leadScore: "hot" | "nurture" | "long_term";
  durabilityMessage: string;
}

export type CalculatorStage = "hook" | "teaser" | "diagnostic" | "gate" | "results";
