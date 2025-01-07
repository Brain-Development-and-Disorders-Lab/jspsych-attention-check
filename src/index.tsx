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
import View from "./components/View";

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
      style: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Alternate display for options",
        default: "radio",
        description:
          "Change the options to display as a series of radio " +
          "options instead of a drop-down.",
      },
      responses: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: "List of responses to the prompt",
        default: undefined,
        description:
          "A list of responses that the participant can select as " +
          "their answer to the attention-check prompt.",
      },
      correct: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Index of correct response from the `responses` array",
        default: 0,
        description:
          "The index of the correct response, as the response is located " +
          "the `responses` array.",
      },
      feedback: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: "Set the feedback messages",
        default: undefined,
        description:
          "Describe feedback to the participant in the case of " +
          "correct and incorrect responses.",
      },
      input_timeout: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Timeout before input permitted",
        default: 0,
        description:
          "Force the participant to wait for a duration " +
          "before intput is accepted.",
      },
      input_schema: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: "Input schema",
        default: {
          select: null,
          next: null,
          previous: null,
        },
        description:
          "Specify the keyboard inputs used to interact " +
          "with the attention check questions.",
      },
      confirm_continue: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Require confirmation before continuing",
        default: false,
        description:
          "Require the user to confirm their response before " +
          "continuing with the task.",
      },
    },
  };

  plugin.trial = (displayElement: HTMLElement, trial: Trial) => {
    // Instantiate the 'Runner' class for this plugin
    const runner = new Runner(displayElement, trial);

    // If validation of the provided parameters passes, render the screen
    if (runner.validate() === true) {
      runner.render(
        <View
          { ...trial }
          callback={runner.endTrial.bind(runner)}
        />
      );
    }
  };

  return plugin;
})();
