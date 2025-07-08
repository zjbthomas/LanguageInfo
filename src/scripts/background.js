let languagesMap = {};

const loadLanguages = async () => {
	languagesMap = {};

	const response = await fetch('https://raw.githubusercontent.com/zjbthomas/SteamOnlineChecker/refs/heads/main/languages.txt');
	const textData = await response.text();

	// Split file into lines
	const lines = textData.split('\n');

	lines.forEach(line => {
		const [id, supported] = line.trim().split(',');
		if (!id || !supported) return; // Skip bad lines
		languagesMap[id] = supported.toLowerCase() === 'true';
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.type) {
		case 'load-languages':
			loadLanguages().then(() => sendResponse(true)).catch(err => {
				console.error(err);
				sendResponse(false);
			});
			break;
		case 'fetch-game':
			fetchData(request.data).then(r => sendResponse(r));
			break;
	}

	return true;
});

const fetchData = async (data) => {
	const results = {};
	data.ids.forEach(id => {
		results[id] = languagesMap[id];
	});

	return JSON.stringify(results);
}