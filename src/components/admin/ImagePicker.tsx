'use client';

import { useRef, useState } from 'react';
import { Camera, ImageOff, Loader2 } from 'lucide-react';
import { fileToDataUrl } from '@/lib/clientImage';

interface ImagePickerProps {
  label: string;
  hint?: string;
  /** Photo already stored for the product. */
  currentUrl?: string | null;
  /** Photo picked in this session, not uploaded yet. */
  dataUrl?: string | null;
  onChange: (dataUrl: string | null) => void;
  required?: boolean;
}

export default function ImagePicker({
  label,
  hint,
  currentUrl,
  dataUrl,
  onChange,
  required = false,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = dataUrl ?? currentUrl ?? null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await fileToDataUrl(file));
    } catch (pickerError) {
      setError(pickerError instanceof Error ? pickerError.message : 'That photo could not be read.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-bold text-white">
          {label}
          {required && <span className="ml-1 text-emerald-400">*</span>}
        </label>
        {hint && <span className="text-xs font-medium text-white/45">{hint}</span>}
      </div>

      <div className="flex items-center gap-4">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#162a45]">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-white/25">
              <Camera size={22} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {busy ? 'Preparing…' : dataUrl ? 'Change photo' : 'Take or choose photo'}
          </button>

          {dataUrl && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-xs font-bold text-white/80 transition active:scale-[0.98]"
            >
              <ImageOff size={14} />
              Remove new photo
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error && <p className="mt-2 text-xs font-semibold text-red-300">{error}</p>}
    </div>
  );
}
