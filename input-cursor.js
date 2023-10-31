import { moveCursor, moveCursorToLeft, ANSI_ESC } from "./ansi-escape.js";

const CODE_ETX = 0x03;
const CODE_EOT = 0x04;
const CODE_BS = 0x08;
const CODE_CR = 0x0d;
const CODE_0 = 0x30;
const CODE_9 = 0x39;
const CODE_DEL = 0x7f;

const ANSI_ESC_UP = `${ANSI_ESC}A`;
const ANSI_ESC_DOWN = `${ANSI_ESC}B`;
const ANSI_ESC_RIGHT = `${ANSI_ESC}C`;
const ANSI_ESC_LEFT = `${ANSI_ESC}D`;

const MAX_INPUT_DIGITS = 2;
const INITIAL_CURSOR_POSITION_X = 8;
const INITIAL_CURSOR_POSITION_Y = 5;

class InputCursor {
  #position;
  #buffer;

  constructor(position) {
    this.#position = position;
    this.#buffer = "";
  }

  startKeyInput(
    updateNumberCallback,
    getBufferCallback,
    displayResultCallback
  ) {
    this.#updateCursorPosition(this.#position);

    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on("data", (key) => {
      const keyCode = key.charCodeAt(0);

      if (keyCode === CODE_ETX) {
        process.exit(0);
      } else if (keyCode === CODE_EOT) {
        updateNumberCallback(this.#buffer);
        displayResultCallback();
      } else if (CODE_0 <= keyCode && keyCode <= CODE_9) {
        if (this.#buffer.length >= MAX_INPUT_DIGITS) {
          return;
        }
        this.#buffer += key;
        if (this.#buffer.length > 1) {
          moveCursorToLeft(this.#buffer.length - 1);
        }
        process.stdout.write(this.#buffer);
        moveCursorToLeft(1);
      } else if (keyCode === CODE_DEL || keyCode === CODE_BS) {
        this.#moveToLeftmostOfBuffer();
        this.#buffer = this.#deleteEndOfBuffer();
        process.stdout.write(" " + this.#buffer);
        moveCursorToLeft(1);
      } else if (keyCode === CODE_CR) {
        if (this.#buffer === "") {
          return;
        }
        updateNumberCallback(this.#buffer);
        this.#moveCursorNext();
        this.#syncBuffer(getBufferCallback());
      } else if (key === ANSI_ESC_UP) {
        updateNumberCallback(this.#buffer);
        this.#moveCursorUp();
        this.#syncBuffer(getBufferCallback());
      } else if (key === ANSI_ESC_DOWN) {
        updateNumberCallback(this.#buffer);
        this.#moveCursorDown();
        this.#syncBuffer(getBufferCallback());
      } else if (key === ANSI_ESC_RIGHT) {
        updateNumberCallback(this.#buffer);
        this.#moveCursorRight();
        this.#syncBuffer(getBufferCallback());
      } else if (key === ANSI_ESC_LEFT) {
        updateNumberCallback(this.#buffer);
        this.#moveCursorLeft();
        this.#syncBuffer(getBufferCallback());
      }
    });
  }

  stopKeyInput() {
    process.stdin.pause();
    process.stdin.removeAllListeners("data");
  }

  #moveCursorNext() {
    this.#position.moveNext();
    this.#updateCursorPosition();
  }

  #moveCursorUp() {
    this.#position.moveUp();
    this.#updateCursorPosition();
  }

  #moveCursorDown() {
    this.#position.moveDown();
    this.#updateCursorPosition();
  }

  #moveCursorRight() {
    this.#position.moveRight();
    this.#updateCursorPosition();
  }

  #moveCursorLeft() {
    this.#position.moveLeft();
    this.#updateCursorPosition();
  }

  #updateCursorPosition() {
    const x = INITIAL_CURSOR_POSITION_X + 5 * (this.#position.column() - 1);
    const y = INITIAL_CURSOR_POSITION_Y + 2 * (this.#position.row() - 1);
    moveCursor(y, x);
  }

  #moveToLeftmostOfBuffer() {
    if (this.#buffer.length > 1) {
      moveCursorToLeft(this.#buffer.length - 1);
    }
  }

  #deleteEndOfBuffer() {
    return this.#buffer.slice(0, -1);
  }

  #syncBuffer(number) {
    this.#buffer = number === null ? "" : number.toString();
  }
}

export default InputCursor;
