"use strict";

/**
 * ESLint is really complicated right now, so all of it is abstracted away.
 * Updates coming soon (and hopefully to the built-in ember experience).
 */
const { configs } = require("@nullvoxpopuli/eslint-configs");

const config = configs.ember();

const hasTS = (globArray) => globArray.some((glob) => glob.includes("ts"));

// Setup newer TS-aware lints
function addTSProject(override) {
  if (!hasTS(override.files)) return override;

  return {
    ...override,
    /**
    * This is how you tell @typescript-eslint to use your tsconfig.
    * However, for gts files, we get this:
    *
       <repo>/app/components/welcome.gts
         0:0  error  Parsing error: ESLint was configured to run on
              `<tsconfigRootDir>/app/components/welcome.gts/0_<repo>/app/components/welcome.gts/0_<repo>/app/components/welcome.gts/0_<repo>/app/components/welcome.gts`
              using `parserOptions.project`: <tsconfigRootDir>/tsconfig.json
       However, that TSConfig does not include this file. Either:
       - Change ESLint's list of included files to not include this file
       - Change that TSConfig to include this file
       - Create a new TSConfig that includes this file and include it in your parserOptions.project

      This is likely because we need to configure the TS parser to use glint instead of tsc
    */
    // parserOptions: {
    //   ...override.parserOptions,
    //   extraFileExtensions: [".gts"],
    //   project: path.join(__dirname, "./tsconfig.json"),
    //   // TODO: try to set the Glint Program
    //   //   https://typescript-eslint.io/packages/parser/
    //   // program: import("@glint/core"),
    // },
    rules: {
      ...override.rules,
      // Disabled until the above issue is resolved
      "@typescript-eslint/prefer-optional-chain": "off",
    },
  };
}

module.exports = {
  ...config,
  overrides: [...config.overrides].map(addTSProject),
};
