module.exports = {
	getImages(success, error, page, maxPhotos) {
		const httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
	      if (httpRequest.status === 200) {
	        success(JSON.parse(httpRequest.responseText));
	      } else {
					error();
	      }
	    }
		};
		httpRequest.open('GET', `http://localhost:3000/images/curated?page=${page}&per_page=${maxPhotos}`,
											true);
		httpRequest.send();
	},
	isMobileDevice () {
		return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) ||
			navigator.userAgent.match(/Windows Phone/i);
	}
};
