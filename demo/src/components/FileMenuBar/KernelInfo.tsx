import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { useEffect, useState } from 'react';
import { useGetJupyterInfo } from './useGetJupyterInfo';

interface IKernelInfoProps {
  bridge: () => ICommandBridgeRemote;
}

const KernelInfo = ({ bridge }: IKernelInfoProps) => {
  const [kernelName, setKernelName] = useState('');
  const [className, setClassName] = useState('idle');

  const kernelInfo = useGetJupyterInfo(state => state.kernelInfo);

  useEffect(() => {
    setClassName(kernelInfo.isKernelBusy ? 'busy' : 'idle');
    setKernelName(kernelInfo.kernelName);
  }, [kernelInfo]);

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
