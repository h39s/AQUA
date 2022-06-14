import { loadFeature, defineFeature } from 'jest-cucumber';
import { givenAquaIsNotRunning, whenAquaIsLaunched } from './shared_steps/aqua';
import { whenSetFrequencyGain } from './shared_steps/aquaSlider';
import {
  givenPeaceIsInstalled,
  givenPeaceIsRunning,
  thenPeaceFrequencyGain,
} from './shared_steps/peace';

const feature = loadFeature('features/set_band_gain.feature');

defineFeature(feature, (test) => {
  test('Move slider to bottom', ({ given, when, then }) => {
    givenPeaceIsInstalled(given);
    givenPeaceIsRunning(given);
    givenAquaIsNotRunning(given);

    whenAquaIsLaunched(when);
    whenSetFrequencyGain(when);

    thenPeaceFrequencyGain(then);
  });
});
