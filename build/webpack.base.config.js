/*
 * @Descripttion: 
 * @Date: 2019-09-05 10:19:33
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:17:32
 */
const path = require('path')
const utils = require('./utils')

module.exports = {
  context: path.resolve(__dirname, '../'),
  resolve: {
    alias: {
      '#': utils.resolveDir('src'),
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: ['.js', '.jsx', '.vue', '.json', '.ts'],
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
      {
        test: /\.tsx?$/,
        use: [
          // tsc编译后，再用babel处理
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              // 加快编译速度
              transpileOnly: true,
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, '../tsconfig.json')
            }
          }
        ],
        exclude: /node_modules/
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
