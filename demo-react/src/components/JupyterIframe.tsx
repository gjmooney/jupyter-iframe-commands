import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { createBridge } from 'jupyter-iframe-commands-host';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface IProps {
  onBridgeReady: (value: boolean) => void;
}
const JupyterIframe = forwardRef(({ onBridgeReady }: IProps, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<ICommandBridgeRemote>(null);

  useEffect(() => {
    // ! This works in lite but not lab
    // window.document.addEventListener('myCustomEvent', handleEvent, false);
    // function handleEvent(e: any) {
    //   console.log(e.detail); // outputs: {foo: 'bar'}
    //   fetchCommands();
    // }

    // ! Works in both but idk
    window.onmessage = async e => {
      if (e.data === 'extension-loaded') {
        // alert('loaded');

        bridgeRef.current = createBridge({ iframeId: 'jupyterlab' });
        onBridgeReady(true);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getBridge: () => bridgeRef.current,
    listCommands: async () => await bridgeRef.current?.listCommands()
  }));

  return (
    <iframe
      ref={iframeRef}
      id="jupyterlab"
      src={import.meta.env.VITE_DEMO_SRC}
      sandbox="allow-scripts allow-same-origin"
      title="JupyterLab Instance"
      loading="lazy"
    ></iframe>
  );
});

export default JupyterIframe;
