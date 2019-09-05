/*
 * @Descripttion: 
 * @Date: 2019-09-05 10:19:33
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 10:19:33
 */
const path = require('path')
const utils = require('./utils')

module.exports = {
  context: path.resolve(__dirname, '../'),
  resolve: {
    alias: {
      '#': utils.resolveDir('src'),
      '@': utils.resolveDir('example/src'),
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: ['.js', '.jsx', '.vue', '.json'],
    modules: ['node_modules']
  },
  module: {
    rules: [{
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            }
          }
        }]
      },
    ]
  },
  plugins: [

  ],
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
}
