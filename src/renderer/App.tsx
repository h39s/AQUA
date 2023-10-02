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

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CONFIG_FILENAME } from 'common/constants';
import { ErrorCode } from 'common/errors';
import MainContent from './MainContent';
import { AquaProvider, useAquaContext } from './utils/AquaContext';
import SideBar from './SideBar';
import FrequencyResponseChart from './graph/FrequencyResponseChart';
import PresetsBar from './PresetsBar';
import AutoEQ from './AutoEQ';
import {
  deletePreset,
  getPresetListFromFiles,
  loadPreset,
  renamePreset,
  savePreset,
  updateConfigFileName,
} from './utils/equalizerApi';
import Modal from './widgets/Modal';
import FilePicker from './widgets/FilePicker';

export const AppContent = () => {
  const {
    isLoading,
    globalError,
    configFileName,
    performHealthCheck,
    setConfigFileName,
  } = useAquaContext();

  const [configFile, setConfigFile] = useState<string | undefined>(
    configFileName
  );

  const handleChange = (file: File) => {
    if (!file) {
      return;
    }

    setConfigFile(file.name);
  };

  const handleConfigUpdate = useCallback(async () => {
    await updateConfigFileName(configFile || DEFAULT_CONFIG_FILENAME);
    setConfigFileName(configFile || DEFAULT_CONFIG_FILENAME);
    performHealthCheck();
  }, [configFile, performHealthCheck, setConfigFileName]);

  useEffect(() => {
    if (globalError && globalError.code === ErrorCode.CONFIG_NOT_FOUND) {
      setConfigFile(undefined);
    }
  }, [globalError]);

  const globalErrorModal = useMemo(() => {
    if (!globalError) {
      return undefined;
    }

    if (globalError.code === ErrorCode.CONFIG_NOT_FOUND) {
      return (
        <Modal
          isLoading={isLoading}
          isSumbitDisabled={!configFile}
          onSubmit={handleConfigUpdate}
          headerText={globalError.title}
          bodyText={`${globalError.shortError} ${globalError.action}`}
        >
          <FilePicker
            label="Select a config file"
            placeholder="No file selected."
            accept=".txt"
            isDisabled={isLoading}
            handleChange={handleChange}
          />
        </Modal>
      );
    }
    return (
      <Modal
        isLoading={isLoading}
        onSubmit={performHealthCheck}
        headerText={globalError.title}
        bodyText={`${globalError.shortError} ${globalError.action}`}
      />
    );
  }, [
    configFile,
    globalError,
    handleConfigUpdate,
    isLoading,
    performHealthCheck,
  ]);

  return (
    <>
      <header className="title-bar row">
        <span className="brand">AQUA</span>
      </header>
      <div className="app">
        <SideBar />
        <div className="middle-content">
          <AutoEQ />
          <MainContent />
        </div>
        <PresetsBar
          fetchPresets={getPresetListFromFiles}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
        <FrequencyResponseChart />
        {globalErrorModal}
      </div>
    </>
  );
};

export default function App() {
  return (
    <AquaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </AquaProvider>
  );
}
