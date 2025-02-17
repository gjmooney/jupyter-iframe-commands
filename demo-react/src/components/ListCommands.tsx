// import { createBridge } from 'jupyter-iframe-commands-host';
import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { useRef, useState } from 'react';

interface IListCommandsProps {
  bridge: () => ICommandBridgeRemote;
  apiFunction: () => Promise<string[]>;
}

const ListCommands = ({ bridge, apiFunction }: IListCommandsProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [commands, setCommands] = useState<string[]>([]);

  const handleOpenDialog = async () => {
    const fromBridge = await bridge().listCommands();
    console.log('fromBridge', fromBridge);

    const fromFunction = await apiFunction();
    console.log('fromFunction', fromFunction);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    setCommands(fromFunction);
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
