import { MENU_ID_EASY_MODE, MENU_ID_NORMAL_MODE, main } from "./index.js";
import Position from "./position.js";
import Formatter from "./formatter.js";
import InputCursor from "./input-cursor.js";

const DIMENTION_OF_EASY_MODE = 5;
const DIMENTION_OF_NORMAL_MODE = 10;

class SquareCalculation {
  #dimention;
  #position;
  #inputCursor;
  #formatter;
  #matrix;
  #mistakes;

  constructor(menuId) {
    let dimention;
    if (menuId === MENU_ID_EASY_MODE) {
      dimention = DIMENTION_OF_EASY_MODE;
    } else if (menuId === MENU_ID_NORMAL_MODE) {
      dimention = DIMENTION_OF_NORMAL_MODE;
    }
    this.#dimention = dimention;
    this.#position = new Position(dimention);
    this.#formatter = new Formatter(dimention);
    this.#inputCursor = new InputCursor(this.#position);
    this.#initMatrix();
    this.#updateDisplay();
    this.#inputCursor.startKeyInput(
      this.update.bind(this),
      this.getCurrentNumber.bind(this),
      this.hasGameEnded.bind(this)
    );
  }

  update(numStr) {
    this.#matrix[this.#position.row()][this.#position.column()] =
      numStr === "" ? null : Number.parseInt(numStr);
  }

  getCurrentNumber() {
    return this.#matrix[this.#position.row()][this.#position.column()];
  }

  hasGameEnded() {
    if (!this.#allCellsFilled()) {
      return;
    }
    this.#inputCursor.stopKeyInput();
    this.#checkAnswer();
    this.#updateDisplay();
    this.#waitForSomeKeyInput();
  }

  #initMatrix() {
    this.#matrix = [];
    this.#matrix.push(["+", ...this.#generateRamdomNumbers()]);
    const verticalNumbers = this.#generateRamdomNumbers();
    for (const number of verticalNumbers) {
      this.#matrix.push([number, ...Array(this.#dimention).fill(null)]);
    }
  }

  #generateRamdomNumbers() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, this.#dimention);
  }

  #updateDisplay() {
    console.clear();
    console.log(Formatter.generateHeader());
    if (this.#matrix) {
      const content = this.#formatter.generateFormattedContent(
        this.#matrix,
        this.#mistakes
      );
      console.log(content);
    }
  }

  #allCellsFilled() {
    for (let rowIndex = 1; rowIndex <= this.#dimention; rowIndex++) {
      if (this.#matrix[rowIndex].includes(null)) {
        return false;
      }
    }
    return true;
  }

  #checkAnswer() {
    this.#mistakes = [];
    for (let rowIndex = 1; rowIndex <= this.#dimention; rowIndex++) {
      for (let columnIndex = 1; columnIndex <= this.#dimention; columnIndex++) {
        const answer = this.#matrix[0][columnIndex] + this.#matrix[rowIndex][0];
        if (this.#matrix[rowIndex][columnIndex] !== answer) {
          this.#mistakes.push([rowIndex, columnIndex]);
        }
      }
    }
  }

  #waitForSomeKeyInput() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", (_key) => {
      process.stdin.pause();
      process.stdin.removeAllListeners("data");
      main();
    });
  }
}

export default SquareCalculation;
