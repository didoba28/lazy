'use client';

import * as React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { searchAddress, type MapboxFeature } from '@/lib/mapbox';
import { cn } from '@/lib/utils';

interface Props {
  id?: string;
  value: string;
  onChange: (value: string, feature?: MapboxFeature) => void;
  placeholder?: string;
}

export default function AddressAutocomplete({ id, value, onChange, placeholder }: Props) {
  const [results, setResults] = React.useState<MapboxFeature[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [highlight, setHighlight] = React.useState(-1);
  const ctrlRef = React.useRef<AbortController | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const lastSelectedRef = React.useRef<string>('');

  React.useEffect(() => {
    if (lastSelectedRef.current === value) return;
    if (value.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await searchAddress(value, ctrl.signal);
        setResults(r);
        setOpen(r.length > 0);
        setHighlight(-1);
      } catch {
        // aborted or network — silent
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function pick(f: MapboxFeature) {
    lastSelectedRef.current = f.place_name;
    onChange(f.place_name, f);
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      pick(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-accent" />
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKey}
          className="flex h-11 w-full rounded-md border border-brand/15 bg-white pl-9 pr-9 py-2 text-sm text-ink placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-accent" />
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-brand/10 bg-white shadow-lg">
          {results.map((r, i) => (
            <li
              key={r.id}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(r);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm',
                i === highlight ? 'bg-mist text-brand' : 'text-ink',
              )}
            >
              <div className="font-medium">{r.text}</div>
              <div className="text-xs text-slate-500">{r.place_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
