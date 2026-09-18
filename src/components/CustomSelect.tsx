'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = 'Select...' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown 
          size={18} 
          className={`ml-2 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition hover:bg-emerald-50 ${
                value === option
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700'
              }`}
            >
              <span>{option}</span>
              {value === option && (
                <Check size={16} className="flex-shrink-0 text-emerald-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
