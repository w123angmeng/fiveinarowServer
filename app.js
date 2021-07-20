// 引入 express 框架 -> 需 npm 安装
var express = require('express');

var ws = require("nodejs-websocket")
var game1 = null,game2 = null ,user1=null, user2=null, game1Ready = false , game2Ready = false;
var server = ws.createServer(function(conn){
    conn.on("text", function (res) {
		console.log("serve 接受数据",res,Object.prototype.toString.call(res)==='[object ArrayBuffer]')
		let resObj = JSON.parse(res),
			str = resObj.type
		
        console.log("收到的信息为:"+str, typeof resObj)
        if(str==="game1"){
            game1 = conn;
            game1Ready = true;
			user1 = resObj.user;
            // conn.sendText(JSON.stringify({code: '1003',success: true,data:user1}));
        }
        if(str==="game2"){
            game2 = conn;
            game2Ready = true;
			user2 = resObj.user;
        }

        if(game1Ready&&game2Ready){
			
            // game2.sendText('game2:', str);
			let user = str==="game2" ? user1 : user2
			console.log("2222", str==="game2", JSON.stringify(user))
			game1.sendText(JSON.stringify({code: '1003',success: true,type:'user',data:user2}))
			conn.sendText(JSON.stringify({code: '1003',success: true,type:'user',data:user}));
        }
        
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8082)
console.log("WebSocket建立完毕")
/**
 * 初始化框架,并将初始化后的函数给予 '当前页面'全局变量 app
 * 也就是说, app 是 express 
 */
var app = express();


/* 配置框架环境 S */


// 设置 public 为静态文件的存放文件夹
app.use('/public', express.static('public'));


/* 配置框架环境 E */


app.get('/', function(req, res) {
    res.send('Hello World');
})

var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
    
    console.log("Node.JS 服务器已启动，访问地址： http://%s:%s", host, port)

})