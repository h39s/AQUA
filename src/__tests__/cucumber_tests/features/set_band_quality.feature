Feature: Set quality of a frequency band
  Users want to change the quality that is applied to a certain frequency

  Scenario: Select a new quality using the input field
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
    When I set the quality to 1.41 for the first band with frequency 125Hz
    Then aqua.txt should show a quality of 1.41 for the first band with frequency 125Hz

  Scenario: Select a new quality using the arrow buttons
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And the quality for the first band with frequency 125Hz is 0.5
    When I click on the up arrow for the quality for frequency 125Hz 2 times
    Then aqua.txt should show a quality of 2.5 for the first band with frequency 125Hz
