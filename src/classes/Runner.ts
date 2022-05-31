import React from 'react';
import * as ReactDOM from 'react-dom/client';

/**
 * Default class to support the plugin.
 */
class Runner {
  private displayElement: HTMLElement;
  private trial: any;
  private root: ReactDOM.Root;

  // private root: 
  /**
   * Default constructor
   * @param {HTMLElement} displayElement target element for jsPsych display
   * @param {any} trial jsPsych trial data
   */
  constructor(displayElement, trial) {
    // Copy and store the plugin configuration
    this.displayElement = displayElement;
    this.trial = trial;

    this.root = ReactDOM.createRoot(this.displayElement);
  }

  /**
   * Validate the configuration passed to the plugin
   * @return {boolean}
   */
  validate() {
    return true;
  }

  /**
   * Render method for the plugin
   * @param {React.ReactNode} content React content to render
   */
  render(content: React.ReactNode) {
    this.root.render(content);
  }
}

export default Runner;
