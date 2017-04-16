/* ROUTER 
 * Dependency: html.array
*/
(function () {
    //this.config.historyEnabled = false;
    var _html     = this,
        context   = {},
        history   = !!window.history && _html.config.historyEnabled,
        location  = window.location,
        origin    = location.origin || location.protocol + "//" + location.hostname + (location.port ? ':' + location.port: ''),
        routes    = _html.array([]);
        
    var router = this.router = this.navigate = function(pattern, fn) {
        var isPatternRegistered = routes.any(function(r){ return r.originalPattern === pattern; });
        if(!isPatternRegistered) {
            var realPattern = new RegExp('^' + pattern.replace(/\//g, "\\/").replace(/:(\w*)/g,"(\\w*)") + '$');
            routes.push({originalPattern: pattern, pattern: realPattern, fn: fn});
        } else {
            throw 'Duplicated pattern: ' + pattern + '. Please provide another pattern!';
        }
    };
    
    this.navigate = function(path) {
        history && window.history.pushState(null, null, path);
        process({href: path});
    };
    
    var process = function() {
        var path = this.href || location.hash || location.pathname;
        var route = routes.firstOrDefault(function(r){ return r.pattern.test(path); });
        if(route) {
            //reset the context
            context = {};
            var params = path.match(route.pattern);
            params.shift();
            var paramKeys = _html.array(route.originalPattern.match(/:(\w*)/g))
                .select(function(arg){ return arg.replace(':', ''); })
                .each(function(key, index) {
                    context[key] = params[index];
                });
            route.fn.apply(context, params);
        }
    };
    
    _html(document).click(function(e) {
        var a = e.target || e.srcElement;
        // Middle click, cmd click, and ctrl click should open
        // links in a new tab as normal.
        if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        // Ignore cross origin links
        if (location.protocol !== a.protocol || location.hostname !== a.hostname ) return;
        // Ignore event with default prevented
        if (e.defaultPrevented || e.getPreventDefault && e.getPreventDefault()) return;

        if(a && a.nodeName && a.nodeName.toLowerCase() === 'a') {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            if(history) {
                window.history.pushState(null, null, a.getAttribute('href'));
            }
            process.call({href: a.getAttribute('href')});
        }
    });
    
    window.addEventListener(history? 'popstate': 'hashchange', process);

}).call(html);
/* END OF ROUTER */