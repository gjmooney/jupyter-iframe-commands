import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import clipboardUrl from '../../../icons/clipboard.svg';
import redoUrl from '../../../icons/redo.svg';
import saveUrl from '../../../icons/save.svg';
import undoUrl from '../../../icons/undo.svg';
import AddCellButton from './AddCellButton';
import AvailableCommands from './AvailableCommands';
import KernelInfo from './KernelInfo';
import RunButton from './RunButton';
import './fileMenuBar.css';
interface IFileMenuBarProps {
  bridge: () => ICommandBridgeRemote;
  submitCommand: (command: string, args: string) => void;
}

const FileMenuBar = ({ bridge, submitCommand }: IFileMenuBarProps) => {
  const handleSave = () => {
    console.log('saving');
    submitCommand('docmanager:save', '');
  };

  const handleUndo = () => {
    // ? cell action or no cell action?
    submitCommand('notebook:undo-cell-action', '');
  };

  const handleRedo = () => {
    // ? cell action or no cell action?
    submitCommand('notebook:redo-cell-action', '');
  };

  const handlePaste = () => {
    submitCommand('notebook:paste-cell-below', '');
  };

  return (
    <div className="file-menu-bar-container">
      <div className="file-menu-bar-wrapper">
        <div className="file-menu-bar-commands">
          <AddCellButton submitCommand={submitCommand} />
          <button onClick={handleSave}>
            <div className="button-name">
              <img src={saveUrl} />
            </div>
          </button>
          <button onClick={handleUndo}>
            <div className="button-name">
              <img src={undoUrl} />
            </div>
          </button>
          <button onClick={handleRedo}>
            <div className="button-name">
              <img src={redoUrl} />
            </div>
          </button>
          <button onClick={handlePaste}>
            <div className="button-name">
              <img src={clipboardUrl} />
            </div>
          </button>
          <AvailableCommands bridge={bridge} />
        </div>

        <div className="file-menu-bar-buttons">
          <RunButton submitCommand={submitCommand} />
          <KernelInfo bridge={bridge} />
        </div>
      </div>
    </div>
  );
};

export default FileMenuBar;
