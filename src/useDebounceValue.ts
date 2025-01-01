import { useEffect, useRef, useState } from 'react';

function useDebounceValue<T>(value: T | (() => T), delay?: number): T;
function useDebounceValue<T = undefined>(value: undefined, delay?: number): T | undefined;

function useDebounceValue<T>(value?: T, delay = 0) {
  const [cur, setCur] = useState(value);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCur(value);
    }, delay);
  }, [value]);

  return cur;
}

export default useDebounceValue;
