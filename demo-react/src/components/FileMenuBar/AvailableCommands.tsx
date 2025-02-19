import { useCallback, useEffect, useRef, useState } from 'react';

const AvailableCommands = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const options: string[] = ['New', 'Open', 'Save'];

  // Toggle dropdown visibility
  const toggleDropdown = useCallback((): void => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Handle selection of an option
  const handleOptionClick = useCallback((option: string): void => {
    setSelectedOption(option);
    console.log(`${option} option clicked`);
    setIsDropdownOpen(false);
  }, []);

  // Close dropdown if clicking outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '200px'
      }}
    >
      <div
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: '#fff'
        }}
      >
        <input
          type="text"
          value={selectedOption}
          onChange={e => setSelectedOption(e.target.value)}
          placeholder="Select an option"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            cursor: 'pointer'
          }}
          readOnly
        />
        <span style={{ marginLeft: '8px' }}>&#9660;</span>
      </div>

      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
            zIndex: 1000
          }}
        >
          {options.map(option => (
            <div
              key={option}
              style={{
                padding: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCommands;
