import { ICommandBridgeRemote } from 'jupyter-iframe-commands';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import plusUrl from '../../../icons/keyboard.svg';

interface IAvailableCommandsProps {
  items?: string[];
  bridge: () => ICommandBridgeRemote;
}

// type CommandOption = { label: string; command: string };
const commandList = [
  { label: 'Create new notebook...', command: 'notebook:create-new' },
  { label: 'Open terminal...', command: 'terminal:create-new' },
  { label: 'Undo last operation', command: 'notebook:undo' },
  { label: 'Redo last operation...', command: 'notebook:redo' },
  { label: 'Run selected cell', command: 'notebook:run-cell-and-select-next' },
  { label: 'Run all blocks', command: 'notebook:run-all-cells' },
  { label: 'Restart Kernel', command: 'notebook:restart-kernel' },
  {
    label: 'Restart kernel and clear all outputs',
    command: 'notebook:restart-clear-output'
  },
  { label: 'Add code block below', command: 'notebook:insert-cell-below' },
  { label: 'Add code block above', command: 'notebook:insert-cell-above' }
];

const AvailableCommands = ({ bridge }: IAvailableCommandsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  //   const [availableCommands, setAvailableCommands] =
  //     useState<CommandOption[]>(commandList);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const toggleMenu = useCallback(async (): Promise<void> => {
    setIsMenuOpen(prev => !prev);

    // ? Fetch available commands
    // const list = await bridge().listCommands();
    // setAvailableCommands(list.sort());
  }, []);

  // Handle option click
  const handleOptionClick = useCallback((option: string): void => {
    console.log(`${option} option clicked`);
    setIsMenuOpen(false);
    setSearchQuery(''); // Reset search query after selection
    bridge().execute(option, {});
  }, []);

  // Update the search query as the user types
  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Close the dropdown when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Filter items based on the search query
  const filteredItems = commandList.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button onClick={toggleMenu}>
        <img src={plusUrl} />
      </button>
      {isMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '8px',
            marginTop: '4px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            width: '320px',
            borderRadius: 8
          }}
        >
          {/* Search bar */}
          <input
            type="text"
            placeholder="Type to search available commands"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '4px',
              marginBottom: '8px',
              boxSizing: 'border-box'
            }}
          />
          {/* Render filtered options */}
          {filteredItems.map(option => (
            <div
              key={option.command}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
              onClick={() => handleOptionClick(option.command)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCommands;
