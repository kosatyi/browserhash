(function () {

    var WATERFALL_TIMEOUT = 0;

    function waterfall(stack, callback, context) {
        var list = stack, result = {};
        (function (index) {
            var next, key, call;
            if (!list[index]) return callback.call(context, result);
            key  = list[index].key;
            call = list[index].callback;
            next = arguments.callee;
            try {
                call(function (value) {
                    result[key] = value;
                    setTimeout(function(){
                        next(++index);
                    },WATERFALL_TIMEOUT);
                });
            } catch (e) {
                result[key] = e;
                setTimeout(function(){
                    next(++index);
                },WATERFALL_TIMEOUT);
            }
        })(0);
    }

    function Component() {
        this.stack     = [];
        this.callbacks = [];
        this.hash      = null;
        this.data      = null;
    }

    Component.prototype = {
        then: function ( fn ){
            if(this.hash && this.data) return this.callback(fn);
            this.callbacks.push( fn );
            return this.fetch();
        },
        fetch:function(){
            if(this.init) return this;
            this.init = true;
            waterfall(this.stack, function (data){
                this.data = data;
                this.hash = x64hash128(this.values(data),31);
                this.run();
            }, this );
            return this;
        },
        run:function(){
            this.callbacks.forEach(this.callback,this);
        },
        base64:function(data){
            return Base64.encode(JSON.stringify(data));
        },
        callback:function(fn){
            fn.call(this,{
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
                    if (typeof(value) === 'object') {
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

    var browserHash = new Component();

    browserHash.add('user_agent', function (next) {
        next(navigator.userAgent);
    });

    browserHash.add('hardware_concurrency', function (next) {
        next(navigator.hardwareConcurrency || 'unknown');
    });

    browserHash.add('language', function (next) {
        next(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || '');
    });

    browserHash.add('languages', function (next) {
        next(navigator.languages || []);
    });

    browserHash.add('color_depth', function (next) {
        next(window.screen.colorDepth || -1);
    });

    browserHash.add('device_memory', function (next) {
        next(navigator.deviceMemory || -1);
    });

    browserHash.add('pixel_ratio', function (next) {
        next(window.devicePixelRatio || '');
    });

    browserHash.add('resolution', function (next) {
        next((window.screen.height > window.screen.width) ? [window.screen.height, window.screen.width] : [window.screen.width, window.screen.height]);
    });

    browserHash.add('available_resolution', function (next) {
        next((window.screen.availHeight > window.screen.availWidth) ? [window.screen.availHeight, window.screen.availWidth] : [window.screen.availWidth, window.screen.availHeight]);
    });

    browserHash.add('timezone_offset', function (next) {
        next(new Date().getTimezoneOffset());
    });

    browserHash.add('cookie_enabled', function (next) {
        next(!!navigator.cookieEnabled);
    });

    browserHash.add('session_storage', function (next) {
        var result;
        try {
            result = !!window.sessionStorage
        } catch (e) {
            result = true
        }
        next(result);
    });

    browserHash.add('local_storage', function (next) {
        var result;
        try {
            result = !!window.localStorage
        } catch (e) {
            result = true
        }
        next(result);
    });

    browserHash.add('indexed_db', function (next) {
        var result;
        try {
            result = !!window.indexedDB
        } catch (e) {
            result = true
        }
        next(result);
    });

    browserHash.add('add_behavior', function (next) {
        next(!!(document.body && document.body.addBehavior));
    });

    browserHash.add('open_database', function (next) {
        var result;
        try {
            result = !!window.openDatabase
        } catch (e) {
            result = true
        }
        next(result);
    });

    browserHash.add('cpu_class', function (next) {
        next(navigator.cpuClass || 'unknown');
    });

    browserHash.add('navigator_platform', function (next) {
        next(navigator.platform || 'unknown');
    });

    browserHash.add('plugins', function (next) {
        next(getBrowserPlugins());
    });

    browserHash.add('canvas', function (next) {
        next(x64hash128(getCanvasHash(), 31));
    });

    browserHash.add('webgl', function (next) {
        next(x64hash128(getWebglHash(), 31));
    });

    browserHash.add('webgl_vendor', function (next) {
        next(getWebglVendor());
    });

    browserHash.add('adblock', function (next) {
        var ads = document.createElement('div'), className = 'adsbox';
        ads.innerHTML = '&nbsp;';
        ads.className = className;
        var result = false;
        try {
            document.body.appendChild(ads);
            result = document.getElementsByClassName(className)[0].offsetHeight === 0;
            document.body.removeChild(ads);
        } catch (e) {
            result = false
        }
        next(result);
    });

    browserHash.add('has_lied_languages', function (next) {
        next(getHasLiedLanguages());
    });

    browserHash.add('has_lied_resolution', function (next) {
        next(getHasLiedResolution());
    });

    browserHash.add('has_lied_os', function (next) {
        next(getHasLiedOs());
    });

    browserHash.add('has_lied_browser', function (next) {
        next(getHasLiedBrowser());
    });

    browserHash.add('touch_support', function (next) {
        var maxTouchPoints = 0;
        var touchEvent = false;
        if (typeof navigator.maxTouchPoints !== 'undefined') {
            maxTouchPoints = navigator.maxTouchPoints;
        } else if (typeof navigator.msMaxTouchPoints !== 'undefined') {
            maxTouchPoints = navigator.msMaxTouchPoints;
        }
        try {
            document.createEvent('TouchEvent');
            touchEvent = true;
        } catch (_) { /* squelch */
        }
        var touchStart = 'ontouchstart' in window;
        next([maxTouchPoints, touchEvent, touchStart]);
    });

    browserHash.add('do_not_track', function (next) {
        var result;
        if (navigator.doNotTrack) {
            result = navigator.doNotTrack;
        } else if (navigator.msDoNotTrack) {
            result = navigator.msDoNotTrack;
        } else if (window.doNotTrack) {
            result = window.doNotTrack;
        } else {
            result = 'unknown'
        }
        next(result);
    });

    browserHash.add('fonts', function (next) {
        next(getAvailableFonts());
    });

    browserHash.add('platform_name', function (next) {
        next(String(platform.name || 'unknown').toLowerCase());
    });

    browserHash.add('platform_version', function (next) {
        next(String(platform.version || 'unknown').toLowerCase());
    });

    browserHash.add('platform_os', function (next) {
        next(String(platform.os.family || 'unknown').toLowerCase());
    });

    browserHash.add('platform_product', function (next) {
        next(String(platform.product || 'unknown').toLowerCase());
    });

    browserHash.add('platform_type', function (next) {
        next(device.type || 'unknown');
    });

    this.BrowserHash = browserHash;

})();