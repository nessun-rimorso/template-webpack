const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');
const CssMinimizer = require("css-minimizer-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin')

const { env } = process
// управление режимом сборки
// const { NODE_BUILD_MODE: buildMode = 'development' } = env
const { NODE_BUILD_MODE: buildMode = 'production' } = env

const { [buildMode]: buildConfig } = require('../template-webpack/build.config')
const bytes = 1024
const kBs = 5000
const maxEntrypointSize = bytes * kBs

module.exports = {
  mode: buildConfig.mode,

  entry: {
    index: './src/index.js',
    pageOne: './src/pages/page-one',
    pageTwo: './src/pages/page-two'
  },

  // точка сборки бандлов
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: '[path][hash][ext][query]'
  },

  // доступность source-map
  devtool: buildConfig.devTools,

  devServer: {
    static: './dist'
  },

  performance: {
    // не выводятся варнинги и ерроры
    // hints: false,
    maxAssetSize: maxEntrypointSize
  },

  // декларирование алиасов и расширений
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['.js', '.json', 'scss', '.png', 'jpg'],
  },

  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },

      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          miniCss.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext][query]'
        }
      },

      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      }
    ]
  },

  optimization: {
    chunkIds: 'named',
    emitOnErrors: true,
    mergeDuplicateChunks: true,
    innerGraph: buildConfig.innerGraph,

    // минификация JS для прода
    minimize: buildConfig.isMinificationJS,
    minimizer: [
      new TerserJSPlugin({
        parallel: true
      }),

      new CssMinimizer({
        parallel: true,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      title: 'Development',
      template: 'src/index.html',
      scriptLoading: 'defer',
      hash: true,
      chunks: [ 'index' ],
      minify: buildConfig.isMinifyHTML,
      showErrors: buildConfig.isShowErrors
    }),

    new HtmlWebpackPlugin({
      filename: 'pages/page-one.html',
      inject: 'body',
      title: 'Development',
      template: 'src/pages/page-one.html',
      scriptLoading: 'defer',
      hash: true,
      chunks: [ 'pageOne', 'index' ],
      minify: buildConfig.isMinifyHTML,
      showErrors: buildConfig.isShowErrors
    }),

    new HtmlWebpackPlugin({
      filename: 'pages/page-two.html',
      inject: 'body',
      title: 'Development',
      template: 'src/pages/page-two.html',
      scriptLoading: 'defer',
      hash: true,
      chunks: [ 'pageTwo' ],
      minify: buildConfig.isMinifyHTML,
      showErrors: buildConfig.isShowErrors
    }),

    new miniCss({
      filename: 'style.css',
    }),

    new FaviconsWebpackPlugin({
      logo: 'assets/images/cat-favicon.png',
      cache: true,
      mode: 'light',
      devMode: 'light',
      // outputPath: 'assets/images',
      prefix: 'assets/images/',
      favicons: {
        developerName: 'Anastasiya',
        background: '#ddd',
      }
    }),

    new DefinePlugin(
      buildConfig.env
    )
  ]
};