import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const eslintConfig = defineConfig([
  globalIgnores([
    "node_modules/**",
    "dist/**",
    ".output/**",
    ".nitro/**",
    "build/**",
    "src/routeTree.gen.ts",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["eslint-recommended"]?.rules,
      quotes: [
        "warn",
        "double",
        {
          avoidEscape: true,
        },
      ],
      curly: ["error", "all"],
    },
  },
]);

export default eslintConfig;
