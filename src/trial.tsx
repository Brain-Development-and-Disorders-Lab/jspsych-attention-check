import React from "react";
import { JsPsych, TrialType } from "jspsych";
import Runner from "./classes/Runner";
import View from "./components/View";

export const run_trial = (display_element: HTMLElement, trial: TrialType<any>, jsPsych: JsPsych) => {
  // Instantiate the 'Runner' class for this plugin
  const runner = new Runner(display_element, trial, jsPsych);

  // If validation of the provided parameters passes, render the screen
  if (runner.validate() === true) {
    runner.getRoot().render(
      <View
        style={trial.style}
        prompt={trial.prompt}
        responses={trial.responses}
        feedback={trial.feedback}
        continue={trial.continue}
        input_timeout={trial.input_timeout}
        callback={runner.endTrial.bind(runner)}
      />
    );
  }
};

