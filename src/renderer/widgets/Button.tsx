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

import '../styles/Button.scss';

interface IButtonProps {
  children: JSX.Element | string;
  ariaLabel: string;
  isDisabled: boolean;
  className?: string;
  handleChange: () => void;
}

const Button = ({
  children,
  ariaLabel,
  isDisabled,
  className = '',
  handleChange,
}: IButtonProps) => {
  return (
    <div
      role="button"
      aria-label={ariaLabel}
      className={`button ${className}`}
      onMouseUp={handleChange}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {children}
    </div>
  );
};

export default Button;
