const ANSI_ESC = "\x1b[";

const outAnsiEsc = (code) => {
  process.stdout.write(`${ANSI_ESC}${code}`);
};

export const moveCursor = (absoluteY, absoluteX) => {
  outAnsiEsc(`${absoluteY};${absoluteX}H`);
};

export const moveCursorToLeft = (x = 1) => {
  outAnsiEsc(`${x}D`);
};
