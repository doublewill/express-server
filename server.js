let express = require('express')
let app = express()
let fs = require('fs')

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
	// 首先我们读取已存在的用户
	console.log(req)
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {

		data = JSON.parse(data);
		let users = data.data.filter(opt=> opt.id === req.params.id) || []

		var user = users.length ? users[0] : null
		res.end(JSON.stringify(user));
	});
})
 
app.post('/deleteUser', function (req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		console.log(data)		 
		data = JSON.parse(data); 
		delete data["user2"];   
		res.end(JSON.stringify(data)); 
	});
})

var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

