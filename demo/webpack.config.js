import HtmlWebpackPlugin from 'html-webpack-plugin';
import path, { dirname } from 'path';
// import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const folderPath = dirname(fileURLToPath(import.meta.url));

const config = {
  mode: 'development',
  entry: './client/index.jsx',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(folderPath, 'build'),
    clean: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: './client/index.html' })],
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(folderPath, 'build'),
      publicPath: '/',
    },
    port: 8080,
    host: '0.0.0.0',
    historyApiFallback: true,
    compress: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000', secure: false,
      },
    },
  },
};

export default config;
