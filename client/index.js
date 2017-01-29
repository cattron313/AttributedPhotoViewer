(function (win) {
	const app = require('./app');
	if (win.document.readyState === 'complete') {
		app.init(); // get images and setup event handlers
	} else {
		win.addEventListener("DOMContentLoaded", () => {
			app.init(); // get images and setup event handlers
		}, { once: true });
	}
})(window);
