const path = require("path");
const fs = require("fs");
const Clean = require("webpack-clean");
const webpack = require("webpack");
const Md5Hash = require("webpack-md5-hash");
const dependencies = Object.keys(require("./package").dependencies);

const config = module.exports = {
	devtool: "source-map",
	entry: {
		app: "./src/client.js",
		vendor: dependencies
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/",
		filename: "[name].[chunkhash].js",
		chunkFilename: "[name].[chunkhash].js"
	},
	plugins: [
		new Clean(["dist/*"], null, true),

		new Md5Hash(),

		new webpack.optimize.CommonsChunkPlugin("vendor", "[name].[chunkhash].js"),

		new webpack.optimize.DedupePlugin(),

		new webpack.optimize.UglifyJsPlugin({
			output: {comments: false}
		}),

		function linkScripts() {
			this.plugin("done", function(stats) {
				const assets = stats.toJson().assetsByChunkName;

				fs.writeFileSync(
					path.join(__dirname, "dist", "index.html"),
					fs.readFileSync(path.join(__dirname, "src", "index.html")).toString().replace(
						"{{scripts}}",
						[
							assets.vendor ? `<script src="/${assets.vendor[0]}"></script>` : null,
							assets.app ? `<script src="/${assets.app[0]}"></script>` : null
						].filter(script => !!script).join("\n\t\t")
					)
				);
			});
		}
	]
};

