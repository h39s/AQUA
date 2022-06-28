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
            className="modalButton"
            handleChange={onRetry}
          >
            <div>Retry</div>
          </Button>
          <Button
            ariaLabel="Close"
            isDisabled={isLoading}
            className="modalButton"
            handleChange={handleClose}
          >
            <div>Close</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
