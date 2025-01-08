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
