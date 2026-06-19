"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatMultiple } from "@/lib/utils";

interface LiveTickerProps {
  multiple: number;
  show: boolean;
}

export function LiveTicker({ multiple, show }: LiveTickerProps) {
  const reduceMotion = useReducedMotion();

  if (!show) return null;

  return (
    <div
      className="sticky top-0 z-20 border-b border-gold/20 bg-navy px-4 py-3 text-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="text-xs uppercase tracking-wider text-slate-400">
        Your Lang Multiple
      </p>
      <motion.p
        key={multiple.toFixed(2)}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl italic text-gold"
      >
        {formatMultiple(multiple)}
      </motion.p>
    </div>
  );
}
