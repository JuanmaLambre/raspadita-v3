import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import { CallableOption, WebpackConfiguration } from "webpack-cli";
import Server from "webpack-dev-server";
import { setup as setupServer } from "./src/devServer/setup";

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

const config: CallableOption = (env: any): WebpackConfiguration => ({
  entry: {
    app: path.resolve(__dirname, "./src/main.ts"),
    ...tbEntries,
  },

  optimization: {
    minimize: !env.expanded,
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
      minify: !env.expanded,
    }),

    // Testbenches
    ...tbPages,
  ],

  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: !env.expanded },
          },
        ],
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
        test: /\.s?css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: { sassOptions: { outputStyle: "expanded" } },
          },
        ],
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

      // To import any file (e.g. shaders) as text. Remember to update `./src/types/global.d.ts`
      {
        test: /\.(frag|vert)$/,
        loader: "raw-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
      publicPath: "/public/",
    },

    // Setup server endpoints
    setupMiddlewares: (middlewares: any, devServer: Server) => {
      setupServer(devServer);
      return middlewares;
    },
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
});

export default config;
