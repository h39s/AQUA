Feature: Set whether the equalizer is enabled or disabled
  Users want to toggle whether the equalizer is enabled or disabled

  Scenario: Enable the equalizer
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua is disabled
    When I enable the equalizer
    Then Aqua config should be non-empty
  
  Scenario: Disable the equalizer
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua is enabled
    When I disable the equalizer
    Then Aqua config should be empty
