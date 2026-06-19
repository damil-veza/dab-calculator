import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl italic text-navy">
          DAB
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
          <Link href="/calculator" className="hover:text-gold transition-colors">
            Valuation Calculator
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs leading-relaxed text-slate-500">
          This is an educational estimate for illustration purposes only. It is not a
          formal business valuation, appraisal, or offer, and should not be relied on
          for any transaction. Agency values vary with deal structure, diligence, and
          market conditions.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Digital Agency Buyers. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
