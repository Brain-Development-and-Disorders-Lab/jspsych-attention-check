# jspsych-attention-check

_A jsPsych plugin for adding attention check questions to an experiment timeline._

_Note: This package is NOT compatible with jsPsych versions >= 7.0._

![npm](https://img.shields.io/npm/v/jspsych-attention-check) ![npm](https://img.shields.io/npm/dt/jspsych-attention-check)

Install this package:

```terminal
npm install jspsych-attention-check
```

or,

```terminal
yarn add jspsych-attention-check
```

## Parameters

| Name | Type | Required? | Description | Example |
| ---- | ---- | --------- | ----------- | ------- |
| `prompt` | `string` | Yes | The prompt to be presented to the participant. | |
| `responses` | `{ value: string, key: string \| null, correct: boolean }[]` | Yes | A list of response objects that the participant can select as their answer to the attention-check prompt. Each response object requires three parameters: `value`: The displayed text of the option; `key`: If the attention-check questions use keyboard input only, specify the corresponding keycode here. If not, this value should always be `null`; and `correct`: Boolean to mark if this response is the correct response or not. There can only be one correct response in each collection of responses. | `[{value: "Response A", key: "1", correct: true}, {value: "Response B", key: "2", correct: false}]` |
| `continue` | `{confirm: boolean, key: string \| null}` | Yes | Optionally display a confirmation message before submitting a selected response. | `{confirm: true, key: " "}` |
| `feedback` | `{correct: string, incorrect: string}` | Yes | Specify feedback to be presented depending on a correct or incorrect answer. | `{correct: "Correct feedback.", incorrect: "Incorrect feedback."}` |
| `style` | `radio` or `default` | No (default: `default`) | Change the display style of the responses. `radio` displays the responses as a set of radio buttons, and is the only display format supporting keyboard input configuration. `default` displays the options as a drop-down list. | |
| `input_timeout` | `number` | No (default: `0`) | Specify an input timeout that must expire before a participant is permitted to interact with the attention-check question. | `1000` |

## Example Usage

You can simply add an attention check to your jsPsych plugin like any other timeline element. The following example displays responses as a radio button group, and uses keyboard input only.

```javascript
timeline.push({
  type: "attention-check",
  prompt: "Why is 6 afraid of 7?",
  responses: [
    {value: "Because 7 is even and 6 is not.", key: "1", correct: false},
    {value: "Because 7 is a better number.", key: "2", correct: false},
    {value: "Because 7 8 9!", key: "3", correct: true},
  ],
  style: "radio",
  continue: {
    confirm: true,
    key: " ",
  },
  feedback: {
    correct: "Correct!",
    incorrect: "Incorrect.",
  },
});
```

The following example displays responses as a drop-down, does not use keyboard input, and does not require confirmation.

```javascript
timeline.push({
  type: "attention-check",
  prompt: "Why is 6 afraid of 7?",
  responses: [
    {value: "Because 7 is even and 6 is not.", key: null, correct: false},
    {value: "Because 7 is a better number.", key: null, correct: false},
    {value: "Because 7 8 9!", key: null, correct: true},
  ],
  style: "default",
  continue: {
    confirm: false,
    key: null,
  },
  feedback: {
    correct: "Correct!",
    incorrect: "Incorrect.",
  },
});
```
