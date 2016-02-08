"use strict"; // Webpack actually needs this for the `let` declaration below

const path = require("path");
const fs = require("fs");
const Clean = require("webpack-clean");
const webpack = require("webpack");
const Md5Hash = require("webpack-md5-hash");
const dependencies = Object.keys(require("./package").dependencies);

let envConfig;

try {
	envConfig = require(`./webpack.config.${process.env.NODE_ENV || "development"}.js`);
} catch (error) {
	envConfig = {};
	console.warn(`No webpack build config is available for this NODE_ENV (${process.env.NODE_ENV}). Falling back to common build config. To resolve this, either leave NODE_ENV undefined to use the development build, or set NODE_ENV to match the environment in the filename of a webpack.config.[NODE_ENV].js file.`, error);
}

const config = module.exports = {
	devtool: "source-map",
	entry: envConfig.entry,
	output: envConfig.output,
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

		// Embed whitelisted env vars into client. Do not allow secrets to enter the client codebase!
		new webpack.DefinePlugin(require("./env-whitelist").reduce((envVar, env) => {
			return Object.assign(env, {[envVar]: process.env[envVar]});
		})),

		new webpack.NamedModulesPlugin(),
	].concat(envConfig.plugins || [])
};
