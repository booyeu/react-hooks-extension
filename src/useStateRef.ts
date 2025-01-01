import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';

function useStateRef<T>(
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>];
function useStateRef<T = undefined>(): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  MutableRefObject<T | undefined>,
];

function useStateRef<T>(initialValue?: T) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return [state, setState, ref];
}

export default useStateRef;
