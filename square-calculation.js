import enquirer from "enquirer";

class SquareCalculation {
  #position;
  #inputCursor;
  #formatter;
  #matrix;
  #mistaks;

  async startGame() {
    await this.#showMenus();
  }

  async #showMenus() {
    // TODO
  }
}

export default SquareCalculation;
