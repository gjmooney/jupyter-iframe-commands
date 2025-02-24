import { IJupyterInfo, jupyterInfo } from 'jupyter-iframe-commands-host';
import { useCallback, useSyncExternalStore } from 'react';

export function useGetJupyterInfo<T>(selector: (state: IJupyterInfo) => T): T {
  const getSnapshot = useCallback(() => {
    const snapshot = selector(jupyterInfo.getState());

    return snapshot;
  }, [selector]);

  return useSyncExternalStore(jupyterInfo.subscribe, getSnapshot);
}
