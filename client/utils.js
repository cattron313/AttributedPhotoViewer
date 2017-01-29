module.exports = {
	getImages(success, error, page) {
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
		httpRequest.open('GET', `http://localhost:3000/images/curated?page=${page}&per_page=20`, true);
		httpRequest.send();
	}
};
