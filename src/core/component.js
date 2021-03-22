var waterfall = require('./waterfall');
var x64hash128 = require('./x64hash128');

/**
 *
 * @constructor
 */
function Component() {
    this.cache = 'browserhash';
    this.stack = [];
    this.callbacks = [];
    this.hash = null;
    this.data = null;
    //this.restore();
}


Component.prototype = {
    then: function (fn) {
        if (this.hash && this.data) {
            return this.callback(fn);
        }
        this.callbacks.push(fn);
        return this.fetch();
    },
    save: function (hash, data) {
        try {
            window['localStorage'].setItem(this.cache, JSON.stringify({
                hash: hash,
                data: data
            }));
        } catch (e) {

        }
    },
    restore: function () {
        var cache;
        try {
            cache = window['localStorage'].getItem(this.cache);
            cache = JSON.parse(cache);
        } catch (e) {
            cache = null;
        }
        if (cache) {
            this.hash = cache.hash;
            this.data = cache.data;
        }
    },
    fetch: function () {
        if (this.init) return this;
        this.init = true;
        waterfall(this.stack, function (data) {
            this.hash = x64hash128(this.values(data), 31);
            this.data = data;
            this.save(this.hash, this.data);
            this.run();
        }, this);
        return this;
    },
    run: function () {
        this.callbacks.forEach(this.callback, this);
    },
    base64: function (data) {
        return Base64.encode(JSON.stringify(data));
    },
    callback: function (fn) {
        fn.call(this, {
            id: this.hash,
            data: this.data
        });
    },
    values: function (data) {
        var list = [];
        var prop, value;
        for (prop in data) {
            if (data.hasOwnProperty(prop)) {
                value = data[prop];
                if (typeof (value) === 'object') {
                    list.push(this.values(value));
                } else {
                    list.push(value);
                }
            }
        }
        return list.join('~~~');
    },
    add: function (key, callback) {
        this.stack.push({key: key, callback: callback});
    }
};

module.exports = Component;