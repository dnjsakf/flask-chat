const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: 'inline-source-map',
  entry: {
    app: [
      "@babel/polyfill",
      path.join(__dirname, "../src/index.js"),
      path.join(__dirname, "../src/index.css"),
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "../src/dist"),
    publicPath: "/public/",
    chunkFilename: "[name].chunk.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify("v1.0.0"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src/index.html"),
    }),
    new webpack.ProgressPlugin((percentage, message, ...args)=>{
      console.info(Math.trunc(percentage*100), "%", message, ...args);
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, "css-loader" ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    host: "localhost",
    port: 4000,
    hot: true,
    contentBase: path.join(__dirname, "../src/dist"),
    publicPath: "/public/",
    historyApiFallback: true,
    proxy: {
      '/': {
        target: "http://localhost:5000/"
      }
    }
  },
}