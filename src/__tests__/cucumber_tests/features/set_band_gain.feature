Feature: Set gain of a frequency band
  Users want to change the gain of a filter applied to a certain frequency

  Scenario: Move slider to bottom
    Given Aqua is running
    When I set gain of slider of frequency 125Hz to bottom
    Then Aqua config file should show gain of -30dB for frequency 125Hz