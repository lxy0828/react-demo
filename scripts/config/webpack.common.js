const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('mini-css-extract-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const { resolve } = require('path')
const { isDev, PROJECT_PATH } = require('../constant')

const getCssLoaders = (importLoaders) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        // 修复一些和 flex 布局相关的 bug
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            grid: true,
            flexbox: 'no-2009'
          },
          stage: 3,
        }),
        require('postcss-normalize'),
      ],
      sourceMap: isDev,
    },
  },
]

module.exports = {
  entry: {
    app: resolve(PROJECT_PATH, './src/index.tsx'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
    path: resolve(PROJECT_PATH, './dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      'Src': resolve(PROJECT_PATH, './src'),
      'Components': resolve(PROJECT_PATH, './src/components'),
      'Utils': resolve(PROJECT_PATH, './src/utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
    ]
  },
  plugins: [
  	new HtmlWebpackPlugin({
      template: resolve(PROJECT_PATH, './public/index.html'),
      filename: 'index.html',
      cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      minify: isDev ? false : {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        useShortDoctype: true,
      },
    }),
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包',
      color: '#fa8c16',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          // context: resolve(PROJECT_PATH, './public'),
          from: '*',
          to: resolve(PROJECT_PATH, './dist'),
          toType: 'dir',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
    new webpack.BannerPlugin({
      raw: true,
      banner: '/** @preserve Powered by react-ts-quick-starter (lixingya) */',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',					// 开一个本地服务查看报告
      analyzerHost: '127.0.0.1',			// host 设置
      analyzerPort: 8888,							// 端口号设置
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      !isDev && new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] },
        }
      }),
      !isDev && new OptimizeCssAssetsPlugin()
    ].filter(Boolean),
    splitChunks: {
      chunks: 'all',
    },
  },
}

