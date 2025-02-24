import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { useEffect, useState } from 'react';
import { useStore } from './useJupyterStuff';

interface IKernelInfoProps {
  bridge: () => ICommandBridgeRemote;
}

const KernelInfo = ({ bridge }: IKernelInfoProps) => {
  const [kernelName, setKernelName] = useState('Loading...');
  const [className, setClassName] = useState('idle');

  // const externalValue = useSyncExternalStore(
  //   externalStore.subscribe,
  //   externalStore.getSnapshot
  // );

  const kernelStatus = useStore(state => state.kernelStatus);
  const bridgeReady = useStore(state => state.isBridgeReady);

  useEffect(() => {
    console.log('externalValue status', kernelStatus);
    setClassName(kernelStatus ? 'busy' : 'idle');
  }, [kernelStatus]);

  useEffect(() => {
    const getKernelName = async () => {
      const displayName = await bridge().getKernelDisplayName();
      setKernelName(displayName);
    };

    if (bridgeReady) {
      getKernelName();
    }
  }, [bridgeReady]);

  const handleClick = async () => {
    bridge().execute('notebook:change-kernel', {});
  };

  return (
    <div className="notebook-extra-actions">
      <div className="kernel-info-and-actions">
        <button className="kernel-button" onClick={handleClick}>
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
