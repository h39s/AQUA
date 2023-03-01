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

import { U } from 'win32-api';
import { UINT_PTR, LONG_PTR, HANDLE } from 'win32-def/dist/lib/win.model';

// See win32 documentation https://docs.microsoft.com/en-us/windows/win32/winmsg/wm-app
const WM_APP = 0x8000;
const user32 = U.load(); // load all apis defined in lib/{dll}/api from user32.dll
const peaceTitle = 'Peace window messages';
const peaceLpszWindow = Buffer.from(peaceTitle, 'ucs2');

export const getPeaceWindowHandle = () => {
  return user32.FindWindowExW(0, 0, null, peaceLpszWindow);
};

export const isPeaceRunning = (peaceHWnd: HANDLE) => {
  return (
    (typeof peaceHWnd === 'number' && peaceHWnd > 0) ||
    (typeof peaceHWnd === 'bigint' && peaceHWnd > 0) ||
    (typeof peaceHWnd === 'string' && peaceHWnd.length > 0)
  );
};

export const sendPeaceCommand = (
  peaceHWnd: HANDLE,
  messageCode: number,
  wParam: UINT_PTR,
  lParam: LONG_PTR
) => {
  // Send message to Peace
  return user32.SendMessageW(peaceHWnd, WM_APP + messageCode, wParam, lParam);
};
