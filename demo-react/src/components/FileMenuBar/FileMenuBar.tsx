import AddCellButton from './AddCellButton';
import AvailableCommands from './AvailableCommands';
import './fileMenuBar.css';

interface IFileMenuBarProps {
  submitCommand: (command: string, args: string) => void;
}

const FileMenuBar = ({ submitCommand }: IFileMenuBarProps) => {
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
        <button onClick={handleSave}>save</button>
        <button onClick={handleUndo}>undo</button>
        <button onClick={handleRedo}>redo</button>
        <button>paste</button>
        <AvailableCommands />
      </div>

      <div className="file-menu-bar-buttons">
        <button>run</button>
        <button>kernel</button>
      </div>
    </div>
  );
};

export default FileMenuBar;
