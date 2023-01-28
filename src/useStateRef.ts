import { useCallback, useRef, useState } from 'react';

export default function (initialValue: any) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  const set = useCallback((val: any) => {
    ref.current = val;
    setState(val);
  }, []);
  return [state, set, ref];
}
