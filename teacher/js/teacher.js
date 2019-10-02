//设定导航、左侧栏的内容
var navData = ['课堂','作业','通知','文件共享','个人中心'];

//获取各个需要的id值
var topNav = document.querySelector('.top-nav');

var line = document.getElementById('line');

var left = document.getElementById('left');

var uls = document.querySelectorAll('#left ul');

var leftLine = document.getElementById('leftLine');

var content = document.getElementById('content');

var video = document.getElementById('video');

var videoGet =document.getElementById('videoGet');

var videoRight = document.getElementById('videoRight');

var videoContent = document.getElementById('videoContent');

var enter = document.getElementById('enter');

var createClass = document.getElementById('createClass');

var reLesson = document.getElementById('reLesson');

var pubWork = document.getElementById('pubWork');

var divs = content.children;

var lis = topNav.children;

var  i = 0 ,len = lis.length;

//循环给li添加数据并注册事件
navData.forEach(function (element , index) {

   let li = lis[index];

    //记录下此时的li是哪个
    li.index = index;


   li.innerText = element;
   li.addEventListener('mouseenter',mouseEnter, false);
   li.addEventListener('click',isClick, false);
    li.addEventListener('mouseleave',tabLeave,false);

   // //创建ul
   //  let ul = document.createElement('ul');
   //  left.appendChild(ul);



});

function mouseEnter() {
    for ( i = 0; i < len; i++) {

        lis[i].className = '';

    }
   this.className = 'shadow';

}
var number = 0;
function tabLeave() {
    this.className = '';
    lis[number].className = 'shadow';
}



function isClick() {
     //获取当前li的索引
    let index = this.index;
     number = index;

    for ( i = 0; i < len; i++) {

        lis[i].className = '';

    }
    this.className = 'shadow';
    //实现动画移动
    let moveX = this.offsetLeft + topNav.offsetLeft + 30;
    animate(line , moveX );

    //取消左侧栏所有的高亮
    for (i = 0 ; i < len ; i++) {
        uls[i].className = ''

    }
    //当前内容的左侧栏高亮
     uls[index].className = 'show';
    //让左滑动条回到起始点,第一个li高亮
    leftLine.style.top = '55px';
     let num = uls[index].children.length;

     for (i = 0;i < num; i++) {
         uls[index].children[i].style.color = 'darkgrey';
     }
      uls[index].children[0].style.color = 'white';



     //让video消失，显示content
     if (video.style.display === 'block' ) {

         video.style.display = 'none';
         content.style.display = 'block';

     }


      let n = 0;
     //取消高亮的content
    for (i = 0; i < len ; i++) {
            let divLis = divs[i].children.length;

            for ( n = 0; n < divLis; n++) {
                   let clName =  divs[i].children[n];
                   if(clName.className === 'model spread') {
                       clName.className = 'model';

                   }

            }



    }
     //显示对应的content
    divs[index].children[0].className = 'model spread';



}
//循环给左侧栏ul里面的li注册事件

for (i = 0; i < len ; i++) {
       let ul = uls[i];
         ul.index = i;
       let lis = ul.children;

       let n = 0, count = lis.length;
       for ( ; n < count; n++) {

           let li = lis[n];

           li.index = n;

           li.addEventListener('click',liClick, false);


       }

}

var timeId = null;
function liClick() {
   //获取父节点
    let parent = this.parentNode;
    let that = this;
    let parentIndex = parent.index;
    let index = this.index;

      //左边线的动态滑动
      if (timeId) {
          clearInterval(timeId);
      }
       timeId = setInterval(function () {
           let current = leftLine.offsetTop ;
           let target = that.offsetTop + parent.offsetTop;
            let step = 10;

            if(current > target) {

                step = -Math.abs(step);
            }

            if( Math.abs(current - target) <= step ) {
                leftLine.style.top = target + 'px';
                clearInterval(timeId);
                return;

            }
           current += step;
            leftLine.style.top = current +'px';

       },20);
      //让其他li的字体不高亮

    let n = 0, count = parent.children.length ;


      for ( ;n < count ;n++ ) {
          parent.children[n].style.color = 'darkgrey';

      }
      //让字体高亮
    this.style.color = 'white';

      //取消所有content的高亮
    for (n = 0; n < count; n++) {

        divs[parentIndex].children[n].className = 'model';
    }
  //显示当前的content
    divs[parentIndex].children[index].className = 'model spread';

    //让video消失，显示content
    if (video.style.display === 'block' ) {

        video.style.display = 'none';
        content.style.display = 'block';

    }

}

