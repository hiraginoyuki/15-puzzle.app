module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: './bundle.js'
  },

  mode: 'development',
  watch: true,
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss']
  },
  target: 'electron-renderer',

  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: 'local',
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
