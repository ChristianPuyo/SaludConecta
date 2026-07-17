import { useMemo, useState } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  minQueryLength?: number;
}

interface UseSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
  hasResults: boolean;
  totalResults: number;
}

export function useSearch<T>({
  data,
  searchFields,
  minQueryLength = 1,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query || query.length < minQueryLength) return data;
    const q = query.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') return value.toLowerCase().includes(q);
        if (Array.isArray(value)) return value.some((v) => String(v).toLowerCase().includes(q));
        return String(value).toLowerCase().includes(q);
      })
    );
  }, [data, query, searchFields, minQueryLength]);

  return {
    query,
    setQuery,
    results,
    hasResults: results.length > 0,
    totalResults: results.length,
  };
}
