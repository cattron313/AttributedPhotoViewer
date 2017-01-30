const utils = require('./utils');
const view = require('./view-manager');

function App() {
	// PRIVATE FUNCTIONS AND INTERNAL STATE
	var page = 1;
	var loadingImages = false;
	function fillPage() {
		if (view.hasVerticalScroll()) {
			document.getElementById('loading').classList.add('hidden');
			return;
		}
		view.addNewImages();
		utils.getImages((json) => {
			view.replacePlaceHolderImages(json);
			setTimeout(() => {
				return fillPage.call(this);
			}, 700);
		}, function() {
				view.removePlaceHolderImages();
				alert('There was a problem with the request. Please try again later.');
		}, this.getPage());
		this.incrementPage();
	}

	// OBJECT INSTANCE, PUBLIC METHODS
	return {
		getPage() {
			return page;
		},
		incrementPage() {
			return page += 1;
		},
		init() {
			utils.getImages((json) => {
				view.replacePlaceHolderImages(json);
				fillPage.call(this);
			}, function() {
				view.removePlaceHolderImages();
				alert('There was a problem with the request. Please try again later.');
			}, page);
			page += 1;
			document.getElementById('loading').classList.remove('hidden');

			const photosContainer = document.getElementById('photos-container');
			// adding hover affect based on image color
			photosContainer.addEventListener('mouseover', function(e) {
				const el = e.target;
				if (el.nodeName === 'IMG') {
					el.style.borderColor = el.getAttribute('data-color');
				}
			});
			photosContainer.addEventListener('mouseout', function(e) {
				const el = e.target;
				if (el.nodeName === 'IMG') {
					el.style.borderColor = null;
				}
			});

			// open modal lightbox
			photosContainer.addEventListener('click', function(e) {
				const thumbImg = e.target;
				if (thumbImg.nodeName === 'IMG') {
					view.openPhotoViewer(thumbImg);
				}
			});
			// close modal lightbox
			document.querySelector('#modal i').addEventListener('click', view.closePhotoViewer.bind(view));
			// resize modal when photoviewer image loaded to make sure modal completely covers screen
			document.querySelector('#photo-viewer img').addEventListener('load', view.resizeModal.bind(view));

			// cycling through images when arrow buttons clicked
			const arrowBtns = document.getElementsByClassName('arrow-btn');
			for (let i = 0; i < arrowBtns.length; i++) { //should only be two arrow buttons
				arrowBtns[i].addEventListener('click', function(e) {
					// sending an inc or dec
					view.changePhotoViewerImg((e.target.id === 'left-arrow') ? -1 : 1);
				});
			}

			// cycling through images when key is pressed, close modal on Esc key
			document.body.addEventListener('keydown', function(e) { 
				switch (e.key) {
					case 'ArrowLeft':
						view.changePhotoViewerImg(-1);
						break;
					case 'ArrowRight':
						view.changePhotoViewerImg(1);
						break;
					case 'Escape':
						view.closePhotoViewer();
						break;
					default:
				}
			});

			window.onscroll = function(e) {
				// reducing jitter and sensitivty on infinite scroll
				if ((window.innerHeight + window.pageYOffset - document.body.scrollHeight) <= 10 &&
					 (window.innerHeight + window.pageYOffset - document.body.scrollHeight) >= 0 &&
					 !view.hasImagePlaceholders() && !view.modalOpen() && !loadingImages) {
					// you're at the bottom of the page
					view.addNewImages();
					utils.getImages(function(json) {
						view.replacePlaceHolderImages(json);
						loadingImages = false;
						document.getElementById('loading').classList.add('hidden');
					}, function() {
						view.removePlaceHolderImages();
						loadingImages = false;
						alert('There was a problem with the request. Please try again later.');
						document.getElementById('loading').classList.add('hidden');
					}, page);
					loadingImages = true;
					page += 1;
					document.getElementById('loading').classList.remove('hidden');
				}
			};
		}
	};
}

module.exports = new App();
