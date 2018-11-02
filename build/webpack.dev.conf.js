'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const chunks = Object.keys(baseWebpackConfig.entry)

chunks.forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

console.log('assets: ', baseWebpackConfig.resolve.alias.assets)
console.log('context: ', baseWebpackConfig.context)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  optimization: {
    // minimizer: true,
    providedExports: true,
    // usedExports: true,
    // 识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    // 依赖于optimization.providedExports和optimization.usedExports
    // sideEffects: true,
    // 取代 new webpack.optimize.ModuleConcatenationPlugin()
    // concatenateModules: true,
    // 取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        commons: {
          test: /[\/]node_modules[\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    // 提取webpack运行时的代码
    // runtimeChunk: {
    //   name: 'manifest'
    // }
  },
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      },],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    // open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: false, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    staticOptions: {}
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()// HMR shows correct file names in console on update.
    // new webpack.NoEmitOnErrorsPlugin()
  ]
})

// 添加多页面应用的HTML页面生成
let htmlWebpackPlugins = utils.genHtmlWebpackPlugins(baseWebpackConfig.entry)
htmlWebpackPlugins.map(function (plugin) {
  devWebpackConfig.plugins.push(plugin)
})

module.exports = devWebpackConfig
