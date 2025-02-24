// Copyright (c) TileDB, Inc.
// Distributed under the terms of the Modified BSD License.
import { expose, windowEndpoint, wrap } from 'comlink';
import { ICommandBridgeRemote } from 'jupyter-iframe-commands';

type Listener = () => void;
export interface IJupyterInfo {
  isBridgeReady: boolean;
  kernelInfo: {
    kernelName: string;
    isKernelBusy: boolean;
  };
}

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

/**
 * Define host package api and expose it to Jupyter extension
 */
export function exposeApi({ iframeId }: { iframeId: string }) {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;

  if (!iframe.contentWindow) {
    return;
  }
  const endpoint = windowEndpoint(iframe.contentWindow);
  const hostApi = {
    async setReady(val: boolean) {
      jupyterInfo.setState({ isBridgeReady: val });
    },
    async kernelStatus(displayName: string, stat: boolean) {
      jupyterInfo.setState({
        kernelInfo: { kernelName: displayName, isKernelBusy: stat }
      });
    }
  };

  expose(hostApi, endpoint);
}

// Create observable state for consuming app to subscribe to
let jupyterInfoState = {
  isBridgeReady: false,
  kernelInfo: {
    kernelName: 'Loading...',
    isKernelBusy: false
  }
};

const listeners = new Set<Listener>();
export const jupyterInfo = {
  getState() {
    return jupyterInfoState;
  },

  setState(newState: Partial<IJupyterInfo>) {
    const mergedState = { ...jupyterInfoState, ...newState };

    jupyterInfoState = mergedState;
    listeners.forEach(listener => listener());
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
