import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["public/*.js", "public/*.map"]), {
    extends: [
        ...compat.extends("plugin:@typescript-eslint/recommended"),
        ...compat.extends("eslint:recommended"),
        ...compat.extends("plugin:react/recommended"),
        ...compat.extends("plugin:@next/next/recommended"),
        ...compat.extends("prettier")
    ],

    plugins: {
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.commonjs,
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "react/react-in-jsx-scope": "off",

        "react/jsx-filename-extension": [1, {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        }],

        "prettier/prettier": "error",
    },
}]);