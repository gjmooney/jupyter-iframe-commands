import { useCallback, useEffect, useRef, useState } from 'react';

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
      <button onClick={toggleMenu}>+</button>
      {isMenuOpen && (
        <div className="file-menu-popover">
          <div
            style={{ padding: '8px 12px', cursor: 'pointer' }}
            onClick={() => handleOptionClick('code')}
          >
            <div className="file-menu-button-text">
              <label>Code</label>
              <span>Insert an executable code cell</span>
            </div>
          </div>
          <div
            style={{ padding: '8px 12px', cursor: 'pointer' }}
            onClick={() => handleOptionClick('markdown')}
          >
            <div className="file-menu-button-text">
              <label>Markdown</label>
              <span>Insert a markdown cell</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCellButton;
