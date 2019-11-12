let express = require('express')
let app = express()
let fs = require('fs')
let bodyParser = require('body-parser')

let AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
let APP_ID = "";
let API_KEY = "";
let SECRET_KEY = "";

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});


// 新建一个对象，建议只保存一个对象调用服务接口
let client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);
app.post('/voice', function (req, res) {
	let voice = fs.readFileSync('./assets/voice/16k.pcm');
	let voiceBuffer = new Buffer(voice);
	
	client.recognize(voiceBuffer, 'pcm', 16000).then(function (result) { 	// 识别本地文件
		// console.log('<recognize>: ' + JSON.stringify(result));		
		if (result.err_msg == 'success' || result.err_no == 0) {
			res.end(JSON.stringify({
				code: 200,
				msg: '转换成功',
				data: result.result[0]
			}))			
		}
		else res.end(JSON.stringify({
			code: 300,
			msg: '转换失败',
			data: 'false'
		}))			

	}, function(err) {
		console.log(err);
	});
})

app.get('/listUsers', function (req, res) {
	fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
		res.end(data)
	})
})

//添加的新用户数据
app.post('/addUser', function (req, res) {
	fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
		data = JSON.parse(data)
		data.data.push({
			"name": "suresh",
			"address": "中国北京",
			"email": "test@163.com",
			"id": data.data.length ?  data.data[data.data.length - 1].id + 1 : 1
		})
		res.end(JSON.stringify(data)) 
	})
})

app.get('/:id', function (req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {

		data = JSON.parse(data);
		let users = data.data.filter(opt=> opt.id === req.params.id) || []

		var user = users.length ? users[0] : null
		res.end(JSON.stringify(user));
	});
})
 
app.post('/deleteUser/:id', function (req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		let users = data.data.filter(opt=> opt.id != req.params.id) || []
		res.end(JSON.stringify(users)); 
	});
})

var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

