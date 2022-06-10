import path from 'path';
import { app } from 'electron';
import { promisified as regedit, setExternalVBSLocation } from 'regedit';

// TODO: test that the import change here works for packaged apps!

const vbsDirectory = path.join(
  path.dirname(app.getPath('exe')),
  './resources/vbs'
);
setExternalVBSLocation(vbsDirectory);

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
