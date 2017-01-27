const utils = require('./utils');
const view = require('./view-manager');

function App() {
	var page = 1;
	return {
		getPage() {
			return page;
		},
		incrementPage() {
			return page++;
		},
		init() {
			utils.getImages(function(json) {
				view.replacePlaceHolderImages(json);
		  }, page);
		  page++;
		  window.onscroll = function(e) {
		  	// reducing jitter and sensitivty on infinite scroll
		  	if ((window.innerHeight + window.pageYOffset - document.body.scrollHeight) <= 10 &&
		  		 (window.innerHeight + window.pageYOffset - document.body.scrollHeight) >= 0 &&
		  		 !view.hasImagePlaceholders()) {
		      // you're at the bottom of the page
		  		view.addNewImages();
		      utils.getImages(function(json) {
		      	view.replacePlaceHolderImages(json);
		  		}, page);
		  		page++;
		    }
		  };
		}
	};
}

module.exports = new App();
