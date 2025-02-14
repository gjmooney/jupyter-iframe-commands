import { FormEvent, useState } from 'react';

interface InputAreaProps {
  submitCommand: (command: string, args: string) => void;
}

const InputArea = ({ submitCommand }: InputAreaProps) => {
  const [command, setCommand] = useState('');
  const [args, setArgs] = useState('');

  const cumFart = async (e: FormEvent) => {
    e.preventDefault();

    // Single quotes cause an error
    submitCommand(command, args.replace(/'/g, '"'));
  };

  return (
    <div className="input-area">
      <form id="commands" autoComplete="off">
        <input
          type="text"
          name="command"
          placeholder="Enter a command"
          aria-label="Command input"
          onChange={e => {
            setCommand(e.target.value);
          }}
          required
        />
        <input
          type="text"
          name="args"
          placeholder="Enter args (optional)"
          aria-label="Command arguments"
          onChange={e => {
            setArgs(e.target.value);
          }}
        />
        <button type="submit" onClick={cumFart}>
          Submit Command
        </button>
      </form>
    </div>
  );
};

export default InputArea;
