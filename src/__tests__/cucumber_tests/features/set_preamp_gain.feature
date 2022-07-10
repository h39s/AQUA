Feature: Set preamplification gain
  Users want to change the preamplification gain

  Scenario: Set preamp gain using the slider
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
    When I set gain of the preamp slider to the bottom
    Then aqua.txt should show a preamp gain of -30dB
  
  Scenario: Set preamp gain using the arrows
    Given EqualizerAPO is installed
      And Aqua can write to aqua.txt
      And Aqua is running
      And the pramp gain is 0dB
    When I click on the up arrow for the preamp gain 3 times
    Then aqua.txt should show a preamp gain of 3dB