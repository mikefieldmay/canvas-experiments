const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: "./app/src/index.js"
  },
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: "index.html"
    },
    proxy: {
      "/socket.io": {
        target: "http://127.0.0.1:3000",
        ws: true
      }
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
