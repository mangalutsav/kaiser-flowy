var webpack = require('webpack');
var path = require('path');
var AsyncAwaitPlugin = require('webpack-async-await') ;

var SRC_DIR = path.join(__dirname, 'src');

module.exports = {
  debug: true,
  errorDetails: true,
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/assets/js/app.tsx'
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel', 'eslint-loader'],
        include: SRC_DIR,
      },
      {
        test: /\.tsx?$/,
        loaders: [
          'react-hot', 'babel', 'awesome-typescript-loader', 'tslint',
        ],
        include: SRC_DIR
      },
      {
        test: /\.(sass|css)$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot)(\?.*$|$)/,
        loader: 'file'
      },
    ]
  },
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'static', 'build'),
    publicPath: '/build/'
  },
  plugins: [
    new AsyncAwaitPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    // new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.jsx', '.js', '.tsx', '.ts']
  },
  tslint: {
    emitErrors: true,
    failOnHint: false
  },
  eslint: {
    configFile: '.eslintrc'
  }
};
