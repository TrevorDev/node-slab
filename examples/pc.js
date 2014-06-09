var slab = require("../lib/slab")

var handlers = []
handlers.push(slab.createHandler("volume", slab.CONTROL_TYPE.RANGE, handleVol))

var handleVol = function *(val){
	console.log(val)
}

var server = slab.startServer(handlers, "test", {port: 3000})

console.log("Started running on address " + server.ip+":"+server.port);