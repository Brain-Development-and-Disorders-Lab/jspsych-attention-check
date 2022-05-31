import { Box, Heading, RadioButtonGroup, Select, Text } from "grommet";
import React, { useState } from "react";

declare type ResponseFieldProps = {
  input: "default" | "radio";
  responses: { value: string, key: string, correct: boolean }[];
};

const ResponseField = (props: ResponseFieldProps) => {
  const [response, setResponse] = useState("");

  return (
    <Box pad="medium" border round>
      <Heading level={2} margin={{top: "small"}}>Please select an option from the list below.</Heading>
      {props.input === "default" ?
        <Select
          name="responses"
          options={props.responses.map((r) => {
            return {
              disabled: false,
              id: r.key,
              label: <Box>Option 1: LSkdfnslkdfn</Box>
            };
          })}
          onChange={(event) => setResponse(event.target.value)}
          size="large"
        />
      :
        <RadioButtonGroup
          name="responses"
          options={props.responses.map((r) => {
            return {
              disabled: false,
              id: r.key,
              label: <Box><Text size="2xl">AAA</Text></Box>,
              value: r.key
            };
          })}
          onChange={(event) => setResponse(event.target.value)}
        />
      }
    </Box>
  );
};

export default ResponseField;
