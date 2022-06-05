import { useContext, useState } from 'react';
import './App.css';
import { getProgramState } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import './Modal.css';

export default function PrereqMissingModal() {
  const { wasPeaceFound, setWasPeaceFound } = useContext(PeaceFoundContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = async () => {
    window.electron.ipcRenderer.sendMessage('internal', [0]);
  };

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      const res = await getProgramState();
      setWasPeaceFound(res > 0);
    } catch (e) {
      setWasPeaceFound(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!wasPeaceFound && (
        <div className="modal col">
          <div className="modal-content">
            <h1 className="header">Prerequisite Missing</h1>
            <div className="body">
              <p>
                PeaceGUI was not detected to be running in the background.
                Please install and launch PeaceGUI before retrying.
              </p>
            </div>
            <div className="footer row">
              <button
                type="button"
                disabled={isLoading}
                className="close"
                onClick={handleRetry}
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
      )}
    </>
  );
}
