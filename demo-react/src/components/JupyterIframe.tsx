import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { createBridge } from 'jupyter-iframe-commands-host';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface IProps {
  iframeSrc: string;
  onBridgeReady: (value: boolean) => void;
}

const JupyterIframe = forwardRef(
  ({ iframeSrc, onBridgeReady }: IProps, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const bridgeRef = useRef<ICommandBridgeRemote>(null);

    useEffect(() => {
      window.onmessage = async e => {
        if (e.data === 'extension-loaded') {
          bridgeRef.current = createBridge({ iframeId: 'jupyterlab' });
          onBridgeReady(true);

          // Example of getting style from host page
          // iframeRef.current?.contentWindow?.postMessage(
          //   {
          //     // To differentiate from comlink messages
          //     type: 'CSS',
          //     style: getAllCss
          //   },
          //   iframeSrc
          // );
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
        src={iframeSrc}
        sandbox="allow-scripts allow-same-origin"
        title="JupyterLab Instance"
        loading="lazy"
      ></iframe>
    );
  }
);

export default JupyterIframe;
