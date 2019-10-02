//-------------------------Student----------------------------------
//获取各个需要的id值
var tabUl = document.querySelector('.tab-ul');

var tabLine = document.getElementById('tabLine');

var leftTab = document.getElementById('leftTab');

var leftUls = document.querySelectorAll('#leftTab ul');

var leftLine = document.getElementById('leftLine');

var rightContent = document.getElementById('rightContent');

var video = document.getElementById('video');

var videoTool = document.getElementById('videoTool');

var rightTab = document.getElementById('rightTab');

// var videoContent = document.getElementById('videoContent');
var seClass = document.getElementById('seClass');

var enter = document.getElementById('enter');

var readMsg = document.getElementById('readMsg');

var reClass = document.getElementById('reClass');

var sCasBtn = document.querySelector('.sCas-btn');

var rightDivs = rightContent.children;

var tabLi = tabUl.children;

var i = 0,
    len = tabLi.length;

var userName = document.getElementById('userName');

//循环给li添加数据并注册事件

for (i = 0; i < len; i++) {
    let li = tabLi[i];

    //记录下此时的li是哪个
    li.index = i;
    li.addEventListener('mouseenter', tabEnter, false);
    li.addEventListener('click', tabClick, false);
    li.addEventListener('mouseleave', tabLeave, false);


}

function tabEnter() {
    let select = 'li-select';
    for (i = 0; i < len; i++) {
        let li = tabLi[i];
        li.className = li.className.replace(select, '');

    }
    this.className = this.className + select;

}

var number = 0;

function tabLeave() {
    let select = 'li-select';
    this.className = this.className.replace(select, '');
    tabLi[number].className += select;
}

let select = 'li-select';
let ulSelect = 'left-show';
let divFlag = 'model spread';

function tabClick() {
    //获取当前li的索引
    let index = this.index;
    number = index;
    for (i = 0; i < len; i++) {
        let li = tabLi[i];
        li.className = li.className.replace(select, '');

    }
    this.className = this.className + select;
    //实现动画移动
    let moveX = this.offsetLeft + tabUl.offsetLeft + 30;
    animate(tabLine, moveX);

    //取消左侧栏所有的高亮
    for (i = 0; i < len; i++) {
        let ul = leftUls[i];
        ul.className = ul.className.replace(ulSelect, '');

    }
    //当前内容的左侧栏高亮
    leftUls[index].className = leftUls[index].className + ulSelect;
    //让左滑动条回到起始点,第一个li高亮
    leftLine.style.top = '55px';
    let num = leftUls[index].children.length;

    for (i = 0; i < num; i++) {
        leftUls[index].children[i].style.color = 'darkgrey';
    }
    leftUls[index].children[0].style.color = 'white';



    //让video消失，显示content
    if (video.style.display === 'block') {

        video.style.display = 'none';
        rightContent.style.display = 'block';

    }


    let n = 0;
    //取消高亮的content
    for (i = 0; i < len; i++) {
        let divLis = rightDivs[i].children.length;

        for (n = 0; n < divLis; n++) {
            let clName = rightDivs[i].children[n];
            if (clName.className === divFlag) {
                clName.className = 'model';

            }

        }



    }
    //显示对应的content
    rightDivs[index].children[0].className = divFlag;



}
//循环给左侧栏ul里面的li注册事件

for (i = 0; i < len; i++) {
    let ul = leftUls[i];
    ul.index = i;
    let lis = ul.children;

    let n = 0,
        count = lis.length;
    for (; n < count; n++) {

        let li = lis[n];

        li.index = n;

        li.addEventListener('click', leftLiClick, false);


    }

}

var timeId = null;
let divSelect = 'spread';

function leftLiClick() {
    //获取父节点
    let parent = this.parentNode;
    let that = this;
    let parentIndex = parent.index;
    let index = this.index;

    //左边线的动态滑动
    if (timeId) {
        clearInterval(timeId);
    }
    timeId = setInterval(function() {
        let current = leftLine.offsetTop;
        let target = that.offsetTop + parent.offsetTop;
        let step = 10;

        if (current > target) {

            step = -Math.abs(step);
        }

        if (Math.abs(current - target) <= step) {
            leftLine.style.top = target + 'px';
            clearInterval(timeId);
            return;

        }
        current += step;
        leftLine.style.top = current + 'px';

    }, 20);

    //让其他li不高亮
    let n = 0,
        count = parent.children.length;



    for (; n < count; n++) {
        parent.children[n].style.color = 'darkgrey';

    }
    //让当前li高亮
    this.style.color = 'white';

    //取消所有content的高亮
    for (n = 0; n < count; n++) {
        let div = rightDivs[parentIndex].children[n];
        div.className = div.className.replace(divSelect, '');
    }
    //显示当前的content
    rightDivs[parentIndex].children[index].className = rightDivs[parentIndex].children[index].className + divSelect;

    //让video消失，显示content
    if (video.style.display === 'block') {

        video.style.display = 'none';
        rightContent.style.display = 'block';

    }

}


