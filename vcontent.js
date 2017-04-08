chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        var videoURL = document.querySelector('.video video').getAttribute('src');
        port.postMessage({videoURL: videoURL});
    });
});