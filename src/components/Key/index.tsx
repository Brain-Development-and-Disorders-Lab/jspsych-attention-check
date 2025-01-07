import React, { FC, ReactElement } from "react";
import styled from "styled-components";

// Setup a list of aliases
const aliases: {[key: string]: string} = {
  " ": "Space",
  "CONTROL": "Ctrl",
  "SHIFT": "Shft",
  "COMMAND": "Cmd",
  "WINDOWS": "Win",
  "OPTION": "Opt",
  "BACKSPACE": "Bksp",
}

declare type KeyProps = {
  value: string;
  height?: number;
  disabled?: boolean;
  pressed?: boolean;
  showCursor?: boolean;
};

const HEIGHT = 64;

const Key: FC<KeyProps> = (props: KeyProps): ReactElement => {
  let presentedValue = props.value;

  // Set single chars to uppercase
  if (props.value.length === 1) {
    presentedValue = presentedValue.toUpperCase();
  }

  // Normalize style of string and check aliases
  if (presentedValue.toUpperCase() in aliases) {
    presentedValue = aliases[presentedValue.toUpperCase()];
  }

  // Set the height of the button if specified
  const customStyles = {
    height: props.height === undefined ? HEIGHT : Math.max(HEIGHT, props.height),
  }

  const Button = styled.button<KeyProps>`
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: x-large;
    background-color: ${(props) => {
      if (props.disabled) return "#f3f3f3"; // Disabled
      if (props.pressed) return "#c2c2c2"; // Pressed, not disabled
      return "#e7e7e7"; // Not pressed, not disabled
    }};
    color: ${(props) => props.disabled ? "#b4b4b4" : "#575757"};
    width: auto;
    padding: 16px 24px;
    border-radius: 16px;
    border: 2px solid  ${(props) => props.pressed ? "#cbcbcb" : "#d8d8d8"};
    box-shadow: ${(props) => props.pressed ? "1.5px 1.5px #b8b8b8" : "3px 3px #d3d3d3"};

    &:after {
      display: block;
      padding-bottom: 100%;
    }
  `;

  return (
    <Button
      disabled={props.disabled}
      pressed={props.pressed}
      style={customStyles}
      value={presentedValue}
    />
  );
};

export default Key;
