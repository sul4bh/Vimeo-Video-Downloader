//this is the content_script file. The code in this file is appended to the tab from where the script is fired.

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

    var id = window.location.href.match(/[0-9]+/);
    var time = document.body.innerHTML.match(/\"timestamp\":[0-9]+/)[0].split(':')[1];
    var sig = document.body.innerHTML.match(/\"signature\":\"[a-z0-9]+/)[0].split(':')[1].replace("\"", "");
    var qualities = document.body.innerHTML.match(/h264\":\[[\"a-z,]+/)[0].split('[')[1].split(',');

    
    if (request.action == "getDOM")
        sendResponse({id: id, time:time, sig:sig, qualities:qualities});
    else
        sendResponse({}); // Send nothing..
});
