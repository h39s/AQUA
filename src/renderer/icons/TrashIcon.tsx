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

const TrashIcon = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.6071 0.937505H7.66071L7.42991 0.389653C7.38102 0.272529 7.30571 0.174006 7.21244 0.105169C7.11918 0.0363316 7.01167 -8.87099e-05 6.90201 5.13654e-06H4.09554C3.98612 -0.000496734 3.8788 0.0357877 3.78587 0.104701C3.69294 0.173615 3.61815 0.272371 3.57009 0.389653L3.33929 0.937505H0.392857C0.288665 0.937505 0.18874 0.986891 0.115065 1.0748C0.0413902 1.16271 0 1.28193 0 1.40625L0 2.34375C0 2.46807 0.0413902 2.5873 0.115065 2.67521C0.18874 2.76312 0.288665 2.8125 0.392857 2.8125H10.6071C10.7113 2.8125 10.8113 2.76312 10.8849 2.67521C10.9586 2.5873 11 2.46807 11 2.34375V1.40625C11 1.28193 10.9586 1.16271 10.8849 1.0748C10.8113 0.986891 10.7113 0.937505 10.6071 0.937505ZM1.30625 13.6816C1.32499 14.0387 1.45705 14.3737 1.67555 14.6187C1.89405 14.8636 2.18257 15 2.48237 15H8.51763C8.81743 15 9.10595 14.8636 9.32445 14.6187C9.54295 14.3737 9.67501 14.0387 9.69375 13.6816L10.2143 3.75H0.785714L1.30625 13.6816Z"
        fill="#718792"
      />
    </svg>
  );
};

export default TrashIcon;
