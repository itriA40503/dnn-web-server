"use strict";

function mobileAndTabletcheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function loadYoutubeAPI() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/player_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

loadYoutubeAPI()
  var tv;
  var playerDefaults = {autoplay: 0, autohide: 1, modestbranding: 1, rel: 0, showinfo: 0, controls: 0, disablekb: 1, enablejsapi: 0, iv_load_policy: 3};
  var vid = [
      {'videoId': 'xkMdLcB_vNU',  'suggestedQuality': 'hd1080'},
      {'videoId': 'qeibsvuDfbA',  'suggestedQuality': 'hd720'},
      {'videoId': 'UR9looq0cNk',  'suggestedQuality': 'hd720'},
      {'videoId': 'Em3XjsMuhTA',  'suggestedQuality': 'hd1080'},
      {'videoId': 'K3myqnKgegY',  'suggestedQuality': 'hd720'},
      {'videoId': 'mqpZNWYyMf4',  'suggestedQuality': 'hd720'},
      {'videoId': 'bX6IIo5fmx0',  'suggestedQuality': 'hd720'},
      {'videoId': '12OONG09ng8',  'suggestedQuality': 'hd1080'},
      {'videoId': 'uAhCP6sVDZU',  'suggestedQuality': 'hd1080'},
      {'videoId': 'O3DCpZhpX2Y',  'suggestedQuality': 'hd720'},
      {'videoId': 'agvnZl90cq4',  'suggestedQuality': 'hd720'},
      {'videoId': 'q8Qp-bV3ZdI',  'suggestedQuality': 'hd720'},
      {'videoId': 'IxdJVwRYwEc',  'suggestedQuality': 'hd1080'}
        /* {'videoId': 'R3xv4DsSBhU',  'suggestedQuality': 'hd720'},
         {'videoId': 'WCM69omIEpQ',  'suggestedQuality': 'hd720'},
         {'videoId': 'JwCIW8QlkHM',  'suggestedQuality': 'hd720'},
         {'videoId': 'cSwc1GmhF3g',  'suggestedQuality': 'hd720'},
         {'videoId': 'SxNo8NkKtHE',  'suggestedQuality': 'hd720'},
         {'videoId': 'Cktm5ug7eOU',  'suggestedQuality': 'hd720'},
         {'videoId': 'KaqC5FnvAEc',  'suggestedQuality': 'hd720'},
         {'videoId': 'ZZ5LpwO-An4',  'suggestedQuality': 'hd720'},
         {'videoId': 'FeHyxQGM6bg',  'suggestedQuality': 'hd720'},
         {'videoId': '3TyGTGg3CIc',  'suggestedQuality': 'hd720'},
         {'videoId': 'hX4-q_tU2r0',  'suggestedQuality': 'hd1080'},
         {'videoId': 'HaMu_WjhzhE',  'suggestedQuality': 'hd720'},
         {'videoId': 'qXdv6j519aU',  'suggestedQuality': 'hd720'},
         {'videoId': 'BNoMQxENM0U',  'suggestedQuality': 'hd720'},
         {'videoId': 'p3yIOoyhs-I',  'suggestedQuality': 'hd720'},
         {'videoId': 'rHmZYeh-EYI',  'suggestedQuality': 'hd720'},
         {'videoId': 'dBfv3cYJBEY',  'suggestedQuality': 'hd720'},
         {'videoId': 'GCUKZ7h6whc',  'suggestedQuality': 'hd720'},
         {'videoId': 'dBqMxvqLQuw',  'suggestedQuality': 'hd720'},
         {'videoId': 't_3VZDb7pj4',  'suggestedQuality': 'hd720'},
         {'videoId': '7J5nR3hOcRM',  'suggestedQuality': 'hd720'},
         {'videoId': 'FH-XKpYY4Yw',  'suggestedQuality': 'hd720'},
         {'videoId': 'ZbM6WbUw7Bs',  'suggestedQuality': 'hd1080'},
         {'videoId': 'SQHTrYRcBsA',  'suggestedQuality': 'hd720'},
         {'videoId': '3GJOVPjhXMY',  'suggestedQuality': 'hd720'},
         {'videoId': 'w6QJ2tft9PQ',  'suggestedQuality': 'hd720'},
         {'videoId': '0wkRJnrCmAQ',  'suggestedQuality': 'hd720'},
         {'videoId': '8hlTqwvfYzA',  'suggestedQuality': 'hd720'},
         {'videoId': 'tha07Sasx60',  'suggestedQuality': 'hd720'},
         {'videoId': 'mDKT7x53AX8',  'suggestedQuality': 'hd720'},
         {'videoId': 'kPpE0_yAVjQ',  'suggestedQuality': 'hd720'}*/

    ];
  var randomVid = Math.floor(Math.random() * vid.length);
  var currVid = randomVid;
  $('.hi em:last-of-type').html(vid.length);

