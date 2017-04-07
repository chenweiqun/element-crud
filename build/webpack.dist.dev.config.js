var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge')
var webpackBaseConfig = require('./webpack.base.config.js');

process.env.NODE_ENV = 'production'

module.exports = merge(webpackBaseConfig, {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: 'element-crud.js',
        library: 'element-crud',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        'axios': 'axios',
        lodash : {
          commonjs: "lodash",
          amd: "lodash",
          root: "_"
        },
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    plugins: [
        // @todo
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]
});
