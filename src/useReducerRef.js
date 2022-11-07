import {useCallback, useRef, useState} from 'react';

export default function (reducer, initialValue) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  const reducerRef = useRef(reducer);
  const dispatch = useCallback(action => {
    ref.current = reducerRef.current(ref.current, action);
    setState(ref.current);
  }, []);
  return [state, dispatch, ref];
}
