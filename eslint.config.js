import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { ignores: ["dist"] },
  {    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended"
    ],
    plugins: [
      reactHooks,
      reactRefresh,
      prettier,
      unusedImports
    ],    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", { "prefer": "type-imports" }],
      
      // React
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/prop-types": "off",
      "react/jsx-no-undef": "error",
      "react/no-unescaped-entities": "error",
      "react/jsx-fragments": ["warn", "syntax"],
      "react/jsx-no-duplicate-props": "error",
      
      // Code quality
      "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "smart"],
      
      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      
      // Prettier
      "prettier/prettier": ["warn", {}, { "usePrettierrc": true }]
    },
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // Disable project requirement to avoid file not found errors
        project: false,
      },
    },    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "prettier": prettier,
      "unused-imports": unusedImports,
    },rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", { "prefer": "type-imports" }],
      "@typescript-eslint/no-floating-promises": "warn",
      
      // React rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/prop-types": "off",
      "react/jsx-no-undef": "error",
      "react/no-unescaped-entities": "error",
      "react/jsx-fragments": ["warn", "syntax"],
      "react/jsx-no-duplicate-props": "error",
      "react-refresh/only-export-components": ["warn", { "allowConstantExport": true }],
      
      // Code quality rules
      "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "args": "after-used"
      }],
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "smart"],
      
      // Security rules
      "no-eval": "error",
      "no-implied-eval": "error",
      
      // Prettier integration
      "prettier/prettier": ["warn", {}, { "usePrettierrc": true }]
    },
  }
);
