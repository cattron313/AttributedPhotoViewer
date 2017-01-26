(function (win) {
	if (win.document.readyState === 'complete') {
		console.log("IIIIIIIII'MMMMMMM READY");
	} else {
		win.addEventListener("DOMContentLoaded", () => {
			console.log("I had to wait a little but....","IIIIIIIII'MMMMMMM READY");
		}, { once: true });
	}
})(window);
