Feature: Set filter type of a frequency band
  Users want to change the type of filter that is applied to a certain frequency

  Scenario: Select a new filter type using a mouse
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And the filter type for the first frequency band with frequency 125Hz is Peak Filter
    When I click on the filter type dropdown for frequency 125Hz
      And I click on the Low Pass Filter type
    Then aqua.txt should show the LPQ filter type for the first band with frequency 125Hz

  Scenario: Select a new filter type using a keyboard
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And the filter type for frequency 125Hz is Peak Filter
    When I click on the filter type dropdown for frequency 125Hz
      And I navigate to the Low Pass Filter type using the arrow keys
      And I select the Low Pass Filter type by pressing Enter
    Then aqua.txt should show the LPQ filter type for the first band with frequency 125Hz
