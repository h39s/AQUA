Feature: Show filter graph
  Users want a visualization of the gains applied from a filter across all frequencies

  Scenario: Apply a single peak filter
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And there are 1 frequency bands
      And ChartView is enabled
    When I set the frequency of band 1 to 125Hz
    When I set gain of slider of frequency 125Hz to bottom
    When I set the quality to 1 for the band with frequency 125Hz
    When I set the filter type to PK filter for the band with frequency 125Hz
    Then Aqua should show the PK graph at 125Hz
  