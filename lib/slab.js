exports.createHandler = function(id, type, func){
	return {id: id, type: type, func: func}
}

exports.CONTROL_TYPE = {RANGE: "range", BUTTON: "button", TOUCH: "touch", TEXT: "text", FORM: "form"}

exports.startServer = function(handlers, html, options){
	var cors = require('koa-cors')
	var router = require('koa-router')
	var koa = require("koa")
	var ip = require('ip')
	var jsonResp = require('./jsonResp')
	var parse = require('co-body')
	var app = koa()
	app.use(cors())
	app.use(jsonResp())
	app.use(router(app))

	app.get('/html', function *(){
		this.jsonResp(200, {html: html, controls: handlers.map(function(handler){
			return {id: handler.id, type: handler.type}
		})})
	})

	var http = require('http')
	var server = http.createServer(app.callback())
	var io = require('socket.io').listen(server);

	io.on('connection', function(socket){
	  console.log('a user connected');

	  socket.on('event', function(e){
	  	for(var i = 0;i < handlers.length;i++){
			var handler = handlers[i]
			if(handler.id == e.id){
				handler.func(e);
				break;
			}
		}
	  });

	  socket.on('disconnect', function(){
	    console.log('user disconnected');
	  });
	});

	server.listen(options.port);
	return {ip: ip.address(), port: options.port}
}