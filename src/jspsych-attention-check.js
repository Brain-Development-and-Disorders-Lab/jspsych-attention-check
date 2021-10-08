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
          'their answer to the control question.',
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
          'option that is presented. Ideal for alternate control schemes.',
      },
      button_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button text',
        default: 'Submit',
        description: 'The text displayed on the button below the options.',
      },
      button_key: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button key',
        default: '',
        description: 'Specify a keypress to click the button. ' +
          'Ideal for alternate control schemes.',
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
      feedback_function: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Feedback function',
        default: function() {},
        description: 'The function called once feedback has been given.',
      },
      instructions: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'HTML code for optional instructions',
        default: '',
        description: 'HTML code included beneath the control questions ' +
          'to instruct the participant on how to complete the questions.',
      },
      input_timeout: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timeout duration for input',
        default: 300,
        description: 'Timeout before input can be given.',
      },
      timeout: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timeout duration for question',
        default: 30000,
        description: 'Timeout to be enforced for completing the control ' +
          'question.',
      },
    },
  };

  plugin.trial = function(displayElement, trial) {
    let html = '<div class="attention-check">';

    const question = trial.question;
    const options = trial.options;
    const correctOptionIndex = trial.option_correct;

    let optionKeysEnabled = trial.option_keys.length > 0;
    const buttonKeyEnabled = trial.button_key !== '';

    // Set to 'true' when input timeout expires
    let acceptInput = false;

    // Timeouts
    let mainTimeout = null;
    let inputTimeout = null;
    let continueTimeout = null;

    const inputTimeoutDuration = trial.input_timeout;

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
        'display: inline-block; padding: 6px 12px; margin: 10%; ' +
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
      '.jspsych-btn {' +
        'font-size: large;' +
      '}' +
      'option, li {' +
        'margin-top: 20px;' +
      '}';
    html += '</style>';

    // Add the question text
    html += '<div id="attention-check-container">';
    html += '<h1 class="attention-check-text">' +
      question + '</h1>';

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
        html += '<li><input type="radio" id="R' + i +
          '" name="option" value="R' + i + '">';
        html += options[i];
        html += '</input></li>';
      }
      html += '</ul></form>';
    }

    html += '</div>';

    // Add a placeholder for feedback text
    html += '<div id="attention-feedback-container">';
    html += '<div id="attention-feedback">';
    html += '</div>';
    html += '</div>';


    html += '<div id="attention-check-button">';
    html += '<button type="button" id="attention-check-selection-button" ' +
      'class="jspsych-btn">';
    html += trial.button_text;
    html += '</button>';
    html += '</div>';

    // Append the instructions if provided
    if (trial.instructions !== '') {
      html += '<br>';
      html += '<hr>';
      html += '<br>';
      html += '<div id="attention-check-instructions">';
      html += trial.instructions;
      html += '</div>';
    }

    html += '</div>';

    const startTime = (new Date).getTime();

    // Update displayed HTML
    displayElement.innerHTML = html;

    configureTimeout();

    // Check for any custom key information.
    if (optionKeysEnabled) {
      // Check that the number of keys equals the number of options.
      if (trial.option_keys.length !== trial.options.length) {
        console.warn(`${trial.option_keys.length} keys specified ` +
          `for ${trial.options.length} options. Keys will not be bound.`);
        optionKeysEnabled = false;
      } else {
        // Bind the keys to selecting each option
        document.addEventListener('keyup', buttonHandler);
      }
    }

    // Disable radio buttons until input enabled
    if (trial.options_radio) {
      for (let i = 0; i < trial.options.length; i++) {
        document.getElementById(`R${i}`).checked = false;
        document.getElementById(`R${i}`).disabled = true;
      }
    } else {
      document.getElementById('attention-check-options').disabled = true;
    }

    /**
     * Configure the timeouts for the trial
     */
    function configureTimeout() {
      // Add timeout for completing the question
      mainTimeout = setTimeout(() => {
        // Mark the response as incorrect before waiting 5 seconds
        displayFeedback(trial.feedback_incorrect, 'red');

        // Disable the form options
        if (trial.options_radio === false) {
          document.getElementById('attention-check-options').disabled = true;
        } else {
          for (let i = 0; i < trial.options.length; i++) {
            document.getElementById(`R${i}`).disabled = true;
          }
        }

        // Store response as incorrect
        trialData.correct = false;

        // Start a 5 second countdown before continuing
        continueTimeout = setTimeout(endTrial, 5000);
      }, trial.timeout);

      inputTimeout = setTimeout(() => {
        acceptInput = true;
        // Enable radio buttons
        if (trial.options_radio) {
          for (let i = 0; i < trial.options.length; i++) {
            document.getElementById(`R${i}`).checked = false;
            document.getElementById(`R${i}`).disabled = false;
          }
        } else {
          document.getElementById('attention-check-options').disabled = false;
        }
      }, inputTimeoutDuration);
    }

    /**
     * Handle the pressing of a button
     * @param {object} _event information about the button press
     */
    function buttonHandler(_event) {
      // Check if input is being accepted
      _event.preventDefault();
      if (!acceptInput) {
        // Do nothing if input is not being accepted yet
        return;
      }

      // Check what kind of button has been pressed
      const keyCode = _event.code;

      // Options can be selected by keys
      if (optionKeysEnabled) {
        // Check what key was pressed
        const optionPressedIndex = trial.option_keys.indexOf(keyCode);
        if (optionPressedIndex >= 0) {
          if (trial.options_radio === false) {
            if (document.getElementById('attention-check-options')
                .disabled === false) {
              document.getElementById('attention-check-options').selectedIndex =
                `${optionPressedIndex}`;
            }
          } else {
            if (document.getElementById(`R${optionPressedIndex}`).disabled ===
                false) {
              document.getElementById(`R${optionPressedIndex}`).checked = true;
            }
          }
        }
      }

      // Button can be pressed using a key
      if (buttonKeyEnabled) {
        if (keyCode === trial.button_key) {
          // Click the button if the key is pressed
          document.getElementById('attention-check-selection-button').click();
        }
      }
    }

    /**
     * Handle the selection of a response
     * @param {object} _event information about the response
     */
    function selectionHandler(_event) {
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
        }
      }

      trialData.selected_response = optionIndex;

      if (optionIndex === correctOptionIndex) {
        displayFeedback(trial.feedback_correct, 'green');
        trialData.correct = true;
      } else {
        displayFeedback(trial.feedback_incorrect, 'red');
        trialData.correct = false;
      }

      clearTimers();
    }

    /**
     * Display feedback text in div.
     * @param {*} _text feedback text to display
     * @param {*} _fontColour colour of feedback text
     */
    function displayFeedback(_text, _fontColour='black') {
      // Insert feedback
      const feedbackContainer = document.getElementById('attention-feedback');
      const feedbackParagraph = document.createElement('h3');
      feedbackParagraph.textContent = _text;
      feedbackParagraph.style.color = _fontColour;
      feedbackContainer.style.marginBottom = '10%';
      feedbackContainer.appendChild(feedbackParagraph);

      // Clear previous event listener
      document.getElementById('attention-check-selection-button')
          .removeEventListener('click', selectionHandler);

      // Update button text
      document.getElementById('attention-check-selection-button')
          .innerText = 'Continue';

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

      clearTimers();

      displayElement.innerHTML = '';
      jsPsych.finishTrial(trialData);
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
