var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = 'production';

var config = {
    devtool: 'source-map',
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
        sourceMapFilename: '[name].[chunkhash].bundle.map',
        chunkFilename: '[id].[chunkhash].chunk.js'
    },
    module: {
        preLoaders: [
            { test: /\.ts$/, loader: 'source-map' }
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
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.prod.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[chunkhash].bundle.js', minChunks: Infinity }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            comments: false,
            compress: {
                screw_ie8 : true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(env),
                'NODE_ENV': JSON.stringify(env)
            }
        })
    ],
};

module.exports = config;
