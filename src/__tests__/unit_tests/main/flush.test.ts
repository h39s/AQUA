import {
  deletePreset,
  doesPresetExist,
  fetchPreset,
  renamePreset,
  savePreset,
} from 'main/flush';
import fs from 'fs';
import { FilterTypeEnum, IPresetV2 } from 'common/constants';
import path from 'path';

const PRESETS_DIR = 'src/__tests__/test_presets';

describe('flush', () => {
  describe('fetchPreset', () => {
    it('should read succesfully a preset of the IPresetV2 format', () => {
      const presetName = 'presetV2';
      const preset = fetchPreset(presetName, PRESETS_DIR);
      expect(preset).toStrictEqual({
        preAmp: 0,
        filters: {
          '0a04dcf8': {
            id: '0a04dcf8',
            frequency: 32,
            gain: -4,
            quality: 1,
            type: FilterTypeEnum.PK,
          },
          d77a7415: {
            id: 'd77a7415',
            frequency: 16000,
            gain: 0,
            quality: 1,
            type: FilterTypeEnum.PK,
          },
        },
      });
    });

    it('should read succesfully a preset of the IPresetV1 format and replace it with a IPresetV2 format', () => {
      const presetName = 'presetV1';
      const content = fs.readFileSync(path.join(PRESETS_DIR, presetName), {
        encoding: 'utf8',
      });
      const preset = fetchPreset('presetV1', PRESETS_DIR);
      expect(preset).toStrictEqual({
        preAmp: 0,
        filters: {
          '123': { id: '123', frequency: 2, gain: -4, quality: 6, type: 'PK' },
          '456': {
            id: '456',
            frequency: 8,
            gain: -10,
            quality: 1.2,
            type: FilterTypeEnum.PK,
          },
        },
      });
      fs.writeFileSync(path.join(PRESETS_DIR, presetName), content, {
        encoding: 'utf8',
      });
    });
  });

  describe('save and delete preset', () => {
    it('should save and delete a preset', () => {
      const presetName = 'newPreset';
      const preset: IPresetV2 = {
        preAmp: 0,
        filters: {
          '123': {
            id: '123',
            frequency: 2,
            gain: -4,
            quality: 6,
            type: FilterTypeEnum.PK,
          },
        },
      };
      savePreset(presetName, preset, PRESETS_DIR);
      expect(doesPresetExist(presetName, PRESETS_DIR)).toBe(true);
      deletePreset(presetName, PRESETS_DIR);
      expect(doesPresetExist(presetName, PRESETS_DIR)).toBe(false);
    });
  });

  describe('doesPresetExist', () => {
    it('should return true for an existing preset', () => {
      const presetName = 'presetV1';
      expect(doesPresetExist(presetName, PRESETS_DIR)).toBe(true);
    });

    it('should return false for a non-existing preset', () => {
      const presetName = '404_not_found';
      expect(doesPresetExist(presetName, PRESETS_DIR)).toBe(false);
    });
  });

  describe('renamePreset', () => {
    it('should rename presets', () => {
      const oldPresetName = 'presetV1';
      const newPresetName = 'presetV11';
      renamePreset(oldPresetName, newPresetName, PRESETS_DIR);
      expect(() => fetchPreset(oldPresetName, PRESETS_DIR)).toThrow();
      expect(fetchPreset(newPresetName, PRESETS_DIR)).toStrictEqual({
        preAmp: 0,
        filters: {
          '123': { id: '123', frequency: 2, gain: -4, quality: 6, type: 'PK' },
          '456': {
            id: '456',
            frequency: 8,
            gain: -10,
            quality: 1.2,
            type: FilterTypeEnum.PK,
          },
        },
      });
      renamePreset(newPresetName, oldPresetName, PRESETS_DIR);
    });
  });
});
