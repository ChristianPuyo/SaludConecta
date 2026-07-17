import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../storage/AsyncStorageAdapter';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    (async () => {
      const result = await storage.get<T>(key);
      if (result.success && result.data !== null) {
        setValue(result.data);
      }
      setIsLoading(false);
    })();
  }, [key]);

  const update = useCallback(async (newValue: T) => {
    setValue(newValue);
    await storage.set(key, newValue);
  }, [key]);

  const reset = useCallback(async () => {
    setValue(defaultValue);
    await storage.set(key, defaultValue);
  }, [key, defaultValue]);

  return { value, setValue: update, reset, isLoading };
}
