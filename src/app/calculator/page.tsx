import { CalculatorProvider } from "@/components/calculator/CalculatorContext";
import { CalculatorFlow } from "@/components/calculator/CalculatorFlow";

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <CalculatorFlow />
    </CalculatorProvider>
  );
}
