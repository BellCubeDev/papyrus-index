import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from "eslint-plugin-react-hooks";

import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const gitignorePath = path.resolve(dirname, ".gitignore");

/** @type {import("eslint").Linter.Config[]}*/
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    ignores: ["src/forks/"],
  },
  includeIgnoreFile(gitignorePath),
  pluginJs.configs.all,
  tseslint.configs.base,
  pluginReact.configs.flat.all,
  {
    settings: {
      react: {
        version: "19.0",
      },
    },
  },
  {
    plugins: {
      'react-compiler': reactCompiler,
      'react-hooks': reactHooks,
      "@next/next": pluginNext,
    },
  },
  {
    settings: {
      next: {
        rootDir: "src/platforms/next/",
      },
    },
  },

  {
    rules: {
      // covered by EITHER typescript-eslint or TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",


      // Style Guide Rules: Customized
      "semi": ["warn", "always", {omitLastInOneLineBlock: true}],
      "one-var": ["warn", "never"],
      "func-style": ["warn", "declaration", {allowArrowFunctions: true}],
      "curly": ["warn", "multi-or-nest", "consistent"],
      "react/jsx-wrap-multilines": ["warn", {declaration: "never", assignment: "never", return: "never", arrow: "never", condition: "never", logical: "never", prop: "never"}],
      "react/no-multi-comp": ["warn", { "ignoreStateless": true }],
      "max-lines": ["warn", {max: 400, skipBlankLines: true, skipComments: true}],
      "camelcase": ["warn", {properties: "never", ignoreDestructuring: true, allow: ["__INTERNAL__"]}],
      "react/jsx-pascal-case": ["warn", {allowAllCaps: true, ignore: ["*__INTERNAL__*"]}],
      "prefer-const": ["warn", {destructuring: "all"}],
      "react/jsx-no-useless-fragment": ["warn", {allowExpressions: true}],
      "complexity": ["warn", {max: 20, variant: "modified"}], // switches are great! And don't create a lot of mental complexity!
      "react/jsx-handler-names": ["warn", {eventHandlerPrefix: "handle", eventHandlerPropPrefix: "off"}], // so we can still use things like `auth.logOut` for our handlers
      "react/prefer-read-only-props": ["warn"],
      "react/jsx-curly-newline": ["warn", {multiline: "consistent", singleline: "consistent"}],
      "react/jsx-max-props-per-line": ["warn", {maximum: {single: 4, multi: 2} }],
      "react/self-closing-comp": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: false, // may need to re-enable this if we start using this feature
        }
      ],


      // Logic Rules
      "react/jsx-filename-extension": ["error", {extensions: [".jsx", ".tsx"]}],
      "react-compiler/react-compiler": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      //'react-native/no-unused-styles': "off",
      //'react-native/no-inline-styles': "off",
      //'react-native/no-color-literals': "warn",
      //'react-native/sort-styles': "off",
      //'react-native/split-platform-components': "error",
      //'react-native/no-raw-text': "error",
      //'react-native/no-single-element-style-arrays': "off",



      // Disabled Rules
      "@typescript-eslint/no-console": "off",
      "@typescript-eslint/no-unreachable": "off",
      "@typescript-eslint/no-extra-parens": "off",
      "no-control-regex": "off",
      "capitalized-comments": "off",
      "sort-imports": "off",
      "sort-keys": "off",
      "no-magic-numbers": "off",
      "no-console": "off",
      "no-inline-comments": "off",
      "no-use-before-define": "off", // effectively covered by TS
      "max-params": "off", // while I do agree with the idea, it's not exactly right for this codebase
      "prefer-destructuring": "off",
      "no-plusplus": "off",
      "id-length": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "no-continue": "off",
      "no-loop-func": "off",
      "init-declarations": "off",
      "require-atomic-updates": "off",
      "react/jsx-props-no-spreading": "off",
      "default-case": "off",
      "react/jsx-sort-props": "off",
      "react/jsx-first-prop-new-line": "off",
      "no-lonely-if": "off",
      "react/jsx-closing-bracket-location": "off",
      "react/jsx-newline": "off",
      "new-cap": "off",
      "max-statements": "off",
      "max-lines-per-function": "off",
      "consistent-return": "off",
      "no-else-return": "off", // Sorry, but I think it's more readable to put the `else` in there
      "no-warning-comments": "off",
      "react/react-in-jsx-scope": "off", // Next.js and Expo both handle this in their bundling processes
      "react/jsx-max-depth": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/jsx-no-literals": "off",
      "no-negated-condition": "off",
      "react/forbid-component-props": "off",
      "no-nested-ternary": "off",
      "no-promise-executor-return": "off",
      "no-underscore-dangle": "off",
      "no-param-reassign": "off",
      "no-redeclare": "off", // covered by TypeScript, also errors for overflows
      "react/destructuring-assignment": "off",
      "react/jsx-closing-tag-location": "off", // everything I care about is covered by the rule "react/jsx-indent"
      "prefer-arrow-callback": "off", // for components, named functions are more useful
      "react/require-default-props": "off", // TS covers everything we'd ever need with this
      "no-useless-constructor": "off", // This will throw when using a constructor with properties declared in the constructor
      "no-labels": "off",
      "no-extra-label": "off",
      "consistent-this": "off",
    }
  }
];
