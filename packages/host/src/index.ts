// Copyright (c) TileDB, Inc.
// Distributed under the terms of the Modified BSD License.
import { expose, windowEndpoint, wrap } from 'comlink';
import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
/**
 * A bridge to expose actions on JupyterLab commands.
 */
export function createBridge({ iframeId }: { iframeId: string }) {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;

  if (!iframe) {
    throw new Error(
      `Cannot create bridge: iframe with id "${iframeId}" not found`
    );
  }

  if (!iframe.contentWindow) {
    throw new Error(
      `Cannot create bridge: iframe with id "${iframeId}" has no content window`
    );
  }

  return wrap<ICommandBridgeRemote>(windowEndpoint(iframe.contentWindow));
}

export function exposeApi({ iframeId }: { iframeId: string }) {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;

  if (!iframe.contentWindow) {
    return;
  }
  const endpoint = windowEndpoint(iframe.contentWindow);
  const hostApi = {
    async setReady(val: boolean) {
      // externalStore.value = stat;
      // stateStore = { ...stateStore, isBridgeReady: val };
      store.setState({ isBridgeReady: val });
      // emitChange();
      // listeners.forEach(listener => listener());

      console.log('stateStore', store.getState());
    },
    async kernelStatus(stat: boolean) {
      // externalStore.value = stat;
      // stateStore = { ...stateStore, kernelStatus: stat };
      store.setState({ kernelStatus: stat });
      // emitChange();

      // listeners.forEach(listener => listener());

      // console.log('stateStore', stateStore);
    }
  };

  expose(hostApi, endpoint);
}

type Listener = () => void;
export type StoreState = { isBridgeReady: boolean; kernelStatus: boolean };

let state = {
  isBridgeReady: false,
  kernelStatus: false
};
const listeners = new Set<Listener>();
export const store = {
  getState() {
    return state;
  },

  setState(newState: Partial<StoreState>) {
    const mergedState = { ...state, ...newState };

    state = mergedState;
    listeners.forEach(listener => listener());
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  shallowEqual(a: StoreState, b: StoreState) {
    const keys = Object.keys(a) as (keyof StoreState)[];
    return keys.every(key => a[key] === b[key]);
  }
};
