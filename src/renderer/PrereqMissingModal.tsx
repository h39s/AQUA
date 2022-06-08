import './Modal.css';

interface IPrereqMissingModalProps {
  isLoading: boolean;
  errorMsg: string;
  actionMsg: string;
  onRetry: () => void;
}

export default function PrereqMissingModal({
  isLoading,
  errorMsg,
  actionMsg,
  onRetry,
}: IPrereqMissingModalProps) {
  const handleClose = async () => {
    window.electron.ipcRenderer.closeApp();
  };

  return (
    <div className="modal col">
      <div className="modal-content">
        <h1 className="header">Prerequisite Missing</h1>
        <div className="body">
          <p>
            {errorMsg} {actionMsg}
          </p>
        </div>
        <div className="footer row">
          <button
            type="button"
            disabled={isLoading}
            className="close"
            onClick={onRetry}
          >
            Retry
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="close"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
