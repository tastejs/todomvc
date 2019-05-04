const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const mode = process.env.PURPOSE === "build" ? "production" : "development";

console.log({ mode });

const config = {
	entry: "./ts/index.ts",
	mode,
	output: {
		path: path.resolve(__dirname),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)?$/,
				use: "source-map-loader",
				exclude: /node_modules/,
				enforce: "pre"
			},
			{
				test: /\.(ts|tsx)?$/,
				loader: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	optimization: {
		minimizer: [new TerserPlugin()]
	},
	devtool: "source-map"
};

module.exports = config;
