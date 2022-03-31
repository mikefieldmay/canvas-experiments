const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./app/src/index.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: "index.html"
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }]
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader"
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css"
    }),
    new HtmlWebpackPlugin({
      template: "./app/index.html",
      title: "Test"
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "app/assets", to: "public" }]
    })
  ]
};
