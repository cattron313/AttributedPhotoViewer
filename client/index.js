(function (win) {
	const app = require('./app');
	if (win.document.readyState === 'complete') {
		app.init();
	} else {
		win.addEventListener("DOMContentLoaded", () => {
			app.init();
		}, { once: true });
	}
})(window);
