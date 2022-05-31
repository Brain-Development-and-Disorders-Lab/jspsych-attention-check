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

import { Heading } from "grommet";
import React from "react";
import Runner from "./classes/Runner";
import Layout from "./components/Layout";
import ResponseField from "./components/ResponseField";

// Instantiate the plugin function
jsPsych.plugins['attention-check'] = (function() {
  const plugin = { info: {}, trial: (displayElement, trial) => {}};

  plugin.info = {
    name: 'attention-check',
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text prompt',
        default: undefined,
        description: 'The prompt to be presented to the participant.',
      },
      responses: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'List of responses to the prompt',
        default: undefined,
        description: 'A list of responses that the participant can select as ' +
          'their answer to the attention-check prompt.',
      },
      input: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Alternate display for options',
        default: 'radio',
        description: 'Change the options to display as a series of radio ' +
          'options instead of a drop-down.',
      },
      confirm: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Enable a confirmation message',
        default: false,
        description: 'Optionally display a confirmation message before ' +
          'submitting a selected response.',
      },
    },
  };

  plugin.trial = (displayElement: HTMLElement, trial: Trial) => {
    // ------------------------------- Responses -------------------------------
    // Check that the response format is valid
    let correctCount = 0;
    for (const r of trial.responses) {
      console.debug('Response:', r.value, 'Key:', r.key, 'Correct:', r.correct);
      if (r.value !== undefined && r.key !== undefined && r.correct !== undefined) {
        if (r.correct === true) correctCount += 1;
      } else {
        console.error(new Error('Invalid \"responses\" value specified. Ensure each response has a \"value\", \"key\", and \"correct\" value defined.'));
      }
    }

    // Check the number of correct answers
    if (correctCount !== 1) {
      console.error(new Error('Invalid number of correct responses. There should only be one correct response per set of responses.'));
    }

    const runner = new Runner(displayElement, trial);
    runner.render(
      <Layout prompt={trial.prompt}>
        <ResponseField input={trial.input} responses={trial.responses} />
      </Layout>
    );
  };

  return plugin;
})();
