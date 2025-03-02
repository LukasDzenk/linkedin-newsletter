export default {
    useTabs: false, // tabs mess with version control systems
    semi: false, // semi colons are unnecessary visual noise. "semi": false, -> Only add semicolons at the beginning of lines that [may introduce ASI failures](https://prettier.io/docs/en/rationale#semicolons).
    singleQuote: true, // less visual noise
    trailingComma: 'all', // for more uniformity. Add trailing commas to arrays, etc.
    tabWidth: 4, //
    printWidth: 100, // 100 is ideal for working on a small, single laptop screen without splitting the window
    bracketSpacing: true,
    arrowParens: 'always',
}
