var connection = null;
var connected = false;
var jid = "";
var password = "";

$(document).ready(function () {
    $("#getInto").click(function (){
        if($("#useName").val()==""&&$("#password").val()==""){
            layer.tips('我是另外一个tips，只不过我长得跟之前那位稍有些不一样。', '#ad', {
                tips: [1, '#3595CC'],
                time: 4000
            });
            return
        }
        if ($("#student").prop("checked") ) {
            $("#guide").attr("href",'./studentInterface.html');
            jid = $("#useName").value + "@desktop-7dqbre6";
            password = $("#password").value;
            // 连接
            if (!connected) {
                connection = new Strophe.Connection("http://127.0.0.1:7070/http-bind/");
                connection.connect(jid, password, onConnect);
            }
        } else if ($("#teacher").prop("checked") ) {
            $("#guide").attr("href",'./teacherInterface.html');
        }
    });
    $("#register").click(function(){
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade:0.3,
            // maxmin: true, //开启最大化最小化按钮
            area: ['893px', '600px'],
            success:function(){
                $(".bottomMap").addClass("blur");
            },
            end:function(){
                $(".bottomMap").removeClass("blur");
            },
            content: ["register.html",'no']
        });

    })
});
function onConnect(status) {

    if (status === 2) {
        console.log("连接失败");
    } else if (status === Strophe.Status.AUTHFAIL) {
        console.log("登录失败");
    } else if (status === Strophe.Status.DISCONNECTED) {
        console.log("连接断开");
        connected = false;
    } else if (status === Strophe.Status.CONNECTED) {
        console.log("连接成功");
        connected = true;
        var iq = $iq({
            type: 'get'
        }).c('query', {
            xmlns: 'jabber:iq:roster'
        });
        connection.sendIQ(iq);

        // 首先要发送一个<presence>给服务器（initial presence）
        connection.send($pres().tree());

    }
}