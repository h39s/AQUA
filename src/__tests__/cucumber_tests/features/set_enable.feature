Feature: Set whether the equalizer is enabled or disabled
  Users want to toggle whether the equalizer is enabled or disabled

  Scenario: Enable the equalizer
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is disabled
    When I toggle the equalizer state
    Then Aqua config file should be non-empty
  
  Scenario: Disable the equalizer
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
    When I toggle the equalizer state
    Then Aqua config file should be empty
