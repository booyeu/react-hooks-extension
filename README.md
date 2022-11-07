# react-hooks-extension [![Monthly download](https://img.shields.io/npm/dm/react-hooks-extension.svg)](https://img.shields.io/npm/dm/react-hooks-extension.svg) [![Total downloads](https://img.shields.io/npm/dt/react-hooks-extension.svg)](https://img.shields.io/npm/dt/react-hooks-extension.svg)

## Install

```bash
npm install react-hooks-extension --save
```

## Usage

```javascript
import {useStateRef, useReducerRef, useDebounce, useStateDebounce} from 'react-hooks-extension';

const [state, setState, stateRef] = useStateRef('init value');
const [data, dataDispatch, dataRef] = useReducerRef((prevData, action) => {}, {data: 'init value'});
const delayFunction = useDebounce(
    useCallback(() => {
        // do something delay
    }, []),
    2000,
    useCallback(() => {
        // do something first
    }, []),
);
const [keywords, setKeywords, keywordsDelay, setKeywordsDelay] = useStateDebounce('', 2000);
```
