# jspsych-attention-check

_A jsPsych plugin for creating attention-check questions._

_Note: This package is NOT compatible with jsPsych versions >= 7.0._

![npm](https://img.shields.io/npm/v/jspsych-attention-check) ![npm](https://img.shields.io/npm/dt/jspsych-attention-check)

To install this package compatible with jsPsych v6.3 or earlier:

```Shell
$ npm install jspsych-attention-check@2.2.0
```

or,

```Shell
$ yarn add jspsych-attention-check@2.2.0
```

> [!WARNING]
> Version 2.2.0 introduces breaking changes to the jsPsych parameters. Review the _Parameters_ section carefully!

## Overview

This plugin allows two styles of attention-check questions to be displayed, while supporting keyboard input schemes for the radio button display style. Additional features include an input timeout, rich feedback capabilities, and the ability to ask the participant for confirmation before submitting their response.

The plugin makes use of React and the [Grommet](https://v2.grommet.io) UI library, an accessibility-first library that provides a number of useful components. Given that jsPsych experiments may not use React, the plugin will clean up after itself to ensure there are no issues mixing a React-based component with a non-React experiment.

## Parameters

| Name | Type | Required? | Description | Example |
| - | - | - | - | - |
| `prompt` | `string` | Yes | The prompt to be presented to the participant. | |
| `style` | `radio` or `default` | No (default: `default`) | Change the display style of the responses. `radio` displays the responses as a set of radio buttons, and is the only display format supporting keyboard input configuration. `default` displays the options as a drop-down list. | |
| `responses` | `string[]` | Yes | A list of responses that will be presented to the participant for them to select from. | `["Response A", "Response B", "Response C"]` |
| `feedback` | `{ correct: string, incorrect: string }` | Yes | Specify feedback to be presented depending on a correct or incorrect answer. | `{correct: "Correct feedback.", incorrect: "Incorrect feedback."}` |
| `input_timeout` | `number` | No (default: `0`) | Specify an input timeout that must expire before a participant is permitted to interact with the attention-check question. | `1000` |
| `input_schema` | `{ select: string \| null, next: string \| null, previous: string \| null }` | Yes | Specify the input schema for using the keyboard to interact with the responses. Set each item to a string representation of a keyboard key to enable keyboard input, or leave all as `null` to disable keyboard input. | `{ select: "3", next: "2", previous: "1" }` |
| `confirm_continue` | `boolean` | Yes | Optionally display a confirmation message before submitting a selected response. | `{confirm: true, key: " "}` |

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
  prompt:
    "In this task, who will be choosing the points you and your partner get?",
  style: "radio",
  responses: ["A lottery", "Me", "My partner"],
  correct: 1,
  feedback: {
    correct: "Correct!",
    incorrect: "Incorrect!",
  },
  input_timeout: 2000,
  input_schema: {
    select: "3",
    next: "2",
    previous: "1",
  },
  confirm_continue: true,
});
```

The following example displays responses as a drop-down, does not use keyboard input, and does not require confirmation.

```javascript
timeline.push({
  type: "attention-check",
  prompt:
    "In this task, who will be choosing the points you and your partner get?",
  style: "default",
  responses: ["A lottery", "Me", "My partner"],
  correct: 1,
  feedback: {
    correct: "Correct!",
    incorrect: "Incorrect!",
  },
  input_timeout: 2000,
  input_schema: {
    select: null,
    next: null,
    previous: null,
  },
  confirm_continue: false,
});
```
