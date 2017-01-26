var path = require('path');
var webpackValidator = require('webpack-validator');
var webpackUtils = require('webpack-config-utils');
var webpack = require('webpack');
var ifUtils = webpackUtils.getIfUtils(process.env);

module.exports = webpackValidator(webpackUtils.removeEmpty({
	entry: './index.js',
	output: {
		path: path.resolve('build'),
		publicPath: '/build/',
		filename: 'bundle.js',
		pathinfo: ifUtils.ifNotProd() //so in dev i can know what files to reference
	},
	devtool: ifUtils.ifProd('source-map', ifUtils.ifDev('eval', 'inline-source-map'))
}));
