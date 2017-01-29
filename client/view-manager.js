function ViewManager() {
	// PRIVATE HELPER METHOD
	function updatePhotoViewer(photoViewerImg, thumbImg, thumbImgIndex) {
		photoViewerImg.setAttribute('src', thumbImg.getAttribute('data-photo-url'));
		if (thumbImg.width <= thumbImg.height) { //if image is, taller than it is wide
			photoViewerImg.setAttribute('height', window.innerHeight * 0.9);
		} else {
			//smaller size than height adjustment to make room for arrows
			photoViewerImg.setAttribute('width', window.innerWidth * 0.87);
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
		replacePlaceHolderImages(json) {
			const elems = document.querySelectorAll(".photo.empty");
			for(let i = 0; i < 20; i++) {
				/* assuming I will receive 20 images back but may not.
				 * don't want to rely on the number of elems since it
				 * may not always be 20 (async updates of view)
				 */
				if (i < json.length) {
					const img = elems.item(i).firstChild;
					img.addEventListener('load', () => {
						img.parentNode.classList.remove('empty');
					}, { once: true });
					img.setAttribute('src', json[i].urls.thumb);
				  img.setAttribute('data-color', json[i].color);
				  img.setAttribute('data-photographer', json[i].user.name);
				  img.setAttribute('data-profile', json[i].user.links.html);
				  img.setAttribute('data-photo-url', json[i].urls.full);
				} else {
					img.parentNode.remove();
				}
			}
			this.resizeModal();
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
		resizeModal() {
			if (this.modalOpen()) {
				if (window.innerHeight > document.body.clientHeight) {
				//if window height larger than document height, set modal height to window height
					modal.style.height = `${window.innerHeight}px`;
				} else {
					modal.style.height = `${document.body.clientHeight}px`;
				}
			}
		},
		openPhotoViewer(thumbImg) {
			const photoViewerImg = document.querySelector('#photo-viewer img');
			const photosContainer = document.getElementById('photos-container');
			const thumbImgIndex = [].indexOf.call(photosContainer.children, thumbImg.parentNode);
			
			updatePhotoViewer.call(this, photoViewerImg, thumbImg, thumbImgIndex);
		},
		closePhotoViewer() {
			const modal = document.getElementById('modal');
			modal.classList.add('hidden');
			modal.style.height = 'auto';
			this.clearPhotoViewerImg();
		},
		clearPhotoViewerImg(photoViewerImg=document.querySelector('#photo-viewer img')) {
			photoViewerImg.setAttribute('src', '');
			photoViewerImg.removeAttribute('height');
			photoViewerImg.removeAttribute('width');
		},
		changePhotoViewerImg(direction){
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
	};
}

module.exports = new ViewManager();
