/*******  Variables  *******/
const version = chrome.runtime.getManifest().version;

/*******  Updated Functions  *******/
const log = (...args) => {
	let messageConfig = '%c%s ';

	args.forEach((argument) => {
		messageConfig += '%o';
	});

	console.log(messageConfig, 'color:#f7f7f7; background-color:#0f780f;', '[Steam Language Info]', ...args);
};

log('https://github.com/zjbthomas/LanguageInfo');

/*******  Functions  *******/

function waitForElement(selector) {
    return new Promise(function (resolve, reject) {
        let element = document.querySelector(selector);

        if (element) {
            resolve(element);
            return;
        }

        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let nodes = Array.from(mutation.addedNodes);
                for (let node of nodes) {
                    if (node.matches && node.matches(selector)) {
                        observer.disconnect();
                        resolve(node);
                        return;
                    }
                };
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    });
}