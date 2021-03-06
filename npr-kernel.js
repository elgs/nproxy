(function () {
    var net = require('net');

    var proxy = function (lConfig, rConfig) {
        return net.createServer(function (socket) {
            var client = net.connect(rConfig);
            client.on('end', function () {
                try {
                    socket.destroy();
                } catch (err) {
                    console.log(err);
                }
            });
            socket.on('end', function () {
                try {
                    client.destroy();
                } catch (err) {
                    console.log(err);
                }
            });
            client.on('close', function () {
                try {
                    socket.destroy();
                } catch (err) {
                    console.log(err);
                }
            });
            socket.on('close', function () {
                try {
                    client.destroy();
                } catch (err) {
                    console.log(err);
                }
            });
            client.on('error', function (e) {
                if (e) console.log(e);
                try {
                    client.destroy();
                } catch (err) {
                    console.log(err);
                }
                try {
                    socket.destroy();
                } catch (err) {
                    console.log(err);
                }
            });
            socket.on('error', function (e) {
                if (e) console.log(e);
                try {
                    client.destroy();
                } catch (err) {
                    console.log(err);
                }
                try {
                    socket.destroy();
                } catch (err) {
                    console.log(err);
                }
            });
            client.on('data', function (data) {
                socket.write(data);
            });
            socket.on('data', function (data) {
                client.write(data);
            });
        }).listen(lConfig.port, lConfig.host);
    };

    var router = function (lConfig, routes) {
        return net.createServer(function (socket) {
            socket.on('error', function (e) {
                socket.destroy();
            });
            socket.on('data', function (data) {
                if (socket.peerClient === undefined || socket.peerClient === null) {
                    var peep = data.toString();
                    var headers = peep.split('\n');
                    for (var i in headers) {
                        if (headers[i].toLowerCase().indexOf('host') === 0) {
                            var hostData = headers[i].split(':');
                            var route = hostData[1].trim();
                            var rConfig = routes[route];
                            if (rConfig === undefined || rConfig === null) {
                                rConfig = routes['default'];
                                if (rConfig === undefined || rConfig === null) {
                                    console.log("No route found.")
                                    try {
                                        socket.destroy();
                                    } catch (err) {
                                        console.log(err);
                                    }
                                    break;
                                }
                            }
                            var client = net.connect(rConfig);
                            client.on('error', function (e) {
                                if (e) console.log(e);
                                try {
                                    client.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                                try {
                                    socket.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            socket.peerClient = client;
                            client.write(data);
                            socket.on('error', function (e) {
                                if (e) console.log(e);
                                try {
                                    client.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                                try {
                                    socket.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            client.on('end', function () {
                                try {
                                    socket.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            socket.on('end', function () {
                                try {
                                    client.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            client.on('close', function () {
                                try {
                                    socket.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            socket.on('close', function () {
                                try {
                                    client.destroy();
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            client.on('data', function (data) {
                                socket.write(data);
                            });
                            break;
                        }
                    }
                } else {
                    socket.peerClient.write(data);
                }
            });
        }).listen(lConfig.port, lConfig.host);
    };

    exports.run = function (config) {
        var lConfig = {
            port: config.localPort,
            host: config.localAddr
        };
        var routes = {};
        var routeConfig = config.routes;
        if (routeConfig !== undefined && routeConfig !== null) {
            for (var rk in routeConfig) {
                var r = routeConfig[rk];
                var rConfig = {
                    port: r.dstPort,
                    host: r.dstAddr
                };
                routes[rk] = rConfig;
            }
            router(lConfig, routes);
        } else {
            var rConfig = {
                port: config.dstPort,
                host: config.dstAddr
            };
            proxy(lConfig, rConfig);
        }
    };
})();