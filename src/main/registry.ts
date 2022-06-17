import path from 'path';
import { app } from 'electron';
import { promisified as regedit, setExternalVBSLocation } from 'regedit';

// app will only be defined in the electron main process environment.
// in the test environment, we expect it to be undefined.
if (app) {
  const vbsDirectory = path.join(
    path.dirname(app.getPath('exe')),
    './resources/vbs'
  );
  setExternalVBSLocation(vbsDirectory);
} else {
  const vbsDirectory = path.join(
    __dirname,
    '../../../node_modules/regedit/vbs'
  );
  console.log(vbsDirectory);
  setExternalVBSLocation(vbsDirectory);
}

const isPeaceInstalled = async () => {
  const registryKey =
    'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall';
  const listResult = await regedit.list([registryKey]);

  if (listResult[registryKey].exists) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of listResult[registryKey].keys) {
      if (key === 'Peace') {
        return true;
      }
    }
  }
  return false;
};

export default {
  isPeaceInstalled,
};
