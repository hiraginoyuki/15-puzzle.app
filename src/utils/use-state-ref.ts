import { MutableRefObject, useRef } from 'react';
import { useForceUpdate } from './use-force-update';

export function useStateRef<T>(initialValue?: T): MutableRefObject<T> {
  const forceUpdate = useForceUpdate();
  const ref = useRef(initialValue);
  return {
    get current() {
      return ref.current;
    },
    set current(value: T | undefined) {
      ref.current = value;
      forceUpdate();
    }
  } as MutableRefObject<T>;
}
