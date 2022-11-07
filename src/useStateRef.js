import {useCallback, useRef, useState} from 'react';

export default function (initialValue) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  const set = useCallback(val => {
    ref.current = val;
    setState(val);
  }, []);
  return [state, set, ref];
}