var webRTCHelper;
//点击进入课堂，则切换到课堂界面
// enter.addEventListener('click',enterClass,false);
$('#latestLes').on('click','#enter',enterClass);
function enterClass(e){

    var node = e.target.parentNode;
    var chi = node.children;

    var jid=chi[1].innerHTML;
    var name=chi[2].innerHTML;
    var title = video.getElementsByClassName('video-title')[0];

    content.style.display = 'none';
    video.style.display = 'block';
    title.innerHTML = name;
    video.setAttribute('jid',jid);
    video.setAttribute('name',name);

    connection.addHandler(joinClass,null,'presence',null,null,null,null);
    connection.muc.join(jid,connection.authzid,null,null,null,null,{maxstanzas:'0'});

// 实例化XMPP和WebRTC帮助类
    webRTCHelper = new WebRTCHelper(connection, document.getElementById('localVideo'),null);

}

//出席群
function joinClass(msg) {
    let msgFrom = msg.getAttribute('from').split('/')[0];
    let item = msg.getElementsByTagName('item')[0];
    let jid = item.getAttribute('jid').split('@')[0];
    if(msgFrom === video.getAttribute('jid')){
        console.log('出席：',msg);
        var p = $('<p>'+jid+'进入课堂</p>');
        $('.video-news').append(p);
    }

    return true;
}

//发送消息
$('#video .video-submit').on('click',function () {
    var msg = $('#video .video-text').val();
    if(msg != null){
        var room = video.getAttribute('jid');

        var m=$msg({
            to:room,
            from:connection.authzid,
            type:'groupchat'
        }).c("body",null,msg);
        connection.send(m.tree());

        $('#video .video-text').val('');
    }
})

//鼠标进入视频时，出现工具栏,移出后消失
videoGet.addEventListener('mouseenter',right,false);
videoGet.addEventListener('mouseleave',right,false);


function right(e) {
    switch (e.type) {
        case 'mouseenter':
            videoRight.style.display = 'block';
            //截图
            var screenShotBtn = document.getElementById('screenShotBtn');

            screenShotBtn.onclick = function () {
                screenShot([16, 65], 27);
                screenShotBtn.onclick = null;
            };
            break;
        case 'mouseleave':
            videoRight.style.display = 'none';
            break;

    }
}

var roomNum;//服务器中群数量
var newRoomId;//新创建的群的群号
//最近课堂
function classlist1(iq){
    var latestClass= iq.firstChild.firstChild;
    if(latestClass.nodeName === 'item'){
        $("#latestLes li").remove();
        var roomId = latestClass.getAttribute('jid');
        var roomName = latestClass.getAttribute('name');
        var li = $('<li id="class-'+roomId+'"><div></div><p>'
            +roomId+'</p><p>'+roomName
            +'</p><a class="enter"  id="enter" href="javascript:void(0)">进入课堂</a></li>');

        $("#latestLes").append(li);
        }
}
var zuoyeQun;//用于发作业
var tongzhiQun;//发通知
var fileShare;//文件共享

