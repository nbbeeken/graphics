// @ts-check
const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
// @ts-ignore
const Stylish = require('webpack-stylish')
const OptimizeThreePlugin = require('@vxna/optimize-three-webpack-plugin')

/** @type { import('webpack').Configuration } */
const config = {
    stats: false,
    entry: './src/index.ts',
    devtool: 'source-map',
    devServer: {
        writeToDisk: true,
        compress: false,
        port: 1234,
    },
    optimization: {
        sideEffects: true
    },
    performance: {
        maxAssetSize: 700000,
        maxEntrypointSize: 700000
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // @ts-ignore
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/favicon.ico'
        }),
        // @ts-ignore
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        // @ts-ignore
        new webpack.NamedModulesPlugin(),
        new OptimizeThreePlugin(),
        new Stylish()
    ]
}

module.exports = config
