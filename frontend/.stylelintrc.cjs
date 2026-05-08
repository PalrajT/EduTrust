module.exports = {
  // Minimal Stylelint config to allow Tailwind/PostCSS at-rules
  rules: {
    // Allow Tailwind directives and PostCSS at-rules
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer']
    }],
  },
  ignoreFiles: ['**/node_modules/**', 'dist/**'],
}
