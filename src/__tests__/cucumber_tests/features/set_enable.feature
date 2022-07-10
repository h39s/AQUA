Feature: Set whether the equalizer is enabled or disabled
  Users want to toggle whether the equalizer is enabled or disabled

  Scenario: Enable the equalizer
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And Aqua is disabled
    When I enable the equalizer
    Then aqua.txt should be non-empty
  
  Scenario: Disable the equalizer
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And Aqua is enabled
    When I disable the equalizer
    Then aqua.txt should be empty