layui.use('element', function () {
    var element = layui.element;

    //…
});

$(document).ready(function () {
    $("#Tookit").hide();
    $("#GetMouse").hover(function(){
        $("#Tookit").show();
    }, function () {
        $("#Tookit").hide();
    });
    $("#add-1").click(function () {
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade: false,
            // maxmin: true, //开启最大化最小化按钮
            area: ['600px', '400px'],
            content: "note.html"
        });

    });
    $("#add-2").click (function () {
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade: false,
            // maxmin: true, //开启最大化最小化按钮
            area: ['600px', '400px'],
            content: "photo.html"
        });

    });
    $("#add-3").click (function () {
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade: false,
            // maxmin: true, //开启最大化最小化按钮
            area: ['600px', '400px'],
            content: "video.html"
        });

    });
    $("#add-4").click (function () {
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade: false,
            // maxmin: true, //开启最大化最小化按钮
            area: ['600px', '400px'],
            content: "file.html"
        });

    });

    $("#personal").hide();
    $("#portrait").hover(function(){
        $("#personal").show();
    }, function () {
        $("#personal").hide();
    });

    $("#sheZhi").click(function () {
        layer.open({
            type: 2,
            title: '',
            shadeClose: true,
            shade:false,

            area: ['96%', '96%'],
            content: ["message.html",'no']
        });

    });
    $("#task").click (function () {
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade: false,

            area: ['600px', '400px'],
            content: "task.html"
        });

    });
    $("#notice").click (function () {
        layer.open({
            type: 2,
            title: null,
            shadeClose: true,
            shade: false,
            // maxmin: true, //开启最大化最小化按钮
            area: ['600px', '400px'],
            content: "notice.html"
        });

    });



});