//生成课程列表  我的课堂
function classlist(iq){
    console.log('群列表:',iq);
    roomNum = 0;
    if(iq.firstChild.firstChild.nodeName === 'item'){
        roomNum++;//计算群数量
        $("#lesson li").remove();
        $(iq).find('item').each(function(){
            var roomId = $(this).attr('jid');
            var roomName = $(this).attr('name');

            if(roomName === '教师作业'){
                zuoyeQun = roomId;
                //默认所有人上线都出席该群
                connection.muc.join(zuoyeQun,connection.authzid,null,null,null,null,{maxstanzas:'10'});

            }else if(roomName === '系统通知'){
                tongzhiQun = roomId;
                //默认所有人上线都出席该群
                connection.muc.join(tongzhiQun,connection.authzid,null,null,null,null,{maxstanzas:'10'});

            }else if(roomName === '文件共享'){
                fileShare = roomId;
                //默认所有人上线都出席该群
                connection.muc.join(fileShare,connection.authzid,null,null,null,null,null);

            }else{
                var li = $('<li id="myclass-'+roomId+'"><div></div><p>'
                    +roomId+'</p><p>'+roomName
                    +'</p></li>');

                $("#lesson").append(li);
            }
        });
    }
}

//创建课堂
function ceClass () {
      let setClass = document.getElementsByClassName('setClass')[0];
      setClass.className = setClass.className + 'show';
    ///自动生成群号
    var data = new Date();
    var year = data.getFullYear();
    var n= Math.ceil(Math.random() * 100).toString();
    newRoomId = year + n + roomNum + "@conference."+server;
    var pres=$pres({
        id:'createRoom',
        to:newRoomId + "/create"
    }).c('x',{xmlns:'http://jabber.org/protocol/muc'});
    connection.send(pres.tree());
    connection.addHandler(firstCreate,null,'presence',null,'createRoom',null,null);
    // console.log('1 预定房间：'+pres);
}

createClass.addEventListener('click', ceClass,false);
//完成创建
function seClass() {
    let setClass = document.getElementsByClassName('setClass')[0];
    setClass.className = setClass.className.replace('show','');
    var data = {};
    data['muc#roomconfig_roomname'] = $('#createForm input[name="muc#roomconfig_roomname"]').val();
    data['muc#roomconfig_roomdesc'] = $('#createForm textarea[name="muc#roomconfig_roomdesc"]').val();
    data['muc#roomconfig_moderatedroom'] = $('#createForm input[name="muc#roomconfig_moderatedroom"]:checked').val();
    data['muc#roomconfig_enablelogging'] = '1';
    data['muc#roomconfig_reservednick'] = '1';

    connection.addHandler(createResult,null,'iq','result','setReservedRoom',null,null);
    connection.muc.createReservedRoom(newRoomId,data,function () {
        // console.log('3 配置房间信息');
        $('#createForm')[0].reset();
    });

    return false;
}
//修改课堂
function reClass() {
    let reClass = document.getElementsByClassName('reClass')[0];
    reClass.className = reClass.className + 'show';
}

reLesson.addEventListener('click',reClass, false);

function removeClass() {
    let reClass = document.getElementsByClassName('reClass')[0];
    reClass.className = reClass.className.replace('show','') ;
    return false;
}
//发布作业

function publishWork() {
    let pubWork = document.getElementsByClassName('pubWork')[0];
    pubWork.className = pubWork.className + 'show';

}
pubWork.addEventListener('click',publishWork,false);

function removeWork() {
    let pubWork = document.getElementsByClassName('pubWork')[0];
    var name = $('#zuoye input[type="text"]').val();
    var miao = $('#zuoye textarea').val();
    var time = $('#zuoye input[type="date"]').val();
    if(name!=null){
        var m=$msg({
            to:zuoyeQun,
            from:connection.authzid,
            id:'zuoye',
            type:'groupchat'
        }).c("body").c('h1',null,name)
            .c('p',null,miao)
            .c('b',null,time);
        connection.send(m.tree());
        $('#zuoye')[0].reset();

        pubWork.className = pubWork.className.replace('show','');
    }

    return false;
}

