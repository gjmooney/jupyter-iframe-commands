import { useCallback, useRef, useState } from 'react';
import ErrorDialog from './components/Error';
import InputArea from './components/InputArea';
import Instructions from './components/Instructions';
import JupyterIframe from './components/JupyterIframe';
import ListCommands from './components/ListCommands';
import ModeToggle from './components/ModeSelect';

function App() {
  const [commands, setCommands] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBridgeReady, setIsBridgeReady] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  let bridge: any;

  console.log('check');

  const getBridge = useCallback(() => {
    console.log(
      'iframeRef.current?.getBridge()',
      //@ts-expect-error w
      iframeRef.current?.getBridge()
    );
    //@ts-expect-error w
    return iframeRef.current?.getBridge();
  }, [isBridgeReady]);

  const listComms = async () => {
    // example of using method directly instead of with bridge
    //@ts-expect-error wewe
    const commands = await iframeRef.current?.listCommands();
    setCommands(commands ?? []);
    console.log('listComms', commands);
  };

  const submitCommand = async (command: string, args: string) => {
    console.log('command', command);
    console.log('args', args);

    bridge = getBridge();

    console.log('bridge', bridge);
    try {
      bridge.execute(command, args ? JSON.parse(args) : {});
    } catch (e: any) {
      setErrorMessage(e instanceof Error ? e.message : String(e));
      dialogRef.current?.showModal();
    }
  };

  return (
    <>
      <div className="demo-top">
        <button onClick={listComms}>Manual Commands</button>
        <h1>{import.meta.env.VITE_TITLE} Demo</h1>
        <div className="button-row">
          <Instructions submitCommand={submitCommand} />
          <ListCommands
            bridge={getBridge} //can pass bridge itself
            getCommands={getBridge()?.listCommands} // can pass function from bridge
            commands={getBridge()?.listCommands()} // can promise result of calling function
          />
          <ModeToggle />
        </div>
        <InputArea submitCommand={submitCommand} />
      </div>
      <JupyterIframe ref={iframeRef} onBridgeReady={setIsBridgeReady} />
      <ErrorDialog ref={dialogRef} message={errorMessage} />
    </>
  );
}

export default App;
