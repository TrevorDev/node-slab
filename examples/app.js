var fs = require('fs');
var slab = require("../lib/slab")
var exec = require('child_process').exec;

var handlers = []

var handleVol = function (e){
	exec("amixer -D pulse sset Master "+e.val+"%", function (error, stdout, stderr) {});
}

var handleButton = function (e){
	//exec("shut", function (error, stdout, stderr) {});
	exec("mpg321 developer.mp3", function (error, stdout, stderr) {});
}

var handleForm = function (e){
	var command = e.val.outputText.split("").map(function(val){
		return "xdotool key "+val+";";
	}).join("");
	console.log(command);
	exec(command, function (error, stdout, stderr) {});
}

var handleTouch = function (e){
	if (e.val.type == "touchstart"){
		console.log("start!!!!!!!!!!!!!!!!");
	}else{
		var command = "xdotool mousemove_relative -- "+e.val.x+" "+e.val.y;
		console.log(command);
		exec(command, function (error, stdout, stderr) {});
	}
}

handlers.push(slab.createHandler("volume", slab.CONTROL_TYPE.RANGE, handleVol))
handlers.push(slab.createHandler("playSound", slab.CONTROL_TYPE.BUTTON, handleButton))
handlers.push(slab.createHandler("outputForm", slab.CONTROL_TYPE.FORM, handleForm))
handlers.push(slab.createHandler("touchScreen", slab.CONTROL_TYPE.TOUCH, handleTouch))



var server = slab.startServer(handlers, fs.readFileSync('ui.html').toString(), {port: 3000})

console.log("Started running on address " + server.ip+":"+server.port);