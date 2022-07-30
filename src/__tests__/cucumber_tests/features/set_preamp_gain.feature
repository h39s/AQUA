Feature: Set preamplification gain
  Users want to change the preamplification gain

  Scenario: Set preamp gain using the slider
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And Aqua equalizer state is enabled
    When I set gain of the preamp slider to the bottom
    Then Aqua config should show a preamp gain of -30dB
  
  Scenario: Set preamp gain using the arrows
    Given EqualizerAPO is installed
      And Aqua can write to Aqua config
      And Aqua is running
      And the preamp gain is 0dB
      And Aqua equalizer state is enabled
    When I click on the up arrow for the preamp gain 3 times
    Then Aqua config should show a preamp gain of 3dB
