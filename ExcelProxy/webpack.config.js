"use strict"
{
    let path = require('path');

    const CleanWebpackPlugin = require('clean-webpack-plugin');

    const bundleFolder = "wwwroot/ExcelAddIn/bundle/";
    module.exports = {
        //externals: {
        //    fs: "require('fs')",
        //},
        entry: "./wwwroot/ExcelAddIn/Home",
        output: {
            filename: 'Home.js',
            path: path.resolve(__dirname, bundleFolder)
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
            ]
        },
        node: {
            fs: 'empty',
        },
        mode: 'development',
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        plugins: [
            new CleanWebpackPlugin([bundleFolder])
        ],
        devtool: "inline-source-map"
    };
}