const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
        alias: {
			// https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: ['vue-loader']
			},
			{
				test: /\.css$/,
				use: [
				  'vue-style-loader',
				  'css-loader'
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	],
	devServer: {
		contentBase: "./dist",
		port: 8080,
		compress: false
	  },
}
