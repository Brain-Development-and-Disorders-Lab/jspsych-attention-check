# jspsych-attention-check

_A jsPsych plugin for adding multiple-choice attention check questions to an experiment timeline._

_Note: This package is NOT compatible with jsPsych versions >= 7.0._

![npm](https://img.shields.io/npm/v/jspsych-attention-check)

![npm](https://img.shields.io/npm/dt/jspsych-attention-check)

Install this package:

```terminal
npm install jspsych-attention-check
```

or,

```terminal
yarn add jspsych-attention-check
```

## Parameters

### Question and options

Use these parameters to define the attention check prompt and the possible options.

`question`

- **Required:** yes
- **Type:** `String`
- **Description:** The question to be presented to the participant.

`options`

- **Required:** yes
- **Type:** `Array<String>`
- **Description:** A list of responses that the participant can select as their answer to the attention-check question.

`options_radio`

- **Required:** no
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Change the options to display as a series of radio options instead of a drop-down.

`option_correct`

- **Required:** yes
- **Type:** `int`
- **Description:** The index of the correct response in the list of responses. Indexed from 0.

`option_keys`

- **Required:** no
- **Type:** `List<String>`
- **Default:** `[]`
- **Description:** A list of keys that are allocated to selecting each of the options listed. Examples include: `'E'`, `' '` (Space bar), or `'Enter'`.

### Submit button

The 'submit' button is displayed to the participant before they submit their response.

`submit_button_key`

- **Required:** no
- **Type:** `String`
- **Default:** `''` (none)
- **Description:** A key that can be allocated to pressing the button if mouse input is not the only method of interaction. Examples include: `'E'`, `' '` (Space bar), or `'Enter'`.

`submit_button_text`

- **Required:** no
- **Type:** `String`
- **Default:** `Submit`
- **Description:** The text displayed on the submit button.

### Continue button

The 'continue' button is displayed to the participant after they submit their response.

`continue_button_text`

- **Required:** no
- **Type:** `String`
- **Default:** `Continue`
- **Description:** The text displayed on the continue button.

`continue_button_message_correct`

- **Required:** no
- **Type:** `String`
- **Default:** `Continue`
- **Description:** The message displayed next to the continue button after a correct response.

`continue_button_message_incorrect`

- **Required:** no
- **Type:** `String`
- **Default:** `Continue`
- **Description:** The message displayed next to the continue button after an incorrect response.

### Confirmation and feedback

Participants can be given the chance to confirm their answer before submitting. Additionally, the feedback for correct and incorrect answers can be specified.

`confirmation`

- **Required:** yes
- **Type:** `Boolean`
- **Description:** Require confirmation of the answer selection before submitting.

`feedback_correct`

- **Required:** yes
- **Type:** `String`
- **Description:** Feedback to be given for a correct answer.

`feedback_incorrect`

- **Required:** yes
- **Type:** `String`
- **Description:** Feedback to be given for an incorrect answer.

`input_timeout`

- **Required:** no
- **Type:** `int`
- **Default:** `300`
- **Description:** A timeout to allow the participant to read the questions before allowing input.

`main_timeout`

- **Required:** no
- **Type:** `int`
- **Default:** `30000`
- **Description:** A timeout for completing the attention-check question, measured in milliseconds.

## Example Usage

You can simply add an attention check to your jsPsych plugin like any other timeline element.

```javascript
timeline.push({
  type: 'attention-check',
  question: 'Why is 6 afraid of 7?',
  options: [
    'Because 7 is even and 6 is not.',
    'Because 7 is a better number.',
    'Because 7 8 9!',
  ],
  option_correct: 2,
  button_text: 'Submit Answer',
  feedback_correct: 'Correct!',
  feedback_incorrect: 'Incorrect.',
});
```
