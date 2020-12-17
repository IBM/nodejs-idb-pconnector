module.exports = {
  "extends": "airbnb-base",
  env: {
    node: true
  },
  rules: {
    // disable unresolved imports ie: idb-connector import will be unresolved when on non IBM i system.
    'import/no-unresolved': ['off', { commonjs: true }],
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        node: true,
        mocha: true,
      },
      extends: 'plugin:mocha/recommended',
      rules: {
        // These are set by airbnb-base, but go against Mocha conventions
        // See https://mochajs.org/#arrow-functions
        // and https://github.com/airbnb/javascript/issues/433
        'func-names': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  ],
};
