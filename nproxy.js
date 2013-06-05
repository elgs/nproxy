var fs = require('fs');
var net = require('net');

var proxy = function(lConfig, rConfig) {
   return net.createServer(function(socket) {
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

var router = function(lConfig, routes) {
   return net.createServer(function(socket) {
      socket.on('data', function(data) {
         if (socket.peerClient === undefined || socket.peerClient === null) {
            var peep = data.toString();
            var headers = peep.split('\n');
            for ( var i in headers) {
               if (headers[i].toLowerCase().indexOf('host') === 0) {
                  var hostData = headers[i].split(':');
                  var route = hostData[1].trim();
                  var rConfig = routes[route];
                  if (rConfig === null) {
                     rConfig = routes['default'];
                  }
                  var client = net.connect(rConfig);
                  socket.peerClient = client;
                  client.write(data);

                  client.on('end', function() {
                     socket.end();
                  });
                  socket.on('end', function() {
                     client.end();
                  });
                  client.on('data', function(data) {
                     socket.write(data);
                  });
                  break;
               }
            }

         } else {
            socket.peerClient.write(data);
         }
      });
   }).listen(lConfig.port, lConfig.port);
}

var start = function(config) {
   var data = fs.readFileSync(config, 'UTF-8');
   var config = JSON.parse(data);
   for ( var k in config) {
      var c = config[k];
      var lConfig = {
         port : c.localPort,
         host : c.localAddr
      };
      var routes = {};
      var routeConfig = c.routes;
      if (routeConfig !== undefined && routeConfig !== null) {
         for ( var rk in routeConfig) {
            var r = routeConfig[rk];
            var rConfig = {
               port : r.dstPort,
               host : r.dstAddr
            };
            routes[rk] = rConfig;
         }
         router(lConfig, routes);
      } else {
         var rConfig = {
            port : c.dstPort,
            host : c.dstAddr
         };
         proxy(lConfig, rConfig);
      }
   }
}

var args = function() {
   var ret = [];
   process.argv.forEach(function(val, index, array) {
      if (index >= 2) {
         ret.push(val);
      }
   });
   if (ret.length === 0) {
      ret = [ 'proxy.json' ];
   }
   return ret;
}

var input = args();
for ( var i in input) {
   start(input[i]);
}