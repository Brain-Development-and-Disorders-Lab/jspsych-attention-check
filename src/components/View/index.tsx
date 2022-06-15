// React and Grommet
import React, { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Grommet,
  Heading,
  Layer,
  RadioButtonGroup,
  Select,
  Text,
} from "grommet";
import { Next } from "grommet-icons";

// Custom React hooks
import { useEventListener, useTimeout } from "usehooks-ts";

// Keyboard key icons
import Key from "react-key-icons";

// Custom theme
import { Theme } from "../../theme";

// Component props
declare type ViewProps = {
  callback: (data: any) => void;
} & Info;

/**
 * Construct and return the 'View' component
 * @param {ViewProps} props component props
 * @return {ReactElement}
 */
const View = (props: ViewProps): ReactElement => {
  // Participant selection and correctness
  const [selection, setSelection] = useState("");
  const [selectionCorrect, setSelectionCorrect] = useState(false);
  const [correctResponse] = useState(
    props.responses.filter((r) => r.correct === true)[0].value
  );

  // Label of the continue button underneath the responses
  const [buttonLabel, setButtonLabel] = useState("Continue");

  // Enable or disable input depending on timeout conditions
  const [timeoutExpired, setTimeoutExpired] = useState(false);

  // Toggle confirmation text and feedback layer visibility
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Either prompt confirmation or check the response depending on
   * the 'continue' configuration
   * @return {void}
   */
  const continueTrial = (): void => {
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
      attentionSelection: selection,
      attentionCorrect: selectionCorrect,
      attentionRT: performance.now() - startTime,
    });
  };

  /**
   * Generic keyboard handler, filters input and progresses trial
   * as required
   * @param event the keyboard event to be processed
   * @return {void}
   */
  const keyboardHandler = (event: KeyboardEvent): void => {
    // Ignore all input if the timeout has not expired
    if (timeoutExpired === false) return;

    // Ignore all input if keyboard input is not enabled
    if (props.style === "default" || props.continue.key === null) return;

    // Get key information
    const key = event.key;

    // Normalize key strings for comparison
    const submitKey = props.continue.key.toLocaleLowerCase();

    if (key === submitKey && showFeedback === true && selection !== "") {
      // Confirmation shown, but trial not ended
      endTrial();
    } else if (key === submitKey && selection !== "") {
      // Selection has been made, but confirmation not shown
      continueTrial();
    } else if (showFeedback === false) {
      // Select the corresponding option
      for (const response of props.responses) {
        if (response.key.toLocaleLowerCase() === key) {
          setSelection(response.value);
        }
      }
    }
  };

  // Set a timeout to block input
  useTimeout(() => setTimeoutExpired(true), props.input_timeout);

  // Setup an event listener for the 'keyup' event
  useEventListener("keyup", keyboardHandler);

  // Record start time
  const startTime = performance.now();

  // Return component
  return (
    <Grommet theme={Theme}>
      <Box direction="column" align="center" gap="small" fill>
        <Heading>{props.prompt}</Heading>
        <Box
          pad="medium"
          margin={{ top: "xsmall", bottom: "large" }}
          align="center"
          justify="center"
          fill="horizontal"
          border={{
            color: "light-4",
            size: "medium",
            side: "all",
          }}
          round
        >
          {/* 'Select' component or 'RadioButtonGroup' component depending on configuration */}
          {props.style === "default" ? (
            // 'Select' component
            <Box width={{ max: "large" }} fill>
              <Select
                name="responses"
                options={props.responses.map((r) => {
                  return r.value;
                })}
                size="medium"
                width="xlarge"
                value={selection}
                onChange={({ option }) => setSelection(option)}
                placeholder={"Select"}
                disabled={!timeoutExpired}
              />
            </Box>
          ) : (
            // 'RadioButtonGroup' component
            <RadioButtonGroup
              name="responses"
              width={{ min: "small", max: "2xl" }}
              options={props.responses.map((r) => {
                return {
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
              onChange={(event) => {
                // Update selection only if input is enabled
                if (timeoutExpired) setSelection(event.target.value);
              }}
              disabled={!timeoutExpired}
            />
          )}
        </Box>

        {/* 'Continue' button */}
        <Box direction="row" gap="small">
          <Button
            size="large"
            label={buttonLabel}
            disabled={selection === "" || !timeoutExpired}
            onClick={() => continueTrial()}
            icon={<Next />}
            color={showConfirmation === false ? "light-4" : "status-warning"}
            primary
            reverse
          />
          {props.continue.key !== null ? (
            <Key value={props.continue.key} disabled={selection === "" || !timeoutExpired} />
          ) : null}
        </Box>

        {/* Feedback dialog */}
        {showFeedback && (
          <Layer>
            <Box
              direction="column"
              pad="medium"
              gap="medium"
              align="center"
              fill
            >
              <Box>
                {/* Top-level feedback heading */}
                <Heading
                  margin="small"
                  color={selectionCorrect === true ? "green" : "red"}
                >
                  {selectionCorrect === true ? "Correct!" : "Incorrect."}
                </Heading>
              </Box>

              {/* Prompt */}
              <Box>
                <Text size="xlarge">{props.prompt}</Text>
              </Box>

              {/* Participant selection and correct response (if incorrect) */}
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

                {/* Feedback for response */}
                <Box>
                  <Text size="xlarge">
                    <strong>Feedback:</strong>{" "}
                    {selectionCorrect === true
                      ? props.feedback.correct
                      : props.feedback.incorrect}
                  </Text>
                </Box>
              </Box>

              {/* Continue button */}
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
      </Box>
    </Grommet>
  );
};

export default View;
