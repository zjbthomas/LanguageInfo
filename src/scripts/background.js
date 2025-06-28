chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.type) {
		case 'fetch-game':
			fetchData(request.data).then(r => sendResponse(r));
		break;
	}

	return true;
});

const fetchData = async (data) => {
	return fetch(`https://store.steampowered.com/api/appdetails?appids=${data.id}&l=english`, {
		method: 'GET',
	}).then(async response => {
		try {
			const jsonData = await response.json();

			return JSON.stringify({id: data.id, data: jsonData[data.id].data.supported_languages.includes('Chinese')});
		} catch (error) {
			console.error(error, response);
		}
	});
}