
var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var request=require('request');


function getParam(query,name){
    if(!query){
        return '0';
    }
    var arr = query.split('&');
    for(let i = 0; i < arr.length; i++){
        var _arr = arr[i].split('=');
        if(_arr[0] == name){
            return _arr[1];
        }
    }
}

 http.createServer(function (req, res){
    //解析请求
    var request_url = url.parse(req.url);
    var pathname = request_url.pathname;
    var query = request_url.query;


    if(pathname === '/bilibili/init'){
        var id =getParam(query,'id');
        request({
            url:'https://api.live.bilibili.com/room/v1/Room/room_init?id='+id,  
            method:'GET',  
            headers:{  
                "Content-Type": 'application/json',  
            }  
        },function(error,response,body){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.writeHead(200, {"Content-Type": "application/json"})
            res.write(body)
            res.end();
        })
    }

    if(pathname === '/bilibili/info') {
        var id =getParam(query,'id');
        request({
            url:'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id='+id+'&type=0',  
            method:'GET',  
            headers:{  
                "Content-Type": 'application/json',  
            }  
        },function(error,response,body){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.writeHead(200, {"Content-Type": "application/json"})
            res.write(body)
            res.end();
        })

    }
}).listen(3000)