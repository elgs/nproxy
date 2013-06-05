nproxy
======

A nodejs proxy server.
------

* Start the proxy server with default configuration 'proxy.js':  
`node proxy.js`

* Start the proxy server with selected configuration 'google.json':  
`node proxy.js google.json`

* Start the proxy server with multiple configurations 'google.json ms.json':  
`node proxy.js google.json ms.json`

When a configuration looks like this:

```js
{
  "microsoft" : {
    "dstPort" : 80,
    "localPort" : 3000,
    "localAddr" : "127.0.0.1",
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