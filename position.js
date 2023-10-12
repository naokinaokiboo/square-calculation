class Position {
  #dimention;
  #currentRow;
  #currentColumn;

  constructor(dimention) {
    this.#dimention = dimention;
    this.#currentRow = 1;
    this.#currentColumn = 1;
  }

  update() {
    this.#currentColumn++;
    if (this.#currentColumn > this.#dimention) {
      this.#currentColumn = 1;
      this.#currentRow++;
    }
  }

  row() {
    return this.#currentRow;
  }

  column() {
    return this.#currentColumn;
  }
}

export default Position;
