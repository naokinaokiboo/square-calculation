const ANSI_ESC = "\x1b[";

const outAnsiEsc = (code) => {
  process.stdout.write(`${ANSI_ESC}${code}`);
};

const getAnsiEsc = (code) => {
  return `${ANSI_ESC}${code}`;
};

export const moveCursor = (absoluteY, absoluteX) => {
  outAnsiEsc(`${absoluteY};${absoluteX}H`);
};

export const moveCursorToLeft = (x = 1) => {
  outAnsiEsc(`${x}D`);
};

export const getChangeBackColor = (color) => {
  return getAnsiEsc(`${color}m`);
};

export const getResetBackColor = () => {
  return getAnsiEsc("0m");
};
