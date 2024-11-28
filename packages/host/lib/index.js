// Copyright (c) TileDB, Inc.
// Distributed under the terms of the Modified BSD License.
import { windowEndpoint, wrap } from 'comlink';
/**
 * A bridge to expose actions on JupyterLab commands.
 */
export class CommandBridge {
    constructor(iframeId, options) {
        this._commands = (options === null || options === void 0 ? void 0 : options.commands) || 'test';
        if (!window.parent) {
            console.log('Host window not found');
            return;
        }
        this._endpoint = windowEndpoint(window.parent);
        this._commandBridge = wrap(this._endpoint);
        // For demo purposes for now, and to make it easier to test the commands
        // via the dev tools
        window.commandBridge = this._commandBridge;
    }
    async execute(command, args) {
        return this._commands.execute(command, args);
    }
    async listCommands() {
        return this._commands.listCommands();
    }
    async test() {
        return 'this is a test';
    }
}
