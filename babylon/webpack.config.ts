import { Configuration } from "webpack";
import { resolve, join } from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import Stylish from "webpack-stylish";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const config: Configuration = {
  stats: "none",
  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "main.bundle.js"
  },
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "tones",
      favicon: "./img/favicon.ico",
      template: "src/index.html"
    }),
    new Stylish(),
    new MiniCssExtractPlugin({
      filename: "style.css"
    })
  ]
};

export default config;
