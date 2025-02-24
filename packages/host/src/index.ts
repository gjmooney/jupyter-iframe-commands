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
      stateStore = { ...stateStore, isBridgeReady: val };
      // emitChange();
      listeners.forEach(listener => listener());

      console.log('stateStore', stateStore);
    },
    async kernelStatus(stat: boolean) {
      // externalStore.value = stat;
      stateStore = { ...stateStore, kernelStatus: stat };
      // emitChange();
      listeners.forEach(listener => listener());

      // console.log('stateStore', stateStore);
    }
  };

  expose(hostApi, endpoint);
}

type Listener = () => void;
type Store = { isBridgeReady: boolean; kernelStatus: boolean };

// let _kernelStatus: any;
let stateStore: Store;
const listeners = new Set<Listener>();
// let listeners: any[] = [];

export const externalStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return stateStore;
  }
};
