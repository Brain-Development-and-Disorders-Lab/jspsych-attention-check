import "jspsych";

// Our custom plugin
import "../src";

// Styling
import "../src/css/style.css";
import "jspsych/css/jspsych.css";

const timeline = [
  {
    type: "attention-check",
    prompt:
      "In this task, who will be choosing the points you and your partner get?",
    responses: [
      {
        value: "A lottery",
        key: null,
        correct: false,
      },
      {
        value: "Me",
        key: null,
        correct: true,
      },
      {
        value: "My partner",
        key: null,
        correct: false,
      },
    ],
    style: "default",
    continue: {
      confirm: true,
      key: null,
    },
    feedback: {
      correct: "Correct!",
      incorrect: "Incorrect!",
    },
    input_timeout: 2000,
  },
];

const nodeLoop = {
  timeline: timeline,
  loop_function: function (data) {
    if (jsPsych.data.getLastTrialData().values()[0].correct === false) {
      return true;
    } else {
      return false;
    }
  },
};

jsPsych.init({
  timeline: [nodeLoop],
});
