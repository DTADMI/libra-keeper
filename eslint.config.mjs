// eslint.config.mjs
import js from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import hooks from "eslint-plugin-react-hooks"
import a11y from "eslint-plugin-jsx-a11y"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Common TypeScript parser options
const tsParserOptions = {
  tsconfigRootDir: __dirname,
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion: "latest",
  sourceType: "module",
  project: "./tsconfig.json",
}

export default [
  // Global ignores
  {
    ignores: [
      // Dependencies
      "node_modules/",
      ".next/",

      // Build outputs
      "out/",
      "dist/",
      "build/",

      // Test files
      "**/*.test.*",
      "**/*.spec.*",
      "**/__tests__/",
      "coverage/",

      // Config files
      "*.config.*",

      // Environment files
      ".env*",

      // IDE specific files
      ".idea/",
      ".vscode/",
      "*.sublime-*",

      // Generated files
      ".next/",
      ".next-env.d.ts",

      // Public files
      "public/**",

      // Scripts
      "scripts/",
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript + React rules for project files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: tsParserOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      tseslint,
      react,
      "react-hooks": hooks,
      "jsx-a11y": a11y,
      "simple-import-sort": simpleImportSort,
    },
    settings: { react: { version: "detect" } },
    rules: {
      "no-undef": "off", // TypeScript handles this
      quotes: "off", // Handled by Prettier
      semi: ["warn", "always"],
      curly: ["warn", "all"],
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-unused-vars": "off", // Handled by @typescript-eslint/no-unused-vars

      // React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "off"/*[
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ]*/,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-var-requires": "error",

      // A11y
      "jsx-a11y/alt-text": "warn",

      // Imports
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },

  // JavaScript files (config files, scripts, etc.)
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      // Disable TypeScript-specific rules for JS files
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/restrict-template-expressions": "off",

      // Basic JS rules
      "no-unused-vars": "off",
      "no-undef": "warn",
      semi: ["warn", "always"],
    },
  },

  // Config files
  {
    files: ["**/*.config.{js,mjs,cjs,ts}"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    },
  },

  // Test files
  {
    files: ["**/__tests__/**/*", "**/*.test.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];
