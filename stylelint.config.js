
module.exports = {
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen']
    }]
  }
};