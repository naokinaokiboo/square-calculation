import enquirer from "enquirer";

const MENU_ID_EASY_MODE = 1;
const MENU_ID_NORMAL_MODE = 2;
const MENU_ID_QUIT = 3;

class SquareCalculation {
  #position;
  #inputCursor;
  #formatter;
  #matrix;
  #mistaks;

  async execute() {
    const menuId = await this.#showMenus();
    switch (menuId) {
      case MENU_ID_EASY_MODE:
        // TODO
        break;
      case MENU_ID_NORMAL_MODE:
        // TODO
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
}

export default SquareCalculation;
