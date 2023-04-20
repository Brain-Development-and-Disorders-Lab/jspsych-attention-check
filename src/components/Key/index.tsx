import React, { FC, ReactElement } from "react";

// Import styling
import "../../css/style.css";

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

  // Check if any of the toggle props are present
  const styleClasses = ["styled-key"];
  if (props.showCursor !== undefined && props.showCursor === false) {
    styleClasses.push("no-cursor");
  }

  if (props.disabled !== undefined && props.disabled === true) {
    // Disabled appearance
    styleClasses.push("styled-key-disabled");
  }

  if (props.disabled !== true && props.pressed === true) {
    // Pressed appearance
    styleClasses.push("styled-key-pressed");
  }

  // Set the height of the button if specified
  const customStyles = {
    height: props.height === undefined ? HEIGHT : Math.max(HEIGHT, props.height),
  }

  return (
    <button className={styleClasses.join(" ")} style={customStyles}>
      {presentedValue}
    </button>
  );
};

export default Key;
