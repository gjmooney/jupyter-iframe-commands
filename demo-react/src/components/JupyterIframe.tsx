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
    // from MDN
    const getAllCss = [...document.styleSheets]
      .map(styleSheet => {
        try {
          return [...styleSheet.cssRules].map(rule => rule.cssText).join('');
        } catch (e) {
          console.log(
            'Access to stylesheet %s is denied. Ignoring…',
            styleSheet.href
          );
        }
      })
      .filter(Boolean)
      .join('\n');

    window.onmessage = async e => {
      if (e.data === 'extension-loaded') {
        bridgeRef.current = createBridge({ iframeId: 'jupyterlab' });
        onBridgeReady(true);

        // Example of getting style from host page
        iframeRef.current?.contentWindow?.postMessage(
          {
            // To differentiate from comlink messages
            type: 'CSS',
            style: getAllCss
          },
          import.meta.env.VITE_DEMO_SRC
        );
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
