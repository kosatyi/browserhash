var platform = require('./component/platform');

var device = require('./component/device');

var fonts  = require('./component/fonts');

var canvas = require('./component/canvas');

var lied   = require('./component/lied');

var audio  = require('./component/audio');

var plugins = require('./component/plugins');

var x64hash128 = require('./core/x64hash128');

var Component = require('./core/component');

var BrowserHash = new Component();

BrowserHash.add('user_agent', function (next) {
    next(navigator.userAgent);
});

BrowserHash.add('hardware_concurrency', function (next) {
    next(navigator.hardwareConcurrency || 'unknown');
});

BrowserHash.add('language', function (next) {
    next(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || '');
});

BrowserHash.add('languages', function (next) {
    next(navigator.languages || []);
});

BrowserHash.add('color_depth', function (next) {
    next(window.screen.colorDepth || -1);
});

BrowserHash.add('device_memory', function (next) {
    next(navigator.deviceMemory || -1);
});

BrowserHash.add('pixel_ratio', function (next) {
    next(window.devicePixelRatio || '');
});

BrowserHash.add('resolution', function (next) {
    next((window.screen.height > window.screen.width) ? [window.screen.height, window.screen.width] : [window.screen.width, window.screen.height]);
});

BrowserHash.add('available_resolution', function (next) {
    next((window.screen.availHeight > window.screen.availWidth) ? [window.screen.availHeight, window.screen.availWidth] : [window.screen.availWidth, window.screen.availHeight]);
});

BrowserHash.add('timezone_offset', function (next) {
    next(new Date().getTimezoneOffset());
});

BrowserHash.add('cookie_enabled', function (next) {
    next(!!navigator.cookieEnabled);
});

BrowserHash.add('session_storage', function (next) {
    var result;
    try {
        result = !!window.sessionStorage
    } catch (e) {
        result = true
    }
    next(result);
});

BrowserHash.add('local_storage', function (next) {
    var result;
    try {
        result = !!window.localStorage
    } catch (e) {
        result = true
    }
    next(result);
});

BrowserHash.add('indexed_db', function (next) {
    var result;
    try {
        result = !!window.indexedDB
    } catch (e) {
        result = true
    }
    next(result);
});

BrowserHash.add('add_behavior', function (next) {
    next(!!(document.body && document.body.addBehavior));
});

BrowserHash.add('open_database', function (next) {
    var result;
    try {
        result = !!window.openDatabase
    } catch (e) {
        result = true
    }
    next(result);
});

BrowserHash.add('cpu_class', function (next) {
    next(navigator.cpuClass || 'unknown');
});

BrowserHash.add('navigator_platform', function (next) {
    next(navigator.platform || 'unknown');
});

BrowserHash.add('plugins', function (next) {
    next(plugins.getBrowserPlugins());
});

BrowserHash.add('canvas', function (next) {
    next(x64hash128(canvas.getCanvasHash(), 31));
});

BrowserHash.add('webgl', function (next) {
    next(x64hash128(canvas.getWebglHash(), 31));
});

BrowserHash.add('audio_hash', function (next) {
    audio.audioFingerprint(next);
});


BrowserHash.add('adblock', function (next) {
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

BrowserHash.add('has_lied_languages', function (next) {
    next(lied.getHasLiedLanguages());
});

BrowserHash.add('has_lied_resolution', function (next) {
    next(lied.getHasLiedResolution());
});

BrowserHash.add('has_lied_os', function (next) {
    next(lied.getHasLiedOs());
});

BrowserHash.add('has_lied_browser', function (next) {
    next(lied.getHasLiedBrowser());
});

BrowserHash.add('touch_support', function (next) {
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

BrowserHash.add('do_not_track', function (next) {
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

BrowserHash.add('fonts', function (next) {
    next(fonts.getAvailableFonts());
});

BrowserHash.add('platform_name', function (next) {
    next(String(platform.name || 'unknown').toLowerCase());
});

BrowserHash.add('platform_version', function (next) {
    next(String(platform.version || 'unknown').toLowerCase());
});

BrowserHash.add('platform_os', function (next) {
    next(String(platform.os.family || 'unknown').toLowerCase());
});

BrowserHash.add('platform_product', function (next) {
    next(String(platform.product || 'unknown').toLowerCase());
});

BrowserHash.add('platform_type', function (next) {
    next(device.type || 'unknown');
});

window.BrowserHash = BrowserHash;

module.exports = BrowserHash;