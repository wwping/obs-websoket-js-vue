/*
 * @Author: your name
 * @Date: 2020-07-27 20:38:40
 * @LastEditTime: 2020-07-29 23:11:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \undefinedd:\Desktop\plugins\js.js
 */ 
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
        return decodeURI(r[2]);
    }else{
        return null;
    }
}

function addz(x){
    if(x<10){
        x="0"+x;
    }
    return x;
}

String.prototype.hex2rgb = function(){
    var color = this.toLowerCase();
    var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if(color && pattern.test(color)) {
        if(color.length == 4) {
            // 将三位转换为六位
              color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        //处理六位的颜色值
        var colorNew = [];
        for (var i=1; i<7; i+=2) {
            colorNew.push(parseInt("0x"+color.slice(i, i+2)));  
        }
        return colorNew;
    }
    return color;
};


function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 