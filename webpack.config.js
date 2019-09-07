/* leny/seve
 *
 * /webpack.config.js - Webpack configuration
 *
 * coded by leny@flatLand!
 * started at 07/09/2019
 */

/* eslint-disable */

const webpack = require("webpack");
const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
    const plugins = [
        new webpack.EnvironmentPlugin({
            NODE_ENV: env === "dev" ? "development" : "production",
            VERSION: require("./package.json").version,
            BUILD_TIME: Date.now(),
        }),
        new HtmlWebpackPlugin({
            template: resolve(__dirname, "./src/client/index.html"),
            path: "./",
        }),
    ];

    let optimization = {};

    if (env !== "dev") {
        optimization = {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                maxSize: 20000,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                            )[1];

                            return `npm.${packageName.replace("@", "")}`;
                        },
                    },
                },
            },
        };
    }

    return {
        mode: env === "dev" ? "development" : "production",
        devtool:
            env === "dev"
                ? "cheap-module-eval-source-map"
                : "hidden-source-map",
        context: resolve(__dirname, "./src/client"),
        entry: ["./app.js"],
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[path][name].[ext]",
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: env === "development",
                                presets: [
                                    "@babel/preset-env",
                                    "@babel/preset-react",
                                ],
                                plugins: [
                                    [
                                        "@babel/plugin-proposal-decorators",
                                        {
                                            legacy: true,
                                        },
                                    ],
                                    "@babel/plugin-proposal-object-rest-spread",
                                    [
                                        "@babel/plugin-proposal-class-properties",
                                        {
                                            loose: true,
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        plugins,
        optimization,
        performance: {hints: false},
        output: {
            path: resolve(__dirname, "./bin/client"),
            filename: env === "dev" ? "js/bundle.js" : "js/[chunkhash].js",
        },
        watch: env === "dev",
    };
};

