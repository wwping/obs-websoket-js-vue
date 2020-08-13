
var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var request = require('request');


function getParam (query, name) {
    if (!query) {
        return '0';
    }
    var arr = query.split('&');
    for (let i = 0; i < arr.length; i++) {
        var _arr = arr[i].split('=');
        if (_arr[0] == name) {
            return _arr[1];
        }
    }
}

http.createServer(function (req, res) {
    //解析请求
    var request_url = url.parse(req.url);
    var pathname = request_url.pathname;
    var query = request_url.query;




    if (pathname === '/bilibili/init') {
        var id = getParam(query, 'id');
        request({
            url: 'https://api.live.bilibili.com/room/v1/Room/room_init?id=' + id,
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
            }
        }, function (error, response, body) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(body)
            res.end();
        })
    } else if (pathname === '/bilibili/info') {
        var id = getParam(query, 'id');
        request({
            url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=' + id + '&type=0',
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
            }
        }, function (error, response, body) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(body)
            res.end();
        })
    } else if (pathname === '/bilibili/gifts') {
        var id = getParam(query, 'id');
        request({
            url: 'https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=' + id,
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
            }
        }, function (error, response, body) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(body)
            res.end();
        })
    } else if (pathname === '/bilibili/dm') {

        var postData = "";
        req.addListener("data", function (data) {
            postData += data;
        });

        req.addListener("end", function () {

            let json = JSON.parse(postData)
            let csrf = json.cookie.split('; ').filter(c => c.indexOf('bili_jct=') == 0)[0].split('=')[1];

            request.post({
                url: 'https://api.live.bilibili.com/msg/send',
                form: {
                    msg: json.msg,
                    rnd: new Date().getTime(),
                    roomid: json.roomid,
                    csrf_token: csrf,
                    csrf: csrf,
                    fontsize: 25,
                    color: 16777215,
                    mode: 1,
                    bubble: 0,
                },
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "cookie": json.cookie,
                }
            }, function (error, response, body) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
                res.writeHead(200, { "Content-Type": "application/json" })
                res.write(body)
                res.end();
            })
        });
    }
}).listen(3000)