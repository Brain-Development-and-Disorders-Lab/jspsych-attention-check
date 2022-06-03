// Parameters specified in the jsPsych plugin 'info' attribute.
declare type Info = {
  prompt: string;
  responses: { value: string; key: string | null; correct: boolean }[];
  feedback: { correct: string; incorrect: string };
  continue: { confirm: boolean; key: string | null };
  style: "default" | "radio";
  input_timeout: number;
};

declare type Trial = {
  type: string;
} & Info;
