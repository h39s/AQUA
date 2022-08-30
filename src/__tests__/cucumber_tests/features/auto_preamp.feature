Feature: Auto Pre-amp
  Users want the pre-amp to be automatically set depending on the greatest frequency gain

  Scenario: Apply auto pre-amp
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And ChartView is disabled
      And there are 2 frequency bands
      And auto pre-amp is on
    When I set the frequency of band 1 to 1000Hz
    When I set the frequency of band 2 to 2000Hz
    When I set gain of slider of frequency 1000Hz to 6.05db
    When I set gain of slider of frequency 2000Hz to 11.16db
    Then Aqua config should show a preamp gain of -13.14dB
  