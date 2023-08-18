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
          from: "src/images/",
          to({ _context, absoluteFilename }) {
            const imagePath = absoluteFilename.split('images/')[1]?.split('/')
            return Promise.resolve('assets/images/' + imagePath.splice(0, imagePath.length - 1).join('/') + '/[name][ext]');
          },
        }
      ],
    }),
  ]
})
