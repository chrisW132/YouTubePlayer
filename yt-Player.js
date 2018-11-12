function invokeVideos(targetElementId) {
/***********************************************************
  * YOUTUBE*
 ***********************************************************/

   //****FUNCTION VARIABLES**********//

   var idSelector = "#" + targetElementId;

   var videoData = {
     youtubeApiKey: "", //plug in the key API - needs to be uniquely generated


     $videoSelector: $(idSelector)
   };

   var $ytPlayer = $(idSelector + " .yt-player");

    if ($(idSelector + ".videoBlock").length > 0) {


        $(idSelector + " .widget-tabs:first").addClass("active");
        gapi.load('client', loadAPI);

        function loadAPI() {
             "use strict";

             gapi.client.setApiKey(videoData.youtubeApiKey);
             //sets api key for application - specifically rendered for this app
             var player = "<i class='fa fa-youtube-play'></i><div class='line'></div>"
             var playlistId = $(idSelector + " [data-playlist-id]:first").attr("data-playlist-id"),
                 nextPageToken, prevPageToken;

             //grabbing playlistId from DOM
             $(idSelector + " [data-playlist-id]:first").addClass("active");

             $ytPlayer.html(player);

             function loadVideo(videoId, videoDesc) {

                 var player = "<iframe class='embed-responsive-item' src='//www.youtube.com/embed/" + videoId + "?version=3&autohide=1&modestbranding=1&showinfo=0&rel=0' frameborder='0' allowfullscreen></iframe>";
                 // takes params from API and sets up video player
                 var count = $(idSelector + '.videoBlock ul.video-menu').children('.yt-menu').length;
                 var $currentLi = $(idSelector + ' ul.video-menu li[data-video-id="' + videoId + '"]');
                 var currentLiIndex = $currentLi.data("video-index");

                 $ytPlayer.html(player);
                 //creates player html in DOM

                 videoBlockSize();
                 $(idSelector + ' .totalVidYT').text(count);
                 $(idSelector + ' .viewedYT').text(currentLiIndex);
             }

             function initPlayList(pageToken) {

                 var requestOptions = {
                         playlistId: playlistId,
                         part: "snippet",
                         maxResults: 20,
                         pageToken: pageToken
                     },
                     request = gapi.client.youtube.playlistItems.list(requestOptions);

                 request.execute(function(response) {

                     var nextVis = nextPageToken ? "visible" : "hidden",
                         prevVis = prevPageToken ? "visible" : "hidden",
                         videoList = response.result.items,
                         listLength = $(videoList).length,
                         sIndex = videoList[0].snippet.position + 1,
                         eIndex, totalVideos = response.result.pageInfo.totalResults,
                         firstVideoId = videoList[0].snippet.resourceId.videoId,
                         firstTitle = videoList[0].snippet.title,
                         firstDesc = videoList[0].snippet.description,
                         nextPageToken = response.result.nextPageToken,
                         prevPageToken = response.result.prevPageToken;

                     $(idSelector + " #video-next-button").css("visibility", nextVis);
                     $(idSelector + " #video-prev-button").css("visibility", prevVis);

                     if (nextVis === "hidden" && listLength < requestOptions.maxResults) {
                         eIndex = videoList[listLength - 1].snippet.position + 1;
                     }else{
                         eIndex = videoList[requestOptions.maxResults - 1].snippet.position + 1;
                     }

                     $.each(videoList, function(index, item) {

                         //setting variables pulled from api
                         var videoTitle = item.snippet.title,
                             videoDesc = item.snippet.description,
                             videoId = item.snippet.resourceId.videoId,
                             videoThumbNail = item.snippet.thumbnails.medium.url,
                             videoItem = "<li class='video-item yt-menu' data-video-index='" + (index + 1) + "' data-video-id='" + videoId + "' data-video-title='" + videoTitle + "' data-video-desc='" + videoDesc + "'><a href='#'><div class='itemNum col-md-1 col-sm-1 col-xs-1'>" + (index + 1) + "</div><div class='col-md-3 col-sm-4 col-xs-3'><img class='video-thumbnail' src='" + videoThumbNail + "' alt='" + videoTitle + "' /></div>" + "<div class='vidTitle col-md-7 col-sm-7 col-xs-7'>" + videoTitle + "</div></a></li>";


                         $(idSelector + " .video-menu").append(videoItem);

                     });

                     $(idSelector + " #video-page-display").html("Videos " + sIndex + " - " + eIndex + " of " + totalVideos);

                     setTimeout(function() {
                       loadVideo(firstVideoId, firstTitle, firstDesc)
                     }, 3000);

                     $(idSelector + " .video-item:first").addClass("active");

                     $(idSelector + " .video-item").click(function() {

                         if ($(this).hasClass("active")) {
                             return false;
                         } else {

                             var videoId = $(this).attr("data-video-id"),
                                 videoTitle = $(this).attr("data-video-title"),
                                 videoDesc = $(this).attr("data-video-desc");

                             $(idSelector + " .video-item").removeClass("active");
                             loadVideo(videoId, videoTitle, videoDesc);
                             $(this).addClass("active");

                             return false;
                         }

                     });

                 });
             }

             gapi.client.load("youtube", "v3", initPlayList);

             $(idSelector + " .videoBlock li[data-playlist-id]").click(function() {

                 var playlistId = $(this).attr("data-playlist-id");

                 if ($(this).hasClass("active")) {
                     return false;
                 } else {

                     $(idSelector + " .videoBlock li[data-playlist-id]").removeClass("active");
                     initPlayList();
                     $(this).addClass("active");

                     return false;
                 }
             });

             $(idSelector + " #video-prev-button").click(function() {
                 initPlayList(prevPageToken);
             });

             $(idSelector + " #video-next-button").click(function() {
                 initPlayList(nextPageToken);
             });


             function videoBlockSize() {

                 var videoHeight = ($(idSelector + ' .videoBlock div.tab-content').outerHeight());
                 $(idSelector + ' .videoBlock div.navContain').height(videoHeight);
             }

             $(window).resize(function() {
                 videoBlockSize();
             });
         }

    }
}
