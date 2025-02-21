import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { useEffect, useState } from 'react';

interface IKernelInfoProps {
  bridge: () => ICommandBridgeRemote;
}

const KernelInfo = ({ bridge }: IKernelInfoProps) => {
  const [bridgeReady, setBridgeReady] = useState(false);
  const [kernelName, setKernelName] = useState('Loading...');
  const [className, setClassName] = useState('idle');

  useEffect(() => {
    window.addEventListener('message', e => {
      if (e.data === 'extension-loaded') {
        console.log('check');
      }

      if (e.data.id === 'kernel-status') {
        setClassName(e.data.isBusy ? 'busy' : 'idle');
        setBridgeReady(true);
      }
    });
  }, []);

  useEffect(() => {
    const getKernelName = async () => {
      const displayName = await bridge().getKernelDisplayName();

      setKernelName(displayName);
    };

    if (bridgeReady) {
      getKernelName();
    }
  }, [bridgeReady]);

  const onClik = async () => {
    const lll = await bridge().getKernelDisplayName();
    setKernelName(lll);
    console.log('lll', lll);
  };

  return (
    <div className="notebook-extra-actions">
      <div className="kernel-info-and-actions">
        <button className="kernel-button" onClick={onClik}>
          <span className={`indicator ${className}`}>
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2.66699"
                y="3.16666"
                width="10.6667"
                height="10.6667"
                rx="5.33333"
                fill="#F2F6F8"
              />
              <rect
                x="5.33398"
                y="5.83331"
                width="5.33333"
                height="5.33333"
                rx="2.66667"
                fill="#B3C4D8"
              />
            </svg>
          </span>
          <span className="kernel-text">
            <span>{kernelName}</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default KernelInfo;
