module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2020': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 11
  },
  'rules': {
    'arrow-spacing': [
      'error',
      { 'before': true, 'after': true }
    ],
    'eqeqeq': 'error',
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'no-console': 0,
    'no-trailing-spaces': 'error',
    'no-unused-vars': [
      'error',
      { 'args': 'all', 'argsIgnorePattern': '^_' }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  }
}
