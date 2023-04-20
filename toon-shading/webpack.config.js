// @ts-check
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type { import('webpack').Configuration } */
const config = {
    stats: false,
    entry: ['./src/index.ts'],
    devtool: 'cheap-source-map',
    devServer: {
        compress: false,
        port: 1234,
    },
    optimization: {
        sideEffects: true,
        moduleIds: 'named',
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all'
        //         }
        //     }
        // }
    },
    performance: {
        maxAssetSize: 700000,
        maxEntrypointSize: 700000
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }],

                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
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
        chunkFilename: '[name].bundle.js',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // @ts-ignore
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/favicon.ico',
        }),
    ]
}

module.exports = config
