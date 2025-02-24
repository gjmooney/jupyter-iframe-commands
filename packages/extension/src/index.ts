// Copyright (c) TileDB, Inc.
// Distributed under the terms of the Modified BSD License.

import {
  ILabStatus,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ReadonlyPartialJSONObject } from '@lumino/coreutils';
import { expose, windowEndpoint, wrap } from 'comlink';
import { ICommandBridgeRemote } from './interface';

/**
 * A plugin to expose an API for interacting with JupyterLab from a parent page.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-iframe-commands:plugin',
  autoStart: true,
  description:
    'A plugin to expose an API for interacting with JupyterLab from a parent page.',
  requires: [ILabStatus, INotebookTracker],
  optional: [ISettingRegistry],
  activate: async (
    app: JupyterFrontEnd,
    labStatus: ILabStatus,
    tracker: INotebookTracker,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log('JupyterLab extension jupyter-iframe-commands is activated!');
    const { commands } = app;

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log(
            'jupyter-iframe-commands settings loaded:',
            settings.composite
          );
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for jupyter-iframe-commands.',
            reason
          );
        });
    }

    const api: ICommandBridgeRemote = {
      async execute(command: string, args: ReadonlyPartialJSONObject) {
        await commands.execute(command, args);
      },
      async listCommands() {
        return commands.listCommands();
      },
      async getKernelDisplayName() {
        const kernel = await commands.execute('notebook:get-kernel', {});
        const spec = await kernel.spec;

        return await spec.display_name;
      }
    };

    labStatus.busySignal.connect(async () => {
      await host.kernelStatus(labStatus.isBusy);
    });

    const endpoint = windowEndpoint(self.parent);
    const host = wrap<any>(endpoint); // TODO: fix typings?

    expose(api, endpoint);

    //TODO targetOrigin should be host page
    window.parent?.postMessage('extension-loaded', '*');
  }
};

export default plugin;
export * from './interface';
