import enquirer from "enquirer";
import Position from "./position.js";
import Formatter from "./formatter.js";
import InputCursor from "./input-cursor.js";

const MENU_ID_EASY_MODE = 1;
const MENU_ID_NORMAL_MODE = 2;
const MENU_ID_QUIT = 3;

const DIMENTION_OF_EASY_MODE = 5;
const DIMENTION_OF_NORMAL_MODE = 10;

class SquareCalculation {
  #dimention;
  #position;
  #inputCursor;
  #formatter;
  #matrix;
  #mistakes;

  async execute() {
    const menuId = await this.#showMenus();
    switch (menuId) {
      case MENU_ID_EASY_MODE:
        this.#startNewGame(DIMENTION_OF_EASY_MODE);
        break;
      case MENU_ID_NORMAL_MODE:
        this.#startNewGame(DIMENTION_OF_NORMAL_MODE);
        break;
      case MENU_ID_QUIT:
        process.exit(0);
        break;
      default:
        // TODO
        break;
    }
  }

  async #showMenus() {
    const menus = [
      {
        id: MENU_ID_EASY_MODE,
        name: "Easy Mode (5 x 5 Grid)",
        description: "Start the game with 25 squares.",
      },
      {
        id: MENU_ID_NORMAL_MODE,
        name: "Normal Mode (10 x 10 Grid)",
        description: "Start the game with 100 squares.",
      },
      {
        id: MENU_ID_QUIT,
        name: "Quit",
        description: "Exit menu.",
      },
    ];
    const question = {
      type: "select",
      name: "value",
      message: "Please select a menu.",
      choices: menus.map((menu) => ({
        name: menu.name,
        value: menu.id,
      })),
      result() {
        return this.focused.value;
      },
      footer() {
        const descriptions = menus.map((mode) => mode.description);
        return "\n" + descriptions[this.index];
      },
    };

    this.#updateDisplay();
    const answer = await enquirer.prompt(question);
    return answer.value;
  }

  #startNewGame(dimention) {
    this.#dimention = dimention;
    this.#position = new Position(dimention);
    this.#formatter = new Formatter(dimention);
    this.#inputCursor = new InputCursor(this.#position);
    this.#initMatrix();
    this.#updateDisplay();
    this.#inputCursor.startKeyInput(this.update.bind(this));
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
      const content = this.#formatter.generateContent(
        this.#matrix,
        this.#mistakes
      );
      console.log(content);
    }
  }

  update(numStr) {
    const num = Number.parseInt(numStr);

    if (isNaN(num)) {
      // TODO
      // メッセージ「正しい数値を入力してください。」を追加する
      return;
    } else {
      this.#matrix[this.#position.row()][this.#position.column()] = num;
      this.#position.update();
    }

    this.#updateDisplay();
    this.#inputCursor.updateCursorPosition();

    if (this.#hasGameEnded()) {
      process.stdin.pause();
      process.stdin.removeAllListeners("data");
      this.#checkAnswer();
      this.#updateDisplay();

      process.stdin.resume();
      process.stdin.once("data", (key) => {
        process.stdin.pause();
        process.stdin.removeAllListeners("data");
        process.stdin.setRawMode(false);
        this.#releaseAllResources();
        this.execute();
      });
    }
  }

  #hasGameEnded() {
    return this.#position.row() > this.#dimention;
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

  #releaseAllResources() {
    this.#dimention = null;
    this.#position = null;
    this.#inputCursor = null;
    this.#formatter = null;
    this.#matrix = null;
    this.#mistakes = null;
  }
}

export default SquareCalculation;
