const chai = require('chai');
global.jsdom = require('jsdom');
const fs = require('fs');

chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

global.document = jsdom.env(fs.readFileSync('index.html').toString(),
	function(err, win) {
		if (err) {
			throw err;
		} else {
			global.window = win;
			global.document = win.document;
		}
	}
);
