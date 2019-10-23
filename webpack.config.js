const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = (env, arg) => ({
  mode: 'production',
  entry: './src/app/app.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
          'tslint-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: arg.mode === 'development' ? 'expanded' : 'compressed'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new CopyWebpackPlugin(
      [
        { from: 'src/public', to: '../' }
      ],
      { ignore: ['.DS_Store', 'Thumbs.db'] }
    ),
    new WriteFilePlugin(),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      jpegtran: {
        progressive: true
      }
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss']
  },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  devtool: arg.mode === 'development' ? 'source-map' : false,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000
  },
  performance: {
    hints: false
  }
});
