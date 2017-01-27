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

			// adding hover affect based on image color
			document.getElementById('photos-container').addEventListener('mouseover', function(e) {
				const el = e.target;
				if (el.nodeName === 'IMG') {
					el.style.boxShadow = `10px 10px 1px ${el.getAttribute('data-color')}`;
				}
			});

			document.getElementById('photos-container').addEventListener('mouseout', function(e) {
				const el = e.target;
				if (el.nodeName === 'IMG') {
					el.style.boxShadow = null;
				}
			});

			 // adding click handler for lightbox effect
			document.getElementById('photos-container').addEventListener('click', function(e) {
				const el = e.target;
				if (el.nodeName === 'IMG') {
					const photoUrl = el.getAttribute('data-photo-url');
					const profileUrl = el.getAttribute('data-profile');
					const photographer = el.getAttribute('data-photographer');
					const photoViewerImg = document.querySelector('#photo-viewer img');
					
					photoViewerImg.setAttribute('src', photoUrl);
					const photographerAttribution = `<a href="${profileUrl}">${photographer}</a>`;
					document.querySelector('#photo-viewer span').innerHTML = 'Photo by ' + photographerAttribution +
																											' / <a href="http://unsplash.com/">Unsplash</a>';
					if (el.width <= el.height) { //taller than it is wide
						photoViewerImg.setAttribute('height', window.innerHeight * 0.9);
					} else {
						photoViewerImg.setAttribute('width', window.innerWidth * 0.9);
					}
					document.getElementById('modal').classList.remove('hidden');
				}
			});

			//close dialog
			document.querySelector('#modal i').addEventListener('click', function () {
				document.getElementById('modal').classList.add('hidden');
				const photoViewerImg = document.querySelector('#photo-viewer img');
				photoViewerImg.removeAttribute('height');
				photoViewerImg.removeAttribute('width');
			});

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
