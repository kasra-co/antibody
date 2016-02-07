const path = require("path");
const fs = require("fs");
const Clean = require("webpack-clean");
const webpack = require("webpack");
const Md5Hash = require("webpack-md5-hash");
const dependencies = Object.keys(require("./package").dependencies);

const config = module.exports = {
	devtool: "source-map",
	entry: "./src/client.js",
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/dist",
		filename: "app.js",
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: "babel"
		}, {
			test: /\.json$/,
			loader: "json"
		}]
	},
	plugins: [
		function linkScripts() {
			this.plugin("done", function(stats) {
				const assets = stats.toJson().assetsByChunkName;

				console.log("markup");
				fs.writeFileSync(
					path.join(__dirname, "dist", "index.html"),
					fs.readFileSync(path.join(__dirname, "src", "index.html")).toString().replace(
						"{{scripts}}",
						`<script src="/app.js"></script>`
					)
				);
			});
		}
	]
};
