import { createBridge } from 'jupyter-iframe-commands-host';
import { useEffect, useState } from 'react';
import Instructions from './Instructions';
import JupyterIframe from './JupyterIframe';
import ListCommands from './ListCommands';
import ModeToggle from './ModeSelect';

function App() {
  const [commands, setCommands] = useState<string[]>([]);
  const [commandBridge, setCommandBridge] = useState<any>();

  useEffect(() => {
    window.onmessage = e => {
      if (e.data === 'extension-loaded') {
        // alert('got message');
        fetchCommands();
      }
    };

    /**
     * This works in lite but not lab
     */
    // window.document.addEventListener('myCustomEvent', handleEvent, false);
    // function handleEvent(e: any) {
    //   console.log(e.detail); // outputs: {foo: 'bar'}
    //   fetchCommands();
    // }
  }, []);

  const fetchCommands = async () => {
    const commandBridge = createBridge({ iframeId: 'jupyterlab' });
    const commands = await commandBridge.listCommands();
    commands.sort();

    console.log('commands', commands);
    setCommandBridge(commandBridge);
    setCommands(commands);
  };

  return (
    <>
      <div className="demo-top">
        {/* <button onClick={fetchCommands}>SODSOD</button> */}
        <h1>{import.meta.env.VITE_TITLE} Demo</h1>
        <div className="button-row">
          <Instructions />
          <ListCommands commands={commands} />
          <ModeToggle />
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
