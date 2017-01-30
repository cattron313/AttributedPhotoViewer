(function (window) {
	window.aplb = window.aplb || {}; // global namespace
	const { utils, view } = window.aplb;

	function App() {
		// PRIVATE FUNCTIONS AND INTERNAL STATE
		var page = 1;
		var loadingImages = false;
		const PHOTOS_PER_PAGE = 20;

		function fillPage() {
			if (view.hasVerticalScroll()) { return; }
			view.addNewImages(PHOTOS_PER_PAGE);
			utils.getImages((json) => {
				view.replacePlaceHolderImages(json, PHOTOS_PER_PAGE);
				setTimeout(() => {
					return fillPage.call(this);
				}, 700);
			}, function() {
					view.removePlaceHolderImages();
					view.showErrorMsg();
			}, this.getPage(), PHOTOS_PER_PAGE);
			this.incrementPage();
		}

		function setupPhotosContainerHandlers() {
			const photosContainer = document.getElementById('photos-container');
			if (!utils.isMobileDevice()) {
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
			}

			// open modal lightbox on thumbnail click
			photosContainer.addEventListener('click', function(e) {
				const thumbImg = e.target;
				if (thumbImg.nodeName === 'IMG') {
					view.openPhotoViewer(thumbImg);
				}
			});
		}

		function setupEventHandlersForModal() {
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
				switch (e.keyCode) {
					case 37:
						view.changePhotoViewerImg(-1);
						break;
					case 39:
						view.changePhotoViewerImg(1);
						break;
					case 27:
						view.closePhotoViewer();
						break;
					default:
				}
			});
		}

		function setupDeviceEventHandlers() {
			// resize modal on browser resize or device rotation
			window.addEventListener("orientationchange", () => {
				view.resizeModal();
				view.showLoadingIcon();
				fillPage.call(this);
				view.hideLoadingIcon();
			});

			window.onresize = () => {
				view.resizeModal();
				view.showLoadingIcon();
				fillPage.call(this);
				view.hideLoadingIcon();
			};

			window.onscroll = function(e) {
				// reducing jitter and sensitivty on infinite scroll
				if ((window.innerHeight + window.pageYOffset - document.body.scrollHeight) <= 10 &&
					 (window.innerHeight + window.pageYOffset - document.body.scrollHeight) >= 0 &&
					 !view.hasImagePlaceholders() && !view.modalOpen() && !loadingImages) {
					// you're at the bottom of the page
					view.addNewImages(PHOTOS_PER_PAGE);
					utils.getImages(function(json) {
						view.replacePlaceHolderImages(json, PHOTOS_PER_PAGE);
						loadingImages = false;
						view.hideLoadingIcon();
					}, function() {
						view.removePlaceHolderImages();
						loadingImages = false;
						view.showErrorMsg();
						view.hideLoadingIcon();
					}, page, PHOTOS_PER_PAGE);
					loadingImages = true;
					page += 1;
					view.showLoadingIcon();
				}
			};
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
					view.replacePlaceHolderImages(json, PHOTOS_PER_PAGE);
					fillPage.call(this);
					view.hideLoadingIcon();
				}, function() {
					view.removePlaceHolderImages();
					view.showErrorMsg();
				}, page, PHOTOS_PER_PAGE);
				page += 1;
				view.showLoadingIcon();

				setupPhotosContainerHandlers();
				setupEventHandlersForModal();
				setupDeviceEventHandlers.call(this);
			}
		};
	}

	window.aplb.app = new App();
})(window);
