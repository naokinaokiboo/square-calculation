#!/usr/bin/env node

import enquirer from "enquirer";
import SquareCalculation from "./square-calculation.js";
import Formatter from "./formatter.js";

export const MENU_ID_EASY_MODE = 1;
export const MENU_ID_NORMAL_MODE = 2;
const MENU_ID_QUIT = 3;

const REQUIRED_TERMINAL_HEIGHT = 33;
const REQUIRED_TERMINAL_WIDTH = 60;

const hasSufficientTerminalSize = (terminalHeight, terminalWidth) => {
  return (
    terminalHeight < REQUIRED_TERMINAL_HEIGHT ||
    terminalWidth < REQUIRED_TERMINAL_WIDTH
  );
};

const warningMessage = (terminalHeight, terminalWidth) => {
  return (
    "The terminal's width and height are insufficient. \n" +
    "Please enlarge the terminal and run again.\n" +
    `The required width and height are ${REQUIRED_TERMINAL_WIDTH} and ${REQUIRED_TERMINAL_HEIGHT}, respectively.\n` +
    `(Current width:${terminalWidth}, Current height:${terminalHeight})`
  );
};

const showMenus = async () => {
  const menus = [
    {
      id: MENU_ID_EASY_MODE,
      name: "Easy Mode (5 x 5 Grid)",
      description: "Start the game with 25 squares.",
    },
    {
      id: MENU_ID_NORMAL_MODE,
      name: "Normal Mode (10 x 10 Grid)",
      description: "Start the game with 100 squares.",
    },
    {
      id: MENU_ID_QUIT,
      name: "Quit",
      description: "Exit menu.",
    },
  ];
  const question = {
    type: "select",
    name: "value",
    message: "Please select a menu.",
    choices: menus.map((menu) => ({
      name: menu.name,
      value: menu.id,
    })),
    result() {
      return this.focused.value;
    },
    footer() {
      const descriptions = menus.map((mode) => mode.description);
      return "\n  " + descriptions[this.index];
    },
  };

  console.clear();
  console.log(Formatter.generateHeader());
  try {
    const answer = await enquirer.prompt(question);
    return answer.value;
  } catch (err) {
    console.error("An unexpected error has occurred.");
    process.exit(1);
  }
};

export const mainMenu = async () => {
  const terminalHeight = process.stdout.rows;
  const terminalWidth = process.stdout.columns;
  if (hasSufficientTerminalSize(terminalHeight, terminalWidth)) {
    console.log(warningMessage(terminalHeight, terminalWidth));
    return;
  }

  const selectedMenuId = await showMenus();
  try {
    switch (selectedMenuId) {
      case MENU_ID_EASY_MODE:
      case MENU_ID_NORMAL_MODE:
        new SquareCalculation(selectedMenuId);
        break;
      case MENU_ID_QUIT:
        process.exit(0);
        break;
      default:
        throw new Error("Unknown menu is selected.");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    } else {
      throw err;
    }
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  mainMenu();
}
