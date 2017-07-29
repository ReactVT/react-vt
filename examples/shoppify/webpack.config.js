const config = {
  entry: './client/index.js', 
  output: {
		path: __dirname + "/build",
		filename: "webpack-bundle.js"
	},
  module: {
    loaders: [
      {
  	  test:/\.js$/,
  	  exclude: /node_modules/,
  	  loader: 'babel-loader',
  	  query: {
          presets: ['es2015', 'react']
        }
  	  },
      {
  	  test:/\.css$/,
  	  loaders: ['style-loader', 'css-loader'],
  	  exclude: /node_modules/,
  	  include: __dirname,
      },
      {
  	  test:/\.txt$/,
  	  loader: 'raw-loader',
      },
    ],
  }
};





module.exports = config;