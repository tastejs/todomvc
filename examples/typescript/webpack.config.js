const path = require('path');

module.exports = {
    entry: './src/ctrl.ts',
    module: {
        rules: [
          {
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    resolve: {
      extensions: [ '.ts', '.js' ],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'js/'),
    },
    mode: 'production',
}
