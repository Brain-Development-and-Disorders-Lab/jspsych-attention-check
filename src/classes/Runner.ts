import React from "react";
import * as ReactDOM from "react-dom/client";

/**
 * Default class to support the plugin.
 */
class Runner {
  private displayElement: HTMLElement;
  private trial: Trial;
  private root: ReactDOM.Root;

  // private root:
  /**
   * Default constructor
   * @param {HTMLElement} displayElement target element for jsPsych display
   * @param {any} trial jsPsych trial data
   */
  constructor(displayElement: HTMLElement, trial: Trial) {
    // Copy and store the plugin configuration
    this.displayElement = displayElement;
    this.trial = trial;

    this.root = ReactDOM.createRoot(this.displayElement);
  }

  /**
   * Validate the configuration passed to the plugin
   * @return {boolean}
   */
  validate(): boolean {
    if (this.trial.responses.length === 0) {
      console.error(new Error('Invalid "responses" value specified. Ensure at least one response is provided.'));
      return false;
    }

    if (this.trial.correct < 0 || this.trial.correct >= this.trial.responses.length) {
      console.error(new Error('Invalid "correct" index specified. Ensure value is >= 0 and corresponds to a value in the "responses" array.'));
      return false;
    }

    let keyCount = 0;
    for (const key of Object.keys(this.trial.input_schema)) {
      if (typeof this.trial.input_schema[key] === "string") {
        keyCount += 1;
      }
    }

    if (keyCount > 0 && keyCount < 3) {
      console.warn('Some keys are not assigned correctly in "input_schema".');
    }

    if (this.trial.style === "default" && keyCount !== 0) {
      console.warn(new Error(`Do not specify keys for the "default" style.`));
      return false;
    }

    return true;
  }

  /**
   * Render method for the plugin
   * @param {React.ReactNode} content React content to render
   */
  render(content: React.ReactNode) {
    this.root.render(content);
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
    jsPsych.finishTrial(data);
  }
}

export default Runner;
