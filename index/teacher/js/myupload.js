
//根据请求链接上的名字给文件添加url属性
function getServer(msg) {
    console.log(msg);
    //处理链接
    var putUrl = $(msg).find('put').attr('url');
    var url = putUrl.split('hi');
    var newUrl = url[0]+'10.34.15.181'+url[1];
    console.log(newUrl);

    //根据名字寻找对应文件
    var ff=putUrl.split('/');
    var fName = ff[ff.length-1];
    var file = getFileName(fName);

    //绑上去
    file.url = newUrl;
    // console.log(uploader.getFiles());

}
//根据文件名获取文件
function getFileName(fn) {
    var que = uploader.getFiles();
    for(var i in que){
        if (que[i].name === fn) {
            return uploader.getFile(que[i].id)
        }
    }
    return false;
}


var uploader = WebUploader.create({

    // swf文件路径
    swf: '/Uploader.swf',

    // 文件接收服务端。
    server: null,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#picker',

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false,
    sendAsBinary: true,
    method:'put',
    compress:null
});

// 当有文件被添加进队列的时候
uploader.on( 'fileQueued', function( file ) {
    var $list = $('#thelist');
    var $li = $(
        '<div id="' + file.id + '" class="file-item thumbnail">' +
        '<img>' +
        '<div class="info">' + file.name + '</div>' +
        '</div>'
        ),
        $img = $li.find('img');

    // console.log(file.id +' '+ Date());
    // $list为容器jQuery实例
    $list.append( $li );

var iq = $iq({
        type:'get',
        to:'httpfileupload.hi'
    }).c('request',{
        'xmlns': 'urn:xmpp:http:upload:0',
        'filename': file.name,
        'size': file.size,
        'content-type': file.type
    });
    // console.log(iq);
    connection.sendIQ(iq,getServer);

    // 创建缩略图
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        file.src=src;
        if ( error ) {
            if(file.type.indexOf('text/') >= 0){
                $img.attr('src','teacher/images/txt.png');
            }else if(file.name.indexOf('.doc')>=0){
                $img.attr('src','teacher/images/doc.png');
            }else if(file.name.indexOf('.pdf')>=0){
                $img.attr('src','teacher/images/pdf.png');
            }else if(file.name.indexOf('.rar')>=0||file.name.indexOf('.zip')>=0){
                $img.attr('src','teacher/images/yasuo.png');
            }else {
                $img.attr('src','teacher/images/unknown.png');
            }
        }else{
            $img.attr( 'src', src );
        }

    }, 100, 100 );



});

//把请求到的该文件的上传链接赋给server
uploader.on('uploadStart',function (file) {
    uploader.option('server',file.url);
});

//点击上传按钮开始上传
var btn = $('#ctlBtn');
btn.on('click',function () {
    uploader.upload();
});





// 文件上传过程中创建进度条实时显示。
uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),
        $percent = $li.find('.progress span');

    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<p class="progress"><span></span></p>')
            .appendTo( $li )
            .find('span');
    }

    $percent.css( 'width', percentage * 100 + '%' );
});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on( 'uploadSuccess', function( file) {
    var $img=$('<img>');

    if(file.type.indexOf('text/') >= 0){
        $img.attr('src','teacher/images/txt.png');
    }else if(file.name.indexOf('.doc')>=0){
        $img.attr('src','teacher/images/doc.png');
    }else if(file.name.indexOf('.pdf')>=0){
        $img.attr('src','teacher/images/pdf.png');
    }else if(file.name.indexOf('.rar')>=0||file.name.indexOf('.zip')>=0){
        $img.attr('src','teacher/images/yasuo.png');
    }else {
        // $img.attr('src','images/unknown.png');
        $img.attr( 'src', file.src );
    }

    $img.attr('url',file.url);
    $img.attr('name',file.name);
    $('#files').append($img);

    console.log(file.name + '上传成功');
    var m=$msg({
        to:fileShare,
        from:connection.authzid,
        id:'file',
        type:'groupchat'
    }).c("body")
        .c('p',null,file.name)
        .c('span',null,file.url);
    connection.send(m.tree());

    let upFlag =  document.querySelector('.up-flag');
    upFlag.className += 'up-flagShow';
    setTimeout(function () {
        upFlag.className = upFlag.className.replace('up-flagShow','');
    },2000);

    $('#'+file.id).remove();

    //全部下载
    $('#down').on('click',function () {
        const xhr = new XMLHttpRequest();
        xhr.open('get',
            file.url,
            true);
        // 请求类型 bufffer
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 304) {
                // 将后台 buffer 转换为 blob
                let blob = new Blob([xhr.response], {
                    type: 'image/*'
                })
                // 创建blob链接
                let a = document.createElement('a');
                a.download = file.name;
                a.href = window.URL.createObjectURL(blob);
                a.click();
            }
        }
        xhr.send();
    })
});

// 文件上传失败，显示上传出错。
uploader.on( 'uploadError', function( file ) {
    var $li = $( '#'+file.id ),
        $error = $li.find('div.error');

    // 避免重复创建
    if ( !$error.length ) {
        $error = $('<div class="error"></div>').appendTo( $li );
    }

    $error.text('上传失败');
});

// 完成上传完了，成功或者失败，先删除进度条。
uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').remove();
});
