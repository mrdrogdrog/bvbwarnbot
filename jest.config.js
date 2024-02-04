/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.m?js$": "$1",
  },
  "testMatch": [
    "<rootDir>/tests/**/*.spec.mts"
  ],
  moduleFileExtensions: ['js', 'ts', 'mts'],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    //  to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
