const { resolve } = require("path");

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: resolve(__dirname, "public/build"),
    filename: './bundle.js'
  },

  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss']
  },
  target: 'web',

  module: {
    rules: [
      { test: /\.(sc|c)ss$/,
        loaders: [
          { loader: 'style-loader' },
          { loader: 'css-loader',
            options: {
              url: false,
              modules: { mode: 'local', localIdentName: "[local]__[hash:base64:8]" }
            }
          },
          { loader: 'sass-loader' }
        ]
      },
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};
