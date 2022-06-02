import 'jspsych';

// Our custom plugin
import '../src';

// Styling
import '../src/css/style.css';
import 'jspsych/css/jspsych.css';

const timeline = [
  {
    type: 'attention-check',
    prompt: 'In this task, ' +
        'who will be choosing the points you and your partner get?',
    responses: [
      {
        value: 'Response A',
        key: 'A',
        correct: true,
      },
      {
        value: 'Response B',
        key: 'B',
        correct: false,
      },
    ],
    style: 'radio',
    continue: {
      confirm: true,
      key: 'C',
    },
    feedback: {
      correct: 'Correct!',
      incorrect: 'Incorrect!',
    },
  },
];

const nodeLoop = {
  timeline: timeline,
  loop_function: function(data) {
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
