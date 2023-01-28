import { useCallback, useRef } from 'react';

export default function (fn: Function, delay = 2000, normalFn: Function) {
  const timer = useRef<number>();
  return useCallback(
    (params: any) => {
      normalFn?.(params);
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(params), delay);
    },
    [delay, fn, normalFn],
  );
}
