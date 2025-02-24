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
    async kernelStatus(stat: boolean) {
      externalStore.value = stat;
    }
  };

  expose(hostApi, endpoint);
}

type Listener = () => void;

let _externalValue: any;
const listeners = new Set<Listener>();

export const externalStore = {
  get value() {
    return _externalValue;
  },
  set value(newValue: any) {
    _externalValue = newValue;
    listeners.forEach(listener => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
