import 'jspsych';
import 'jspsych/plugins/jspsych-instructions';

// Our custom plugin (run `yarn build` first)
import '../dist/main';

// Styling
import '../src/buttons.css';
import 'jspsych/css/jspsych.css';

const timeline = [
  {
    type: 'instructions',
    pages: [
      '<h1>Instructions</h1><p>Page 1 😴</p>',
      '<h1>Instructions</h1><p>Page 2 🤔</p>',
      '<h1>Instructions</h1><p>Page 3 🧠</p>',
    ],
    show_clickable_nav: true,
  },
  {
    type: 'attention-check',
    question: 'In this task, ' +
        'who will be choosing the points you and your partner get?',
    options: [
      'A lottery',
      'Me',
      'My partner',
    ],
    options_radio: true,
    option_correct: 1,
    confirmation: true,
    feedback_correct: 'Correct! ' +
        'You will be choosing the points you and your partner get.',
    feedback_incorrect: 'Incorrect. Please review the instructions.',
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
