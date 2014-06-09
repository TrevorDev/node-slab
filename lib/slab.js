exports.createHandler = function(id, type, func){
	return {id: id, type: type, func: func}
}

exports.CONTROL_TYPE = {RANGE: "range", BUTTON: "button", TOUCH_SCREEN: "touch"}

exports.startServer = function(handlers, html, options){
	var cors = require('koa-cors')
	var router = require('koa-router')
	var koa = require("koa")
	var ip = require('ip')
	
	var app = koa()
	app.use(cors())
	app.use(router(app))

	app.post('/', handleEvent)
	app.get('/html', function *(){
		this.jsonResp(200, {html: html})
	})

	function *handleEvent(){
		var e = yield parse(this)

		for(var i = 0;i < handlers.length;i++){
			var handler = handlers[i]
			if(handler.type == e.type){
				yield handler.func();
				break;
			}
		}
		console.log(e)
		this.jsonResp(200, {test: "blah"})
	}

	app.listen(options.port);
	return {ip: ip.address(), port: options.port}
}