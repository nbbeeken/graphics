// @ts-check
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// @ts-ignore
const Stylish = require('webpack-stylish')
const OptimizeThreePlugin = require('@vxna/optimize-three-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

/** @type { import('webpack').Configuration } */
const config = {
    stats: false,
    entry: ['./src/index.ts', './src/main.css'],
    devtool: 'source-map',
    devServer: {
        writeToDisk: true,
        compress: true,
        port: 1234,
    },
    optimization: {
        sideEffects: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
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
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "./assets/[name].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg|cur|obj)$/i,
                include: path.resolve(__dirname, 'src', 'assets'),
                use: [
                    'file-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.png', '.svg', '.cur', '.obj', '.json'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        //@ts-ignore
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        // @ts-ignore
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/favicon.ico',
        }),
        // @ts-ignore
        new webpack.NamedModulesPlugin(),
        // @ts-ignore
        new CompressionPlugin(),
        new OptimizeThreePlugin(),
        new Stylish()
    ]
}

module.exports = config
