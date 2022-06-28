import Button from './Button';
import './styles/Modal.scss';

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
          <Button
            ariaLabel="Retry"
            isDisabled={isLoading}
            className="small"
            handleChange={onRetry}
          >
            Retry
          </Button>
          <Button
            ariaLabel="Close"
            isDisabled={isLoading}
            className="small"
            handleChange={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
