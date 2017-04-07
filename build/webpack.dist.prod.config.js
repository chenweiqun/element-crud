var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge')
var webpackBaseConfig = require('./webpack.base.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
process.env.NODE_ENV = 'production';

module.exports = merge(webpackBaseConfig, {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: 'element-crud.min.js',
        library: 'element-crud',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        },
        'element-ui':'element-ui',
        axios: 'axios',
        lodash : {
          commonjs: "lodash",
          commonjs2: 'lodash',
          amd: "lodash",
          root: "_"
        }
    },
    plugins: [
        // @todo
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});
