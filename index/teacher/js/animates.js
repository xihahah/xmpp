function animate(element,target, callback) {
    if(element.timeId){

        clearInterval(element.timeId);
    }

    element.timeId = setInterval(function () {
        let moveX = element.offsetLeft;
        let step = 15;

        if(moveX > target) {

            step = - Math.abs(step);


        }
        moveX += step;

        if(Math.abs(moveX - target) <= Math.abs(step)){
            element.style.left = target + 'px';
            clearInterval(element.timeId);

            if(callback){
                callback();
            }
            return;
        }


        element.style.left = moveX + 'px';
    },20 );
}
