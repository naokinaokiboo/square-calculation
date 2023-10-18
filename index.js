import SquareCalculation from "./square-calculation.js";

const REQUIRED_TERMINAL_HEIGHT = 26;
const REQUIRED_TERMINAL_WIDTH = 55;

const terminalHeight = process.stdout.rows;
const terminalWidth = process.stdout.columns;

if (
  terminalHeight < REQUIRED_TERMINAL_HEIGHT ||
  terminalWidth < REQUIRED_TERMINAL_WIDTH
) {
  console.log("The terminal's width and height are insufficient. ");
  console.log("Please enlarge the terminal and run again.");
  console.log("The required width and height are 55 and 26, respectively.");
  console.log(
    `(Current width:${terminalWidth}, Current height:${terminalHeight})`
  );
} else {
  new SquareCalculation().execute();
}
