'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Plus, X } from 'lucide-react';
import type { Product } from '@/types';
import ImagePicker from '@/components/admin/ImagePicker';
import { Chip, Field, Section, TextArea, TextInput, Toggle } from '@/components/admin/fields';

const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLOR_PRESETS = ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Grey'];

interface FormValues {
  name: string;
  team: string;
  league: string;
  player: string;
  number: string;
  price: string;
  sleeveType: '' | 'short' | 'long';
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  available: boolean;
  is_new: boolean;
  is_featured: boolean;
}

function toFormValues(product?: Product): FormValues {
  return {
    name: product?.name ?? '',
    team: product?.team ?? '',
    league: product?.league ?? '',
    player: product?.player ?? '',
    number: product?.number ?? '',
    price: product ? String(product.price) : '',
    sleeveType: product?.sleeveType ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    sizes: product?.sizes ?? ['S', 'M', 'L', 'XL'],
    colors: product?.colors ?? [],
    available: product?.available ?? true,
    is_new: product?.is_new ?? false,
    is_featured: product?.is_featured ?? false,
  };
}

function TagEditor({
  label,
  hint,
  values,
  presets,
  onChange,
}: {
  label: string;
  hint?: string;
  values: string[];
  presets: string[];
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const add = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (values.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...values, trimmed]);
    setDraft('');
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Chip
            key={preset}
            active={values.some((item) => item.toLowerCase() === preset.toLowerCase())}
            onClick={() =>
              values.some((item) => item.toLowerCase() === preset.toLowerCase())
                ? onChange(values.filter((item) => item.toLowerCase() !== preset.toLowerCase()))
                : add(preset)
            }
          >
            {preset}
          </Chip>
        ))}
      </div>

      {values.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-200"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((item) => item !== value))}
                className="rounded-full p-0.5 text-emerald-200/70 active:text-white"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <TextInput
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add(draft);
            }
          }}
          placeholder="Add your own"
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => add(draft)}
          aria-label="Add value"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 text-white/80 transition active:scale-95"
        >
          <Plus size={18} />
        </button>
      </div>
    </Field>
  );
}

export default function ProductForm({ product, mode }: { product?: Product; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() => toFormValues(product));
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!values.name.trim()) {
      setError('Add a product name.');
      return;
    }
    if (!values.team.trim()) {
      setError('Add the team this shirt belongs to.');
      return;
    }
    const price = Number(values.price);
    if (!Number.isFinite(price) || price < 0) {
      setError('Add a valid price.');
      return;
    }

    const payload: Record<string, unknown> = {
      name: values.name.trim(),
      team: values.team.trim(),
      league: values.league.trim(),
      player: values.player.trim(),
      number: values.number.trim(),
      price,
      sleeveType: values.sleeveType || undefined,
      category: values.category.trim(),
      description: values.description.trim(),
      sizes: values.sizes,
      colors: values.colors,
      available: values.available,
      is_new: values.is_new,
      is_featured: values.is_featured,
      rating: product?.rating ?? 0,
      reviews_count: product?.reviews_count ?? 0,
    };

    if (frontImage) payload.image = frontImage;
    if (backImage) payload.hoverImage = backImage;

    setSaving(true);
    try {
      const response = await fetch(
        mode === 'create' ? '/api/products' : `/api/products/${product?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'Could not save this product.');
        return;
      }

      router.push('/admin/products');
    } catch {
      setError('No connection to the server. Check your network and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-44">
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Section title="Photos" description="The front photo is what customers see first.">
        <ImagePicker
          label="Front photo"
          required
          currentUrl={product?.image_url}
          dataUrl={frontImage}
          onChange={setFrontImage}
        />
        <ImagePicker
          label="Back photo"
          hint="Optional"
          currentUrl={product?.hover_image_url}
          dataUrl={backImage}
          onChange={setBackImage}
        />
      </Section>

      <Section title="Shirt">
        <Field label="Name" required>
          <TextInput
            value={values.name}
            onChange={(event) => set('name', event.target.value)}
            placeholder="Real Madrid Zidane #5 Home Jersey"
            autoCapitalize="words"
          />
        </Field>

        <Field label="Team" required>
          <TextInput
            value={values.team}
            onChange={(event) => set('team', event.target.value)}
            placeholder="Real Madrid"
            autoCapitalize="words"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="League">
            <TextInput
              value={values.league}
              onChange={(event) => set('league', event.target.value)}
              placeholder="La Liga"
              autoCapitalize="words"
            />
          </Field>
          <Field label="Category">
            <TextInput
              value={values.category}
              onChange={(event) => set('category', event.target.value)}
              placeholder="Retro Jerseys"
              autoCapitalize="words"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Player">
            <TextInput
              value={values.player}
              onChange={(event) => set('player', event.target.value)}
              placeholder="Zidane"
              autoCapitalize="words"
            />
          </Field>
          <Field label="Number">
            <TextInput
              value={values.number}
              onChange={(event) => set('number', event.target.value)}
              placeholder="5"
              inputMode="numeric"
            />
          </Field>
        </div>

        <Field label="Price" required hint="EUR">
          <TextInput
            value={values.price}
            onChange={(event) => set('price', event.target.value)}
            placeholder="99.99"
            inputMode="decimal"
            type="number"
            step="0.01"
            min="0"
          />
        </Field>

        <Field label="Sleeve">
          <div className="flex gap-2">
            <Chip active={values.sleeveType === ''} onClick={() => set('sleeveType', '')}>
              Any
            </Chip>
            <Chip
              active={values.sleeveType === 'short'}
              onClick={() => set('sleeveType', 'short')}
            >
              Short
            </Chip>
            <Chip active={values.sleeveType === 'long'} onClick={() => set('sleeveType', 'long')}>
              Long
            </Chip>
          </div>
        </Field>
      </Section>

      <Section title="Details">
        <TagEditor
          label="Sizes"
          values={values.sizes}
          presets={SIZE_PRESETS}
          onChange={(sizes) => set('sizes', sizes)}
        />

        <TagEditor
          label="Colours"
          values={values.colors}
          presets={COLOR_PRESETS}
          onChange={(colors) => set('colors', colors)}
        />

        <Field label="Description">
          <TextArea
            value={values.description}
            onChange={(event) => set('description', event.target.value)}
            placeholder="Classic home jersey with the classic details."
          />
        </Field>
      </Section>

      <Section title="Shop status">
        <Toggle
          checked={values.available}
          onChange={(available) => set('available', available)}
          label="In stock"
          description="Customers can buy this shirt."
        />
        <Toggle
          checked={values.is_new}
          onChange={(is_new) => set('is_new', is_new)}
          label="Show as NEW"
          description="Adds the green NEW badge."
        />
        <Toggle
          checked={values.is_featured}
          onChange={(is_featured) => set('is_featured', is_featured)}
          label="Featured"
          description="Pins it near the top of the catalogue."
        />
      </Section>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-white/10 bg-[#0d1a2e]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-3">
          {mode === 'edit' && (
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="min-h-13 shrink-0 rounded-xl border border-white/15 px-5 text-sm font-black text-white/80 transition active:scale-[0.98]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-base font-black text-[#081120] transition active:scale-[0.98] disabled:opacity-60"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? 'Saving…' : mode === 'create' ? 'Add to catalogue' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
