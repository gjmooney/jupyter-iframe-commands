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

    const exportCss = () => {
      const command = 'jupyter-import-css';
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

      const parsedCSS = getAllCss.replace(/'/g, '"');

      bridgeRef.current?.execute(command, { parsedCSS });
    };

    useEffect(() => {
      window.onmessage = async e => {
        if (e.data === 'extension-loaded') {
          bridgeRef.current = createBridge({ iframeId: 'jupyterlab' });
          onBridgeReady(true);
          exportCss();
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
        style={{ margin: '0 1rem' }}
      ></iframe>
    );
  }
);

export default JupyterIframe;
