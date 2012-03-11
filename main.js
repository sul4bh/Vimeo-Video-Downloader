
function showPhotos() {
    var photos = req.responseXML.getElementsByTagName("photo");

    for (var i = 0, photo; photo = photos[i]; i++) {
        var img = document.createElement("image");
        img.src = constructImageURL(photo);
        document.body.appendChild(img);
    }
}

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

function setCookie()
{
    var cookieDetail = {
        "url" : "http://vimeo.com",
        "name" : "v6",
        "value" : "1",
        "domain" : ".vimeo.com",
        "path" : "/",
        "expirationDate": 1355244471
    }

    chrome.cookies.set(cookieDetail);
//    console.log("------------------");
//    console.log(cookieDetail);

}

function getVideoXML(videoId)
{
    var loadUrl = "http://vimeo.com/moogaloop/load/clip:" + videoId;


    /*
     Problem: Sending a cookie to the new vimeo interface does not allow the request to access the moogaloop XML.
     Solution: Step1. Store all the cookies in a cookieJar
     Step2. Delete all the cookie.
     Step3. Make necessary requests to the vimeo server for XML
     Step4. Restore cookie from the cookieJar
     */

//    var cookieJar = [];

    //fetch all cookies
//    chrome.cookies.getAll({},function(cookie){
//        cookie.forEach(function(item){
//            cookieJar.push(item)
//        });
//    })


    //the call to cookies API above is asynchronous. We hope that the call is executed within 2 sec.
//    setTimeout(function(){
//        cookieJar.forEach(function(cookie){
//            var url = "http" + (cookie.secure ? "s" : "") + "://vimeo.com" + cookie.path;
//            console.log(url);
//            console.log(cookie.name);
////            chrome.cookies.remove({"url":url,"name":cookie.name},function(result){
////            });
//        });
//    },2000);
                chrome.cookies.remove({"url":"http://vimeo.com","name":"v6"});


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
            {
                $("#vid-hd").show().click(function(){
                    window.open(getUrl+'/?q=hd','_newtab');
                });
            }
            setCookie();
        }

    ).error(function() {
            $("#loader").hide();
            $("#error").html("Couldn't fetch XML. Error !");
            $("#error").show();
        })

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

        if (isNaN(videoId))
        {
            $("#error").show();
            return(-1);
        }
        $("#loader").show();
        var info = getVideoXML(videoId);

    });

}
