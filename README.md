# jspsych-attention-check

_A jsPsych plugin for adding multiple-choice attention check questions to an experiment timeline._

_Note: This package is NOT compatible with jsPsych version 7.0._

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

`question`

- **Required:** yes
- **Type:** `String`
- **Description:** The question to be presented to the participant.

`options`

- **Required:** yes
- **Type:** `Array<String>`
- **Description:** A list of responses that the participant can select as their answer to the control question.

`options_radio`

- **Required:** no
- **Type:** `Boolean`
- **Description:** Change the options to display as a series of radio options instead of a drop-down.

`option_correct`

- **Required:** yes
- **Type:** `int`
- **Description:** The index of the correct response in the list of responses. Indexed from 0.

`option_keys`

- **Required:** no
- **Type:** `List<String>`
- **Description:** A list of keys that are allocated to selecting each of the options listed. Examples include: `'E'`, `' '` (Space bar), or `'Enter'`.

`button_text`

- **Required:** no
- **Type:** `String`
- **Description:** The text displayed on the button below the options.

`button_key`

- **Required:** no
- **Type:** `String`
- **Description:** A key that can be allocated to pressing the button if mouse input is not the only method of interaction. Examples include: `'E'`, `' '` (Space bar), or `'Enter'`.

`confirmation`

- **Required:** yes
- **Type:** `Boolean`
- **Description:** Confirm the submission of the participant's answer before continuing.

`feedback_correct`

- **Required:** yes
- **Type:** `String`
- **Description:** Feedback to be given for a correct answer.

`feedback_incorrect`

- **Required:** yes
- **Type:** `String`
- **Description:** Feedback to be given for an incorrect answer.

`feedback_function`

- **Required:** no
- **Type:** `Function`
- **Description:** The function called once feedback has been given.

`input_timeout`

- **Required:** no
- **Type:** `int`
- **Description:** A timeout to allow the participant to read the questions before allowing input, default time is 300 milliseconds.

`timeout`

- **Required:** no
- **Type:** `int`
- **Description:** A timeout for completing the control questions in milliseconds, default time is 30 seconds.

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
