// Parameters specified in the jsPsych plugin 'info' attribute.
declare type Info = {
  prompt: string;
  responses: { value: string, key: string | null, correct: boolean }[];
  continue: { confirm: boolean, key: string | null };
  style: "default" | "radio";
  inputTimeout: number;
};

declare type Trial = {
  type: string;
} & Info;
