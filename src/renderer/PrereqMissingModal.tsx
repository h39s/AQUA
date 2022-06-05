import { useContext, useState } from 'react';
import './App.css';
import { getProgramState } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import './Modal.css';
import type { ErrorDescription } from '../common/errors';

export default function PrereqMissingModal() {
  const { wasPeaceFound, setWasPeaceFound } = useContext(PeaceFoundContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shortErrorStr, setShortError] = useState<string>('');
  const [solutionStr, setSolution] = useState<string>('');

  const handleClose = async () => {
    window.electron.ipcRenderer.sendMessage('internal', [0]);
  };

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      const res = await getProgramState();
      setWasPeaceFound(res > 0);
    } catch (e) {
      const { shortError, solution } = e as ErrorDescription;
      setShortError(shortError);
      setSolution(solution);
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
                {shortErrorStr}
                {solutionStr}
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
