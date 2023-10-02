/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import Button from './Button';
import '../styles/Modal.scss';

interface IModalProps {
  isLoading: boolean;
  headerText: string;
  bodyText: string;
  isSumbitDisabled?: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
  children?: JSX.Element | string;
  cancelText?: string;
  submitText?: string;
}

export default function Modal({
  isLoading,
  headerText,
  bodyText,
  isSumbitDisabled = false,
  onSubmit,
  onCancel,
  children,
  cancelText,
  submitText,
}: IModalProps) {
  const handleClose = async () => {
    window.electron.ipcRenderer.closeApp();
  };

  return (
    <div className="modal col">
      <div className="modal-content">
        <h1 className="header">{headerText}</h1>
        <div className="body">
          <p>{bodyText}</p>
          {children}
        </div>
        <div className="footer row">
          <Button
            ariaLabel="Cancel"
            isDisabled={isLoading}
            className="default"
            handleChange={onCancel || handleClose}
          >
            {cancelText || 'Exit'}
          </Button>
          <Button
            ariaLabel="Submit"
            isDisabled={isLoading || isSumbitDisabled}
            className="default"
            handleChange={onSubmit}
          >
            {submitText || 'Close & Retry'}
          </Button>
        </div>
      </div>
    </div>
  );
}
