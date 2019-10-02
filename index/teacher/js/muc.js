function firstCreate(pres) {
    //聊天室预创建成功
    try{
        // console.log('2 预定成功：',pres);
        var roomid = pres.getAttribute('from').split('/')[0];
        var created = false;
        $(pres).find('status').each(function () {
            if($(this).attr('code')==='201')//预创建成功
                created = true;
        });
        if(created){
            // 获取需要设置的房间信息
            connection.muc.configure(roomid);
        }else{
            //重新生成群号
        }
    }catch (e) {

    }
}

// 建群结果  iq
//成功创建永久聊天室  存到了数据库
function createResult(iq) {
    try{
        console.log('4 创建成功！',iq);
        connection.muc.listRooms('conference.'+server,classlist,null);
        //重新获取群列表  更新
    }catch (e) {

    }
}
