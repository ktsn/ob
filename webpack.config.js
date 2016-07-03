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
    modulesDirectories: ['node_modules'],
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
