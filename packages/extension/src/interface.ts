import { ReadonlyPartialJSONObject } from '@lumino/coreutils';

/**
 * Represents a remote command bridge interface.
 *
 * This interface provides a standardized way to interact with a Jupyter environment contained in an iframe.
 */
export interface ICommandBridgeRemote {
  /**
   * Executes a command with the given arguments.
   *
   * @param command - The name of the command to execute.
   * @param args - An object containing arguments for the command.
   */
  execute(command: string, args: ReadonlyPartialJSONObject): void;

  /**
   * Lists all available commands.
   *
   * @returns An array of strings representing the names of all available commands.
   */
  listCommands(): Promise<string[]>;

  /**
   * Get the display name of the active kernel
   *
   * @returns A string representing the names of the active kernel.
   */
  getKernelDisplayName(): Promise<string>;
}
