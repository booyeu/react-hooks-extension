import { useEffect, useRef, useState } from 'react';

export default function <T>(value?: T, delay = 0) {
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