//鼠标进入视频时，出现工具栏,移出后消失
function videoTab(e) {
    switch (e.type) {
        case 'mouseenter':
            rightTab.style.display = 'block';
            //截图
            var screenShotBtn = document.getElementById('screenShotBtn');

            screenShotBtn.onclick = function() {
                screenShot([16, 65], 27);
                screenShotBtn.onclick = null;

            };
            break;
        case 'mouseleave':
            rightTab.style.display = 'none';
            break;

    }

}

videoTool.addEventListener('mouseenter', videoTab, false);
videoTool.addEventListener('mouseleave', videoTab, false);


//通知消息的读取
function readMessage() {

    let allShade = document.getElementById('allShade');
    allShade.className = allShade.className + 'allShade-show';

    let message = document.getElementsByClassName('message')[0];
    message.className = message.className + 'message-show';

    let msgTitle = document.getElementsByClassName('message-title')[0];
    msgTitle.innerText = this.children[1].innerText;
    let msgDate = document.getElementsByClassName('message-date')[0];
    msgDate.innerText = '日期：' + this.children[2].innerText;
    let msgDetail = document.getElementsByClassName('message-detailed')[0];
    msgDetail.innerText = this.contentMsg;
    let parent = this.parentNode;
    let that = this;
    let msgBtn = document.getElementById('msgBtn');

    //移除信息
    msgBtn.onclick = function() {

        let alreadyMsg = document.getElementById('alreadyMsg');
        let li = document.createElement('li');
        alreadyMsg.appendChild(li);
        let spanOne = document.createElement('span');
        let spanTwo = document.createElement('span');
        let spanThree = document.createElement('span');
        li.appendChild(spanOne);
        li.appendChild(spanTwo);
        li.appendChild(spanThree);
        spanTwo.innerText = that.children[1].innerText;
        spanThree.innerText = that.children[2].innerText;
        li.contentMsg = that.contentMsg;
        li.onclick = alreadyMessage;
        li.onmouseenter = enterMessage;
        li.onmouseleave = leaveMessage;

        message.className = message.className.replace('message-show', '');
        parent.removeChild(that);

        allShade.className = allShade.className.replace('allShade-show', '');

    };
}

function alreadyMessage() {
    let allShade = document.getElementById('allShade');
    allShade.className = allShade.className + 'allShade-show';

    let message = document.getElementsByClassName('message')[1];
    message.className = message.className + 'message-show';

    let msgTitle = document.getElementsByClassName('message-title')[1];
    msgTitle.innerText = this.children[1].innerText;
    let msgDate = document.getElementsByClassName('message-date')[1];
    msgDate.innerText = '日期：' + this.children[2].innerText;
    let msgDetail = document.getElementsByClassName('message-detailed')[1];
    msgDetail.innerText = this.contentMsg;


    let msgBtn = document.getElementById('rMsgBtn');
    msgBtn.onclick = function() {

        message.className = message.className.replace('message-show', '');
        allShade.className = allShade.className.replace('allShade-show', '');

    };
}


function enterMessage() {
    this.className = 'enterMsg'

}

function leaveMessage() {
    this.className = '';
}

// //测试
// var msgLi = readMsg.children;
//      for(i = 0; i < msgLi.length;i++) {
//          let li = msgLi[i];
//          li.onclick = readMessage;
//          li.onmouseenter  = enterMessage;
//          li.onmouseleave = leaveMessage;
//      }



// readMsg.addEventListener('click',readMessage,false);



//  退课
function reLesson() {
    let inputs = document.querySelectorAll('.myClass label input');
    let len = inputs.length;

    for (let i = 0; i < len; i++) {
        let input = inputs[i];
        if (input.checked) {
            let parent = input.parentNode;
            let brother = input.nextElementSibling;
            parent.removeChild(input);
            parent.removeChild(brother);

        }

    }


}
reClass.addEventListener('click', reLesson, false);


//选课
function seLesson() {
    let selectClass = document.querySelector('.selectClass');
    selectClass.className = selectClass.className + 'sCas-show';
}
seClass.addEventListener('click', seLesson, false);

function transmit() {
    let nameClass = document.querySelector('.sCas-content form label input');
    let label = document.querySelector('.myClass label');
    let input = document.createElement('input');
    input.type = 'checkbox';
    label.appendChild(input);
    let span = document.createElement('span');
    label.appendChild(span);
    span.innerText = nameClass.value;
    let selectClass = document.querySelector('.selectClass');
    selectClass.className = selectClass.className.replace('sCas-show', '');
    return false;
}
var webRTCHelper;
//点击进入课堂，则切换到课堂界面
$('#latestLes').on('click', '#enter', enterClass);

function enterClass(e) {
    var node = e.target.parentNode;
    var chi = node.children;
    var jid = chi[1].innerHTML;
    var name = chi[2].innerHTML;
    var title = video.getElementsByClassName('video-title')[0];

    rightContent.style.display = 'none';
    video.style.display = 'block';
    title.innerHTML = name;
    video.setAttribute('jid', jid);
    video.setAttribute('name', name);
    connection.addHandler(joinClass, null, 'presence', null, null, null, null);
    connection.muc.join(jid, connection.authzid, null, joinClass, null, null, { maxstanzas: '0' });
    // // 实例化XMPP和WebRTC帮助类
    webRTCHelper = new WebRTCHelper(connection, null, document.getElementById('remoteVideo'));
}

