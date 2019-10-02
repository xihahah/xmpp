$(function(){
    var canvas = $("#canvas"),
        ctx = canvas[0].getContext('2d');

      var  winWidth = canvas.width(),
           winHeight = canvas.height();
      var _color = null;

    canvas.attr('width',winWidth).attr("height",winHeight);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,winWidth,winHeight);

    var running = "",  // draw
        offset = canvas.offset();



    canvas.on("mousedown",function(e){
        var sx = e.pageX - offset.left-450,  //做个换算以防万一
            sy = e.pageY - offset.top-145;
        if(_color) {
            running = "reDraw";
        }else {
            running = 'draw';
        }
        ctx.beginPath();
        ctx.moveTo(sx,sy);
        canvas.mousemove( function(e){
            if(running === "draw"){
                toDraw(e.pageX-offset.left-450, e.pageY-offset.top-145);
            }
            if (running === 'reDraw') {
                toDraw(e.pageX-offset.left-450, e.pageY-offset.top-145,_color);
            }
        });
    });



    canvas.mouseup (function(){
        running= "";
        canvas.off('mousemove');
    });
    // canvas.on("mouseup", function(e){
    //     running= "";
    // });

    function toDraw(x, y,color){
        ctx.lineTo(x,y); // 画路径
        ctx.lineWidth = 10;
        ctx.strokeStyle = color ||"#ff4444";
        ctx.stroke();	// 描边
        ctx.save();		// 保存状态
    }

    $("#clearMap").click(function(){
        ctx.clearRect(0, 0, winWidth, winHeight);
        ctx.fillRect(0,0,winWidth,winHeight);
    });
    function saveAsPNG(canvas) {
        return canvas[0].toDataURL("image/png",1);
    }
    function downLoad(url){
        var oA = document.createElement("a");
        oA.download = '图片';// 设置下载的文件名，默认是'下载'
        oA.href = url;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    }

    $("#saveMap").click(function(){
        downLoad(saveAsPNG(canvas));
    });
    $('#wboColor li').click(function () {

         _color = this.getAttribute('data-color');
         running = 'reDraw';
        // console.log(this.getAttribute('data-color'));
    })


});