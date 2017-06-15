const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './ob.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ob.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
}
