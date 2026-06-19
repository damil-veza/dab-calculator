"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-8">
      {label && (
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gold transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface QuestionShellProps {
  title: string;
  subtitle?: string;
  hint?: string;
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export function QuestionShell({
  title,
  subtitle,
  hint,
  children,
  onBack,
  backLabel = "Back",
}: QuestionShellProps) {
  return (
    <div className="mx-auto max-w-lg">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm text-slate-500 hover:text-gold transition-colors"
        >
          ← {backLabel}
        </button>
      )}
      <h2 className="font-display text-2xl italic text-navy sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-slate-body">{subtitle}</p>
      )}
      {hint && (
        <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
          {hint}
        </p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  );
}

interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  id?: string;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  id,
}: CurrencyInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        className="w-full rounded-lg border border-slate-200 py-4 pl-8 pr-4 text-xl text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
        placeholder={placeholder}
        value={
          value !== null
            ? new Intl.NumberFormat("en-US").format(value)
            : ""
        }
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9]/g, "");
          onChange(cleaned ? parseInt(cleaned, 10) : null);
        }}
      />
    </div>
  );
}

interface PercentInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  id?: string;
}

export function PercentInput({ value, onChange, id }: PercentInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className="w-full rounded-lg border border-slate-200 py-4 px-4 pr-10 text-xl text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
        placeholder="0"
        value={value !== null ? (value * 100).toString() : ""}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9.]/g, "");
          if (!cleaned) {
            onChange(null);
            return;
          }
          const num = parseFloat(cleaned);
          if (!isNaN(num)) onChange(num / 100);
        }}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
    </div>
  );
}

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  suffix?: string;
  id?: string;
}

export function NumberInput({ value, onChange, suffix, id }: NumberInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className="w-full rounded-lg border border-slate-200 py-4 px-4 text-xl text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
        style={{ paddingRight: suffix ? "3rem" : undefined }}
        placeholder="0"
        value={value !== null ? value.toString() : ""}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9.]/g, "");
          if (!cleaned) {
            onChange(null);
            return;
          }
          const num = parseFloat(cleaned);
          if (!isNaN(num)) onChange(num);
        }}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          {suffix}
        </span>
      )}
    </div>
  );
}

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function OptionButton({ selected, onClick, children }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-4 py-4 text-left text-sm font-medium transition",
        selected
          ? "border-gold bg-gold/5 text-navy ring-2 ring-gold/30"
          : "border-slate-200 text-slate-700 hover:border-gold/50 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );
}

export function UnknownButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full py-2 text-sm text-slate-500 hover:text-gold transition-colors"
    >
      Unknown / Not sure
    </button>
  );
}

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: ContinueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 w-full rounded-md bg-gold py-4 text-sm font-semibold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
