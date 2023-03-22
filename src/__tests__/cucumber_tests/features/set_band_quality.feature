Feature: Set quality of a frequency band
  Users want to change the quality that is applied to a certain frequency

  Scenario: Select a new quality using the input field
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the frequency of band 1 is 130Hz
      And Aqua equalizer state is enabled
    When I set the quality to 1.4 for the band with frequency 130Hz
    Then Aqua config file should show a quality of 1.4 for the band with frequency 130Hz

  Scenario: Select a new quality using the arrow buttons
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the frequency of band 1 is 130Hz
      And the quality for the band with frequency 130Hz is 0.5
      And Aqua equalizer state is enabled
    When I click on the up arrow for the quality for frequency 130Hz 2 times
    Then Aqua config file should show a quality of 0.52 for the band with frequency 130Hz
