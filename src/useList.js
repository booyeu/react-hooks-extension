import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {RefreshControl, Text, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';

import {
  byFetch,
  useReducerRef,
  byStyle,
  byI18n,
  ActivityIndicator,
  byLocation,
  global,
} from '../../common';

let AsyncStorage = null;

export default function (params) {
  const {
    requestParams,
    storage,
    url,
    location,
    listProps,
    customReducer,
    Component = FlatList,
    extraData,
    paddingBottom,
  } = params;
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const firstLoadRef = useRef(true);
  const locationRef = useRef();
  const [loading, setLoading] = useState(false);
  const [storageParams, setStorageParams] = useReducer(
    useCallback(
      (prevState, data) => {
        if (!storage) {
          return {};
        }
        if (AsyncStorage === null) {
          AsyncStorage =
            require('@react-native-async-storage/async-storage').default;
        }
        if (data) {
          if (storage.params) {
            AsyncStorage.setItem(storage.key, data[storage.params]);
          } else {
            AsyncStorage.setItem(storage.key, JSON.stringify(data));
          }
          return {...prevState, ...data};
        }
        AsyncStorage.removeItem(storage.key);
        return {};
      },
      [storage],
    ),
  );
  const [list, listDispatch, listRef] = useReducerRef(
    (prevState, action) => {
      switch (action.type) {
        case 'LOAD':
          return {
            data: [...prevState.data, ...action.payload.data],
            over: action.payload.over,
          };
        case 'UPDATE':
          prevState.data[action.payload.index] = action.payload.data;
          return {...prevState, data: [...prevState.data]};
        case 'ADD':
          prevState.data.splice(action.payload.index, 0, action.payload.data);
          return {...prevState, data: [...prevState.data]};
        case 'DELETE':
          prevState.data.splice(action.payload.index, 1);
          return {...prevState, data: [...prevState.data]};
        case 'INIT':
          return action.payload;
        case 'BLOCK':
          return {
            ...prevState,
            data: [
              ...prevState.data.filter(el => el.uuid !== action.payload.uuid),
            ],
          };
        default:
          return customReducer?.(prevState, action) || prevState;
      }
    },
    {data: [], over: false},
  );
  const fetchData = useCallback(
    reload => {
      byFetch(url, {
        type: 'list',
        num: reload ? 0 : listRef.current.data.length,
        location: locationRef.current,
        ...requestParams,
        ...Object.keys(storageParams).reduce((prevValue, curValue) => {
          prevValue[curValue] =
            storageParams[curValue] instanceof Object
              ? storageParams[curValue].value
              : storageParams[curValue];
          return prevValue;
        }, {}),
      })
        .then(result => {
          if (!locationRef.current) {
            locationRef.current = global.location.data;
          }
          listDispatch({type: reload ? 'INIT' : 'LOAD', payload: result});
        })
        .finally(() => reload && !firstLoadRef.current && setLoading(false));
    },
    [listDispatch, listRef, requestParams, storageParams, url],
  );
  const update = useCallback(
    (reload = true) => {
      if (!storageParams) {
        return;
      }
      if (reload) {
        !firstLoadRef.current && setLoading(true);
        if (listProps?.onRefresh) {
          const onRefresh = listProps?.onRefresh;
          onRefresh();
        }
      }
      firstLoadRef.current = false;
      if (location && !locationRef.current) {
        byLocation().then(() => {
          fetchData(reload);
        });
      } else {
        fetchData(reload);
      }
    },
    [fetchData, listProps?.onRefresh, location, storageParams],
  );
  const onEndReach = useCallback(() => update(false), [update]);

  useEffect(() => {
    if (storage) {
      if (AsyncStorage === null) {
        AsyncStorage =
          require('@react-native-async-storage/async-storage').default;
      }
      AsyncStorage.getItem(storage.key, (error, data) => {
        if (storage.params) {
          setStorageParams({[storage.params]: data || storage.default});
        } else {
          setStorageParams(data && JSON.parse(data));
        }
      });
    } else {
      setStorageParams();
    }
  }, [storage, setStorageParams]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    List: useMemo(
      () =>
        extraData !== null ? (
          <Component
            data={(extraData || []).concat(list.data)}
            onEndReached={(!list.over && onEndReach) || null}
            keyboardDismissMode="on-drag"
            ListFooterComponent={
              list.over ? (
                <Text
                  style={[
                    byStyle.else,
                    {paddingBottom: paddingBottom ? insets.bottom : 0},
                  ]}>
                  {byI18n.t('common.tip.over')}
                </Text>
              ) : (
                <ActivityIndicator
                  style={{paddingBottom: paddingBottom ? insets.bottom : 0}}
                />
              )
            }
            disableRightSwipe
            closeOnRowBeginSwipe
            useFlatList
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={update}
                tintColor={colors.text}
                colors={[colors.text]}
                progressBackgroundColor={colors.card}
              />
            }
            refreshing={loading}
            onRefresh={update}
            refreshControlProps={{
              tintColor: colors.text,
              colors: [colors.text],
              progressBackgroundColor: colors.card,
            }}
            {...listProps}
          />
        ) : null,
      [
        paddingBottom,
        extraData,
        listProps,
        list.data,
        list.over,
        loading,
        update,
        onEndReach,
        insets.bottom,
        colors,
      ],
    ),
    listDispatch,
    storageParams,
    setStorageParams,
    locationRef,
  };
}
