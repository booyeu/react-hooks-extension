import {useCallback, useRef} from 'react';

export default function (fn, delay = 2000, normalFn) {
  const timer = useRef();
  return useCallback(
    params => {
      normalFn?.(params);
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(params), delay);
    },
    [delay, fn, normalFn],
  );
}
