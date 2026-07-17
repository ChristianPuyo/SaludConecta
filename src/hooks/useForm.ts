import { useCallback, useState } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  handleSubmit: () => Promise<void>;
  reset: (newValues?: T) => void;
  touched: Partial<Record<keyof T, boolean>>;
  setTouched: (key: keyof T) => void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [key]: value }));
    if (validate) {
      const validationErrors = validate({ ...values, [key]: value });
      setErrors((prev) => ({ ...prev, [key]: validationErrors[key] }));
    }
  }, [validate, values]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setTouched = useCallback((key: keyof T) => {
    setTouchedState((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      const hasErrors = Object.values(validationErrors).some(Boolean);
      if (hasErrors) return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, values, onSubmit]);

  const reset = useCallback((newValues?: T) => {
    setValuesState(newValues ?? initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setValues,
    handleSubmit,
    reset,
    touched,
    setTouched,
  };
}
