class Position {
  #dimention;
  #currentRow;
  #currentColumn;

  constructor(dimention) {
    this.#dimention = dimention;
    this.#currentRow = 1;
    this.#currentColumn = 1;
  }
}

export default Position;
