void
function(w) {
    /** convert line parameters to object. : 'e=10' to {e:10} */
    var deserialize = function(line) {
        var o = {};
        if (!line) return o;
        for (var item, i, parts = line.split('&');
        (item = parts[(i = -~i) - 1]) && (item = item.split('=')) && (item.length == 2);) {
            o[item[0]] = item[1];
        }
        return o;
    }

    /**
     *      route = {Object}
     *      {
     *              match: {regexp},
     *              param: {querystring} /** 'key=$1&key2=$2'
     *      }
     */

    w.routes = new (Class({
        Construct: function(routes) {            
            window.onhashchange = this.hashchanged.bind(this);
        },
        hashchanged: function() {
            var hash = (w.location.hash || '').replace(/^#\/?/, '');

            if (this.routes == null) return;

            for (var i = 0, x, length = this.routes.length; x = this.routes[i], i < length; i++) {
                var result = x.match.exec(hash);
                if (!result || !result.length) continue;

                x.callback(deserialize(hash.replace(x.match, x.param)));
            }
        },
        add: function(routes) {
            if (routes) {
                var isarray = routes instanceof Array,
                    length = isarray ? routes.length : 1,
                    x = null;
                for (var i = 0; x = isarray ? routes[i] : routes, isarray ? i < length : i < 1; i++) {
                    (this.routes || (this.routes = [])).push(x);
                }
            }
            
        },
        set: function(hash) {
            w.location.hash = '/' + hash;
        },
        current: function() {
            var hash = (w.location.hash || '').replace(/^#\/?/, '');

            if (this.routes) {

                for (var i = 0, x, length = this.routes.length; x = this.routes[i], i < length; i++) {
                    var result = x.match.exec(hash);
                    if (!result || !result.length) continue;

                    return deserialize(hash.replace(x.match, x.param));
                }
            }
            return null;
        }
    }));




}(window);