exports.createHandler = function(id, type, func){
	return {id: id, type: type, func: func}
}

exports.CONTROL_TYPE = {RANGE: "range", BUTTON: "button", TOUCH_SCREEN: "touch"}

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

	app.post('/', handleEvent)
	app.get('/html', function *(){
		this.jsonResp(200, {html: html, controls: handlers.map(function(handler){
			return {id: handler.id, type: handler.type}
		})})
	})

	function *handleEvent(){
		var e = yield parse(this)

		for(var i = 0;i < handlers.length;i++){
			var handler = handlers[i]
			if(handler.id == e.id){
				yield handler.func(e);
				break;
			}
		}
		
		this.jsonResp(200, {test: "test"})
	}

	app.listen(options.port);
	return {ip: ip.address(), port: options.port}
}