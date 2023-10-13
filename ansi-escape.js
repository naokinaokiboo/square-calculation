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

export const changeBackColor = (text, color) => {
  return getAnsiEsc(`${color}m`) + text + resetTextSetting();
};

export const changeTextColor = (text, color) => {
  return getAnsiEsc(`${color}m`) + text + resetTextSetting();
};

export const changeTextBold = (text) => {
  return getAnsiEsc(`1m`) + text + resetTextSetting();
};

const resetTextSetting = () => {
  return getAnsiEsc("0m");
};
