import { Box, Button, Heading, Layer, RadioButtonGroup, Select, Text } from "grommet";
import { Next, Revert } from "grommet-icons";
import React, { useState } from "react";
import Key from "react-key-icons";

declare type ResponseFieldProps = {
  style: "default" | "radio";
  prompt: string;
  responses: { value: string, key: string | null, correct: boolean }[];
  inputTimeout: number;
  continue: { confirm: boolean, key: string | null };
  callback: (data: any) => void;
};

const ResponseField = (props: ResponseFieldProps) => {
  // Generate the list of valid responses
  const [responses] = useState(props.responses.map((r) => {
    return {
      disabled: false,
      id: r.value,
      label: <Text size="xlarge" margin="small">{r.value}</Text>,
      value: r.value
    };
  }));

  // State
  const [selection, setSelection] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Create a keyboard event listener (for radio group only)
  if (props.style === "radio") {
    addEventListener('keypress', (event: KeyboardEvent) => {
      const key = event.key;
      for (const response of props.responses) {
        if (response.key !== null && response.key.toLocaleLowerCase() === key) {
          setSelection(response.value);
        }
      }
    });
  }

  // Record start time
  const startTime = performance.now();

  return (
    <>
      <Box
        pad="medium"
        margin={{top: "xsmall", bottom: "large"}}
        align="center"
        justify="center"
        fill="horizontal"
        border
        round
      >
        <Heading level={2} margin={{top: "small"}} fill>
          Please select an option from the {props.style === "default" ? "drop-down" : "list"} below.
        </Heading>
        {props.style === "default" ?
          <Select
            name="responses"
            options={responses}
            labelKey="label"
            value={selection}
            size="medium"
            onChange={({ option }) => {
              setSelection(option)
            }}
          />
        :
          <RadioButtonGroup
            name="responses"
            width={{min: "small", max: "2xl"}}
            options={props.responses.map((r) => {
              return {
                disabled: false,
                id: r.value,
                label:
                  <Box direction="row" justify="center" align="center" gap="small" animation="fadeIn">
                    <Text size="xlarge">
                      {r.value}
                    </Text>

                    {/* Display the keyboard key if specified */}
                    {r.key !== null ? <Key value={r.key} /> : null}
                  </Box>,
                value: r.value
              };
            })}
            value={selection}
            onChange={(event) => setSelection(event.target.value)}
          />
        }
      </Box>

      {/* 'Continue' button */}
      <Box direction="row" gap="small">
        <Button
          size="large"
          label="Continue"
          disabled={selection === ""}
          onClick={() => {
            if (props.continue.confirm) {
              setShowConfirmation(true);
            } else {
              props.callback({
                selection: selection,
                responseTime: performance.now() - startTime
              });
            }
          }}
          icon={<Next />}
          color="light-4"
          primary
          reverse
        />
        {props.continue.key !== null ? <Key value={props.continue.key} /> : null}
      </Box>

      {/* Confirmation dialog */}
      {showConfirmation &&
        <Layer>
          <Box direction="column" pad="medium" gap="medium" align="center" fill>
            <Box>
              <Heading margin="small">Confirmation</Heading>
            </Box>
            <Box>
              <Text size="xlarge">{props.prompt}</Text>
            </Box>
            <Box>
              <Text size="xlarge"><strong>You selected:</strong> "{selection}"</Text>
            </Box>
            <Box direction="row" gap="small">
              <Button
                size="large"
                label="Go Back"
                disabled={selection === ""}
                onClick={() => {
                  setShowConfirmation(false);
                }}
                icon={<Revert />}
                color="light-4"
              />
              <Button
                size="large"
                label="Continue"
                disabled={selection === ""}
                onClick={() => {
                  setShowConfirmation(false);
                }}
                icon={<Next />}
                color="light-4"
                primary
                reverse
              />
            </Box>
          </Box>
        </Layer>
      }
    </>
  );
};

export default ResponseField;
