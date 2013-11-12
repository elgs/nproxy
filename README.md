npr
======

A nodejs proxy server.
------
Supports TCP in proxy mode, HTTP and Websocket in router mode.

Installation
------
* Standalone Installation (as command line utility):  
`sudo npm install npr -g`

* Modular Installation (as a node module):  
`sudo npm install npr`

Startup (as command line utility)
------
* Start the proxy server with default configuration `npr.json`:  
`npr`

* Start the proxy server with selected configuration `google.json`:  
`npr google.json`

* Start the proxy server with multiple configurations `google.json ms.json`:  
`npr google.json ms.json`

Use as node module
------
```js
var npr = require('npr-kernel');

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
            "dstPort": 10309
        },
        "default": {
            "dstAddr": "127.0.0.1",
            "dstPort": 10309
        }
    }
};

npr.run(configProxy1);
npr.run(configProxy2);
npr.run(configRouter);
```

Proxy mode
------
A configuration `npr.json` looks like this:
```js
{
  "microsoft" : {
    "dstPort" : 80,
    "localPort" : 3000,
    "dstAddr" : "www.microsoft.com"
  },
  "google" : {
    "dstPort" : 80,
    "localPort" : 2000,
    "localAddr" : "127.0.0.1",
    "dstAddr" : "www.google.com"
  }
}
```
means that:  
when the clients connect to 127.0.0.1:3000, they connect to `www.microsoft.com:80`, and when the clients connect to `127.0.0.1:2000`, they connect to `www.google.com:80`.

Please note that `localAddr` is not necessary, when omitted, the server will listen on all network interfaces.

Router mode
------
Router mode works only with HTTP, not even HTTPS. Proxy mode and router mode can be working together happily.
A configuration `npr.json` looks like this:
```js
{
  "google_ms" : {
    "localPort" : 4000,
    "routes" : {
      "hostname_a" : {
        "dstAddr" : "www.microsoft.com",
        "dstPort" : 80
      },
      "hostname_b" : {
        "dstAddr" : "www.google.com",
        "dstPort" : 80
      },
      "default" : {
        "dstAddr" : "www.yahoo.com",
        "dstPort" : 80
      }
    }
  }
}
```
means that:  
if multiple host names / domain names are bound to the proxy server, let's say `hostname_a` and `hostname_b`. When the clients connect to `hostname_a:4000`, they connect to `www.microsoft.com:80`, and when the clients connect to `hostname_b:4000`, they connect to `www.google.com:80`. If the clients connect to a host name which is not in the route table, `127.0.0.1:4000` from the proxy server itelf, for example, they connect to the default route `www.yahoo.com:80`.
