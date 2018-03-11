const path = require('path');

module.exports = {
  entry: `${__dirname}/index.ts`,
  output: {
    filename: 'index.bundle.js',
    path: __dirname,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};