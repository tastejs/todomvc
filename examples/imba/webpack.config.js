module.exports = {
  entry: './src/App.imba',
  resolve: {
    extensions: ['.imba']
  },
  module: {
    rules: [
      {
        test: /\.imba$/, // include .js files
        //exclude: /node_modules/, // exclude any and all files in the node_modules folder
        use: [
          {
            loader: "imba/loader"
          }
        ]
      }
    ]
  }
};