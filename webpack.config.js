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
  target: 'electron-renderer',

  module: {
    rules: [
      {
        test: /(?<!\.module)\.(sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.module\.(sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: {
                mode: 'local'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
    ]
  }
};
