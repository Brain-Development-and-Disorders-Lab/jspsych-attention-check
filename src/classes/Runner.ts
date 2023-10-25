import { JsPsych, TrialType } from "jspsych";

import { createRoot, Root } from "react-dom/client";

/**
 * Default class to support the plugin.
 */
class Runner {
  private displayElement: HTMLElement;
  private trial: TrialType<any>;
  private jsPsych: JsPsych;
  private root: Root;

  // private root:
  /**
   * Default constructor
   * @param {HTMLElement} displayElement target element for jsPsych display
   * @param {any} trial jsPsych trial data
   */
  constructor(displayElement: HTMLElement, trial: TrialType<any>, jsPsych: JsPsych) {
    // Copy and store the plugin configuration
    this.displayElement = displayElement;
    this.trial = trial;
    this.jsPsych = jsPsych;

    this.root = createRoot(this.displayElement);
  }

  /**
   * Validate the configuration passed to the plugin
   * @return {boolean}
   */
  validate(): boolean {
    // All keys must be null or different key values
    let correctCount = 0;
    let keyCount = 0;
    for (const response of this.trial.responses) {
      // Count correct answers and valid attributes
      if (
        response.value !== undefined &&
        response.key !== undefined &&
        response.correct !== undefined
      ) {
        if (response.correct === true) correctCount += 1;
      } else {
        console.error(
          new Error(
            'Invalid "responses" value specified. Ensure each response has a "value", "key", and "correct" value defined.'
          )
        );
        return false;
      }

      // Count keyboard responses
      if (response.key !== null && typeof response.key === "string") {
        keyCount += 1;
      }
    }

    if (correctCount !== 1) {
      // Check if only one correct answer has been specified
      console.error(
        new Error(
          "Invalid number of correct responses. There should only be one correct response per set of responses."
        )
      );
      return false;
    } else if (keyCount !== 0 && keyCount !== this.trial.responses.length) {
      // Check that enough keys have been specified for the number of responses
      console.error(
        new Error(
          `Invalid key configuration. Ensure all values are "null" or all values are a key.`
        )
      );
      return false;
    }

    //  Check the 'confirm' parameter
    if (this.trial.continue.key === null && keyCount > 0) {
      console.error(
        new Error(
          "Cannot not mix-and-match keyboard input for some interactions."
        )
      );
      return false;
    } else if (this.trial.continue.key !== null && keyCount === 0) {
      // Check that keys are specified for responses and the continue key
      console.error(
        new Error(
          "Cannot not mix-and-match keyboard input for some interactions."
        )
      );
      return false;
    } else if (this.trial.continue.key !== null) {
      // Check that the continue key is not assigned already
      if (
        this.trial.responses.map((r) => r.key).includes(this.trial.continue.key)
      ) {
        console.error(
          new Error(
            "The key to confirm the response must not be assigned to selecting a response also!"
          )
        );
        return false;
      }
    }

    if (this.trial.style === "default" && keyCount !== 0) {
      console.error(new Error(`Do not specify keys for the "default" style.`));
      return false;
    }

    return true;
  }

  getRoot(): Root {
    return this.root;
  }

  /**
   * End the trial, unmount the React component then submit data to jsPsych
   * @param {{ attentionSelection: string, attentionCorrect: boolean, attentionRT: number }} data collected response data
   */
  endTrial(data: {
    attentionSelection: string;
    attentionCorrect: boolean;
    attentionRT: number;
  }) {
    this.root.unmount();
    this.jsPsych.finishTrial(data);
  }
}

export default Runner;
