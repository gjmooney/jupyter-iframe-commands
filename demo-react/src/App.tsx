import { createBridge } from 'jupyter-iframe-commands-host';
import { useRef, useState } from 'react';
import ErrorDialog from './components/Error';
import InputArea from './components/InputArea';
import Instructions from './components/Instructions';
import JupyterIframe from './components/JupyterIframe';
import ListCommands from './components/ListCommands';
import ModeToggle from './components/ModeSelect';

function App() {
  const [commands, setCommands] = useState<string[]>([]);
  const [commandBridge, setCommandBridge] = useState<any>();
  const [errorMessage, setErrorMessage] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  // useEffect(() => {
  //   window.onmessage = e => {
  //     if (e.data === 'extension-loaded') {
  //       fetchCommands();
  //     }
  //   };

  //   /**
  //    * This works in lite but not lab
  //    */
  //   // window.document.addEventListener('myCustomEvent', handleEvent, false);
  //   // function handleEvent(e: any) {
  //   //   console.log(e.detail); // outputs: {foo: 'bar'}
  //   //   fetchCommands();
  //   // }
  // }, []);

  async function init() {
    const commandBridge = createBridge({ iframeId: 'jupyterlab' });
    const commands = await commandBridge.listCommands();
    commands.sort();

    commandBridge.execute(
      'apputils:change-theme',
      JSON.parse('{"theme":"JupyterLab Light"}')
    );
    console.log('commands', commands);
    // causes TypeError: rawValue.apply is not a function
    // setCommandBridge(commandBridge);
    // setCommands(commands);
  }

  // const fetchCommands = async () => {
  //   const commandBridge = createBridge({ iframeId: 'jupyterlab' });
  //   const commands = await commandBridge.listCommands();
  //   commands.sort();

  //   console.log('commands', commands);
  //   setCommandBridge(commandBridge);
  //   setCommands(commands);
  // };

  const submitCommand = async (command: string, args: string) => {
    console.log('command', command);
    console.log('args', args);

    try {
      // await commandBridge.execute(command, args ? JSON.parse(args) : {});
    } catch (e: any) {
      setErrorMessage(e instanceof Error ? e.message : String(e));
      dialogRef.current?.showModal();
    }
  };

  return (
    <>
      <div className="demo-top">
        <button onClick={init}>INIT</button>
        <h1>{import.meta.env.VITE_TITLE} Demo</h1>
        <div className="button-row">
          <Instructions submitCommand={submitCommand} />
          <ListCommands commands={commands} />
          <ModeToggle />
        </div>
        <InputArea submitCommand={submitCommand} />
      </div>
      <JupyterIframe />
      <ErrorDialog ref={dialogRef} message={errorMessage} />
    </>
  );
}

export default App;
