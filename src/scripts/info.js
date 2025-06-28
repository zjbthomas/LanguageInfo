const path = window.location.pathname;
let triggerLimit = false;

if (path.split('/')[1] === 'wishlist') {
	// Wishlist page
	waitForElement('#StoreTemplate .Panel input.Focusable').then(function (input) {
		input.addEventListener('keyup', function () { limitFunction(filterWishlistList) });
		document.getElementById('StoreTemplate').addEventListener('scroll', function () { limitFunction(filterWishlistList) });
		filterWishlistList();

		function filterWishlistList() {
			document.querySelectorAll('#StoreTemplate .Panel .Panel a[href*="/app/"]').forEach(game => {
				// if game doesn't have img element, skip it
				if (!game.querySelector('img')) return;
				const appId = game.href.split('app/')[1].split('/')[0];
				if (appId) {
					game.dataset.id = appId;

					// retrieve lanaguage information
					chrome.runtime.sendMessage({ type: 'fetch-game', data: { id: appId } }, (response) => {
						// Process found games
						if (response) {
							const jsonData = JSON.parse(response);

							if (jsonData.data === false) {
								addLangInfo(game);
							}
						}
					});
				}
			});

			triggerLimit = false;
		}
	});
}

/*******  Functions  *******/

/**
 * Limits the frequency of function calls to 700ms.
 * 
 * @param {Function} f - The function to be called with a delay.
 */
function limitFunction(f) {
	if (!triggerLimit) {
		triggerLimit = true;
		setTimeout(function () { f(); }, 700);
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