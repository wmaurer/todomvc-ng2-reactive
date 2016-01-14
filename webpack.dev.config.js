var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = 'development';

var config = {
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    entry: {
        app: [
            path.resolve(__dirname, 'src/app/main.ts')
        ],
        vendor: [
            path.resolve(__dirname, 'src/app/vendor.ts')
        ]
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.map',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        preLoaders: [
            { test: /\.ts$/, loader: "source-map-loader" }
        ],
        loaders: [
            { test: /\.ts$/, exclude: /node_modules/, loaders: ['ts'] },
            { test: /\.json$/, loaders: ['json'] },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.html$/, loader: 'raw' }
        ],
        noParse: [ /angular2-polyfills/ ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(env),
                'NODE_ENV': JSON.stringify(env)
            }
        })
    ],
    devServer: {
        historyApiFallback: true
    }
};

module.exports = config;
