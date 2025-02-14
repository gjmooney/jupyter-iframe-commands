// import { createBridge } from 'jupyter-iframe-commands-host';
import { useRef } from 'react';

interface IListCommandsProps {
  commands: string[];
}

const ListCommands = ({ commands }: IListCommandsProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = async () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <div>
      <button
        id="list-commands"
        aria-label="Show available commands"
        onClick={handleOpenDialog}
      >
        List Available Commands
      </button>

      <dialog ref={dialogRef}>
        <h2 style={{ marginTop: 0 }}>Available Commands</h2>
        <div id="commands-list">
          {commands.map(command => {
            return <div key={command}>{command}</div>;
          })}
        </div>
        <div className="dialog-buttons">
          <button value="close" onClick={handleCloseDialog}>
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ListCommands;
