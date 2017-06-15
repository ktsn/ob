const path = require('path')
const glob = require('glob')

const conf = require('./webpack.config')

conf.context = path.resolve(__dirname)
conf.entry = glob.sync('./test/**/*.ts')

conf.output = {
  path: path.resolve(__dirname, '.tmp'),
  filename: 'test.js'
}

conf.devtool = 'source-map'

conf.module = {
  rules: [
    { test: /\.ts$/, use: ['webpack-espower-loader', 'ts-loader'] }
  ]
}

module.exports = conf
