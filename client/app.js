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
					const photoUrl = thumbImg.getAttribute('data-photo-url');
					const profileUrl = thumbImg.getAttribute('data-profile');
					const photographer = thumbImg.getAttribute('data-photographer');

					const photoViewerImg = document.querySelector('#photo-viewer img');
					photoViewerImg.setAttribute('src', photoUrl);
					if (thumbImg.width <= thumbImg.height) { //if image is, taller than it is wide
						photoViewerImg.setAttribute('height', window.innerHeight * 0.9);
					} else {
						//smaller size than height adjustment to make room for arrows
						photoViewerImg.setAttribute('width', window.innerWidth * 0.87);
					}

					const photosContainer = document.getElementById('photos-container');
					const thumbImgIndex = [].indexOf.call(photosContainer.children, thumbImg.parentNode);
					photoViewerImg.setAttribute('data-index', thumbImgIndex);

					const photographerAttribution = `<a href="${profileUrl}">${photographer}</a>`;
					document.querySelector('#photo-viewer span').innerHTML = 'Photo by ' +
									photographerAttribution + ' / <a href="http://unsplash.com/">Unsplash</a>';

					document.getElementById('modal').classList.remove('hidden');
					view.resizeModal();
				}
			});
			// close modal lightbox dialog
			document.querySelector('#modal i').addEventListener('click', function () {
				document.getElementById('modal').classList.add('hidden');
				const photoViewerImg = document.querySelector('#photo-viewer img');
				photoViewerImg.removeAttribute('height');
				photoViewerImg.removeAttribute('width');
				photoViewerImg.setAttribute('src', '');

				document.getElementById('modal').style.height = 'auto';
			});

			const arrowBtns = document.getElementsByClassName('arrow-btn');
			for (let i = 0; i < arrowBtns.length; i++) { //should only be two arrow buttons
				arrowBtns[i].addEventListener('click', function(e) {
					const photoViewerImg = document.querySelector('#photo-viewer img');
					photoViewerImg.setAttribute('src', '');
					photoViewerImg.removeAttribute('height');
					photoViewerImg.removeAttribute('width');
					const shownImgIndex = parseInt(photoViewerImg.getAttribute('data-index'));
					const photosList = document.getElementById('photos-container').children;

					// show previous image if left arrow. show next image if right arrow.
					const thumbImgIndex = (e.target.id === 'left-arrow') ?
																shownImgIndex + photosList.length - 1 : shownImgIndex + 1;
					// making list circular
					const thumbImg = photosList[thumbImgIndex % photosList.length].firstChild;
					
					const photoUrl = thumbImg.getAttribute('data-photo-url');
					const profileUrl = thumbImg.getAttribute('data-profile');
					const photographer = thumbImg.getAttribute('data-photographer');

					photoViewerImg.setAttribute('src', photoUrl);
					if (thumbImg.width <= thumbImg.height) { //if image is, taller than it is wide
						photoViewerImg.setAttribute('height', window.innerHeight * 0.9);
					} else {
						//smaller size than height adjustment to make room for arrows
						photoViewerImg.setAttribute('width', window.innerWidth * 0.87);
					}
					photoViewerImg.setAttribute('data-index', thumbImgIndex);

					const photographerAttribution = `<a href="${profileUrl}">${photographer}</a>`;
					document.querySelector('#photo-viewer span').innerHTML = 'Photo by ' +
									photographerAttribution + ' / <a href="http://unsplash.com/">Unsplash</a>';

					view.resizeModal();
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
