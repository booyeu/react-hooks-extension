import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function useStateDebounce<T>(
  initialState: T | (() => T),
  delay?: number,
): [T, Dispatch<SetStateAction<T>>, T, Dispatch<SetStateAction<T>>];
function useStateDebounce<T = undefined>(
  initialState: undefined,
  delay?: number,
): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
];

function useStateDebounce<S>(initialValue?: S, delay = 2000) {
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

export default useStateDebounce;
