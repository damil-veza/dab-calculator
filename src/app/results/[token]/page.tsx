import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ResultsView } from "@/components/results/ResultsView";
import type { CalculatorInputs, ValuationResult } from "@/lib/valuation/types";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const { token } = await params;

  const submission = await prisma.submission.findUnique({
    where: { token },
  });

  if (!submission || submission.expiresAt < new Date()) {
    notFound();
  }

  const inputs = JSON.parse(submission.inputs) as CalculatorInputs;
  const result = JSON.parse(submission.result) as ValuationResult;

  return (
    <ResultsView result={result} inputs={inputs} token={token} />
  );
}
