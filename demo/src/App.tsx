import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { useCallback, useRef, useState } from 'react';
import ErrorDialog from './components/Error';
import FileMenuBar from './components/FileMenuBar/FileMenuBar';
import { useGetJupyterInfo } from './components/FileMenuBar/useGetJupyterInfo';
import InputArea from './components/InputArea';
import Instructions from './components/Instructions';
import JupyterIframe from './components/JupyterIframe';
import ListCommands from './components/ListCommands';
import ModeToggle from './components/ModeToggle';
import NoteBookBrowser from './components/NoteBookBrowser';

function App() {
  const [errorMessage, setErrorMessage] = useState('');

  const dialogRef = useRef<HTMLDialogElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isBridgeReady = useGetJupyterInfo(state => state.isBridgeReady);

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
          <NoteBookBrowser />
          <ModeToggle />
        </div>
        <InputArea submitCommand={submitCommand} />
      </div>
      <div className="iframe-container">
        <FileMenuBar bridge={getBridge} submitCommand={submitCommand} />
        <JupyterIframe
          ref={iframeRef}
          iframeSrc={import.meta.env.VITE_DEMO_SRC}
        />{' '}
      </div>

      <ErrorDialog ref={dialogRef} message={errorMessage} />
    </>
  );
}

export default App;
