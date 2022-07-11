Feature: Set frequency for a band
  Users want to change the frequency that a band represents

  Scenario: Set a new frequency using the input field
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
    When I set the frequency of band 1 to 100Hz
    Then Aqua config file should show a frequency of 100Hz for band 1

  Scenario: Set a new frequency using the arrow buttons
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the frequency of band 1 is 32Hz
      And Aqua equalizer state is enabled
    When I click on the up arrow of band 1 2 times
    Then Aqua config file should show a frequency of 34Hz for band 1
