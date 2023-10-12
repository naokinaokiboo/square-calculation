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

    this.#clearConsole();
    const answer = await enquirer.prompt(question);
    return answer.value;
  }

  #clearConsole() {
    console.clear();
    console.log("----------------- Square Calculations -----------------\n");
  }

  #startNewGame(dimention) {
    this.#position = new Position(dimention);
    this.#formatter = new Formatter(dimention);
    this.#inputCursor = new InputCursor(this.#position);
    this.#initMatrix(dimention);

    const content = this.#formatter.generateFormatedContent(this.#matrix);
    this.#output(content);
  }

  #initMatrix(dimention) {
    this.#matrix = [];
    this.#matrix.push(["+", ...this.#generateRamdomNumbers(dimention)]);
    const verticalNumbers = this.#generateRamdomNumbers(dimention);
    for (const number of verticalNumbers) {
      this.#matrix.push([number, ...Array(dimention).fill(null)]);
    }
  }

  #generateRamdomNumbers(dimention) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, dimention);
  }

  #output(content) {
    this.#clearConsole();
    process.stdout.write(content);
  }
}

export default SquareCalculation;
