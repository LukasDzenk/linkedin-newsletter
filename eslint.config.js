import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    {
        ignores: ['**/dist/'],
    },
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier,
        },

        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            'prettier/prettier': 'warn', // Warns about formatting issues that Prettier can fix
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warns about unused variables, except those prefixed with _
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // TypeScript-specific rule for unused variables, except those prefixed with _
            curly: 'error', // Enforces consistent use of curly braces in control statements
            'arrow-body-style': ['error', 'always'], // Requires arrow function bodies to be wrapped in curly braces
            // 'require-await': 'error', // Disallows async functions that don't use await
            'prefer-arrow-callback': 'error', // Suggests using arrow functions for callbacks
            'no-console': 'error', // Disallows the use of console statements in production code
        },
    },
]
