//此处添加文本
const shared_msgs = [
    "早上好，今天你打QB了吗",
    "爱与奇迹的魔法是存在的哦",
];

const character_specific_msgs = {
    '/src/assets/105px-Tomoe_Mami_16.png': ["巴麻美。"],
    '/src/assets/105px-Miki_Sayaka_16.png': ["沙耶香。"],
    '/src/assets/105px-Akemi_Homura_16.png': ["晓美焰。"],
    '/src/assets/105px-Kaname_Madoka_16.png': ["鹿目圆。"],
    '/src/assets/105px-Sakura_Kyouko_16.png': ["杏子。"]
};

const charaImages = [
    '/src/assets/105px-Tomoe_Mami_16.png',
    '/src/assets/105px-Miki_Sayaka_16.png',
    '/src/assets/105px-Akemi_Homura_16.png',
    '/src/assets/105px-Kaname_Madoka_16.png',
    '/src/assets/105px-Sakura_Kyouko_16.png'
];

function getRandomCharaImage() {
    const randomIndex = Math.floor(Math.random() * charaImages.length);
    return charaImages[randomIndex];
}

jQuery(document).ready(function() {
    if (isPC() && (!checkClosed())) {
        var $node = $("<div class='animechara'><span class='message' id='message'>回天到底什么时候出啊</span><div class='chara'></div></div>")
        
        if ($('.animechara').length <= 0) {
            $("body").append($node);
        }

        // 初始化角色图片
        // 初始化角色图片
        $('.chara').css('background-image', 'url(' + getRandomCharaImage() + ')');
        // randchat();
        // var autoloop = setInterval(randchat, 15000);
        
        // 点击事件
        $(".chara").click(function() {    
            // $('.chara').css('background-image', 'url(' + getRandomCharaImage() + ')');
            randchat();
        });
    }

    // 拖拽功能
    var _move = false;
    var ismove = false;
    var _x, _y;
    
    $(".animechara").mousedown(function(e) {
        _move = true;
        _x = e.pageX - parseInt($(".animechara").css("left"));
        _y = e.pageY - parseInt($(".animechara").css("top"));
    });
    
    $(document).mousemove(function(e) {
        if (_move) {
            var x = e.pageX - _x;
            var y = e.pageY - _y;
            var wx = $(window).width() - $('.animechara').width();
            var dy = $(document).height() - $('.animechara').height();
            
            if (x >= 0 && x <= wx && y > 0 && y <= dy) {
                $(".animechara").css({
                    top: y,
                    left: x
                });
                ismove = true;
            }
        }
    }).mouseup(function() {
        _move = false;
    });
});

function showMessage(a, b) {
    if (b == null) b = 8000;
    $("#message").hide().stop();
    $("#message").html(a);
    $("#message").fadeIn();
    $("#message").fadeTo("1", 1);
    $("#message").fadeOut(b);
}

function randchat(b) {
    if (b == null) {
        let currentImage = $('.chara').css('background-image');
        // 提取出文件路径中相对路径部分
        const match = currentImage.match(/\/src\/assets\/105px-[^"]+/);
        currentImage = match ? match[0] : '';

        const specificMsgs = character_specific_msgs[currentImage] || [];
        const allMsgs = shared_msgs.concat(specificMsgs);

        // 定义多个事件及其日期
        const events = [
            { name: '魔法少女小圆上映', date: new Date('2011-01-07') },
            { name: '叛逆的物语上映', date: new Date('2013-10-26') },
            // 添加更多事件...
        ];

        const currentDate = new Date();
        let timeElapsedMsgs = [];

        // 计算每个事件的时间差并添加到消息列表
        events.forEach(event => {
            const timeDiff = currentDate.getTime() - event.date.getTime();

            const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
            const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * (365.25/12)));
            const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * (365.25/12))) / (1000 * 60 * 60 * 24));

            timeElapsedMsgs.push(`距离${event.name}已经过去${years}年${months}月${days}日`);
        });

        const combinedTimeElapsedMsg = timeElapsedMsgs.join('<br>'); // 使用逗号连接多个事件的时间信息
        allMsgs.push(combinedTimeElapsedMsg);

        if (allMsgs.length > 0) {
            const randomIndex = Math.floor(Math.random() * allMsgs.length);
            showMessage(allMsgs[randomIndex]);
        }
    } else {
        setface(parseInt(Math.random() * 5));
    }
}


function isPC() {
    var UserAgent = navigator.userAgent.toLowerCase();
    return !(UserAgent.match(/ipad|iphone os|ucweb|android|micromessenger/i));
}

function checkClosed() {
    if (document.cookie.length > 0) {
        const cookies = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith("animecharaisclosed=")) {
                return cookie.substring(19) === "true";
            }
        }
    }
    return false;
}

$('#btn_closeanimechara').click(function() {
    document.cookie = "animecharaisclosed=true";
    console.log("模块:看板娘:看板娘已在该生命周期关闭，重新启动浏览器可重新加载");
    window.location.reload();
});

$('#btn_reloadanimechara').click(function() {
    document.cookie = "animecharaisclosed=false";
    console.log("模块:看板娘:看板娘已重新启动，页面即将刷新");
    window.location.reload();
});