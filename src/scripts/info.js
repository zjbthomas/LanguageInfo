const path = window.location.pathname;
let triggerLimit = false;

if (path.split('/')[1] === 'wishlist') {
	// Wishlist page
	chrome.runtime.sendMessage({ type: 'load-languages' }, (success) => {
		if (success) {
			waitForElement('#StoreTemplate .Panel input.Focusable').then(function (input) {
				input.addEventListener('keyup', function () { limitFunction(filterWishlistList) });
				document.getElementById('StoreTemplate').addEventListener('scroll', function () { limitFunction(filterWishlistList) });
				filterWishlistList();

				// Observe DOM changes to the wishlist container
				const observer = new MutationObserver(() => {
					limitFunction(filterWishlistList);
				});

				observer.observe(document.querySelector('body'), {
					childList: true, // watch for added/removed children
					subtree: true // include nested changes
				});

				function filterWishlistList() {
					const games = Array.from(document.querySelectorAll('#StoreTemplate .Panel .Panel a[href*="/app/"]')).filter(game => game.querySelector('img'));

					// Remove background
					games.forEach(game => {
						removeLangInfo(game);
					});

					const ids = games.map(game => {
						const appId = game.href.split('app/')[1].split('/')[0];
						game.dataset.id = appId;
						return appId;
					});

					// Remove duplicates
					const uniqueIds = Array.from(new Set(ids));

					// Retrieve language info for all games at once
					chrome.runtime.sendMessage({ type: 'fetch-game', data: { ids: uniqueIds } }, (response) => {
						if (response) {
						const results = JSON.parse(response);

						games.forEach(game => {
							const id = game.dataset.id;
							if (results[id] === false) {
								addLangInfo(game);
							}
						});
						}
					});

					triggerLimit = false;
				}
			});
		} else {
			console.error('Failed to load languages');
		}
	});
}

/*******  Functions  *******/

/**
 * Limits the frequency of function calls.
 * 
 * @param {Function} f - The function to be called with a delay.
 */
function limitFunction(f) {
	if (!triggerLimit) {
		triggerLimit = true;
		setTimeout(function () { f(); }, 20);
	}
}

/**
 * Adds language information to the game element.
 * 
 * @param {Object} g - The game object containing information about the game.
 * @returns {boolean} Returns false if the game object is undefined.
 */
function addLangInfo(g) {
	if (typeof g === 'undefined' || typeof g === null) return false;

	g.parentElement.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
}

function removeLangInfo(g) {
	if (typeof g === 'undefined' || typeof g === null) return false;

	g.parentElement.style.backgroundColor = 'rgba(64, 81, 99, 0.9)';
}