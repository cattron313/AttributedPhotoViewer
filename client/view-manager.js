
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
					elems.item(i).firstChild.setAttribute('src', json[i].urls.thumb);
				  elems.item(i).firstChild.setAttribute('data-color', json[i].color);
				  elems.item(i).classList.remove('empty');
				} else {
					elems.item(i).remove();
				}
			}
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
		},
		hasImagePlaceholders() {
			return document.querySelectorAll(".photo.empty") > 0;
		}
	};
}

module.exports = new ViewManager();
