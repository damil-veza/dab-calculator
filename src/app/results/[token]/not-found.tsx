import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-3xl italic text-navy">Results not found</h1>
      <p className="mt-4 text-slate-body">
        This link may have expired or is invalid. Results links are valid for 90 days.
      </p>
      <div className="mt-8">
        <Link href="/calculator">
          <Button>Take the assessment again</Button>
        </Link>
      </div>
    </div>
  );
}
