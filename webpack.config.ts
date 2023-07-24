import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import { WebpackConfiguration } from "webpack-cli";

const testbenches = ["scratch-mesh"];

const tbEntries = testbenches.reduce(
  (entries, name) => ({ ...entries, [name]: path.resolve(__dirname, `./testbenches/${name}/main.ts`) }),
  {}
);

const tbPages = testbenches.map((name) => {
  const tbPath = `testbenches/${name}/index.html`;

  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, tbPath),
    filename: tbPath,
    chunks: [name],
    minify: true,
  });
});

const config: WebpackConfiguration = {
  entry: {
    app: path.resolve(__dirname, "./src/main.ts"),
    ...tbEntries,
  },

  mode: "development",

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },

  devtool: "source-map",

  plugins: [
    new MiniCSSExtractPlugin(),

    // Main
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      chunks: ["app"],
      minify: true,
    }),

    // Testbenches
    ...tbPages,
  ],

  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },

      // TS
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext]",
        },
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default config;
