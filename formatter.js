import {
  changeBackColor,
  changeTextColor,
  changeTextBold,
} from "./ansi-escape.js";

const ANSI_BACK_COLOR_RED = "41";
const ANSI_TEXT_COLOR_MAGENTA = "35";

class Formatter {
  #dimention;

  constructor(dimention) {
    this.#dimention = dimention;
  }

  static generateHeader() {
    const headerText =
      "----------------- Square Calculations -----------------\n";
    const boldText = changeTextBold(headerText);
    return changeTextColor(boldText, ANSI_TEXT_COLOR_MAGENTA);
  }

  generateFormattedContent(matrix, mistakes) {
    let content = "";
    if (matrix) {
      content += this.#generateSquareParts(matrix, mistakes);
    }
    if (mistakes) {
      content += this.#generateResultParts(mistakes);
    } else {
      content += "\n" + this.#generateHelpMessage();
    }
    return content;
  }

  #generateHelpMessage() {
    return (
      "The following keys are available.\n" +
      "  0-9   : Input numerical values.\n" +
      " Enter  : Move the cursor to the next cell.\n" +
      " Arrows : Move the cursor in the specified direction.\n" +
      " BS/DEL : Erase one digit of the inputted number.\n" +
      " Ctrl+D : Scoring (Only when all cells have been filled in).\n" +
      " Ctrl+C : Quit the game."
    );
  }

  #generateSquareParts(matrix, mistakes = null) {
    const separator = `\n${"-----".repeat(matrix[0].length)}\n`;
    let content = "";
    for (let rowIndex = 0; rowIndex <= this.#dimention; rowIndex++) {
      for (let columnIndex = 0; columnIndex <= this.#dimention; columnIndex++) {
        const isMistake =
          mistakes && this.#isMistake(rowIndex, columnIndex, mistakes);
        const number = matrix[rowIndex][columnIndex];
        const numberText =
          number === null ? "  " : number.toString().padStart(2);
        const coloredNumberText = isMistake
          ? changeBackColor(numberText, ANSI_BACK_COLOR_RED)
          : numberText;
        content += ` ${coloredNumberText} |`;
      }
      content += separator;
    }
    return content;
  }

  #isMistake(rowIndex, columnIndex, mistakes) {
    for (const mistake of mistakes) {
      if (mistake[0] === rowIndex && mistake[1] === columnIndex) {
        return true;
      }
    }
    return false;
  }

  #generateResultParts(mistakes) {
    const perfectScore = this.#dimention ** 2;
    const score = perfectScore - mistakes.length;
    let displayScore = "";
    if (score === perfectScore) {
      displayScore = `Perfect!!（${score} / ${perfectScore}）`;
    } else {
      displayScore = `${score} / ${perfectScore}`;
    }

    return (
      `\n Your current score : ${displayScore}\n` +
      "\n Press any key to return to the menu."
    );
  }
}

export default Formatter;
