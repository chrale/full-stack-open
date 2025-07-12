// all printing to its own module

// info for printing normal messages
const info = (...params) => {
  console.log(...params);
};

// error for printing error messages
const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
