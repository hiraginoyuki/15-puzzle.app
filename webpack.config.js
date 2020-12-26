const { resolve } = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "production",
  devtool: 'source-map',

  entry: './src/index.tsx',
  resolve: { extensions: [ '.ts', '.tsx', '.js', '.scss' ] },
  output: { path: resolve(__dirname, 'public/build'), filename: './bundle.js' },

  module: {
    rules: [
      { test: /\.scss$/,
        use: [
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
