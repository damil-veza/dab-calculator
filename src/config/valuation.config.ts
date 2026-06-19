export const valuationConfig = {
  version: "1.0.0",
  clamps: {
    multipleMin: 1.0,
    multipleMax: 12.0,
    valueRangePercent: 0.15,
    revenueSubScaleThreshold: 250000,
    ebitdaHighThreshold: 20000000,
    marginImplausibleThreshold: 0.8,
    growthImplausibleThreshold: 5.0,
  },
  matrix: {
    marginBreakpoints: [0.05, 0.10, 0.15, 0.20, 0.25, 0.30],
    growthBreakpoints: [0.10, 0.20, 0.25, 0.30, 0.40, 0.50],
    values: [
      [2.0, 2.5, 3.0, 3.5, 4.0, 5.0],
      [3.0, 4.0, 5.0, 5.5, 6.0, 6.0],
      [4.0, 5.0, 6.0, 6.5, 7.0, 7.0],
      [5.0, 6.0, 7.0, 7.5, 8.0, 9.0],
      [6.0, 7.0, 8.0, 8.5, 9.0, 10.0],
      [7.0, 8.0, 9.0, 9.5, 10.0, 11.0],
    ],
    floorMultiple: 2.0,
  },
  durability: {
    "5plus": 1.0,
    "3to4": 0.85,
    "2years": 0.70,
    firstYear: 0.50,
    unknown: 0.85,
  },
  bands: [
    {
      max: 6.0,
      label: "Founder-Centric",
      description:
        "The agency runs on you. Buyers price that risk. Biggest unlocks: new business engine, delivery independence, client spread.",
    },
    {
      max: 9.0,
      label: "Strong Team",
      description:
        "A real team and steady growth. The premium tier is within reach: recurring revenue, longer contracts, deeper niche.",
    },
    {
      max: 12.0,
      label: "Integration-Ready",
      description:
        "Recurring, high-margin, transferable. Agencies in this band command premium multiples and clean processes.",
    },
  ],
  adjustments: {
    A1: {
      id: "A1",
      label: "Client concentration",
      fixable: true,
      brackets: [
        { max: 0.20, value: 0.25 },
        { max: 0.30, value: 0 },
        { max: 0.40, value: -0.75 },
        { max: 0.50, value: -1.25 },
        { max: Infinity, value: -2.0 },
      ],
    },
    A2: {
      id: "A2",
      label: "Recurring revenue",
      fixable: true,
      brackets: [
        { max: Infinity, min: 0.75, value: 0.5 },
        { max: 0.75, min: 0.50, value: 0 },
        { max: 0.50, min: 0.25, value: -0.25 },
        { max: 0.25, value: -0.5 },
      ],
    },
    A3: {
      id: "A3",
      label: "Client tenure",
      fixable: true,
      brackets: [
        { max: Infinity, min: 2, value: 0.25 },
        { max: 2, min: 1, value: 0 },
        { max: 1, value: -0.5 },
      ],
    },
    A4: {
      id: "A4",
      label: "New business engine",
      fixable: true,
      options: {
        sales_team: 0.25,
        founder_plus_team: 0,
        founder_only: -0.5,
        unknown: 0,
      },
    },
    A5: {
      id: "A5",
      label: "Founder in delivery",
      fixable: true,
      options: {
        no: 0,
        yes: -0.5,
        unknown: 0,
      },
    },
    A6: {
      id: "A6",
      label: "Employee tenure",
      fixable: true,
      brackets: [
        { max: Infinity, min: 3, value: 0.25 },
        { max: 3, min: 1, value: 0 },
        { max: 1, value: -0.5 },
      ],
    },
    A7: {
      id: "A7",
      label: "Contract runway",
      fixable: true,
      brackets: [
        { max: Infinity, min: 24, value: 0.5 },
        { max: 24, min: 12, value: 0.25 },
        { max: 12, min: 6, value: 0 },
        { max: 6, value: -0.5 },
      ],
    },
    A8: {
      id: "A8",
      label: "Team culture",
      fixable: true,
      brackets: [
        { max: Infinity, min: 9, value: 0.25 },
        { max: 8, min: 6, value: 0 },
        { max: 5, value: -0.5 },
      ],
    },
    A9: {
      id: "A9",
      label: "Seasonality",
      fixable: true,
      brackets: [
        { max: 0.35, value: 0 },
        { max: 0.50, value: -0.25 },
        { max: 0.75, value: -0.5 },
        { max: Infinity, value: -0.75 },
      ],
    },
    A10: {
      id: "A10",
      label: "Years in business",
      fixable: false,
      brackets: [
        { max: Infinity, min: 3, value: 0 },
        { max: 3, min: 2, value: -0.5 },
        { max: 2, value: -1.0 },
      ],
    },
    A11: {
      id: "A11",
      label: "Negative growth",
      fixable: true,
      value: -0.75,
    },
  },
} as const;

export type ValuationConfig = typeof valuationConfig;
