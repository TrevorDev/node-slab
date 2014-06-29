var fs = require('fs');
var slab = require("../lib/slab")
var exec = require('child_process').exec;

var handlers = []

var handleVol = function *(e){
	exec("amixer -D pulse sset Master "+e.val+"%", function (error, stdout, stderr) {});
}

var handleButton = function *(e){
	//exec("shut", function (error, stdout, stderr) {});
	exec("mpg321 developer.mp3", function (error, stdout, stderr) {});
}

handlers.push(slab.createHandler("volume", slab.CONTROL_TYPE.RANGE, handleVol))
handlers.push(slab.createHandler("outputText", slab.CONTROL_TYPE.BUTTON, handleButton))



var server = slab.startServer(handlers, fs.readFileSync('ui.html').toString(), {port: 3000})

console.log("Started running on address " + server.ip+":"+server.port);