// 引入 express 框架 -> 需 npm 安装
const express = require('express');
const UUID = require('node-uuid');
const ws = require("nodejs-websocket")
const url  = require('url');
// const express_ws = require('express-ws');
const wsObj = {};
// express_ws(app);

// Game Class
var Game = function(obj) {
	this.id = obj.id
	this.user1 = obj.user1
	this.user2 = obj.user2
	this.status = 0
}
Game.prototype = {
	
}
Game.getUniCode = function() {
	return UUID.v1()
}

// User Class
var User = function(obj) {
	this.uid = obj.uid
	this.avatarUrl = obj.avatarUrl
	this.nickName = obj.nickName
	this.gender = obj.gender
}
User.prototype = {
	
}
var curGame = null
var data = {}
var game1 = null,game2 = null ,user1 = null, user2=null, game1Ready = false , game2Ready = false;
var server = ws.createServer(function(conn, req){
	var argObj = url.parse(conn.path, true).query
	console.log("argObj", argObj.uid)
	wsObj[argObj.uid] = conn
    conn.on("text", function (res) {
		console.log("serve 接受数据",arguments,Object.prototype.toString.call(res)==='[object ArrayBuffer]')
		let msgObj = JSON.parse(res),
			type= msgObj.type,
			id = msgObj.id || ''
		switch(type) {
			case 'create':
				// 创建游戏
				var newGame = new Game({
					id: Game.getUniCode(),
					user1: new User(msgObj.data),
					user2: null,
					status: 0 // 等待连接
				})
				data[newGame.id] = newGame
				let data0 = {
					id: newGame.id,
					fromId: '',
					type: 'create',
					data: ''
				}
				wsObj[argObj.uid].sendText(JSON.stringify(data0))
				console.log("创建成功~")
				break;
			case 'user':
				data[id].user2 = new User(msgObj.data)
				data[id].status = 1 // 已连接
				let data1 = {
					fromId: argObj.uid,
					type: 'user',
					data: new User(msgObj.data)
				}, another = {
					fromId: data[id].user2,
					type: 'user',
					data: data[id].user1
				}
				wsObj[msgObj.toId].sendText(JSON.stringify(data1))
				wsObj[argObj.uid].sendText(JSON.stringify(data))
				console.log("用户交换信息成功~")
				break;
			case 'message':
				let data2 = {
					fromId: argObj.uid,
					type: 'message',
					data: msgObj.data
				}
				wsObj[msgObj.toId].sendText(JSON.stringify(data2))
				console.log("下棋中~")
				break;
			default:
				break;
		}
        
		
		// if(!id) {
		// 	var newGame = new Game({
		// 		id: Game.getUniCode(),
		// 		user1: new User(resObj.user),
		// 		user2: null,
		// 		status: 0
		// 	})
		// 	id = newGame.id
		// 	data[newGame.id] = newGame
		// }
		// curGame = data[id]
  //       if(str==="game1"){
  //           game1 = conn;
  //           game1Ready = true;
		// 	user1 = resObj.user;
  //           // conn.sendText(JSON.stringify({code: '1003',success: true,data:user1}));
  //       }
  //       if(str==="game2"){
  //           game2 = conn;
  //           game2Ready = true;
		// 	user2 = resObj.user;
  //       }

  //       if(game1Ready&&game2Ready){
			
  //           // game2.sendText('game2:', str);
		// 	let user = str==="game2" ? user1 : user2
		// 	console.log("2222", str==="game2", JSON.stringify(user))
		// 	game1.sendText(JSON.stringify({code: '1003',success: true,type:'user',data:user2}))
		// 	conn.sendText(JSON.stringify({code: '1003',success: true,type:'user',data:user}));
  //       }
        
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