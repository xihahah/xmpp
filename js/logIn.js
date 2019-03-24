var connection = null;
var connected = false;
var url = "http://127.0.0.1:7070/http-bind/";
var newPage = "";

$(document).ready(function () {
    $("#getInto").click(function (){
        if($("#useName").val()==""&&$("#password").val()==""){
            layer.tips('我是另外一个tips，只不过我长得跟之前那位稍有些不一样。', '#ad', {
                tips: [1, '#3595CC'],
                time: 4000
            });
            return
        }
        if(!$("#student").prop("checked")&&!$("#teacher").prop("checked")){
            layer.tips('我是没有被选的tips', '#ad1', {
                tips: [1, '#3595CC'],
                time: 4000
            });
            return
        }else{
            if ($("#student").prop("checked") ) {
                newPage = './studentInterface.html';
            } else if ($("#teacher").prop("checked") ) {
                newPage = './teacherInterface.html';
            }
        }

        var jid = $("#useName").val() + "@hi";
        var password = $("#password").val();

        // 连接
         connection = new Strophe.Connection(url);
         connection.connect(jid, password, onConnect);

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
    if(status === Strophe.Status.CONNFAIL){
        console.log("连接失败");
    }else if(status === Strophe.Status.AUTHFAIL){
        console.log("登录失败");
        alert('用户名或密码错误');
    }else if(status === Strophe.Status.DISCONNECTED){
        console.log("连接断开");
        connected = false;
    }else if (status === Strophe.Status.CONNECTED) {
        console.log("连接成功");
        connected = true;

        // 获取好友列表，发送出席消息？？
        var iq = $iq({
            type:'get'
        }).c('query',{
            xmlns:'jabber:iq:roster'
        });

        connection.sendIQ(iq);

        // 首先要发送一个<presence>给服务器（initial presence）
        connection.send($pres().tree());
        //跳转页面
        window.location.href = newPage;

    }
}