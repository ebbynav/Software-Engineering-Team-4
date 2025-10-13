module.exports = {
  // General formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // JSX formatting
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  jsxSingleQuote: false,

  // Line endings (auto handles cross-platform)
  endOfLine: 'auto',

  // Files to format
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
  ],
};
