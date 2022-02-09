/**
 * jspsych-attention-check
 *
 * @description A jsPsych plugin for adding multiple-choice attention check
 * questions to an experiment timeline.
 *
 * This plugin is NOT compatible with jsPsych version 7.0.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 *
 */
// Instantiate the plugin function
jsPsych.plugins['attention-check'] = (function() {
  const plugin = {};

  plugin.info = {
    name: 'attention-check',
    parameters: {
      question: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Question prompt text',
        default: undefined,
        description: 'The question to be presented to the participant.',
      },
      options: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'List of responses in drop-down',
        default: undefined,
        description: 'A list of responses that the participant can select as ' +
          'their answer to the attention-check question.',
      },
      options_radio: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        pretty_name: 'Alternate display for options',
        default: false,
        description: 'Change the options to display as a series of radio ' +
          'options instead of a drop-down.',
      },
      option_correct: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Index of correct option',
        default: undefined,
        description: 'The index of the correct response in the list of ' +
          'responses. Indexed from 0.',
      },
      option_keys: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'Keycodes assigned to each option',
        default: [],
        description: 'Define a key corresponding to each ' +
          'option that is presented. Ideal for alternate input schemes.',
      },

      // Submit button text and description
      submit_button_key: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button key',
        default: '',
        description: 'Specify a keypress to click the button. ' +
          'Ideal for alternate input schemes.',
      },
      submit_button_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button text',
        default: 'Submit',
        description: 'The text displayed on the submit button.',
      },

      // Continue button text and description
      continue_button_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button text',
        default: 'Continue',
        description: 'The text displayed on the continue button.',
      },
      continue_button_message_correct: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Continue button message',
        default: 'Continue',
        description: 'The message displayed next to the continue button ' +
                     'after a correct response.',
      },
      continue_button_message_incorrect: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Continue button message',
        default: 'Continue',
        description: 'The message displayed next to the continue button ' +
                     'after an incorrect response.',
      },

      // Confirmation message before submitting the response
      confirmation: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        pretty_name: 'Confirm answer selection',
        default: undefined,
        description: 'Require confirmation of the answer ' +
          'selection before submitting.',
      },
      feedback_correct: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct feedback text',
        default: undefined,
        description: 'Feedback to be given for a correct answer.',
      },
      feedback_incorrect: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Incorrect feedback text',
        default: undefined,
        description: 'Feedback to be given for an incorrect answer.',
      },
      input_timeout: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timeout duration for input',
        default: 300,
        description: 'Timeout before input can be given.',
      },
      main_timeout: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timeout duration for question',
        default: 30000,
        description: 'Time limit to complete the attention-check ' +
          'question.',
      },
    },
  };

  plugin.trial = function(displayElement, trial) {
    let html = '<div id="attention-check" class="attention-check">';

    const question = trial.question;
    const options = trial.options;
    const correctOptionIndex = trial.option_correct;

    // Variable to detect if alternate keybindings were provided
    // Option keys: keys used to select options
    // Button key: key used to submit answer
    let optionKeysEnabled = trial.option_keys !== undefined &&
                            trial.option_keys.length > 0;
    const buttonKeyEnabled = trial.submit_button_key !== '';

    if (optionKeysEnabled === true &&
        trial.option_keys.length !== trial.options.length) {
      console.warn(`${trial.option_keys.length} keys specified ` +
        `for ${trial.options.length} options. Keys will not be bound.`);
      optionKeysEnabled = false;
    }

    // Check that the button key is not an option key
    if (optionKeysEnabled === true &&
        buttonKeyEnabled === true &&
        trial.option_keys.includes(trial.submit_button_key) === true) {
      throw new Error(`button_key '${trial.submit_button_key}'` +
        ` cannot be in option_keys`);
    }

    // Set to 'true' when input timeout expires
    let acceptInput = false;

    // Timeouts
    let mainTimeout = null;
    let inputTimeout = null;
    let continueTimeout = null;
    const inputTimeoutDuration = trial.input_timeout;

    // First click variable
    let firstClick = !trial.confirmation;

    // Initialise the trial data
    const trialData = {
      selected_response: -1,
      correct: false,
      rt: -1,
    };

    // Inject styling
    html += '<style>';
    html +=
      '.jspsych-attention-check-options { ' +
        'display: inline-block; padding: 6px 12px; ' +
        'margin-top: 10px; margin-bottom: 10px;' +
        'font-size: large; font-weight: 400; ' +
        'font-family: "Open Sans", "Arial", sans-serif; ' +
        'cursor: pointer; line-height: 1.4; text-align: left; ' +
        'white-space: nowrap; vertical-align: middle; ' +
        'background-image: none; border: 1px solid transparent; ' +
        'border-radius: 4px; color: #333; ' +
        'background-color: #fff; border-color: #ccc;' +
      '}' +
      '.attention-check-text {' +
        'font-size: xx-large; font-weight: bold;' +
      '}' +
      '.attention-check-button {' +
        'display: flex;' +
        'flex-direction: row;' +
        'justify-content: center;' +
        'align-items: center;' +
      '}' +
      '.jspsych-btn {' +
        'font-size: large;' +
      '}' +
      'option, li {' +
        'margin-top: 20px;' +
      '}';
    html += '</style>';

    // Add the question text
    // Container
    html += '<div id="attention-check-container">';

    // Heading
    html += '<h1 class="attention-check-text">' +
              question +
            '</h1>';

    // Subtitle
    html += '<p>Please select your answer from the options below.</p>';

    // Options
    // These are either in a drop-down or a selection of radio buttons
    html += '<div id="attention-check-options-container">';
    if (trial.options_radio === false) {
      // Add dropdown for options
      html += '<select required name="attention-check-options" ' +
                'id="attention-check-options" ' +
                'class="jspsych-attention-check-options">';
      for (let i = 0; i < options.length; i++) {
        html += '<option value="R' + i + '">';
        html += options[i];
        html += '</option>';
      }
      html += '</select>';
    } else {
      // Add radio buttons for options
      html += '<form required name="attention-check-options" ' +
                'id="attention-check-options" ' +
                'class="jspsych-attention-check-options">';
      html += '<ul style="list-style-type: none; padding-left: 0pt;">';
      for (let i = 0; i < options.length; i++) {
        // Only show button keys when enabled
        if (optionKeysEnabled === true) {
          html +=
            `<li>
              <input
                type="radio"
                id="R${i}"
                name="option"
                value="R${i}"
                style="visibility: hidden;"
              >
              <button id="btn-R${i}" class="control-button">
                <b>${getButtonLabel(trial.option_keys[i])}</b>
              </button>`;
        } else {
          html +=
            `<li>
              <input
                type="radio"
                id="R${i}"
                name="option"
                value="R${i}"
              >`;
        }

        html +=
            `<label for="R${i}">
              &nbsp; ${options[i]}
            </label>
          </li>`;
      }
      html +=
          `</ul>
        </form>`;
    }

    // Close #attention-check-options-container
    html += '</div>';

    // Close #attention-check-container
    html += '</div>';


    // Submit mechanism
    html += '<div id="attention-check-button" class="attention-check-button">';

    // Add a button element or a key glyph depending on answer input
    if (buttonKeyEnabled === true) {
      // Add the keyboard glyph if using the option keys
      html += '<button type="button" id="attention-check-selection-button" ' +
      'class="control-button" style="margin-right: 20px;">';
      html += `<b>${getButtonLabel(trial.submit_button_key)}</b>`;
      html += '</button>';
      html += `&nbsp;<p id="attention-check-alternate-text">` +
                `${getButtonLabel(trial.submit_button_text)}` +
              `</p>`;
    } else {
      // Add button if not using option keys
      html += '<button type="button" id="attention-check-selection-button" ' +
      'class="jspsych-btn">';
      html += getButtonLabel(trial.submit_button_text);
      html += '</button>';
    }

    // Close #attention-check-button
    html += '</div>';

    // Close #attention-check
    html += '</div>';

    // Update displayed HTML
    displayElement.innerHTML = html;

    const startTime = (new Date).getTime();
    configureTimeout();

    // Bind the keys if required
    if (optionKeysEnabled === true) {
      // Bind the keys to selecting each option
      document.addEventListener('keyup', buttonHandler);
    }

    // Hide the cursor if entirely keyboard input
    if (optionKeysEnabled === true && buttonKeyEnabled === true) {
      document.body.style.cursor = 'none';
      document.getElementById('attention-check-options')
          .style.cursor = 'none';
    }

    // Disable all input until input enabled
    if (trial.options_radio === true) {
      // Disable radio buttons until input enabled
      for (let i = 0; i < trial.options.length; i++) {
        // Radio buttons
        document.getElementById(`R${i}`).checked = false;
        document.getElementById(`R${i}`).disabled = true;

        if (optionKeysEnabled === true) {
          // Button glyphs
          document.getElementById(`btn-R${i}`)
              .classList.add('control-button-disabled');
          document.getElementById(`attention-check-selection-button`)
              .classList.add('control-button-disabled');
        }
      }
    } else {
      // Drop-down
      document.getElementById('attention-check-options').disabled = true;

      // Button
      document.getElementById(`attention-check-selection-button`)
          .disabled = true;
    }

    /**
     * Configure the timeouts for the trial
     */
    function configureTimeout() {
      // Add timeout for completing the question
      mainTimeout = setTimeout(() => {
        // Mark the response as incorrect before waiting 5 seconds
        displayFeedback(false, trial.feedback_incorrect, 'red');

        // Store response as incorrect
        trialData.correct = false;

        // Start a 5 second countdown before continuing
        continueTimeout = setTimeout(endTrial, 5000);
      }, trial.main_timeout);

      inputTimeout = setTimeout(() => {
        acceptInput = true;
        // Enable radio buttons
        if (trial.options_radio === true) {
          for (let i = 0; i < trial.options.length; i++) {
            document.getElementById(`R${i}`).checked = false;
            document.getElementById(`R${i}`).disabled = false;

            if (optionKeysEnabled === true) {
              // Change the appearance of the keyboard glyphs
              document.getElementById(`btn-R${i}`)
                  .classList.remove('control-button-disabled');
              document.getElementById(`attention-check-selection-button`)
                  .classList.remove('control-button-disabled');
            }
          }
        } else {
          document.getElementById('attention-check-options').disabled = false;
          document.getElementById(`attention-check-selection-button`)
              .disabled = false;
        }
      }, inputTimeoutDuration);
    }

    /**
     * Handle the pressing of a button
     * @param {KeyboardEvent} event information about the button press
     */
    function buttonHandler(event) {
      // Check if input is being accepted
      event.preventDefault();
      if (!acceptInput) {
        // Do nothing if input is not being accepted yet
        return;
      }

      // Options can be selected by keys
      if (optionKeysEnabled === true) {
        // Check what key was pressed
        const optionPressedIndex = trial.option_keys.indexOf(event.key);
        if (optionPressedIndex >= 0) {
          if (trial.options_radio === false) {
            // Drop-down scenario
            document.getElementById('attention-check-options').selectedIndex =
              `${optionPressedIndex}`;
          } else {
            // De-select and de-activate any other buttons
            for (let i = 0; i < trial.options.length; i++) {
              document.getElementById(`R${i}`).checked = false;

              document.getElementById(`btn-R${i}`)
                  .classList.remove('control-button-selected');
            }

            // Radio button scenario
            document.getElementById(`R${optionPressedIndex}`).checked = true;

            // Set the button as selected
            document.getElementById(`btn-R${optionPressedIndex}`)
                .classList.add('control-button-selected');
          }
        }
      }

      // Button can be pressed using a key
      if (buttonKeyEnabled === true) {
        if (event.key === trial.submit_button_key) {
          // Click the button if the key is pressed
          document.getElementById('attention-check-selection-button').click();
        }
      }
    }

    /**
     * Handle the selection of a response
     * @param {MouseEvent} event information about the response
     */
    function selectionHandler(event) {
      if (firstClick) {
        // Timing information
        const endTime = (new Date).getTime();
        const responseTime = endTime - startTime;
        trialData.rt = responseTime;

        let optionIndex;
        if (trial.options_radio === false) {
          optionIndex = document.getElementById('attention-check-options')
              .selectedIndex;
          document.getElementById('attention-check-options').disabled = true;
        } else {
          // Get the selected radio button
          for (let i = 0; i < trial.options.length; i++) {
            if (document.getElementById(`R${i}`).checked === true) {
              optionIndex = i;
            }
            document.getElementById(`R${i}`).disabled = true;

            if (optionKeysEnabled === true) {
              document.getElementById(`btn-R${i}`)
                  .classList.add('control-button-disabled');
            }
          }
        }

        // Store the selected response
        trialData.selected_response = optionIndex;

        // Disable the option keys, mitigating a bug
        optionKeysEnabled = false;

        if (optionIndex === correctOptionIndex) {
          displayFeedback(true, trial.feedback_correct, 'green');
          trialData.correct = true;
        } else {
          displayFeedback(false, trial.feedback_incorrect, 'red');
          trialData.correct = false;
        }

        clearTimers();
      } else {
        firstClick = true;

        // Append confirmation text
        const mainContainer = document.getElementById('attention-check-button');
        const confirmationText = document.createElement('span');
        confirmationText.id = 'attention-check-confirmation';
        confirmationText.style.alignSelf = 'center';
        confirmationText.style.marginLeft = '20px';
        confirmationText.innerHTML = '<i>Are you sure?</i>';
        mainContainer.appendChild(confirmationText);
      }
    }

    /**
     * Display feedback text in div.
     * @param {boolean} correct whether or not the answer was correct
     * @param {string} text feedback text to display
     * @param {string} fontColour colour of feedback text
     */
    function displayFeedback(correct, text, fontColour='black') {
      // Get the parent container & height
      const formParentContainer =
          document.getElementById('attention-check-options-container');
      const formParentContainerHeight = formParentContainer.clientHeight;

      // Get the form & confirmation text
      const formChild = document.getElementById('attention-check-options');

      // Remove the form from the parent & and the text from the main
      formParentContainer.removeChild(formChild);

      if (firstClick && trial.confirmation === true) {
        // Get the button container
        const buttonContainer =
            document.getElementById('attention-check-button');
        const confirmationText =
            document.getElementById('attention-check-confirmation');
        buttonContainer.removeChild(confirmationText);
      }

      // Create a feedback child
      const feedbackParagraph = document.createElement('h3');
      feedbackParagraph.textContent = text;
      feedbackParagraph.style.color = fontColour;

      // Update the styling of the parent container
      formParentContainer.style.display = 'flex';
      formParentContainer.style.flexDirection = 'row';
      formParentContainer.style.justifyContent = 'center';
      formParentContainer.style.alignItems = 'center';

      // Add the feedback to the parent container
      formParentContainer.appendChild(feedbackParagraph);

      // Set the height of the container
      formParentContainer.style.minHeight = `${formParentContainerHeight}px`;

      // Clear previous event listener
      document.getElementById('attention-check-selection-button')
          .removeEventListener('click', selectionHandler);

      // Update the text displayed on and beside the continue button
      const continueButtonText = trial.continue_button_text;
      const continueMessage = correct ?
                                trial.continue_button_message_correct :
                                trial.continue_button_message_incorrect;

      // Update the button text, if keys are not being used
      if (buttonKeyEnabled === false) {
        document.getElementById('attention-check-selection-button')
            .innerText = continueButtonText;
      }

      // Update the message text beside the button
      if (buttonKeyEnabled === true) {
        document.getElementById('attention-check-alternate-text')
            .innerText = continueMessage;
      }

      // Update binding to continue trials
      document.getElementById('attention-check-selection-button')
          .addEventListener('click', endTrial);
    }

    /**
     * End the trial, clean up event listeners and HTML,
     * append data to jsPsych
     */
    function endTrial() {
      // Remove event listeners
      document.removeEventListener('keyup', buttonHandler);

      if (optionKeysEnabled === true) {
        // Show the cursor if buttons enabled
        document.body.style.cursor = 'auto';
      }

      clearTimers();
      displayElement.innerHTML = '';

      jsPsych.finishTrial(trialData);
    }

    /**
     * Generate and return text to display on a button
     * @param {string} text the text to add to the button
     * @return {string}
     */
    function getButtonLabel(text) {
      if (text === ' ') {
        return 'Space';
      } else if ([...text].length === 1) {
        return text.toUpperCase();
      } else {
        return text;
      }
    }

    /**
     * Clear all timers
     */
    function clearTimers() {
      // Clear the input timeout
      clearTimeout(inputTimeout);

      // Clear the main timeout
      clearTimeout(mainTimeout);

      // Clear a timeout that may have called this function
      clearTimeout(continueTimeout);
    }

    // Add binding for when a response is selected
    document.getElementById('attention-check-selection-button')
        .addEventListener('click', selectionHandler);
  };

  return plugin;
})();
