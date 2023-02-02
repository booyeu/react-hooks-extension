import { useEffect, useState } from 'react';

export default function <S>(initialValue?: S, delay = 2000) {
  const [state, setState] = useState(initialValue);
  const [delayState, setDelayState] = useState(initialValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayState(state);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, state]);
  return [state, setState, delayState, setDelayState] as const;
}
