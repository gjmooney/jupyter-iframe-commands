// hooks/useStore.ts
import { StoreState, store } from 'jupyter-iframe-commands-host';
import { useCallback, useSyncExternalStore } from 'react';

export function useStore<T>(
  selector: (state: StoreState) => T,
  compare?: (a: T, b: T) => boolean
): T {
  //   const prevValueRef = useRef<T>(null);

  const getSnapshot = useCallback(() => {
    const newValue = selector(store.getState());

    // prevValueRef.current = newValue;
    return newValue;
  }, [selector, compare]);

  return useSyncExternalStore(store.subscribe, getSnapshot);
}
