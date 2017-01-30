const utils = require('./utils');

function ViewManager() {
	// PRIVATE HELPER METHOD
	function updatePhotoViewer(photoViewerImg, thumbImg, thumbImgIndex) {
		photoViewerImg.setAttribute('src', thumbImg.getAttribute('data-photo-url'));
		if (thumbImg.width < thumbImg.height) { //if image is, taller than it is wide
			if (utils.isMobileDevice()) {
				photoViewerImg.setAttribute('width', window.innerWidth * 0.8);
			} else {
				photoViewerImg.setAttribute('height', window.innerHeight * 0.9);
			}
		} else {
			if (utils.isMobileDevice()) {
				photoViewerImg.setAttribute('width', window.innerWidth * 0.8);
			} else {
				//smaller size than height adjustment to make room for arrows
				photoViewerImg.setAttribute('width', window.innerWidth * 0.85);
			}
		}
		photoViewerImg.setAttribute('data-index', thumbImgIndex);

		const profileUrl = thumbImg.getAttribute('data-profile');
		const photographer = thumbImg.getAttribute('data-photographer');
		const photographerAttribution = `<a href="${profileUrl}">${photographer}</a>`;
		document.querySelector('#photo-viewer span').innerHTML = 'Photo by ' +
						photographerAttribution + ' / <a href="http://unsplash.com/">Unsplash</a>';

		document.getElementById('modal').classList.remove('hidden');
		this.resizeModal();
	}

	// OBJECT INSTANCE, PUBLIC METHODS
	return {
		replacePlaceHolderImages(json, maxPhotos) {
			// selecting all empty photos that haven't been set yet
			const query = ".photo.empty img[src='/client/photo-placeholder.png']";
			const elems = document.querySelectorAll(query);
			for(let i = 0; i < maxPhotos; i++) {
				/* assuming I will receive 20 images back but may not.
				 * don't want to rely on the number of elems since it
				 * may not always be 20 (async updates of view)
				 */
				if (i < json.length) {
					const img = elems.item(i);
					img.addEventListener('load', () => {
						img.parentNode.classList.remove('empty');
					}, { once: true });
					img.addEventListener('error', (e) => {
						img.parentNode.remove();
					});
					img.setAttribute('src', json[i].urls.thumb);
				  img.setAttribute('data-color', json[i].color);
				  img.setAttribute('data-photographer', json[i].user.name);
				  img.setAttribute('data-profile', json[i].user.links.html);
				  img.setAttribute('data-photo-url', json[i].urls.full);
				}
			}
			this.resizeModal();
		},
		removePlaceHolderImages() {
			const elems = document.querySelectorAll(".photo.empty");
			for(let i = 0; i < elems.length; i++) {
				elems[i].remove();
			}
		},
		showErrorMsg() {
			const errMsg = document.querySelector('.error');
			errMsg.classList.remove('hidden');
			setTimeout(() => { errMsg.classList.add('hidden'); }, 2000);
		},
		showLoadingIcon() {
			document.getElementById('loading').classList.remove('hidden');
		},
		hideLoadingIcon() {
			document.getElementById('loading').classList.add('hidden');
		},
		addNewImages() {
			const container = document.getElementById('photos-container');
			for(let i = 0; i < 20; i++) { // assuming I will receive 20 images back
				const wrapper = document.createElement('div');
				wrapper.classList.add('photo', 'empty');
				const img = document.createElement('img');
				img.setAttribute('src', '/client/photo-placeholder.png');
				wrapper.appendChild(img);
				container.appendChild(wrapper); 
			}
			this.resizeModal();
		},
		hasImagePlaceholders() {
			return document.querySelectorAll(".photo.empty") > 0;
		},
		modalOpen() {
			return !document.getElementById('modal').classList.contains('hidden');
		},
		hasVerticalScroll() {
			return document.body.scrollHeight > window.innerHeight;
		},
		resizeModal() {
			if (this.modalOpen()) {
				const winHeight = window.innerHeight;
				const docHeight = document.body.clientHeight;
				const photoViewerHeight = window.getComputedStyle(document.getElementById('photo-viewer')).height;
				modal.style.height = `${Math.max(winHeight, docHeight, parseInt(photoViewerHeight))}px`;

				const winWidth = window.innerWidth;
				const docWidth = document.body.clientWidth;
				const photoViewerWidth = window.getComputedStyle(document.getElementById('photo-viewer')).width;
				modal.style.width = `${Math.max(winWidth, docWidth, parseInt(photoViewerWidth))}px`;
			}
		},
		openPhotoViewer(thumbImg) {
			const photoViewerImg = document.querySelector('#photo-viewer img');
			const photosContainer = document.getElementById('photos-container');
			const thumbImgIndex = [].indexOf.call(photosContainer.children, thumbImg.parentNode);
			window.scrollTo(0, 0);
			updatePhotoViewer.call(this, photoViewerImg, thumbImg, thumbImgIndex);
		},
		closePhotoViewer() {
			if (this.modalOpen()) {
				const modal = document.getElementById('modal');
				modal.classList.add('hidden');
				modal.style.height = 'auto';

				const photoViewerImg = document.querySelector('#photo-viewer img');
				const thumbIndex = parseInt(photoViewerImg.getAttribute('data-index'));
				const thumbImg = document.getElementById('photos-container').children[thumbIndex].firstChild;
				thumbImg.scrollIntoView({block: "end", behavior: "smooth"});
				this.clearPhotoViewerImg(photoViewerImg);
				thumbImg.style.borderColor = thumbImg.getAttribute('data-color');
				setTimeout(() => { thumbImg.style.borderColor = null; }, 2000);
			}
		},
		clearPhotoViewerImg(photoViewerImg=document.querySelector('#photo-viewer img')) {
			photoViewerImg.setAttribute('src', '');
			photoViewerImg.removeAttribute('height');
			photoViewerImg.removeAttribute('width');
		},
		changePhotoViewerImg(direction){
			if (this.modalOpen()) {
				const photoViewerImg = document.querySelector('#photo-viewer img');
				this.clearPhotoViewerImg(photoViewerImg);
				const shownImgIndex = parseInt(photoViewerImg.getAttribute('data-index'));
				const photosList = document.getElementById('photos-container').children;

				// show previous image if left arrow. show next image if right arrow.
				const thumbImgIndex = shownImgIndex + direction + ((direction < 0) ? photosList.length : 0);
				// making list circular
				const thumbImg = photosList[thumbImgIndex % photosList.length].firstChild;
				updatePhotoViewer.call(this, photoViewerImg, thumbImg, thumbImgIndex);
			}
		}
	};
}

module.exports = new ViewManager();
