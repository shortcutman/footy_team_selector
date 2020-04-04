
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		contentBase: "./dist",
		port: 8080,
		compress: false,
		proxy: {
			'/graphql': 'http://0.0.0.0:80/graphql',
			'/playground': 'http://0.0.0.0:80/'
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			HTTP_GRAPHQL_URL: JSON.stringify("/graphql")
		})
	]
})