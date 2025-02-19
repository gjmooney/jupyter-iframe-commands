import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import clipboardUrl from '../../../icons/clipboard.svg';
import redoUrl from '../../../icons/redo.svg';
import saveUrl from '../../../icons/save.svg';
import undoUrl from '../../../icons/undo.svg';
import AddCellButton from './AddCellButton';
import AvailableCommands from './AvailableCommands';
import './fileMenuBar.css';
interface IFileMenuBarProps {
  bridge: () => ICommandBridgeRemote;
  submitCommand: (command: string, args: string) => void;
}

const FileMenuBar = ({ bridge, submitCommand }: IFileMenuBarProps) => {
  // useEffect(() => {
  //   const list = async () => {
  //     const commands = await bridge().listCommands();
  //     console.log('commands', commands);
  //   };
  //   list();
  // }, [bridge]);

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

  return (
    <div className="file-menu-bar-container">
      <div className="file-menu-bar-commands">
        <AddCellButton submitCommand={submitCommand} />
        <button onClick={handleSave}>
          <img src={saveUrl} />
        </button>
        <button onClick={handleUndo}>
          <img src={undoUrl} />
        </button>
        <button onClick={handleRedo}>
          <img src={redoUrl} />
        </button>
        <button>
          <img src={clipboardUrl} />
        </button>
        <AvailableCommands bridge={bridge} />
      </div>

      <div className="file-menu-bar-buttons">
        <button>run</button>
        <button>kernel</button>
      </div>
    </div>
  );
};

export default FileMenuBar;
