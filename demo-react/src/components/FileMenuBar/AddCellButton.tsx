import { useCallback, useEffect, useRef, useState } from 'react';
import codeUrl from '../../../icons/code.svg';
import markdownUrl from '../../../icons/markdown.svg';
import plusUrl from '../../../icons/plus.svg';
import PopoverListItem from './PopoverListItem';

interface IAddCellButtonProps {
  submitCommand: (command: string, args: string) => void;
}

const AddCellButton = ({ submitCommand }: IAddCellButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu if clicking outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    // Attach the event listener when the menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener on unmount or when the menu is closed
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleOptionClick = useCallback((option: string) => {
    console.log(`${option} option clicked`);
    setIsMenuOpen(false); // Optionally close the menu after clicking an option

    submitCommand('notebook:select-all', '');
    submitCommand('notebook:insert-cell-below', '');
    submitCommand(`notebook:change-cell-to-${option}`, '');
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button onClick={toggleMenu}>
        <img src={plusUrl} />
      </button>

      {isMenuOpen && (
        <div className="file-menu-popover">
          <div className="file-menu-popover-2">
            <PopoverListItem
              label="Code"
              content="Insert an executable code cell"
              iconUrl={codeUrl}
              handleOptionClick={handleOptionClick}
            />
            <PopoverListItem
              label="Markdown"
              content="Insert a markdown cell"
              iconUrl={markdownUrl}
              handleOptionClick={handleOptionClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCellButton;
