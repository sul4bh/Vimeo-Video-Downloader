//start on popup load
$(function(){
    init();
});

function getVideoInfo(videoId){
    var id;
    var time;
    var sig;
    var qualities;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var port = chrome.tabs.connect(tabs[0].id);
        port.postMessage({dummy:0}); //dummy post
        port.onMessage.addListener(function getResp(response) {
            processData(videoId, response.videoURL);
        });
    });
}


function processData(videoId, videoURL){
    var thumbUrlRequest = "http://vimeo.com/api/v2/video/"+videoId+".json";

    $.get(
        thumbUrlRequest,
        function(response){
            initUI(videoURL,response[0].thumbnail_medium,response[0].title);
        },'json');
}


function initUI(downUrl, thumb, title){

    $("#loader").fadeOut(function()
    {
        $("#info").show();
        showCount();
    });

    $("#vid-image").attr("src",thumb);
    $("#vid-title").html(title);

    $("#vid-sd").show().click(function(){
        incUseCount();
        window.open(downUrl,'_newtab');
        window.open(downUrl,'_newtab');
    });

}

function init(){
    chrome.tabs.query({active: true}, function(tab) {
        var videoId = tab[0].url;
        videoId = videoId.split('/');

        videoId = videoId[videoId.length-1];

        if (isNaN(videoId) || videoId == '')
        {
            $("#error").show();
            return(-1);
        }



        $("#loader").show();

        var info = getVideoInfo(videoId);

    });
}


function incUseCount(){

    //synced storage namespace
    var storage = chrome.storage.sync;

    storage.get('useCount',function(data){
        var currentCount = data.useCount;
        currentCount = currentCount?currentCount:0;

        storage.set({'useCount': ++currentCount}, function(){
        });

    });
}


function showCount(){
    var storage = chrome.storage.sync;

    storage.get('useCount',function(data){
        var currentCount;
        currentCount = data.useCount;
        currentCount = currentCount?currentCount:0;
        $('#count').html(currentCount);
        $('#use-count').show();

    });
}
