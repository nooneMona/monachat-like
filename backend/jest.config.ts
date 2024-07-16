export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["html"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
