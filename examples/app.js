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

var handleCompass = function (e){
	//console.log(e)
}

var lastGyroVal = null;
var handleGyro = function (e){
	var newVal = Math.floor(e.val.alpha/20);
	console.log(newVal)
	if(!lastGyroVal){
		lastGyroVal = newVal;
	}else{
		var command = "xdotool key Alt_L+Control_L+"
		if(newVal < lastGyroVal){
			command+="Left"
		}else if(newVal > lastGyroVal){
			command+="Right"
		}else{
			return;
		}
		console.log(command)
		lastGyroVal = newVal;
		exec(command, function (error, stdout, stderr) {});	
	}
	

}

handlers.push(slab.createHandler("volume", slab.CONTROL_TYPE.RANGE, handleVol))
handlers.push(slab.createHandler("playSound", slab.CONTROL_TYPE.BUTTON, handleButton))
handlers.push(slab.createHandler("outputForm", slab.CONTROL_TYPE.FORM, handleForm))
handlers.push(slab.createHandler("touchScreen", slab.CONTROL_TYPE.TOUCH, handleTouch))
handlers.push(slab.createHandler("compassTest", slab.CONTROL_TYPE.COMPASS, handleCompass))
handlers.push(slab.createHandler("gyroTest", slab.CONTROL_TYPE.GRYO, handleGyro))


var server = slab.startServer(handlers, fs.readFileSync('ui.html').toString(), {port: 3545})

console.log("Started running on address " + server.ip+":"+server.port);