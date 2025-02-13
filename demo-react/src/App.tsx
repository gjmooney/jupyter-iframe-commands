import { createBridge } from 'jupyter-iframe-commands-host';
import { useEffect, useState } from 'react';
import Instructions from './Instructions';
import JupyterIframe from './JupyterIframe';
import ListCommands from './ListCommands';

function App() {
  const commandBridge = createBridge({ iframeId: 'jupyterlab' });

  const [commands, setCommands] = useState<string[]>([]);

  useEffect(() => {
    const fetchCommands = async () => {
      const commands = await commandBridge.listCommands();
      commands.sort();

      console.log('commands', commands);

      setCommands(commands);
    };

    fetchCommands();
  }, []);

  return (
    <>
      <div className="demo-top">
        {/* <button onClick={fetchCommands}>SODSOD</button> */}
        <h1>{import.meta.env.VITE_TITLE} Demo</h1>
        <div className="button-row">
          <Instructions commandBridge={commandBridge} />
          {/* <button id="list-commands" aria-label="Show available commands">
            List Available Commands
          </button> */}
          <ListCommands commands={commands} />
          <div className="mode-toggle">
            <label>
              <input type="radio" name="mode" value="lab" checked />
              <span>JupyterLab</span>
            </label>
            <label>
              <input type="radio" name="mode" value="notebook" />
              <span>Jupyter Notebook</span>
            </label>
          </div>
        </div>
        <div className="input-area">
          <form id="commands" autoComplete="off">
            <input
              type="text"
              name="command"
              placeholder="Enter a command"
              aria-label="Command input"
              required
            />
            <input
              type="text"
              name="args"
              placeholder="Enter args (optional)"
              aria-label="Command arguments"
            />
            <button type="submit">Submit Command</button>
          </form>
        </div>
      </div>
      <JupyterIframe />
    </>
  );
}

export default App;