//发布通知
function fabu() {
    var title = $('#fabuMsg input').val();
    var mess = $('#fabuMsg textarea').val();
    var data2 = new  Date();
    let dataYear = data2.getFullYear().toString();
    let dataMonth = data2.getMonth()+ 1 +'';
    let dataDay = data2.getDate().toString();

    let dataString = dataYear +'-'+dataMonth+'-'+dataDay;
    var m=$msg({
        to:tongzhiQun,
        from:connection.authzid,
        id:'tongzhi',
        type:'groupchat'
    }).c("body").c('h1',null,title)
        .c('p',null,mess)
        .c('span',null,dataString);
    connection.send(m.tree());
    $('#fabuMsg')[0].reset();

    // let ul = document.querySelector('.getMsg ul');
    // let li = document.createElement('li');
    // ul.appendChild(li);
    // li.innerText = title;
    return false;
}

//电子白板
var board = document.getElementById('board');

board.onclick = function () {
    let  whiteboard = document.getElementsByClassName('whiteboard')[0];
    whiteboard.className += 'whiteboard-show';
};

//白板消失
var closeWtb = document.getElementById('closeWtb');
closeWtb.onclick = function () {
    let  whiteboard = document.getElementsByClassName('whiteboard')[0];
    whiteboard.className = whiteboard.className.replace('whiteboard-show','') ;
};




//接收message
function onMessage(msg) {
    console.log('msg:', msg);
    var from = msg.getAttribute('from').split("/")[1];
    var type = msg.getAttribute('type');
    var id = msg.getAttribute('id');
    var body = msg.getElementsByTagName('body')[0];

    if (type ==="groupchat") {
        if(id === "zuoye"){//接收作业
            // console.log('作业:', msg);
            var h1 = body.getElementsByTagName('h1')[0].innerHTML;
            let ul = document.querySelector('.work');
            let li = document.createElement('li');
            ul.appendChild(li);
            li.innerText = h1;
        }else if(id === "tongzhi"){
            var title = body.getElementsByTagName('h1')[0].innerHTML;
            let ul = document.querySelector('.getMsg ul');
            let li = document.createElement('li');
            ul.appendChild(li);
            li.innerText = title;
        }else if(id === "sign"){//开始签到
            var span = $('<span>'+from.split('\\')[0]+'----'+body.innerHTML+'</span>');
            $('.video-news').append(span);
        }
        else if (id === 'webRTC'){
            webRTCHelper.setMessage(msg);
        }
        else {
            var b = $('<b>'+from.split('\\')[0]+'：'+body.innerHTML+'</b>');
            $('.video-news').append(b);
            if (from.split('\\')[0] === connection.authcid){//自己的消息
                b.addClass('me');
            }
        }

    }else if(type === 'chat'){
        if (id === 'webRTC'){
            webRTCHelper.setMessage(msg);
        }
    }

    return true;
}
//签到
var sign = document.getElementById('sign');
sign.onclick = function () {
    let newFlag = document.getElementsByClassName('new-flag')[0];
    newFlag.className += 'new-flagShow';
    setTimeout(function () {
        newFlag.className = newFlag.className.replace('new-flag','');
    },2000);
    var m=$msg({
        to:video.getAttribute('jid'),
        from:connection.authzid,
        id:'sign',
        type:'groupchat'
    }).c("body",null,'开始签到');
    connection.send(m.tree());
};

//文件下载
var downFile = $('#files');
downFile.on('click','img',imgDown);
function imgDown() {
    console.log(this + 'click');
    const xhr = new XMLHttpRequest();
    let url = this.getAttribute('url');
    let name = this.getAttribute('name');

    xhr.open('get',
        url,
        true);
    // 请求类型 bufffer
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 304) {
            // console.log(xhr.getResponseHeader("filelist").split(',').length);
            // 将后台 buffer 转换为 blob
            let blob = new Blob([xhr.response], {
                type: 'image/*'
            })
            // 创建blob链接
            let a = document.createElement('a');
            a.download = name;
            a.href = window.URL.createObjectURL(blob);
            a.click();
        }
    }
    xhr.send();
}

//屏幕录制
var call = document.getElementById('call');
call.onclick = function () {
    console.log('分享屏幕');

   //开始共享屏幕
    webRTCHelper.start('user'+'@'+server);
}
