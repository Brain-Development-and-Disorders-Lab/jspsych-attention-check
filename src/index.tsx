/**
 * jspsych-attention-check
 *
 * @description A jsPsych plugin for adding multiple-choice attention check
 * questions to an experiment timeline.
 *
 * This plugin is NOT compatible with jsPsych versions 7.0+.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 *
 */

import React from "react";
import Runner from "./classes/Runner";
import Layout from "./components/Layout";
import ResponseField from "./components/ResponseField";

// Instantiate the plugin function
jsPsych.plugins["attention-check"] = (function () {
  const plugin = { info: {}, trial: (displayElement, trial) => {} };

  plugin.info = {
    name: "attention-check",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Text prompt",
        default: undefined,
        description: "The prompt to be presented to the participant.",
      },
      responses: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: "List of responses to the prompt",
        default: undefined,
        description:
          "A list of responses that the participant can select as " +
          "their answer to the attention-check prompt.",
      },
      continue: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: "Set the continuation behaviour",
        default: undefined,
        description:
          "Optionally display a confirmation message before " +
          "submitting a selected response.",
      },
      feedback: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: "Set the feedback messages",
        default: undefined,
        description:
          "Describe feedback to the participant in the case of " +
          "correct and incorrect responses.",
      },
      style: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Alternate display for options",
        default: "radio",
        description:
          "Change the options to display as a series of radio " +
          "options instead of a drop-down.",
      },
      input_timeout: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Timeout before input permitted",
        default: 0,
        description:
          "Force the participant to wait for a duration " +
          "before intput is accepted.",
      },
    },
  };

  plugin.trial = (displayElement: HTMLElement, trial: Trial) => {
    // ------------------------------- Responses -------------------------------
    const runner = new Runner(displayElement, trial);
    if (runner.validate() === true) {
      runner.render(
        <Layout prompt={trial.prompt}>
          <ResponseField
            style={trial.style}
            prompt={trial.prompt}
            responses={trial.responses}
            feedback={trial.feedback}
            continue={trial.continue}
            inputTimeout={trial.inputTimeout}
            callback={runner.endTrial.bind(runner)}
          />
        </Layout>
      );
    }
  };

  return plugin;
})();
