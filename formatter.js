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

  generateContent(matrix, mistakes) {
    let content = "";
    if (matrix) {
      content += this.#generateFormattedContent(matrix, mistakes);
    }
    if (mistakes) {
      content += this.#generateFormattedResult(mistakes);
    }
    return content;
  }

  #generateFormattedContent(matrix, mistakes = null) {
    const separator = `\n${"-----".repeat(matrix[0].length)}\n`;
    let content = "";
    for (let rowIndex = 0; rowIndex <= this.#dimention; rowIndex++) {
      for (let columnIndex = 0; columnIndex <= this.#dimention; columnIndex++) {
        const isMistake =
          mistakes && this.#isMistake(rowIndex, columnIndex, mistakes);
        content += " ";
        const number = matrix[rowIndex][columnIndex];
        const numberText =
          number === null ? "  " : number.toString().padStart(2);
        content += isMistake
          ? changeBackColor(numberText, ANSI_BACK_COLOR_RED)
          : numberText;
        content += " |";
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

  #generateFormattedResult(mistakes) {
    const perfectScore = this.#dimention ** 2;
    const score = perfectScore - mistakes.length;
    let displayScore = "";
    if (score === perfectScore) {
      displayScore = `Perfect!!（${score} / ${perfectScore}）`;
    } else {
      displayScore = `${score} / ${perfectScore}`;
    }

    let resultMessage = `\n Your current score : ${displayScore}\n`;
    resultMessage += "\n Press any key to return to the menu.";
    return resultMessage;
  }
}

export default Formatter;
