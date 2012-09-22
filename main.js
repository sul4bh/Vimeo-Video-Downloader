//start on popup load
$(function(){
    init();
});

function getVideoInfo(){
    var id;
    var time;
    var sig;
    var qualities;

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {action: "getDOM"}, function(response) {
            processData(response);
        });
    });
}


function processData(data){
    var downUrl = 'http://player.vimeo.com/play_redirect?'
        + 'clip_id=' + data.id
        + '&sig=' + data.sig
        + '&time=' + data.time
        + '&codecs=H264,VP8,VP6&type=moogaloop_local&embed_location=';

    var hd = false;
    if ($.inArray('hd',data.qualities) != -1)
    {
        hd = true;
    }

    var thumbUrlRequest = "http://vimeo.com/api/v2/video/"+data.id+".json";

    $.get(
        thumbUrlRequest,
        function(response){
            initUI(downUrl,hd,response[0].thumbnail_medium,response[0].title);
        },'json');
}


function initUI(downUrl, hd, thumb, title){

    $("#loader").fadeOut(function()
    {
        $("#info").show();
        showCount();
    });

    $("#vid-image").attr("src",thumb);
    $("#vid-title").html(title);

    $("#vid-sd").show().click(function(){
        incUseCount();
        window.open(downUrl+'&quality=sd','_newtab');
    });

    if (hd){
        $("#vid-hd").show().click(function(){
            incUseCount();
            window.open(downUrl+'&quality=hd','_newtab');
        });

    }
}

function init(){
    chrome.tabs.getSelected(null, function(tab) {
        videoId = tab.url;
        videoId = videoId.split('/');

        videoId = videoId[videoId.length-1];

        if (isNaN(videoId) || videoId == '')
        {
            $("#error").show();
            return(-1);
        }



        $("#loader").show();

        var info = getVideoInfo();

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
