module.exports = {
  "env": {
      "node": true,
      "es6": true,
      "jest": true,
  },
  "extends": "airbnb",
  "rules": {
      // Buffer uses constructor: `new Buffer.from(...)`
      "new-cap": "off",

      // Database references are done w/underscore notation
      "camelcase": "off",

      // Rejects returning a {success: false} object are acceptable
      "prefer-promise-reject-errors": "off",

      // Low-scope helpers defined within a class is acceptable
      "class-methods-use-this": "off",

      // Styles defined at bottom of file is clean
      "no-use-before-define": ["error", { "variables": false }],

      // Parenthesizing is preferred, just turning this off to reduce clutter
      "no-mixed-operators": "off",

      // In some cases, giving control to the function rather than the caller can be useful
      "no-param-reassign": "off",

      // When checking if null, abstract equality can actually be better, also some apis use strings for numbers
      "eqeqeq": "off",

      // No alternative logger added yet
      "no-console": "off",

      // Alerts are ok
      "no-alert": "off",

      "no-restricted-globals":"off",
      "no-control-regex":"off",
      "no-loop-func":"off",
      "no-underscore-dangle":"off",
      "no-multi-assign":"off",
      "global-require":"off",
      "import/no-dynamic-require":"off",
      "import/no-extraneous-dependencies":"off",
      "linebreak-style": 0,
      "no-bitwise":"off"
  }
};
