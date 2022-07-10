Feature: Change number of frequency bands
  Users want to increase or decrease the number of frequency bands

  Scenario: Add a new frequency band
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And there are 10 frequency bands
    When I click to add a new frequency band
    Then aqua.txt should show an 11th band with frequency 1000Hz

  Scenario: Select a new quality using the arrow buttons
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And there are 10 frequency bands
    When I click to remove the last frequency band
    Then aqua.txt should show 9 frequency bands
