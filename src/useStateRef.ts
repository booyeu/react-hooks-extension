import { useEffect, useRef, useState } from 'react';

export default function <T>(initialValue?: T) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return [state, setState, ref] as const;
}
