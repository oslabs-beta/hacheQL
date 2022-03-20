import HtmlWebpackPlugin from 'html-webpack-plugin';
import path, { dirname } from 'path';
// import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const folderPath = dirname(fileURLToPath(import.meta.url));

const config = {
  mode: process.env.NODE_ENV,
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
  devtool: 'inline-source-map',
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
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(folderPath, 'build'),
      publicPath: '/',
    },
    port: 8888,
    compress: true,
    hot: true,
    proxy: { '/': 'http://localhost:3000' },
  },
};

export default config;
