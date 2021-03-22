function waterfall(stack, callback, context) {
    var list = stack, result = {};
    (function (index) {
        var next, key, call;
        if (!list[index]) return callback.call(context, result);
        key = list[index].key;
        call = list[index].callback;
        next = arguments.callee;
        try {
            call(function (value) {
                result[key] = value;
                next(++index);
            });
        } catch (e) {
            console.log(e);
            result[key] = e;
            next(++index);
        }
    })(0);
};


module.exports = waterfall;