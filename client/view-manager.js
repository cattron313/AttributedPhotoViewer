
function ViewManager() {
	return {
		replacePlaceHolderImages(json) {
			const elems = document.querySelectorAll(".photo.empty");
			for(let i = 0; i < 20; i++) {
				/* assuming I will receive 20 images back but may not.
				 * don't want to rely on the number of elems since it
				 * may not always be 20 (async updates of view)
				 */
				if (i < json.length) {
					elems.item(i).firstChild.addEventListener('load', () => {
						elems.item(i).classList.remove('empty');
					}, { once: true });
					elems.item(i).firstChild.setAttribute('src', json[i].urls.thumb);
				  elems.item(i).firstChild.setAttribute('data-color', json[i].color);
				  elems.item(i).firstChild.setAttribute('data-photographer', json[i].user.name);
				  elems.item(i).firstChild.setAttribute('data-profile', json[i].user.links.html);
				  elems.item(i).firstChild.setAttribute('data-photo-url', json[i].urls.full);
				} else {
					elems.item(i).remove();
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
		resizeModal() {
			const modal = document.getElementById('modal');
			if (!modal.classList.contains('hidden')) {
				if (window.innerHeight > document.body.clientHeight) {
				//if window height larger than document height, set modal height to window height
					modal.style.height = `${window.innerHeight}px`;
				} else {
					modal.style.height = `${document.body.clientHeight}px`;
				}
			}
		}
	};
}

module.exports = new ViewManager();
