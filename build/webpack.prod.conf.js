'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// const SentryPlugin = require('@sentry/webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[id].[chunkhash].js')
  },
  optimization: {
    // minimizer: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            properties: true,
            keep_fargs: false,
            pure_getters: true,
            collapse_vars: true,
            unsafe_comps: false,
            unsafe: false,
            warnings: false,
            sequences: true,
            dead_code: true,
            drop_debugger: true,
            comparisons: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          }
        }
      }),
    ],
    providedExports: true,
    // usedExports: true,
    // 识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    // 依赖于optimization.providedExports和optimization.usedExports
    // sideEffects: true,
    // 取代 new webpack.optimize.ModuleConcatenationPlugin()
    // concatenateModules: true,
    // 取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
    // noEmitOnErrors: true,
    splitChunks: {
      chunks: 'initial',//默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
      minSize: 30000,//合并前模块文件的体积
      minChunks: 1,//最少被引用次数
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,//敲黑板
          priority: -10//优先级更高
        },
        common: {
          name: 'common',
          test: /[\\/]src[\\/]/,
          minChunks: 2,//一般为非第三方公共模块
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: "manifest"
    }
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash].css'),
    }),
    // extract css into its own file
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? {
        safe: true,
        map: {
          inline: false
        }
      } : {
          safe: true
        }
    }),
    new webpack.HashedModuleIdsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }])
    // sentry: http://raven.clubfactory.com/sentry/
    // ex: https://juejin.im/post/5adb05fef265da0b79647421
    // new SentryPlugin({
    //   release: process.env.RELEASE_VERSION,
    //   include: './dist',
    //   ignore: ['node_modules', 'webpack.config.js'],
    //   configFile: 'sentry.properties',
    // })
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

// 增加HTML生成的插件
let htmlWebpackPlugins = utils.genHtmlWebpackPlugins(baseWebpackConfig.entry)
htmlWebpackPlugins.map(function (plugin) {
  webpackConfig.plugins.push(plugin)
})

module.exports = webpackConfig
