Feature: Set filter type of a frequency band
  Users want to change the type of filter that is applied to a certain frequency

  Scenario: Select a new filter type using a mouse
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the filter type is PEAK filter for the band with frequency 125Hz
    When I set the filter type to LPQ filter for the band with frequency 125Hz
    Then Aqua config should show the LPQ filter type for the band with frequency 125Hz
