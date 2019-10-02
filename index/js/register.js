var connection;
var jid='lian';
var password;
var exist=false;
$('document').ready(function () {

    $('#account-input').change(function () {
        if($('#account-input').val() !== ""){
            connection = new Strophe.Connection("http://127.0.0.1:7070/http-bind/");
            connection.register.connect(jid,onConnect);
        }
    });
    $('#rePassword-input').change(function () {
        if($('#password-input').val()!==$('#rePassword-input').val()){
            alert('两次密码不一致');
        }
    });
    $('#register').click(function () {
        if($('#account-input').val()===""||$('#password-input').val()===""||$('#rePassword-input').val()===""){
            return
        }
        jid = $('#account-input').val();
        password = $('#password-input').val();

        connection.register.setFields(jid,password);
        connection.register.submit();
    })
});
function onConnect(status){
    console.log("当前：" + status);

    if(status === Strophe.Status.CONFLICT){//13
        // console.log("该用户已存在");
        exist = true;
        layer.msg('该用户已存在', {
            time:2000,
            icon: 5
        },function () {
            location.reload(true);
        });
    }else if(status === Strophe.Status.REGISTERED ){//12 注册结束（注册成不成功都结束了）
        console.log("注册结束");
        if(!exist){
            layer.msg('注册成功，2秒后自动返回', {
                time:2000,
                icon: 6
            },function () {
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭
            });
        }
    }else if(status === Strophe.Status.REGISTER){//11
        console.log("可以注册");
    }
}