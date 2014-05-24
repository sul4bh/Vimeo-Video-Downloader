//Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function checkForValidUrl(tabId, changeInfo, tab) {
    videoId = tab.url;
    videoId = videoId.split('/');

    if (videoId[2].toLowerCase() == "vimeo.com")
    {
        chrome.pageAction.show(tabId)
    }
}

