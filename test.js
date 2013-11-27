var npr = require('./npr-kernel');

var configProxy1 = {
    "dstPort": 80,
    "localPort": 3000,
    "dstAddr": "www.microsoft.com"
};

var configProxy2 = {
    "dstPort": 80,
    "localPort": 2000,
    "dstAddr": "www.google.com"
};

var configRouter = {
    "localPort": 8000,
    "routes": {
        "hosta": {
            "dstAddr": "127.0.0.1",
            "dstPort": 10310
        },
        "default": {
            "dstAddr": "127.0.0.1",
            "dstPort": 10310
        }
    }
};

npr.run(configProxy1);
npr.run(configProxy2);
npr.run(configRouter);