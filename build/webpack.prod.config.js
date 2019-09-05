/*
 * @Descripttion: 
 * @Date: 2019-09-05 10:19:33
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 10:19:33
 */
const utils = require('./utils')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    seemap: './src/index.js'
  },
  output: {
    path: utils.resolveDir('dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    library: 'seemap',
    libraryTarget: 'umd',
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    ol: {
      root: 'ol',
      commonjs: 'ol',
      commonjs2: 'ol',
      amd: 'ol'
    },
  },
  // prod 的文件中是不包含vue文件的
  module: {
    noParse: /^(ol|vue)/,
    rules: [{
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'less-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
        ]
      },
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.resolveDir('src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ]
})
