const jsPsych = initJsPsych({
  on_finish: () => {
    jsPsych.data.displayData();
  },
});

const timeline = [
  {
    type: jsPsychAttentionCheck,
    prompt:
      "In this task, who will be choosing the points you and your partner get?",
    responses: [
      {
        value: "A lottery",
        key: "A",
        correct: false,
      },
      {
        value: "Me",
        key: "B",
        correct: true,
      },
      {
        value: "My partner",
        key: "C",
        correct: false,
      },
    ],
    style: "radio",
    continue: {
      confirm: true,
      key: " ",
    },
    feedback: {
      correct: "Correct!",
      incorrect: "Incorrect!",
    },
    input_timeout: 2000,
  },
];

jsPsych.run(timeline);
