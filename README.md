nproxy
======

A nodejs proxy server.
------

* Start the proxy server with default configuration 'proxy.json':  
`node proxy.js`

* Start the proxy server with selected configuration 'google.json':  
`node proxy.js google.json`

* Start the proxy server with multiple configurations 'google.json ms.json':  
`node proxy.js google.json ms.json`

Aconfiguration looks like this:
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
When you connect to 127.0.0.1:3000, you connect to www.microsoft.com:80, and when you connect to 127.0.0.1:2000, you connect to www.google.com:80.

Please note that `localAddr`, is not necessary, when omitted, the server will listen on all network interfaces.