//出席群
function joinClass(msg) {
    console.log('出席：', msg);
    var p = $('<p>' + connection.authcid + '进入课堂</p>');
    $('.video-news').append(p);
}

//发送消息
$('#video .video-submit').on('click', function() {
        // connection.addHandler(onMessage,null,null,null,null,null,null);
        var msg = $('#video .video-text').val();
        if (msg != null) {
            var room = video.getAttribute('jid');

            var m = $msg({
                to: room,
                from: connection.authzid,
                type: 'groupchat'
            }).c("body", null, msg);
            connection.send(m.tree());
            // var b = $('<b>'+connection.authcid+':'+msg+'</b>');
            // $('.video-news').append(b);
            $('#video .video-text').val('');
        }
    })
    //最近课堂
function classlist1(iq) {
    var latestClass = iq.firstChild.firstChild;
    if (latestClass.nodeName === 'item') {
        $("#latestLes li").remove();
        var roomId = latestClass.getAttribute('jid');
        var roomName = latestClass.getAttribute('name');
        var li = $('<li id="class-' + roomId + '"><div></div><p>' +
            roomId + '</p><p>' + roomName +
            '</p><a class="enter" id="enter" href="javascript:void(0)">进入课堂</a></li>');

        $("#latestLes").append(li);
    }
}

var zuoyeQun; //用于收作业
var tongzhiQun; //收通知

//生成课程列表  我的课堂
function classlist(iq) {
    console.log('群列表:', iq);
    roomNum = 0;
    if (iq.firstChild.firstChild.nodeName === 'item') {
        roomNum++; //计算群数量
        $("#myClass label").remove();
        $(iq).find('item').each(function() {
            var roomId = $(this).attr('jid');
            var roomName = $(this).attr('name');
            if (roomName === '教师作业') {
                zuoyeQun = roomId;
                //默认所有人上线都出席该群
                connection.muc.join(zuoyeQun, connection.authzid, null, null, null, null, { maxstanzas: '10' });

            } else if (roomName === '系统通知') {
                tongzhiQun = roomId;
                //默认所有人上线都出席该群
                connection.muc.join(tongzhiQun, connection.authzid, null, null, null, null, { maxstanzas: '10' });

            } else {
                var la = $('<label><input type="checkbox" value="' + roomId +
                    '"><span>' + roomName + '</span></label>');

                $("#myClass").append(la);
            }

        });
    }
}

// 接收课堂消息
function onMessage(msg) {
    console.log('msg:', msg);
    var from = msg.getAttribute('from').split("/")[1];
    var type = msg.getAttribute('type');
    var id = msg.getAttribute('id');
    var body = msg.getElementsByTagName('body')[0];

    if (type === 'groupchat') {
        if (id === 'zuoye') {
            var ztitle = body.getElementsByTagName('h1')[0].innerHTML;
            let time = body.getElementsByTagName('b')[0].innerHTML;
            let mesg = body.getElementsByTagName('p')[0].innerHTML;
            console.log(time);
            let ul = document.querySelector('.work');
            let li = document.createElement('li');
            ul.appendChild(li);
            li.innerText = ztitle;
        } else if (id === 'tongzhi') {
            // $("#readMsg li").remove();
            let title = body.getElementsByTagName('h1')[0].innerHTML;
            let mess = body.getElementsByTagName('p')[0].innerHTML;
            let workDate = body.getElementsByTagName('span')[0].innerHTML;
            let li = $('<li><span></span> <span>' + title + '</span></li>');
            let span = document.createElement('span');
            span.innerText = workDate;

            li.contentMsg = mess;
            li.append(span);
            $("#readMsg").append(li);
            li.on('click', readMessage);
            li.on('mouseenter', enterMessage);
            li.on('mouseleave', leaveMessage);
        } else if (id === "sign") { //开始签到
            var span = $('<span>' + from.split('\\')[0] + '----' + body.innerHTML + '</span>');
            $('.video-news').append(span);
        } else {
            var b = $('<b>' + from.split('\\')[0] + '：' + body.innerHTML + '</b>');
            $('.video-news').append(b);
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
sign.onclick = function() {
    var m = $msg({
        to: video.getAttribute('jid'),
        from: connection.authzid,
        id: 'sign',
        type: 'groupchat'
    }).c("body", null, '签到');
    connection.send(m.tree());
    let newFlag = document.getElementsByClassName('new-flag')[0];
    newFlag.className += 'new-flagShow';
    setTimeout(function() {
        newFlag.className = newFlag.className.replace('new-flag', '');
    }, 2000);

};
var call = document.getElementById('call');
call.onclick = function() {
    console.log('分享屏幕');

    // 开始共享屏幕
    webRTCHelper.start('admin' + '@' + server);
}