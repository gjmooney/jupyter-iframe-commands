import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { createBridge, exposeApi } from 'jupyter-iframe-commands-host';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useGetJupyterInfo } from './FileMenuBar/useGetJupyterInfo';

interface IProps {
  iframeSrc: string;
}

const JupyterIframe = forwardRef(({ iframeSrc }: IProps, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<ICommandBridgeRemote>(null);

  const isBridgeReady = useGetJupyterInfo(state => state.isBridgeReady);

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
    exposeApi({ iframeId: 'jupyterlab' });
  }, []);

  useEffect(() => {
    if (isBridgeReady) {
      bridgeRef.current = createBridge({ iframeId: 'jupyterlab' });
      exportCss();
    }
  }, [isBridgeReady]);

  useImperativeHandle(ref, () => ({
    getBridge: () => bridgeRef.current,
    listCommands: async () => await bridgeRef.current?.listCommands()
  }));

  return (
    <>
      <iframe
        ref={iframeRef}
        id="jupyterlab"
        src={iframeSrc}
        sandbox="allow-scripts allow-same-origin"
        title="JupyterLab Instance"
        loading="lazy"
      ></iframe>
    </>
  );
});

export default JupyterIframe;
