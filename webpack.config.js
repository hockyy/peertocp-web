const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        codemirror: './index.js'
    },
    output: {
        globalObject: 'self',
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].bundle.js',
        publicPath: '/codemirror/dist/'
    },
    externals: [
        'child_process'
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.ttf$/,
            use: ['file-loader']
        }]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "./")
        },
        compress: true,
        devMiddleware: {
            publicPath: '/dist/'
        },
    }
}