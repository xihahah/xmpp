// WebRTC帮助类
// xmppHelper：XMPP帮助实例
// localVideo：本地视频显示的DOM
// remoteVideo：远端视频显示的DOM
function WebRTCHelper(xmppHelper, localVideo, remoteVideo) {
    var _this = this;

    // 对方用户
    _this.tojid = null;

    // 创建PeerConnection实例 (参数为null则没有iceserver，即使没有stunserver和turnserver，仍可在局域网下通讯)
    _this.pc = new webkitRTCPeerConnection(null);

    _this.hasBindLocalVideo = false;

    _this.sendMessage = function (tojid, type, data) {

        var msg = $msg({
            to: tojid,
            // from: _this.jid,
            id:'webRTC',
            type: 'chat'
        }).c("body", null, JSON.stringify({
            type: type,
            data: data
        }));
        xmppHelper.send(msg.tree());

    };


    // 发送ICE候选到其他客户端
    _this.pc.onicecandidate = function(event){
        console.log('----------- tojid: ' + _this.tojid);
        if (event.candidate !== null && _this.tojid !== null) {
            console.log('----------- onicecandidate ------------');
            console.log('candidate', event.candidate);

            _this.sendMessage(_this.tojid, 'candidate', event.candidate);
        }
    };

    // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
    _this.pc.onaddstream = function(event){
        remoteVideo.srcObject=event.stream;
    };

    // 发送offer和answer的函数，发送本地session描述
    var sendOfferFn = function(desc){
        console.log('----------- sendOfferFn ------------');
        console.log('desc', desc);
        _this.pc.setLocalDescription(desc);

        _this.sendMessage(_this.tojid, 'offer', desc);
    };
    var sendAnswerFn = function(desc){
        console.log('----------- sendAnswerFn ------------');
        console.log('desc', desc);
        _this.pc.setLocalDescription(desc);

        _this.sendMessage(_this.tojid, 'answer', desc);
    };

    // 绑定本地视频流
    var bindLocalVideo = function (callback) {
        navigator.mediaDevices.getDisplayMedia({ video: true })
            .then(stream => {
                //绑定本地媒体流到video标签用于输出
                localVideo.srcObject = stream;
                //向PeerConnection中加入需要发送的流
                _this.pc.addStream(stream);
                callback();
            }, error => console.log(error));
    };

    // 开始视频通讯
    _this.start = function (tojid) {
        _this.tojid = tojid;

        if (_this.hasBindLocalVideo === false) {
            bindLocalVideo(function () {
                // 发送一个offer信令
                _this.pc.createOffer(sendOfferFn, function (error) {
                    console.log('Failure callback: ' + error);
                });
            });
            _this.hasBindLocalVideo = true;
        } else {
            // 发送一个offer信令
            _this.pc.createOffer(sendOfferFn, function (error) {
                console.log('Failure callback: ' + error);
            });
        }
    };

    _this.setMessage = function(msg){

        console.log('--- msg ---', msg);

        // 解析出<message>的from、type属性，以及body子元素
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        var json = JSON.parse(elems[0].innerHTML);
        json.fromjid = from;

        _this.rtcOnMessage(json);


        // return true;
    }

    // 收到对方信息后的处理
    _this.rtcOnMessage = function (json) {
        console.log('rtcOnMessage: ', json);

        if (_this.tojid === null) {
            _this.tojid = json.fromjid;
        }

        if (json.type === 'candidate') {
            _this.pc.addIceCandidate(new RTCIceCandidate(json.data));
        }
        else {
            _this.pc.setRemoteDescription(new RTCSessionDescription(json.data));
            if (json.type === 'offer') {
                    _this.pc.createAnswer(sendAnswerFn, function (error) {
                        console.log('Failure callback: ' + error);
                    });

            }
        }
    }
}