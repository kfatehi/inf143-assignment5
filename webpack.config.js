module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: './',
    library: "bundle",
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }
}
