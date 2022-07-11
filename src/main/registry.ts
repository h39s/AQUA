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
  setExternalVBSLocation(vbsDirectory);
}

const isSoftwareInstalled = async (softwareKey: string) => {
  const registryKey =
    'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall';
  const listResult = await regedit.list([registryKey]);

  if (listResult[registryKey].exists) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of listResult[registryKey].keys) {
      if (key === softwareKey) {
        return true;
      }
    }
  }
  return false;
};

export const isPeaceInstalled = () => isSoftwareInstalled('Peace');
export const isEqualizerAPOInstalled = () =>
  isSoftwareInstalled('EqualizerAPO');

export const getConfigPath = async () => {
  const isInstalled = await isEqualizerAPOInstalled();
  if (!isInstalled) {
    throw new Error('Equalizer APO not installed');
  }

  // Peace checks for Equalizer APO using this registry key first, and then
  // tries the second one if this one fails. From my local testing, this
  // first key tends to always fail but I think it's best to keep both
  // checks regardless, in case someone else installed Equalizer APO at
  // a different location.
  try {
    const registryKey64 = 'HKLM64\\SOFTWARE\\EqualizerAPO';
    const listResult = await regedit.list([registryKey64]);
    const configPath = listResult[registryKey64].values.ConfigPath.value;
    return configPath as string;
  } catch (e) {
    console.log('Did not find file using 64 key');
  }

  try {
    const registryKey = 'HKLM\\SOFTWARE\\EqualizerAPO';
    const listResult = await regedit.list([registryKey]);
    const configPath = listResult[registryKey].values.ConfigPath.value;
    return configPath as string;
  } catch (e) {
    console.log(e);
    throw new Error('Config path not found');
  }
};
