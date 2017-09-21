
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const env = process.env.npm_lifecycle_event;
const isProductionMode = env === 'build-webpack';

const fileDevMask = 'assets/js/[name].bundle.js'
const fileProdMask = 'assets/js/[name].[hash].js';

const rootFolder = (...args) => path.resolve(__dirname, ...args);
const appFolder = (...args) => rootFolder("src", "app", ...args);
const assetsFolder = (...args) => rootFolder("dist", "assets", ...args);

const globalSass = new ExtractTextPlugin('assets/css/style.bundle.css');

module.exports = (function () {
    var config = {};

    config.entry = {
        "app": "./src/main.ts",
        "polyfills": "./src/polyfills.ts"
    }

    config.resolve = {
        extensions: ['.ts', '.js'],
        alias: {
            "@shared": path.resolve(__dirname, "..", "shared")
        }
    }

    config.output = {
        path: rootFolder("dist"),

        publicPath: isProductionMode
            ? '/'
            : 'http://localhost:8082/',

        filename: isProductionMode
            ? fileProdMask
            : fileDevMask,

        chunkFilename: isProductionMode
            ? fileProdMask
            : fileDevMask
    }

    config.module = {
        rules: [{
            test: /\.ts$/,
            use: ["awesome-typescript-loader", "angular2-template-loader"],
            exclude: /node_modules/
        }, {
            // For angular2-template-loader to know how to handle html files
            test: /\.html$/,
            use: ["html-loader"]
        }, {
            // For angular2-template-loader to know how to handle scss files
            test: /\.scss$/,
            use: ["raw-loader", "sass-loader"],
            include: appFolder()
        }, {
            // For other css
            test: /\.scss$/,
            use: globalSass.extract({
                fallback: "style-loader",
                use: ["css-loader", "sass-loader"]
            }),
            exclude: appFolder()
        }]
    }

    config.plugins = [];

    config.plugins.push(
        new CopyWebpackPlugin([
            { from: "src/public/images/**/*.*", to: "assets/img/[name].[ext]" },
            { from: "src/public/manifest.json", to: "assets/manifest.json" },

            { from: "node_modules/bootstrap/dist/css/bootstrap.min.css", to: "assets/css/[name].[ext]" },
            { from: "node_modules/font-awesome/css/font-awesome.min.css", to: "assets/css/[name].[ext]" },
            { from: "node_modules/font-awesome/fonts/*.*", to: "assets/fonts/[name].[ext]" },
        ])
    )

    config.plugins.push(
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body',
            chunks: ["polyfills", "app"],
            chunksSortMode: "manual"
        })
    );

    config.plugins.push(globalSass);

    /**
     * Fix angular warnings about core.es5.js dependency (only with Webpack)
     * @see https://github.com/angular/angular/issues/11580 
     */
    config.plugins.push(
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, '../src')
        )
    );

    config.devServer = {
        contentBase: './src/public',
        stats: 'minimal',
        port: 8082
    }

    return config;
});
