/*
 * @Descripttion: 
 * @Date: 2019-09-05 10:19:33
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 10:19:33
 */
const config = require('./config')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const utils = require('./utils')
const webpackBaseConfig = require('./webpack.base.config')

const devPort = 8080

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './example/src/main.js'
  },
  output: {
    path: utils.resolveDir('dist/example'),
    filename: '[name].js',
    // 输出之后的base url的路径
    publicPath: config.dev.assetsPublicPath,
    globalObject: 'this'
  },
  // resolveLoader: {
  //   modules: [
  //     'node_modules',
  //   ]
  // },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [{
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            },
          }
        }]
      },
      {
        test: /\.css$/,
        oneOf: [{
          resourceQuery: /module/,
          use: [{
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }]
        }, {
          resourceQuery: /\?vue/,
          use: [{
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          }]
        }, {
          test: /\.module\.\w+$/,
          use: [{
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }]
        }, {
          use: [{
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          }]
        }]
      },
      {
        test: /\.less$/,
        oneOf: [{
            resourceQuery: /module/,
            use: [{
                loader: 'vue-style-loader',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          {
            resourceQuery: /\?vue/,
            use: [{
                loader: 'vue-style-loader',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false,
                }
              }
            ]
          },
          {
            test: /\.module\.\w+$/,
            use: [{
              loader: 'vue-style-loader',
              options: {
                sourceMap: false,
                shadowMode: false
              }
            }, {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:5]'
              }
            }, {
              loader: 'less-loader',
              options: {
                sourceMap: false,
              }
            }]
          },
          {
            use: [{
              loader: 'vue-style-loader',
              options: {
                sourceMap: false,
                shadowMode: false
              }
            }, {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2
              }
            }, {
              loader: 'less-loader',
              options: {
                sourceMap: false,

              }
            }]
          }
        ]
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.resolveDir('src'), utils.resolveDir('example')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // 定义所有文件里面的变量对应的值
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        BASE_URL: '"/"'
      }
    }),

    // new CaseSensitivePathsPlugin(),

    new FriendlyErrorsWebpackPlugin(),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    // new webpack.ProgressPlugin(),

    // html模板里面的base_url设置
    new HtmlWebpackPlugin({
      templateParameters: (compilation, assets, pluginOptions) => {
        // enhance html-webpack-plugin's built in template params
        let stats
        return Object.assign({
          // make stats lazy as it is expensive
          get webpack() {
            return stats || (stats = compilation.getStats().toJson())
          },
          compilation: compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: pluginOptions
          }
        }, {
          BASE_URL: '/'
        })
      },
      template: utils.resolveDir('example/public/index.html')
    }),

    new CopyWebpackPlugin(
      [{
        from: utils.resolveDir('example/public'),
        to: utils.resolveDir('dist/example'),
        toType: 'dir',
        ignore: [
          'index.html',
          '.DS_Store'
        ]
      }]
    )

  ],
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }, ],
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    // host: HOST || config.dev.host,
    port: devPort,
    publicPath: config.dev.assetsPublicPath,
    quiet: true,
    overlay: {
      errors: true
    },
    proxy: {
      '/vectors/tiled': { // 矢量切片接口
        // target: 'http://192.168.2.7:18081', // 接口域名
        target: 'http://192.168.2.7:8081/api/platform/map/service', // 接口域名
        changeOrigin: true // 是否跨域
      },
      '/offlines/tiled': { // 栅格切片接口
        // target: 'http://192.168.2.7:18081', // 接口域名
        target: 'http://192.168.2.7:8081/api/platform/map/service', // 接口域名
        changeOrigin: true // 是否跨域
      },
      '/analysis': {
        target: 'http://10.10.4.156:8081', // 接口域名
        changeOrigin: true // 是否跨域
      },
    }
  }
})
