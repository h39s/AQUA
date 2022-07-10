Feature: Change number of frequency bands
  Users want to increase or decrease the number of frequency bands

  Scenario: Add a frequency band
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
      And there are 10 frequency bands
    When I click to add a frequency band
    Then Aqua config file should show 11 frequency bands

  Scenario: Remove a frequency band
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
      And there are 10 frequency bands
    When I click to remove a frequency band
    Then Aqua config file should show 9 frequency bands
