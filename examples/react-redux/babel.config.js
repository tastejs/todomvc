// This file is used for Jest to function properly.
module.exports = {
    presets: [
        ["@babel/preset-env", { targets: "defaults" }],
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
};
