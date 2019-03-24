var connection;
$('document').ready(function () {
    $('#rePassword-input').change(function () {
        if($('#password-input').val()!==$('#rePassword-input').val()){
            alert('两次密码不一致');
        }
    });

    $('#register').click(function () {
        if($('#account-input').val()==""||$('#password-input').val()==""||$('#rePassword-input').val()==""){
            return
        }
        var jid = $('#account-input').val();
        var password = $('#password-input').val();

        connection = new Strophe.Connection("http://127.0.0.1:7070/http-bind/");
        connection.connect(jid,null,onConnect);

        //发送注册信息，对 就是不用请求直接发
        var iq=$iq({
            type:'set'
        }).c('query',{xmlns:'jabber:iq:register'})
            .c('username').t(jid).up()
            .c('password').t(password);
        connection.sendIQ(iq);

        $('#account-input').val("");
        $('#password-input').val("");
        $('#rePassword-input').val("");
        alert('注册成功！');
    })
});
function onConnect(status){
    console.log("当前：" + status);

    if(status === Strophe.Status.CONNFAIL){
        console.log("连接失败");
    }else if(status === Strophe.Status.AUTHFAIL){
        console.log("登录失败");
    }else if(status === Strophe.Status.DISCONNECTED){
        console.log("连接断开");
        connected=false;
    }else if(status === Strophe.Status.CONNECTED){
        console.log("连接成功");
        // connected=true;

    }
}