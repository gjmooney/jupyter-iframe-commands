// import { createBridge } from 'jupyter-iframe-commands-host';
import { useRef, useState } from 'react';

interface IListCommandsProps {
  commands: string[];
  bridge?: any;
  getCommands: () => void;
}

const ListCommands = ({
  commands,
  bridge,
  getCommands
}: IListCommandsProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [comms, setComms] = useState<string[]>([]);
  console.log('bridge in list', bridge()?.listCommands());

  console.log('commands prom', commands);

  const handleOpenDialog = async () => {
    const fromBridge = await bridge().listCommands();
    setComms(fromBridge);

    const dd = await getCommands();
    console.log('dd', dd);
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
          {comms.map(command => {
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
