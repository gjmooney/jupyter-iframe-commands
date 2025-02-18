import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { useCallback, useRef, useState } from 'react';
import ErrorDialog from './components/Error';
import InputArea from './components/InputArea';
import Instructions from './components/Instructions';
import JupyterIframe from './components/JupyterIframe';
import ListCommands from './components/ListCommands';
import ModeToggle from './components/ModeToggle';

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isBridgeReady, setIsBridgeReady] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getBridge = useCallback((): ICommandBridgeRemote => {
    //@ts-expect-error wip
    return iframeRef.current?.getBridge();
  }, [isBridgeReady]);

  const submitCommand = async (command: string, args: string) => {
    const bridge = getBridge();

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
        <h1>{import.meta.env.VITE_TITLE} Demo</h1>
        <div className="button-row">
          <Instructions submitCommand={submitCommand} />
          <ListCommands
            bridge={getBridge} //can pass bridge itself
            apiFunction={getBridge()?.listCommands} // can pass function from bridge
          />
          {/* <CssLoader submitCommand={submitCommand} /> */}
          <ModeToggle />
        </div>
        <InputArea submitCommand={submitCommand} />
      </div>
      <JupyterIframe
        ref={iframeRef}
        iframeSrc={import.meta.env.VITE_DEMO_SRC}
        onBridgeReady={setIsBridgeReady}
      />
      <ErrorDialog ref={dialogRef} message={errorMessage} />
    </>
  );
}

export default App;
