function showPhotos() {
    var photos = req.responseXML.getElementsByTagName("photo");

    for (var i = 0, photo; photo = photos[i]; i++) {
        var img = document.createElement("image");
        img.src = constructImageURL(photo);
        document.body.appendChild(img);
    }
}

// See: http://www.flickr.com/services/api/misc.urls.html
function constructImageURL(photo) {
    return "http://farm" + photo.getAttribute("farm") +
            ".static.flickr.com/" + photo.getAttribute("server") +
            "/" + photo.getAttribute("id") +
            "_" + photo.getAttribute("secret") +
            "_s.jpg";
}

function extractInfo(responseXMl)
{
    var requestSignature = responseXMl.getElementsByTagName("request_signature")[0].textContent;
    var timeStamp = responseXMl.getElementsByTagName("request_signature_expires")[0].textContent;
    var hd =
            responseXMl = responseXMl.getElementsByTagName("video")[0];
    var title = responseXMl.getElementsByTagName("caption")[0].textContent;
    var isHD = responseXMl.getElementsByTagName("isHD")[0].textContent;
    var image = responseXMl.getElementsByTagName("thumbnail")[0].textContent;

    var info = {"title":title,"sig":requestSignature,"tstamp":timeStamp,"hd":isHD,"image":image};

    return info;
}

function getVideoXML(videoId)
{
    var loadUrl = "http://vimeo.com/moogaloop/load/clip:" + videoId;
    $.get(
            loadUrl,
            function(response)
            {
                var info = extractInfo(response);
                var getUrl = "http://vimeo.com/moogaloop/play/clip:"+ videoId + "/" + info.sig + "/" + info.tstamp;
                $("#loader").fadeOut(function()
                {
                    $("#info").show();
                });
                $("#vid-title").html(info.title);
                $("#vid-image").attr("src",info.image);

                $("#vid-sd").click(function(){
                    window.open(getUrl+'/?q=sd','_newtab');
                });
                if (info.hd == '1')
                    $("#vid-hd").click(function(){
                        window.open(getUrl+'/?q=hd','_newtab');
                    });

            }


            );

}

function init()
{
    chrome.tabs.getSelected(null, function(tab) {
        videoId = tab.url;
        videoId = videoId.split('/');

        if (videoId[2].toLowerCase() != "vimeo.com")
        {
            $("#error").show();
            return(-1);
        }
        videoId = videoId[videoId.length-1];

        $("#loader").show();
        var info = getVideoXML(videoId);

    });

}
