class Position {
  #dimention;
  #currentRow;
  #currentColumn;

  constructor(dimention) {
    this.#dimention = dimention;
    this.#currentRow = 1;
    this.#currentColumn = 1;
  }

  row() {
    return this.#currentRow;
  }

  column() {
    return this.#currentColumn;
  }

  moveNext() {
    if (this.#isBottomRow() && this.#isRightColumn()) {
      return;
    }

    this.#currentColumn++;
    if (this.#currentColumn > this.#dimention) {
      this.#currentColumn = 1;
      this.#currentRow++;
    }
  }

  moveUp() {
    if (this.#isTopRow()) {
      return;
    }
    this.#currentRow--;
  }

  moveDown() {
    if (this.#isBottomRow()) {
      return;
    }
    this.#currentRow++;
  }

  moveRight() {
    if (this.#isRightColumn()) {
      return;
    }
    this.#currentColumn++;
  }

  moveLeft() {
    if (this.#isLeftColumn()) {
      return;
    }
    this.#currentColumn--;
  }

  #isTopRow() {
    return this.#currentRow === 1;
  }

  #isBottomRow() {
    return this.#currentRow === this.#dimention;
  }

  #isRightColumn() {
    return this.#currentColumn === this.#dimention;
  }

  #isLeftColumn() {
    return this.#currentColumn === 1;
  }
}

export default Position;
