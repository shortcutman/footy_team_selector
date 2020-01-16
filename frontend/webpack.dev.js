
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		contentBase: "./dist",
		port: 8080,
		compress: false
	},
	plugins: [
		new webpack.DefinePlugin({
			HTTP_GRAPHQL_URL: JSON.stringify("http://localhost:80/graphql"),
			WS_GRAPHQL_URL: JSON.stringify("ws://localhost:80/graphql")
		})
	]
})