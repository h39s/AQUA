import './Modal.css';

interface IPrereqMissingModalProps {
  show: boolean;
  onClose: () => void;
}

export default function PrereqMissingModal({
  show,
  onClose,
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
            <div className="footer">
              <button type="button" className="close" onClick={onClose}>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
