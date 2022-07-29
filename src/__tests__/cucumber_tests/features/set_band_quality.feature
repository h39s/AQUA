Feature: Set quality of a frequency band
  Users want to change the quality that is applied to a certain frequency

  Scenario: Select a new quality using the input field
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
    When I set the quality to 1.4 for the band with frequency 125Hz
    Then Aqua config file should show a quality of 1.4 for the band with frequency 125Hz

  Scenario: Select a new quality using the arrow buttons
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the quality for the band with frequency 125Hz is 0.5
      And Aqua equalizer state is enabled
    When I click on the up arrow for the quality for frequency 125Hz 2 times
    Then Aqua config file should show a quality of 0.7 for the band with frequency 125Hz
