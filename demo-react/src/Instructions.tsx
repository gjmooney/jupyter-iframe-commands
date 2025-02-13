import { useRef } from 'react';
import './App.css';

const Instructions = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = () => {
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
        id="instructions"
        aria-label="Show instructions"
        onClick={handleOpenDialog}
      >
        <span>📖 Instructions</span>
      </button>

      <dialog ref={dialogRef}>
        <form method="dialog">
          <div>
            <h2 style={{ marginTop: 0 }}>Instructions</h2>
            <p>
              To use this demo simply enter a command in the command input and
              any arguments for that command in the args input.
            </p>
            <p>
              Click the{' '}
              <code style={{ backgroundColor: 'lightsteelblue' }}>
                List Available Commands
              </code>{' '}
              button to see a list of available commands.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.4rem',
                flexDirection: 'column',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
            >
              <p style={{ fontWeight: 'bold', padding: 0 }}>
                Some commands are listed here for convenience:
              </p>
              <div className="command-example">
                <ul
                  style={{
                    listStyleType: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    margin: 0,
                    padding: 0
                  }}
                >
                  <li>application:toggle-left-area</li>
                  <li>apputils:activate-command-palette</li>
                  <li>apputils:display-shortcuts</li>
                  <li>notebook:create-new</li>
                </ul>
              </div>
              <p style={{ fontWeight: 'bold', padding: 0 }}>
                And some with arguments:
              </p>
              <div className="command-example">
                <ul
                  style={{
                    listStyleType: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    margin: 0,
                    padding: 0
                  }}
                >
                  <li>
                    <span style={{ fontWeight: 'bold' }}>Command:</span>{' '}
                    apputils:change-theme
                  </li>
                  <li>
                    <span style={{ fontWeight: 'bold' }}>Args:</span>{' '}
                    {JSON.stringify({ theme: 'JupyterLab Light' })}
                  </li>
                  <br />
                  <li>
                    <span style={{ fontWeight: 'bold' }}>Command:</span>{' '}
                    apputils:change-theme
                  </li>
                  <li>
                    <span style={{ fontWeight: 'bold' }}>Args:</span>{' '}
                    {JSON.stringify({ theme: 'JupyterLab Dark' })}
                  </li>
                </ul>
              </div>
            </div>
            <p>
              For even more convenience you can also select a command from the
              dropdown:
            </p>
            <select id="command-select">
              <option value="">Select a command</option>
              <optgroup label="Commands">
                <option value="application:toggle-left-area">
                  Toggle Left Area
                </option>
                <option value="apputils:display-shortcuts">
                  Display Shortcuts
                </option>
                <option value="notebook:create-new">Create New Notebook</option>
              </optgroup>
              <optgroup label="Commands with Arguments">
                <option value="JupyterLab Light">Switch to Light Theme</option>
                <option value="JupyterLab Dark">Switch to Dark Theme</option>
              </optgroup>
            </select>
          </div>
          <div className="dialog-buttons">
            <button value="cancel" onClick={handleCloseDialog}>
              Cancel
            </button>
            <button value="default" id="command-select-submit">
              OK
            </button>
          </div>
        </form>
        <div
          style={{ marginTop: '1rem', fontSize: '0.8rem', textAlign: 'center' }}
        >
          Check the{' '}
          <a
            href="https://github.com/TileDB-Inc/jupyter-iframe-commands?tab=readme-ov-file#usage"
            target="_blank"
          >
            README
          </a>{' '}
          for more detailed instructions.
        </div>
      </dialog>
    </div>
  );
};

export default Instructions;
