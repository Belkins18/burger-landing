const CopyPlugin = require("copy-webpack-plugin");

const { merge } = require('webpack-merge')

const common = require('./webpack.common');
const paths = require("./paths");

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "src/images/*.*",
          to({ context, absoluteFilename }) {
            console.log({
              context,
              absoluteFilename
            })
            return Promise.resolve("assets/images/[name][ext]");
          },
        }
      ],
    }),
  ]
})