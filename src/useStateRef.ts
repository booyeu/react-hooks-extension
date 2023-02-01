import { useCallback, useRef, useState } from 'react';

export default function <T>(initialValue?: T) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  const set = useCallback((val: T) => {
    ref.current = val;
    setState(val);
  }, []);
  return [state, set, ref];
}
