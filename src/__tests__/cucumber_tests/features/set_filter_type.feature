Feature: Set filter type of a frequency band
  Users want to change the type of filter that is applied to a certain frequency

  Scenario: Select a new filter type using a mouse
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the filter type is LSC filter for the band with frequency 125Hz
      And Aqua equalizer state is enabled
    When I set the filter type to PK filter for the band with frequency 125Hz
    Then Aqua config file should show the PK filter type for the band with frequency 125Hz
