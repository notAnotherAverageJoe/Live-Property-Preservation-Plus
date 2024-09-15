module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/", "\\.(css|scss)$"],
  moduleDirectories: ["node_modules", "src"], // Ensure Jest can find the 'src' folder
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", // Handle CSS imports in tests
  },
};

// module.exports = {
//   transform: {
//     "^.+\\.jsx?$": "babel-jest",
//   },
//   testEnvironment: "jsdom",
//   transformIgnorePatterns: ["/node_modules/", "\\.(css|scss)$"],
// };
