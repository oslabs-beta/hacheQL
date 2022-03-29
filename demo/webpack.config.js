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
    // fallback: { 
    //   'events': false,
    //   'net': false,
    //   'tls': false,
    //   'crypto': false,
    //   'assert': false,
    //   'util': false,
    //   'buffer': false,
    //   'string_decoder': false,
    //   'url': require.resolve('url')
    // },
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
    proxy: { '/graphql': 'http://localhost:3000' },
  },
};

export default config;
