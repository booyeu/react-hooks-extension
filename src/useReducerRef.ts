import { useCallback, useRef, useState, Reducer, ReducerState } from 'react';

export default function <R extends Reducer<any, any>>(reducer: R, initialValue?: ReducerState<R>) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);
  const reducerRef = useRef(reducer);
  const dispatch = useCallback((action: Parameters<R>[1]) => {
    ref.current = reducerRef.current(ref.current, action);
    setState(ref.current);
  }, []);
  return [state, dispatch, ref] as const;
}
