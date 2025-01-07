// React and Grommet
import React, { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Grommet,
  Heading,
  Keyboard,
  Layer,
  RadioButtonGroup,
  Select,
  Text,
} from "grommet";
import { Next } from "grommet-icons";

import { useTimeout } from "usehooks-ts";

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
  const [selectedResponseIndex, setSelectedResponseIndex] = useState(0);

  // Label of the continue button underneath the responses
  const [buttonLabel, setButtonLabel] = useState("Continue");

  // Enable or disable input depending on timeout conditions
  const [timeoutExpired, setTimeoutExpired] = useState(false);

  // Toggle confirmation text and feedback layer visibility
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Selection state if using alternate input scheme
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);
  const [elementFocused, setElementFocused] = useState(false);

  const useAlternateInput =
    props.input_schema.select !== null &&
    props.input_schema.next !== null &&
    props.input_schema.previous !== null;

  /**
   * Either prompt confirmation or check the response depending on
   * the 'continue' configuration
   * @return {void}
   */
  const continueTrial = (): void => {
    // Show the confirmation message if it enabled and has not been shown
    if (props.confirm_continue === true && showConfirmation === false) {
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
    setSelectionCorrect(props.responses.indexOf(finalSelection) === props.correct);
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
   * @param {React.KeyboardEvent<HTMLElement>} event the keyboard event to be processed
   * @return {void}
   */
  const keyboardHandler = (event: React.KeyboardEvent<HTMLElement>): void => {
    // Ignore all input if the timeout has not expired
    if (timeoutExpired === false) return;

    // Ignore all input if keyboard input is not enabled
    if (props.style === "default" || props.input_schema === null || event.repeat) return;

    const key = event.key.toString();

    if (key === props.input_schema.next || key === props.input_schema.previous) {
      if (elementFocused === false) {
        // Elements not yet focused, moving between UI elements
        setSelectedElementIndex(selectedElementIndex === 0 ? 1 : 0);
      } else if (selectedElementIndex === 0) {
        // Option within radio buttons
        let updatedSelectedResponseIndex = selectedResponseIndex;
        if (selection !== "" && key === props.input_schema.next) {
          updatedSelectedResponseIndex = selectedResponseIndex + 1 < props.responses.length ? selectedResponseIndex + 1 : props.responses.length - 1;
        } else if (selection !== "" && key === props.input_schema.previous) {
          updatedSelectedResponseIndex = selectedResponseIndex - 1 >= 0 ? selectedResponseIndex - 1 : 0;
        } else {
          updatedSelectedResponseIndex = 0;
        }

        // Update selection state
        setSelectedResponseIndex(updatedSelectedResponseIndex);
        setSelection(props.responses[updatedSelectedResponseIndex]);
      }
    } else if (key === props.input_schema.select) {
      if (selectedElementIndex === 1) {
        // Continue button
        if (selection !== "" && timeoutExpired) {
          continueTrial();
        }
      } else {
        setElementFocused(!elementFocused);
      }
    }
  };

  // Set a timeout to block input
  useTimeout(() => setTimeoutExpired(true), props.input_timeout);

  // Record start time
  const startTime = performance.now();

  // Return component
  return (
    <Grommet theme={Theme}>
      <Keyboard onKeyDown={keyboardHandler} target={"document"}>
        <Box direction={"column"} align={"center"} justify={"center"} gap={"small"} fill>
          <Heading size={"small"} level={"2"}>{props.prompt}</Heading>
          <Box
            pad={"medium"}
            margin={{ top: "xsmall", bottom: "large" }}
            align={"center"}
            justify={"center"}
            fill={"horizontal"}
            border={{
              color: useAlternateInput && selectedElementIndex === 0 && !elementFocused ? "lightgray" : "transparent",
              size: "large",
            }}
            round
          >
            {/* 'Select' component or 'RadioButtonGroup' component depending on configuration */}
            {props.style === "default" ? (
              // 'Select' component
              <Box width={{ max: "md" }} fill>
                <Select
                  name={"responses"}
                  options={props.responses.map((r) => {
                    return r;
                  })}
                  size={"medium"}
                  width={"large"}
                  value={selection}
                  onChange={({ option }) => setSelection(option)}
                  placeholder={"Select"}
                  disabled={!timeoutExpired}
                />
              </Box>
            ) : (
              // 'RadioButtonGroup' component with radio selectors visible
              <RadioButtonGroup
                name="responses"
                width={{ min: "small", max: "2xl" }}
                options={props.responses.map((r) => {
                  return {
                    id: r,
                    label: (
                      <Box
                        direction={"row"}
                        justify={"center"}
                        align={"center"}
                        gap={"medium"}
                        animation={"fadeIn"}
                      >
                        <Text size={"medium"}>{r}</Text>
                      </Box>
                    ),
                    value: r,
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
          <Box
            direction={"row"}
            gap={"medium"}
            pad={"none"}
            border={{
              color: useAlternateInput && selectedElementIndex === 1 ? "lightgray" : "transparent",
              size: "large",
            }}
            style={{ borderRadius: "32px" }}
            round
          >
            <Button
              label={buttonLabel}
              disabled={selection === "" || !timeoutExpired}
              onClick={() => continueTrial()}
              icon={<Next />}
              color={showConfirmation === false ? "brand" : "status-warning"}
              primary
              reverse
            />
          </Box>

          {/* Feedback dialog */}
          {showFeedback && (
            <Layer>
              <Box
                direction={"column"}
                pad={"medium"}
                gap={"medium"}
                align={"center"}
                fill
              >
                <Box>
                  {/* Top-level feedback heading */}
                  <Heading
                    level={"2"}
                    margin={"small"}
                    color={selectionCorrect === true ? "green" : "red"}
                  >
                    {selectionCorrect === true ? "Correct!" : "Incorrect."}
                  </Heading>
                </Box>

                {/* Prompt */}
                <Box>
                  <Text size={"large"}>{props.prompt}</Text>
                </Box>

                {/* Participant selection and correct response (if incorrect) */}
                <Box align={"left"} gap={"small"} fill>
                  <Box>
                    <Text size={"large"}>
                      <strong>You selected:</strong> "{selection}"
                    </Text>
                  </Box>
                  {selectionCorrect === false ? (
                    <Box>
                      <Text size={"large"}>
                        <strong>Correct response:</strong> "{props.responses[props.correct]}"
                      </Text>
                    </Box>
                  ) : null}

                  {/* Feedback for response */}
                  <Box>
                    <Text size={"large"}>
                      <strong>Feedback:</strong>{" "}
                      {selectionCorrect === true
                        ? props.feedback.correct
                        : props.feedback.incorrect}
                    </Text>
                  </Box>
                </Box>

                {/* Continue button */}
                <Box
                  direction={"row"}
                  gap={"medium"}
                >
                  <Button
                    label={"Continue"}
                    disabled={selection === ""}
                    onClick={() => endTrial()}
                    icon={<Next />}
                    color={"light-4"}
                    primary
                    reverse
                  />
                </Box>
              </Box>
            </Layer>
          )}
        </Box>
      </Keyboard>
    </Grommet>
  );
};

export default View;
