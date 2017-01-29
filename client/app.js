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

			 // open modal lightbox
			document.getElementById('photos-container').addEventListener('click', function(e) {
				const thumbImg = e.target;
				if (thumbImg.nodeName === 'IMG') {
					view.openPhotoViewer(thumbImg);
				}
			});
			// close modal lightbox dialog
			document.querySelector('#modal i').addEventListener('click', view.closePhotoViewer.bind(view));

			const arrowBtns = document.getElementsByClassName('arrow-btn');
			for (let i = 0; i < arrowBtns.length; i++) { //should only be two arrow buttons
				arrowBtns[i].addEventListener('click', function(e) {
					// sending an inc or dec
					view.changePhotoViewerImg((e.target.id === 'left-arrow') ? -1 : 1);
				});
			}

			window.onscroll = function(e) {
				// reducing jitter and sensitivty on infinite scroll
				if ((window.innerHeight + window.pageYOffset - document.body.scrollHeight) <= 10 &&
					 (window.innerHeight + window.pageYOffset - document.body.scrollHeight) >= 0 &&
					 !view.hasImagePlaceholders() && !view.modalOpen()) {
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
