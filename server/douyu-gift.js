
var request=require('request');
var fs = require('fs')

var max = 10000;
var arr = []
var noneNum = 0;

setInterval(()=>{
    fs.writeFile('1.json',JSON.stringify(arr),function(){});
},1000)

function fn(index){
    console.log(index);
    if(index >= max || noneNum >= 100){
        fs.writeFile('1.json',JSON.stringify(arr),function(){

        });
        return;
    }

    request({
        url:'https://gift.douyucdn.cn/api/prop/v1/web/single?pid='+index,  
        method:'GET',  
        headers:{  
            "Content-Type": 'application/json',  
        }  
    },function(error,response,body){
       let json = JSON.parse(body);
       if(!json.data.id){
            noneNum ++;
            console.log('空数 : '+noneNum);
       }else{
            noneNum = 0;
            arr.push(json);
       }
       fn(++index);
    })
}
fn(1);

