import './Modal.css';

interface IPrereqMissingModalProps {
  show: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export default function PrereqMissingModal({
  show,
  onClose,
  onRetry,
}: IPrereqMissingModalProps) {
  return (
    <>
      {show && (
        <div className="modal col">
          <div className="modal-content">
            <h1 className="header">Prerequisite Missing</h1>
            <div className="body">
              <p>
                Peace was not detected to be running on in the background.
                Please install and launch it, then retry.
              </p>
            </div>
            <div className="footer row">
              <button type="button" className="close" onClick={onRetry}>
                Retry
              </button>
              <button type="button" className="close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
