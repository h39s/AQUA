Feature: Set frequency for a band
  Users want to change the frequency that a band represents

  Scenario: Set a new frequency using the input field
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the frequency of the first band is 32Hz
    When I set the frequency of the first band to 100Hz
    Then Aqua config file should show a frequency of 32Hz for the first band

  Scenario: Set a new frequency using the arrow buttons
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the frequency of the first band is 32Hz
    When I click on the up arrow for the first band 2 times
    Then Aqua config file should show a frequency of 32Hz for the first band 
