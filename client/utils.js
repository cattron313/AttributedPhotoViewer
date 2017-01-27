module.exports = {
	getImages(callback, page) {
		const httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
	      if (httpRequest.status === 200) {
	        callback(JSON.parse(httpRequest.responseText));
	      } else {
	        alert('There was a problem with the request. Please try again later.');
	      }
	    }
		};
		httpRequest.open('GET', `http://localhost:3000/images/curated?page=${page}&per_page=20`, true);
		httpRequest.send();
	}
};
