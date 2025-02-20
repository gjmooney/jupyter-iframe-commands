import { useCallback, useEffect, useRef, useState } from 'react';
import arrowDownUrl from '../../../icons/arrowDown.svg';
import playUrl from '../../../icons/play.svg';

interface IRunButtonProps {
  submitCommand: (command: string, args: string) => void;
}

const popoverOptions = [
  { label: 'Run all', command: 'notebook:run-all-cells' },
  { label: 'Run selected cell', command: 'notebook:run-cell-and-select-next' },
  {
    label: 'Run from selected cell and above',
    command: 'notebook:run-all-above'
  },
  {
    label: 'Run from selected cell and below',
    command: 'notebook:run-all-below'
  }
];
const RunButton = ({ submitCommand }: IRunButtonProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle the popover menu on right half click
  const togglePopover = useCallback(() => {
    setIsPopoverOpen(prev => !prev);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const handleOptionClick = useCallback((option: string): void => {
    console.log(`${option} option clicked`);
    setIsPopoverOpen(false);
    submitCommand(option, '');
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-flex', position: 'relative' }}
    >
      <div className="buttons-grouped">
        {/* Left Button */}
        <button
          onClick={() => handleOptionClick('notebook:run-all-cells')}
          className="left-half"
        >
          <div className="button-name">
            <img src={playUrl} />
          </div>
          <span>Run</span>
        </button>

        {/* Right Button */}
        <button onClick={togglePopover} className="right-half">
          <div className="button-name">
            <img src={arrowDownUrl} />
          </div>
        </button>
      </div>

      {/* Popover Menu */}
      {isPopoverOpen && (
        <div
          className="available-commands-popover"
          style={{ left: 'unset', right: '0', alignItems: 'flex-end' }}
        >
          <div className="filter-pop-overs">
            {popoverOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  handleOptionClick(option.command);
                  setIsPopoverOpen(false);
                }}
                className="popover-list-item"
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RunButton;
