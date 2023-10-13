import { getChangeBackColor, getResetBackColor } from "./ansi-escape.js";

class Formatter {
  #dimention;

  constructor(dimention) {
    this.#dimention = dimention;
  }

  static generateHeader() {
    return "----------------- Square Calculations -----------------\n";
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
        if (isMistake) {
          content += getChangeBackColor("41");
        }
        const number = matrix[rowIndex][columnIndex];
        const value = number === null ? "  " : number.toString().padStart(2);
        content += value;
        if (isMistake) {
          content += getResetBackColor();
        }
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
