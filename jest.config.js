module.exports = {
  testEnvironment: 'node',
  testRegex: './test/.*\\.(test|spec)?\\.(mjs)$',
  transform: {
    "^.+\\.mjs$": "babel-jest",
  },
  "roots": [
    "<rootDir>/src"
  ],
  moduleFileExtensions: ["js", "jsx", "mjs"]
};
