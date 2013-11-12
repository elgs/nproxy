(function () {
    var fs = require('fs');
    var npr = require('./npr-kernel');

    var start = function (config) {
        fs.readFile(config, 'UTF-8', function (err, data) {
            if (err) {
                console.log(err.path + " not found.");
            } else {
                var configs = JSON.parse(data);
                for (var k in configs) {
                    npr.run(configs[k]);
                }
            }
        });
    };

    var args = function () {
        var ret = [];
        process.argv.forEach(function (val, index, array) {
            if (index >= 2) {
                ret.push(val);
            }
        });
        if (ret.length === 0) {
            ret.push('npr.json');
        }
        return ret;
    };

    var input = args();
    for (var i in input) {
        start(input[i]);
    }
})();