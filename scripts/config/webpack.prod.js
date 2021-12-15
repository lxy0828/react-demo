const { merge } = require('webpack-merge')
// 清除dist文件夹旧的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
//   devtool: 'none',
  plugins: [
    new CleanWebpackPlugin(),
  ],
})
