import { forwardRef, useImperativeHandle, useRef } from 'react';

interface IErrorProps {
  message: string;
}

const ErrorDialog = forwardRef(({ message }: IErrorProps, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close()
  }));

  return (
    <dialog ref={dialogRef}>
      <form method="dialog">
        <h2 style={{ margin: 0, color: '#ED4337' }}>⚠ Error</h2>
        <div id="error-dialog">
          <code>{message}</code>
        </div>
        <div className="dialog-buttons">
          <button
            className="demo-button"
            value="close"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
});

export default ErrorDialog;
