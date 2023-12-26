const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src", "app.js"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "TodoMVC: JavaScript Es6 Webpack",
            template: path.resolve(__dirname, "src", "index.html"),
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
};
