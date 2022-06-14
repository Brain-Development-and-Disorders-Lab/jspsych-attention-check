# jspsych-attention-check

_A jsPsych plugin for creating attention-check questions._

_Note: This package is NOT compatible with jsPsych versions >= 7.0._

![npm](https://img.shields.io/npm/v/jspsych-attention-check) ![npm](https://img.shields.io/npm/dt/jspsych-attention-check)

Install this package:

```Shell
$ npm install jspsych-attention-check
```

or,

```Shell
$ yarn add jspsych-attention-check
```

## Overview

This plugin allows two styles of attention-check questions to be displayed, while supporting keyboard input schemes for the radio button display style. Additional features include an input timeout, rich feedback capabilities, and the ability to ask the participant for confirmation before submitting their response.

The plugin makes use of React and the [Grommet](https://v2.grommet.io) UI library, an accessibility-first library that provides a number of useful components. Given that jsPsych experiments may not use React, the plugin will clean up after itself to ensure there are no issues mixing a React-based component with a non-React experiment. Keyboard key graphics are displayed using [react-key-icons](https://github.com/henry-burgess/react-key-icons) components.

## Parameters

| Name | Type | Required? | Description | Example |
| ---- | ---- | --------- | ----------- | ------- |
| `prompt` | `string` | Yes | The prompt to be presented to the participant. | |
| `responses` | `{value: string, key: string \| null, correct: boolean}[]` | Yes | A list of response objects that the participant can select as their answer to the attention-check prompt. Each response object requires three parameters: `value`: The displayed text of the option; `key`: If the attention-check questions use keyboard input only, specify the corresponding keycode here. If not, this value should always be `null`; and `correct`: Boolean to mark if this response is the correct response or not. There can only be one correct response in each collection of responses. | `[{value: "Response A", key: "1", correct: true}, {value: "Response B", key: "2", correct: false}]` |
| `continue` | `{confirm: boolean, key: string \| null}` | Yes | Optionally display a confirmation message before submitting a selected response. | `{confirm: true, key: " "}` |
| `feedback` | `{correct: string, incorrect: string}` | Yes | Specify feedback to be presented depending on a correct or incorrect answer. | `{correct: "Correct feedback.", incorrect: "Incorrect feedback."}` |
| `style` | `radio` or `default` | No (default: `default`) | Change the display style of the responses. `radio` displays the responses as a set of radio buttons, and is the only display format supporting keyboard input configuration. `default` displays the options as a drop-down list. | |
| `input_timeout` | `number` | No (default: `0`) | Specify an input timeout that must expire before a participant is permitted to interact with the attention-check question. | `1000` |

## Data

Three data points are collected: `attentionRT`, `attentionSelected`, `attentionCorrect`:

- `attentionRT` (_number_): a float representing the time taken by the participant to select an option once input is permitted. Measured in milliseconds.
- `attentionSelected` (_string_): a string containing the value of the response selected by the participant.
- `attentionCorrect` (_boolean_): a boolean representing the correctness of the participant's response.

## Example Usage

You can add an attention-check to your jsPsych timeline like any other timeline node. The following example displays responses as a radio button group, and uses keyboard input only.

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
