const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const Md5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const dependencies = Object.keys(require("./package").dependencies);

const config = module.exports = {
	devtool: "source-map",
	entry: {
		app: "./src/client.js",
		vendor: dependencies
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/dist",
		filename: "[name].[chunkhash].js",
		chunkFilename: "[name].[chunkhash].js",
		sourceMapFilename: "[file].map"
	},
	module: {
		loaders: [{
			test: /\.jsx?/,
			exclude: /node_modules/,
			loader: "babel"
		}]
	},
	plugins: [
		new CleanWebpackPlugin(["dist"]),

		new Md5Hash(),

		new webpack.optimize.CommonsChunkPlugin("vendor", "[name].[chunkhash].js"),

		new webpack.NamedModulesPlugin(),

		new webpack.optimize.DedupePlugin(),

		new webpack.optimize.UglifyJsPlugin({
			compress: {warnings: false},
			output: {comments: false}
		}),

		new webpack.DefinePlugin({
			"process.env": {NODE_ENV: JSON.stringify("production")}
		}),

		function() {
			this.plugin("done", function(stats) {
				const assets = stats.toJson().assetsByChunkName;

				fs.writeFileSync(
					path.join(__dirname, "dist", "index.html"),
					fs.readFileSync(path.join(__dirname, "index.html")).toString().replace(
						"{{scripts}}",
						Object.keys(assets).map(name => {
							return `<script src="/${assets[name]}"></script>`;
						}).join("\n\t\t")
					)
				);
			});
		}
	]
};
