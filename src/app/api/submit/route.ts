import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";
import { calculateValuation } from "@/lib/valuation/engine";
import type { CalculatorInputs, ProfileData } from "@/lib/valuation/types";

const profileSchema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  phone: z.string().optional(),
  marketingConsent: z.boolean(),
  reportConsent: z.boolean(),
});

const inputsSchema = z.object({
  revenue: z.number().nullable(),
  ebitda: z.number().nullable(),
  growth: z.number().nullable(),
  trackRecord: z.string().nullable(),
  top2Share: z.number().nullable(),
  recurringShare: z.number().nullable(),
  clientTenure: z.number().nullable(),
  newBusiness: z.string().nullable(),
  founderInDelivery: z.string().nullable(),
  employeeTenure: z.number().nullable(),
  contractRunway: z.number().nullable(),
  culture: z.number().nullable(),
  largestQuarterShare: z.number().nullable(),
  yearsInBusiness: z.number().nullable(),
  agencyType: z.string().nullable(),
  saleTimeline: z.string().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputs: rawInputs, profile: rawProfile } = body;

    const profile = profileSchema.parse(rawProfile) as ProfileData;
    inputsSchema.parse(rawInputs);

    if (!profile.reportConsent) {
      return NextResponse.json(
        { error: "Report consent is required" },
        { status: 400 }
      );
    }

    const inputs = rawInputs as CalculatorInputs;
    const result = calculateValuation(inputs);

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await prisma.submission.create({
      data: {
        token,
        configVersion: result.configVersion,
        firstName: profile.firstName,
        email: profile.email,
        company: profile.company,
        phone: profile.phone ?? null,
        agencyType: inputs.agencyType,
        yearsInBusiness: inputs.yearsInBusiness,
        saleTimeline: inputs.saleTimeline,
        marketingConsent: profile.marketingConsent,
        reportConsent: profile.reportConsent,
        inputs: JSON.stringify(inputs),
        result: JSON.stringify(result),
        leadScore: result.leadScore,
        expiresAt,
      },
    });

    return NextResponse.json({ token, result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid submission data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
