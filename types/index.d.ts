// Parameters specified in the jsPsych plugin 'info' attribute.
declare type Info = {
  prompt: string;
  style: "default" | "radio";
  responses: string[];
  correct: number; // The correct response index
  feedback: {
    correct: string;
    incorrect: string;
  };
  input_timeout: number;
  input_schema: {
    select: string;
    next: string;
    previous: string;
  };
  confirm_continue: boolean;
};

declare type Trial = {
  type: string;
} & Info;
