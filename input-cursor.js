import { moveCursor, moveCursorToLeft } from "./ansi-escape.js";

const CODE_ETX = 0x03;
const CODE_BS = 0x08;
const CODE_CR = 0x0d;
const CODE_0 = 0x30;
const CODE_9 = 0x39;
const CODE_DEL = 0x7f;

const MAX_INPUT_DIGITS = 2;
const INITIAL_CURSOR_POSITION_X = 8;
const INITIAL_CURSOR_POSITION_Y = 5;

class InputCursor {
  #position;

  constructor(position) {
    this.#position = position;
  }

  startKeyInput(callback) {
    this.updateCursorPosition(this.#position);

    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);
    process.stdin.resume();

    let buffer = "";
    process.stdin.on("data", (key) => {
      const keyCode = key.charCodeAt(0);

      if (keyCode === CODE_ETX) {
        process.exit(0);
      } else if (keyCode === CODE_CR) {
        callback(buffer);
        buffer = "";
      } else if (CODE_0 <= keyCode && keyCode <= CODE_9) {
        if (buffer.length >= MAX_INPUT_DIGITS) {
          return;
        }
        buffer += key;
        if (buffer.length > 1) {
          moveCursorToLeft(buffer.length - 1);
        }
        process.stdout.write(buffer);
        moveCursorToLeft(1);
      } else if (keyCode === CODE_DEL || keyCode == CODE_BS) {
        this.#moveToLeftmostOfBuffer(buffer);
        buffer = this.#deleteEndOfBuffer(buffer);
        process.stdout.write(" " + buffer);
        moveCursorToLeft(1);
      }
    });
  }

  stopKeyInput() {
    process.stdin.pause();
    process.stdin.removeAllListeners("data");
  }

  updateCursorPosition() {
    const x = INITIAL_CURSOR_POSITION_X + 5 * (this.#position.column() - 1);
    const y = INITIAL_CURSOR_POSITION_Y + 2 * (this.#position.row() - 1);
    moveCursor(y, x);
  }

  #moveToLeftmostOfBuffer(buffer) {
    if (buffer.length > 1) {
      moveCursorToLeft(buffer.length - 1);
    }
  }

  #deleteEndOfBuffer(buffer) {
    return buffer.slice(0, -1);
  }
}

export default InputCursor;
