class Formatter {
  #dimention;

  constructor(dimention) {
    this.#dimention = dimention;
  }

  generateFormatedContent(matrix) {
    const separator = `\n${"-----".repeat(matrix[0].length)}\n`;
    let content = "";
    for (let rowIndex = 0; rowIndex <= this.#dimention; rowIndex++) {
      for (let columnIndex = 0; columnIndex <= this.#dimention; columnIndex++) {
        const number = matrix[rowIndex][columnIndex];
        const value =
          number === null ? "    " : ` ${number.toString().padStart(2)} `;
        content += value + "|";
      }
      content += separator;
    }
    return content;
  }
}

export default Formatter;
