module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // zod 4 ships ESM using `export * as ns from`, which the RN preset does not transform
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {'@': './src'},
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};