function onYouTubePlayerAPIReady(){
    tv = new YT.Player('tv', {events: {'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults});
}

function onPlayerReady(){
    tv.loadVideoById(vid[currVid]);
    tv.setVolume(35);
   // tv.mute();
}

function onPlayerStateChange(e) {
    if (e.data === 1){
        $('#tv').addClass('active');
        $('.hi em:nth-of-type(2)').html(currVid + 1);
    } else if (e.data === 2){
        $('#tv').removeClass('active');
        if(currVid === vid.length - 1){
            currVid = 0;
        } else {
            currVid++;
        }
        tv.loadVideoById(vid[currVid]);
        tv.seekTo(vid[currVid].startSeconds);
    }
}

function vidRescale(){

    var w = $(window).width(),
        h = $(window).height();

    if (w/h > 16/9){
        tv.setSize(w, w/16*9);
        $('.tv .screen').css({'left': '0px'});
    } else {
        tv.setSize(h/9*16, h);
        $('.tv .screen').css({'left': -($('.tv .screen').outerWidth()-w)/2});
    }
}

function japari(){

    var seed = {
        x: (2147483648 * Math.random()) | 0,
        y: (2147483648 * Math.random()) | 0,
        z: (2147483648 * Math.random()) | 0,
        w: (2147483648 * Math.random()) | 0
    };
    function randomInt(xors) {
        var t = xors.x ^ (xors.x << 11);
        xors.x = xors.y;
        xors.y = xors.z;
        xors.z = xors.w;
        return xors.w = (xors.w^(xors.w>>>19))^(t^(t>>>8));
    }
    function random(xors) {
        return randomInt(xors) / 2147483648;
    }
    function shuffle(xs){
        var v = Object.assign({}, seed);
        var xs = xs.slice();
        var ys = [];
        while(0 < xs.length){
            var i = Math.abs(randomInt(v)) % xs.length;
            ys.push(xs[i]);
            xs.splice(i, 1);
        }
        return ys;
    }

    var colorTuples = shuffle([
        ["#16ae67", "#90c31f"],
        ["#ea5421", "#f39800"],
        ["#00ac8e", "#e4007f"],
        ["#227fc4", "#00a1e9"],
        ["#9fa0a0", "#c9caca"],
        ["#e60013", "#f39800"],
        ["#c3d600", "#a42e8c"]
    ]);

    var topColors = shuffle(["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"]);


    var middleInput = document.querySelector("#middle");
    var bottomInput = document.querySelector("#bottom");

    var middle = document.querySelector(".middle");
    var bottom = document.querySelector(".bottom");

    var foreground = document.getElementById("foreground");
    var image = document.getElementById("result");

    var container = document.querySelector(".container");

    var canvas = document.createElement("canvas");
    var g = canvas.getContext("2d");

    function update(){
        setTimeout(function(){
            setText(middleInput.value, bottomInput.value);
        });
    }

    function setText(middleText, bottomText){

        var middleTextSize = 120;
        var middleBottomPadding = 20;
        var bottomTextSize = 30;
        var margin = 60;
        var bottomTextLetterSpacing = 20;

        var middleTextFont = `normal 400 ${middleTextSize}px/2 japarifont`;
        var bottomTextFont = `normal 400 ${bottomTextSize}px/2 PlayBold`;

        g.font = middleTextFont;
        var middleMetrics = g.measureText(middleText);
        g.font = bottomTextFont;
        var bottomMetrics = g.measureText(bottomText);
        canvas.width = margin + Math.max(
                middleMetrics.width,
                bottomMetrics.width + bottomTextLetterSpacing * (bottomText.length - 1)
            ) + margin;
        canvas.height = margin + middleTextSize + middleBottomPadding + bottomTextSize + margin;


        // prepare canvas
        g.save();
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.textBaseline = "top";

        // centerize
        var metrics = g.measureText(middleText);
        g.translate((canvas.width - middleMetrics.width) * 0.5, margin);

        // stroke outline
        g.font = middleTextFont;
        g.strokeStyle = "white";
        g.lineWidth = 20.0;
        g.shadowColor = "rgba(0, 0, 0, 0.3)";
        g.shadowBlur = 10;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.strokeText(middleText, 0, 0);

        // fill charactors
        var x = 0;
        var xors = Object.assign({}, seed);
        for(var i = 0; i < middleText.length; i++){
            var c = middleText.slice(i, i + 1);

            // base color
            g.shadowColor = "rgba(0, 0, 0, 0.6)";
            g.shadowBlur = 10;
            g.fillStyle = colorTuples[i % colorTuples.length][0];
            g.fillText(c, 0, 0);

            g.save();

            // clip
            var rot = random(xors);
            g.beginPath();
            g.save();
            g.translate(middleTextSize * 0.5, middleTextSize * 0.5);
            g.rotate(rot);
            g.translate(-middleTextSize * 0.5, -middleTextSize * 0.5);
            g.moveTo(-middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 2);
            g.lineTo(-middleTextSize * 2, middleTextSize * 2);
            g.closePath();
            g.restore();
            g.clip();

            // upper color
            g.shadowColor = "none";
            g.shadowBlur = 0;
            g.fillStyle = colorTuples[i % colorTuples.length][1];
            g.fillText(c, 0, 0);

            g.restore();

            // go to next
            var metrics  = g.measureText(c);
            g.translate(metrics.width, 0);
        }

        g.restore();
        // bottom text
        g.save();
        g.strokeStyle = "white";
        g.fillStyle = "#977a2d";
        g.lineWidth = 13.0;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.textBaseline = "top";
        g.font = bottomTextFont;

        var metrics = g.measureText(bottomText);
        g.translate(
            (canvas.width - metrics.width - (bottomText.length - 1) * bottomTextLetterSpacing) * 0.5,
            margin + middleTextSize + middleBottomPadding
        );

        for(var i = 0; i < bottomText.length; i++){
            var c = bottomText.slice(i, i + 1);
            g.shadowColor = "rgba(0, 0, 0, 0.3)";
            g.shadowBlur = 10;
            g.strokeText(c, 0, 0);
            g.shadowColor = "transparent";
            g.fillText(c, 0, 0);
            var metrics = g.measureText(c);
            g.translate(metrics.width + bottomTextLetterSpacing, 0);
        }

        g.restore();


        var url = canvas.toDataURL();
        image.src = url;

    }

    update();
};

$(window).on('load',function(){
    japari()
});

$(window).on('load resize', function(){
    vidRescale();
});

$('.hi span:first-of-type').on('click', function(){
    $('#tv').toggleClass('mute');
    $('.hi em:first-of-type').toggleClass('hidden');
    if($('#tv').hasClass('mute')){
        tv.mute();
    } else {
        tv.unMute();
    }
});

$('.hi span:last-of-type').on('click', function(){
    $('.hi em:nth-of-type(2)').html('~');
    tv.pauseVideo();
});


