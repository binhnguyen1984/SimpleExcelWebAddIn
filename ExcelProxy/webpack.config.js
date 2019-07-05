"use strict"
{
    let path = require('path');

    const CleanWebpackPlugin = require('clean-webpack-plugin');

    const bundleFolder = "wwwroot/ExcelAddIn/bundle/";
    const serverConfig = {
        target: 'node',
        entry: "./wwwroot/ExcelAddIn/Home.ts",
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
            fs: "empty"
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        plugins: [
            new CleanWebpackPlugin([bundleFolder])
        ],
        devtool: "inline-source-map"
    };

    const clientConfig = {
        target: 'web', // <=== can be omitted as default is 'web'
        entry: "./wwwroot/ExcelAddIn/Home.ts",
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
        //node: {
        //    fs: "empty"
        //},
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        plugins: [
            new CleanWebpackPlugin([bundleFolder])
        ],
        devtool: "inline-source-map"
    };

    module.exports = [serverConfig, clientConfig];
    //module.exports = {
    //    entry: "./wwwroot/ExcelAddIn/Home.ts",
    //    output: {
    //        filename: 'Home.js',
    //        path: path.resolve(__dirname, bundleFolder)
    //    },
    //    module: {
    //        rules: [
    //            {
    //                test: /\.tsx?$/,
    //                loader: "ts-loader",
    //                exclude: /node_modules/,
    //            },
    //        ]
    //    },
    //    node: {
    //        fs: "empty"
    //    },
    //    target: 'node',
    //    resolve: {
    //        extensions: [".tsx", ".ts", ".js"]
    //    },
    //    plugins: [
    //        new CleanWebpackPlugin([bundleFolder])
    //    ],
    //    devtool: "inline-source-map"
    //};
}