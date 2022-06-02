import {
  Box,
  Button,
  Heading,
  Layer,
  RadioButtonGroup,
  Select,
  Text,
} from "grommet";
import { Next } from "grommet-icons";
import React, { useState } from "react";
import Key from "react-key-icons";

declare type ResponseFieldProps = {
  callback: (data: any) => void;
} & Info;

const ResponseField = (props: ResponseFieldProps) => {
  // Component state
  const [selection, setSelection] = useState("");
  const [selectionCorrect, setSelectionCorrect] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Continue");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [responses] = useState(
    props.responses.map((r) => {
      return {
        disabled: false,
        id: r.value,
        label: (
          <Text size="xlarge" margin="small">
            {r.value}
          </Text>
        ),
        value: r.value,
      };
    })
  );
  const [correctResponse] = useState(
    props.responses.filter((r) => r.correct === true)[0].value
  );

  // Continue function
  const continueTrial = () => {
    // Show the confirmation message if it enabled and has not been shown
    if (props.continue.confirm && showConfirmation === false) {
      setButtonLabel("Confirm?");
      setShowConfirmation(true);
      return;
    }

    checkResponse(selection);
    setShowFeedback(true);
  };

  /**
   * Validate the status of the response
   * @param {string} finalSelection the selection made by the participant
   */
  const checkResponse = (finalSelection: string) => {
    setSelectionCorrect(finalSelection === correctResponse);
  };

  /**
   * End the trial, calling the callback function
   */
  const endTrial = () => {
    // Call the callback function
    props.callback({
      selection: selection,
      responseTime: performance.now() - startTime,
    });
  };

  // Create a keyboard event listener (for radio group only) if keys have been specified
  if (props.style === "radio" && props.continue.key !== null) {
    addEventListener("keypress", (event: KeyboardEvent) => {
      const key = event.key;
      if (
        key === props.continue.key.toLocaleLowerCase() &&
        showFeedback === true &&
        selection !== ""
      ) {
        // Confirmation shown, but trial not ended
        endTrial();
      } else if (
        key === props.continue.key.toLocaleLowerCase() &&
        selection !== ""
      ) {
        // Selection has been made, but confirmation not shown
        continueTrial();
      } else {
        // Select the corresponding option
        for (const response of props.responses) {
          if (
            response.key !== null &&
            response.key.toLocaleLowerCase() === key
          ) {
            setSelection(response.value);
          }
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
        margin={{ top: "xsmall", bottom: "large" }}
        align="center"
        justify="center"
        fill="horizontal"
        border
        round
      >
        <Heading level={2} margin={{ top: "small" }} fill>
          Please select an option from the{" "}
          {props.style === "default" ? "drop-down" : "list"} below.
        </Heading>
        {props.style === "default" ? (
          <Select
            name="responses"
            options={responses}
            labelKey="label"
            value={selection}
            size="medium"
            onChange={({ option }) => {
              setSelection(option);
            }}
          />
        ) : (
          <RadioButtonGroup
            name="responses"
            width={{ min: "small", max: "2xl" }}
            options={props.responses.map((r) => {
              return {
                disabled: false,
                id: r.value,
                label: (
                  <Box
                    direction="row"
                    justify="center"
                    align="center"
                    gap="small"
                    animation="fadeIn"
                  >
                    <Text size="xlarge">{r.value}</Text>

                    {/* Display the keyboard key if specified */}
                    {r.key !== null ? <Key value={r.key} /> : null}
                  </Box>
                ),
                value: r.value,
              };
            })}
            value={selection}
            onChange={(event) => setSelection(event.target.value)}
          />
        )}
      </Box>

      {/* 'Continue' button */}
      <Box direction="row" gap="small">
        <Button
          size="large"
          label={buttonLabel}
          disabled={selection === ""}
          onClick={() => continueTrial()}
          icon={<Next />}
          color={showConfirmation === false ? "light-4" : "status-warning"}
          primary
          reverse
        />
        {props.continue.key !== null ? (
          <Key value={props.continue.key} />
        ) : null}
      </Box>

      {/* Feedback dialog */}
      {showFeedback && (
        <Layer>
          <Box direction="column" pad="medium" gap="medium" align="center" fill>
            <Box>
              <Heading
                margin="small"
                color={selectionCorrect === true ? "green" : "red"}
              >
                {selectionCorrect === true ? "Correct!" : "Incorrect."}
              </Heading>
            </Box>
            <Box>
              <Text size="xlarge">{props.prompt}</Text>
            </Box>
            <Box align="left" gap="small" fill>
              <Box>
                <Text size="xlarge">
                  <strong>You selected:</strong> "{selection}"
                </Text>
              </Box>
              {selectionCorrect === false ? (
                <Box>
                  <Text size="xlarge">
                    <strong>Correct response:</strong> "{correctResponse}"
                  </Text>
                </Box>
              ) : null}
              <Box>
                <Text size="xlarge">
                  <strong>Feedback:</strong>{" "}
                  {selectionCorrect === true
                    ? props.feedback.correct
                    : props.feedback.incorrect}
                </Text>
              </Box>
            </Box>
            <Box direction="row" gap="small">
              <Button
                size="large"
                label="Continue"
                disabled={selection === ""}
                onClick={() => endTrial()}
                icon={<Next />}
                color="light-4"
                primary
                reverse
              />
              {props.continue.key !== null ? (
                <Key value={props.continue.key} />
              ) : null}
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default ResponseField;
