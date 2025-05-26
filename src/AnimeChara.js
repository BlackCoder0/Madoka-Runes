//此处添加文本
const shared_msgs = [
    "早上好，今天你打QB了吗",
    "爱与奇迹的魔法是存在的哦",
];

const character_specific_msgs = {
    '/src/assets/105px-Tomoe_Mami_16.png': [
        "已经没什么好怕的了",
        "要来杯红茶吗",
        "在同等条件下，你觉得你能战胜我吗？",
        "既然要实现他人的愿望，就更应该搞清楚自己追求的是什么，你是希望他能实现你的梦想，还是想借实现他的梦想施恩于他呢。要是没弄清楚这一点，迟早有一天你会后悔的。",
    ],
    '/src/assets/105px-Miki_Sayaka_16.png': [
        "我，真是个笨蛋。",
        "小圆可是要当我的老婆的❤",
        "现在想来，那时的我，还什么都不明白，期盼奇迹的意义，以及代价。",
        "即便如此！有一件事我绝对不会忘记……晓美焰，你是恶魔——！",
    ],
    '/src/assets/105px-Akemi_Homura_16.png': [
        "我……我希望和鹿目圆的相遇能够重来…………不是作为被她保护的我，而是作为保护她的我！",
        "我保证，我一定会救你！无论重来多少次，我都一定会守护你的！",
        "我啊……是来自未来的喔……很多次很多次跟小圆相遇，然后无数次的目睹你的死……要怎样才能救你，要怎样怎能改变你的命运，只为了找到那个答案，无数次重新轮回。",
        "越是轮回，就越是偏离你和我一起度过的时间……心意也互相偏离，言语也渐渐无法相通……我想我大概已经迷路了……",
    ],
    '/src/assets/105px-Kaname_Madoka_16.png': [
        "神什么的都好。至今为止和魔女战斗的大家，相信希望的魔法少女，我不想再让她们哭泣。希望她们都能笑着到最后。任何妨碍这些的法则，我会打破它，重写它。这就是我的祈愿，我的愿望！来！实现它吧！Incubator!",
        "我可以再拜托你一件事吗？我不想变成魔女！虽然有讨厌的事情，也有悲伤的事情，但这个世界上，还有许多我想守护的东西。",
        "对不起！到今天为止一直努力着吧？来走吧，从今以后就永远在一起了！",
        "如果有人说怀有希望是错误，我会无数次反驳“不是这样的”，不管到什么时候。	",
        "这是这样的我最后找到的答案。相信我，我保证，ほむらちゃん为我所做的一切绝对不会白费的。",
    ],
    '/src/assets/105px-Sakura_Kyouko_16.png': [
        "神啊。都经过了这样的人生，至少让我做一次幸福的梦吧。",
        "爱与勇气获得胜利的故事，最后不都是这样吗？我也是、憧憬着那种事情，才成为魔法少女的啊……	",
        "奇迹”并不是免费的。去祈求希望的话，就会散播出与之同等的绝望。",
        "一个人很孤单吧…… 没关系，我会陪着你的。沙耶香···",
    ]
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