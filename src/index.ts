import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

import { run_trial } from "./trial";

const info = {
  name: "attention-check",
  parameters: {
    prompt: {
      type: ParameterType.STRING,
      pretty_name: "Text prompt",
      default: undefined,
      description: "The prompt to be presented to the participant.",
    },
    responses: {
      type: ParameterType.OBJECT,
      pretty_name: "List of responses to the prompt",
      default: undefined,
      description:
        "A list of responses that the participant can select as " +
        "their answer to the attention-check prompt.",
    },
    continue: {
      type: ParameterType.OBJECT,
      pretty_name: "Set the continuation behaviour",
      default: undefined,
      description:
        "Optionally display a confirmation message before " +
        "submitting a selected response.",
    },
    feedback: {
      type: ParameterType.OBJECT,
      pretty_name: "Set the feedback messages",
      default: undefined,
      description:
        "Describe feedback to the participant in the case of " +
        "correct and incorrect responses.",
    },
    style: {
      type: ParameterType.STRING,
      pretty_name: "Alternate display for options",
      default: "radio",
      description:
        "Change the options to display as a series of radio " +
        "options instead of a drop-down.",
    },
    input_timeout: {
      type: ParameterType.INT,
      pretty_name: "Timeout before input permitted",
      default: 0,
      description:
        "Force the participant to wait for a duration " +
        "before intput is accepted.",
    },
  },
};
declare type Info = typeof info;

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

// Instantiate the plugin function
class AttentionCheckPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  };

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    run_trial(display_element, trial, this.jsPsych);
  };
};

export default AttentionCheckPlugin;
