(function (window) {
	if (window.document.readyState === 'complete') {
		window.aplb.app.init(); // get images and setup event handlers
	} else {
		window.addEventListener("DOMContentLoaded", () => {
			window.aplb.app.init(); // get images and setup event handlers
		}, { once: true });
	}
})(window);
