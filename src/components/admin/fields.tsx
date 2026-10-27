'use client';

import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, hint, required, children }: FieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-bold text-white">
          {label}
          {required && <span className="ml-1 text-emerald-400">*</span>}
        </label>
        {hint && <span className="text-xs font-medium text-white/45">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const CONTROL =
  'min-h-12 w-full rounded-xl border border-white/12 bg-[#162a45] px-4 text-base font-semibold text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/25';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={`${CONTROL} ${className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea {...rest} className={`${CONTROL} min-h-28 py-3 leading-relaxed ${className ?? ''}`} />;
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#162a45] px-4 py-3 text-left transition active:scale-[0.99]"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-white">{label}</span>
        {description && <span className="mt-0.5 block text-xs font-medium text-white/50">{description}</span>}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? 'bg-emerald-400' : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </span>
    </button>
  );
}

interface ChipProps {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 text-sm font-bold transition active:scale-[0.97] ${
        active
          ? 'border-emerald-400 bg-emerald-400 text-[#081120]'
          : 'border-white/15 bg-white/5 text-white/80'
      }`}
    >
      {children}
    </button>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101f36] p-4">
      <h2 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">{title}</h2>
      {description && <p className="mt-1 text-xs font-medium text-white/45">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
