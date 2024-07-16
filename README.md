# AQUA

Quick link to download latest release: <https://github.com/h39s/AQUA/releases/latest/download/AQUAsetup.exe>

Welcome to AQUA, a modern platform for audio equalization on Windows. Please note that EqualizerAPO is a prerequisite for our application. Our current features include

* System-wide parametric audio equalization (through [EqualizerAPO](https://sourceforge.net/projects/equalizerapo/))
* AutoEQ integration (credit to [Jaakko Pasanen](https://github.com/jaakkopasanen/AutoEq/tree/master/results) and [Ian Walton](https://github.com/iwalton3/AutoEq) for their preset results for the Harman, IEF, and IEF with bass targets)
* Auto Pre-amp Gain to ensure your maximum gain never exceeds 0dB
* Saving/loading equalizer presets
* Graph visualizer for equalizer settings (between 10 Hz and 20 KHz)
* Up to 20 filters (+ preamp gain) with adjustable
  * Filter type (low shelf, peak, or high shelf)
  * Centre frequency (1 Hz - 20 KHz)
  * Gain (-30dB to 30dB)
  * Quality (0.01 - 100.00)

**AQUA is currently no longer under development. We really hope to be back with an update in the future with a potentially larger team of developers as our roadmap is still full of feature requests and substantial improvements. If you are interested in helping with development please reach out to us via [email](mailto:aqua.devteam@gmail.com) with a short introduction. Thank you for your understanding.**

![image](https://user-images.githubusercontent.com/20293445/222267346-b0e2064d-92c2-4334-9bff-d638f9535d12.png)


## Getting Started

To get started using AQUA, it only takes two easy steps:
1. Install [EqualizerAPO](https://sourceforge.net/projects/equalizerapo/) if you don't have it currently installed (and make sure you run `configurator.exe` included as a part of EqualizerAPO to install the required drivers for the devices you would like to EQ).
2. Download and run the executable `AQUAsetup.exe` from the latest [release](https://github.com/h39s/AQUA/releases).

## FAQ

By default, the Windows file system does not support case sensitive file names (i.e. you cannot have files/folders named `AQUA` and `aqua` in the same directory). 

- On Windows 11, AQUA is able to enable case sensitivity specifically for our `presets` folder so users can save presets with case-sensitive names.
- On Windows 10, if you would like to enable this feature you will have to install [WSL](https://learn.microsoft.com/en-us/windows/wsl/). You can do so by opening a PowerShell window as an administrator and running `wsl --install`.
   - If you have existing presets saved in AQUA, you will need to temporarily empty the presets folder (`C:\Users\<username>\AppData\Roaming\aqua\presets`) before starting the app to enable case sensitivity. Your existing presets can then be copied back into the presets folder.
- On Windows 7, 8, and 8.1, case sensitive preset naming is not available.

## Get In Touch

If you find any bugs, have any feature requests, or want to give us any kind of feedback, we'd love to hear it! Please feel free to reach out to us via [email](mailto:aqua.devteam@gmail.com)!

## Development Prerequisites

1. Install [EqualizerAPO](https://sourceforge.net/projects/equalizerapo/)
2. Install Visual Studio 2022. Check "Desktop Development with C++"
3. Clone this repository
4. Run `npm install` in the project folder
   - May need to install latest node-gyp in npm ([link](https://github.com/nodejs/node-gyp/blob/master/docs/Updating-npm-bundled-node-gyp.md))
   - When installing `node-gyp`, ensure msvs_version is set to 2022 in npm config

## License

AQUA: System-wide parametric audio equalizer interface

Copyright (C) 2023  AQUA Dev Team

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
