
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')
require('dotenv').config()

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			HTTP_GRAPHQL_URL: JSON.stringify(`/graphql`),
			WS_GRAPHQL_URL: JSON.stringify("`ws://${location.host}/graphql`")
		})
	]
})