import { useCallback, useRef } from 'react';

export default function <T extends (...args: any[]) => any>(
  fn: T,
  delay = 2000,
  normalFn: Function,
) {
  const timer = useRef<number>();
  return useCallback(
    function inner(...args: Parameters<T>) {
      normalFn?.(args);
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(args), delay);
    },
    [delay, fn, normalFn],
  );
}
