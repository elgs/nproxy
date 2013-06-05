var fs = require('fs');
var net = require('net');

var proxy = function(rConfig, lConfig){
	return net.createServer(function (socket) {
		var client = net.connect(rConfig);

		client.on('end', function() {
			socket.end();
		});
		socket.on('end', function() {
			client.end();
		});

		client.on('data', function(data) {
			socket.write(data);
		});
		socket.on('data', function(data) {
			client.write(data);
		});
	}).listen(lConfig.port, lConfig.port);
}

var start = function(config){
	fs.readFile(config, 'UTF-8',function(err, data) {
		var config = JSON.parse(data);
		for(var k in config){
			var c = config[k];
			var rConfig = {
				port : c.dstPort,
				host : c.dstAddr
			};

			var lConfig = {
				port : c.localPort,
				host : c.localAddr
			}; 
			proxy(rConfig, lConfig);   	
		}
	});
}

var args = function(){
	var ret = [];
	process.argv.forEach(function (val, index, array) {
		if(index >= 2){
			ret.push(val);
		}
	});
	if(ret.length===0){
		ret = ['proxy.json'];
	}
	return ret;
}

var input = args();
for(var i in input){
	start(input[i]);
}