'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    TransferWebpackPlugin = require('transfer-webpack-plugin'),
    CleanPlugin = require('clean-webpack-plugin'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    glob = require('glob');

var isProduction = process.env.NODE_ENV == 'production';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var plugins = [
    new webpack.DefinePlugin({
        '__DEV__': !isProduction,
        'process.env.NODE_ENV': isProduction ? '"production"' : '"development"'
    }),
    new ExtractTextPlugin(isProduction ? '[name].[hash].css' : '[name].css'),
    new HtmlWebpackPlugin({
        inject: true,
        template: path.join(__dirname, './client/index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
];


if (isProduction) {
    plugins.push(
        //清空输出目录
        new CleanPlugin(['dist'], {
            root: path.join(__dirname, './client'),
            verbose: true,  //打印日志
            dry: false,
            // exclude: ["lib"]//排除不删除的目录
        }),
        // new TransferWebpackPlugin([{from: './client/static', to: 'static'}]), //复制文件夹
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    )
}

var entry = isProduction? './client/src/index.js': [ hotMiddlewareScript, './client/src/index.js' ];

module.exports = {

    target: 'web',
    cache: true,

    entry: entry,

    output: {
        path: path.resolve(__dirname, './client/dist'),
        publicPath: '/',
        filename: isProduction ? '[name].[hash].js' : '[name].js',
    },

    module: {
        loaders: [
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
            {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
            {test: /\.scss$/, loaders: ["style", "css", "ƒ"]},
            {test: /\.less?$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.(jpg|png|jpeg|gif)$/, loader: 'url?limit=8192&name=[path][name].[ext]'},
            {test: /\.(woff|woff2|eot|ttf|svg)(\?.*)?/i, loader: 'file-loader?name=[path][name].[ext]'}
        ],
        noParse: []
    },

    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.less', '.css', '.html']
    },
    debug: isProduction ? false : true,
    devtool: isProduction ? null : 'cheap-module-source-map',
    postcss: function () {
        return [autoprefixer];
    }
}

