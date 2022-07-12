Feature: Set gain of a frequency band
  Users want to change the gain of a filter applied to a certain frequency

  Scenario: Move slider to bottom
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
    When I set gain of slider of frequency 1000Hz to bottom
    Then Aqua config file should show gain of -30dB for frequency 1000Hz
