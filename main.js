var yunba_demo;
var CM;
var CHATROOM_TOPIC = 'yunba_damoo';

function initialize() {
    initYunbaSDK();
}

// 初始化 Yunba SDK 并连接到服务器
function initYunbaSDK() {
    logMessage('正在初始化...');
    yunba_demo.init(function (success) {
        if (success) {
            logMessage('初始化成功...');
            connect();
        } else {
            logMessage('初始化失败或服务断线，若长时间无响应请尝试刷新页面');
            connect();
        }
    }, function () {
        logMessage('服务断线，正在尝试重新连接...');
        connect();
    });
}

// 输出提示信息
function logMessage(data) {
//    addMessageElement({log: data}, true);
}

// 连接服务器
function connect() {
    logMessage('正在尝试连接...');
    yunba_demo.connect(function (success, msg) {
        if (success) {
            logMessage('连接成功...');
            setMessageCallback();
            setAlias(function () {
                subscribe(CHATROOM_TOPIC);
            });
        } else {
            logMessage(msg);
        }
    });
}

// 设置别名
function setAlias(callback) {
    var alias = 'Visitor_' + Math.floor(Math.random() * 100000);

    yunba_demo.get_alias(function (data) {
        if (!data.alias) {
            yunba_demo.set_alias({'alias': alias}, function (data) {
                if (!data.success) {
                    console.log(data.msg);
                } else {
                    username = alias;
                }

                callback && callback();
            });
        } else {
            username = data.alias;
            callback && callback();
        }
    });
}

// 订阅消息
function subscribe(topic) {
    logMessage('正在尝试加入房间...');
    yunba_demo.subscribe({'topic': topic}, function (success, msg) {
        if (success) {
            yunba_demo.subscribe_presence({'topic': topic}, function (success, msg) {
                if (success) {
                    logMessage('加入房间成功...');
                } else {
                    logMessage(msg);
                }
            });
        } else {
            logMessage(msg);
        }
    });
}

// 发布消息
function publish(topic, message) {
    yunba_demo.publish({'topic': topic, 'msg': message}, function (success, msg) {
        if (success) {
            console.log('消息发布成功');
        } else {
            logMessage(msg);
        }
    });
}

// 设置接收到 message 的回调处理方法
function setMessageCallback() {
    yunba_demo.set_message_cb(function (data) {
       logMessage(data.msg);
     //   if (data.topic == CHATROOM_TOPIC) {
            dataController(data.msg);
       // }
    });
}

// 接收到消息后处理消息内容
function dataController(data) {
    var danmaku = {
        "mode":1,
        "text":data,
        "stime":0000,
        "size":30,
        "color":0xff0000
    };
	CM.send(danmaku);
}

function $(element){
	// 获取 DOM 对象的短写，如果你在用 jQuery 也可以采用类似的方法
	return document.getElementById(element);
};

window.addEventListener('load', function(){
	// 在窗体载入完毕后再绑定
	CM = new CommentManager($('my-comment-stage'));
	CM.init();
	// 先启用弹幕播放（之后可以停止）
	CM.start();
	// 开放 CM 对象到全局这样就可以在 console 终端里操控
	window.CM = CM;

	$('btnSndMsg').addEventListener('click', function(e){
		e.preventDefault(); // 抑制默认操作
		var data = prompt("publish message");
		if (!data) return;
		publish(CHATROOM_TOPIC, data);
	});

    yunba_demo = new Yunba({
	    appkey: '5487f75052be1f7e1dd834e8'
    });
    initialize();

    $('my-player').addEventListener("click",function(){
        var videoPlayer = $('abpVideo');
        if (videoPlayer == null)
            return;
        if (videoPlayer.paused)
            videoPlayer.play();
        else
            videoPlayer.pause();
    });
});
