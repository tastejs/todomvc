void

function() {
    var _cache = {};

    /**
     *  @augments
     *      1. {String}, {Value},{Value} ... = Template: '%1,%2'
     *      2. {String}, {Object} = Template: '#{key} #{key2}'
     */
    String.format = function(str) {
        if (typeof arguments[1] != 'object') {
            for (var i = 1; i < arguments.length; i++) {
                var regexp = (_cache[i] || (_cache[i] = new RegExp('%' + i, 'g')));
                str = str.replace(regexp, arguments[i]);
            }
            return str;
        }

        var output = '',
            lastIndex = 0,
            obj = arguments[1];
        while (1) {
            var index = str.indexOf('#{', lastIndex);
            if (index == -1) break;
            output += str.substring(lastIndex, index);
            var end = str.indexOf('}', index);

            output += obj[str.substring(index + 2, end)];
            lastIndex = ++end;
        }
        output += str.substring(lastIndex);
        return output;
    }


    Object.defaults = function(obj, def) {
        for (var key in def) if (obj[key] == null) obj[key] = def[key];
        return obj;
    }
    Object.clear = function(obj, arg) {
        if (arg instanceof Array) {
            for (var i = 0, x, length = arg.length; x = arg[i], i < length; i++) if (x in obj) delete obj[x];
        } else if (typeof arg === 'object') {
            for (var key in arg) if (key in obj) delete obj[key];
        }
        return obj;
    }

    Object.extend = function(target, source) {
        if (target == null) target = {};
        if (source == null) return target;
        for (var key in source) if (source[key] != null) target[key] = source[key];
        return target;
    }

    Object.getProperty = function(o, chain) {
        if (typeof o !== 'object' || chain == null) return o;
        if (typeof chain === 'string') chain = chain.split('.');
        if (chain.length === 1) return o[chain[0]];
        return Object.getProperty(o[chain.shift()], chain);
    }

    Object.observe = function(obj, property, callback) {
        if (obj.__observers == null) obj.__observers = {};
        if (obj.__observers[property]) {
            obj.__observers[property].push(callback);
            return;
        };
        (obj.__observers[property] || (obj.__observers[property] = [])).push(callback);

        var chain = property.split('.'),
            parent = obj,
            key = property;

        if (chain.length > 1) {
            key = chain.pop();
            parent = Object.getProperty(obj, chain);
        }

        var value = parent[key];
        Object.defineProperty(parent, key, {
            get: function() {
                return value;
            },
            set: function(x) {
                value = x;
                for (var i = 0, fn, length = obj.__observers[property].length; fn = obj.__observers[property][i], i < length; i++) {
                    fn(x);
                }
            }
        })
    }

    Date.format = function(date, format) {
        if (!format) format = "MM/dd/yyyy";

        function pad(value) {
            return value > 9 ? value : '0' + value;
        }
        format = format.replace("MM", pad(date.getMonth() + 1));
        var _year = date.getFullYear();
        if (format.indexOf("yyyy") > -1) format = format.replace("yyyy", _year);
        else if (format.indexOf("yy") > -1) format = format.replace("yy", _year.toString().substr(2, 2));

        format = format.replace("dd", pad(date.getDate()));

        if (format.indexOf("HH") > -1) format = format.replace("HH", pad(date.getHours()));
        if (format.indexOf("mm") > -1) format = format.replace("mm", pad(date.getMinutes()));
        if (format.indexOf("ss") > -1) format = format.replace("ss", pad(date.getSeconds()));
        return format;
    }


}();