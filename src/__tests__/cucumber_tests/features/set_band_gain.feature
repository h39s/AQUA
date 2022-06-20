Feature: Set gain of a frequency band
  Users want to change the gain of a filter applied to a certain frequency

  Scenario: Move slider to bottom
    Given Peace is installed
      And Peace is running
      And Aqua is not running
    When Aqua is launched
      And I set gain of slider of frequency 100Hz to bottom
    Then Peace should show gain of -30dB for frequency 100Hz