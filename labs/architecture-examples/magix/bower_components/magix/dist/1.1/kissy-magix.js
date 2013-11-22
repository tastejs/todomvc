/**
 * @fileOverview Magix全局对象
 * @author 行列<xinglie.lkf@taobao.com>
 * @version 1.0
 **/
KISSY.add('magix/magix', function(S) {
    var Slice = [].slice;

    var Include = function(path, mxext) {
        var magixPackages = S.Config.packages[mxext ? 'mxext' : 'magix'];
        var mPath = magixPackages.base || magixPackages.path;

        var url = mPath + path + ".js?r=" + Math.random() + '.js';
        var xhr = window.ActiveXObject || window.XMLHttpRequest;
        var r = new xhr('Microsoft.XMLHTTP');
        r.open('GET', url, false);
        r.send(null);
        return r.responseText;
    };
    var PathRelativeReg = /\/\.\/|\/[^\/.]+?\/\.{2}\/|([^:\/])\/\/+|\.{2}\//; // ./|/x/../|(b)///
var PathTrimFileReg = /\/[^\/]*$/;
var PathTrimParamsReg = /[#?].*$/;
var EMPTY = '';
var ParamsReg = /([^=&?\/#]+)=?([^&=#?]*)/g;
var PATHNAME = 'pathname';
var ProtocalReg = /^https?:\/\//i;
//var Templates = {};
var CacheLatest = 0;
var Slash = '/';
var DefaultTagName = 'vframe';
/**
待重写的方法
@method imimpl
**/
var Unimpl = function() {
    throw new Error('unimplement method');
};
/**
 * 空方法
 */
var Noop = function() {};

var Cfg = {
    tagName: DefaultTagName,
    rootId: 'magix_vf_root',
    execError: Noop
};
var HasProp = Cfg.hasOwnProperty;
/**
 * 检测某个对象是否拥有某个属性
 * @param  {Object}  owner 检测对象
 * @param  {String}  prop  属性
 * @return {Boolean} 是否拥有prop属性
 */
var Has = function(owner, prop) {
    return owner ? HasProp.call(owner, prop) : owner; //false 0 null '' undefined
};
var GSObj = function(o) {
    return function(k, v, r) {
        switch (arguments.length) {
            case 0:
                r = o;
                break;
            case 1:
                if (Magix.isObject(k)) {
                    r = Mix(o, k);
                } else {
                    r = Has(o, k) ? o[k] : null;
                }
                break;
            case 2:
                if (v === null) {
                    delete o[k];
                    r = v;
                } else {
                    o[k] = r = v;
                }
                break;
        }
        return r;
    };
};
var CacheSort = function(a, b) {
    return b.f == a.f ? b.t - a.t : b.f - a.f;
};
var Cache = function(max, buffer) {
    var me = this;
    if (!me.get) return new Cache(max, buffer);
    me.c = [];
    me.x = max || 20;
    me.b = me.x + (isNaN(buffer) ? 5 : buffer);
};

/**
 * 混合对象的属性
 * @param  {Object} aim    要mix的目标对象
 * @param  {Object} src    mix的来源对象
 * @param  {Object} ignore 在复制时，忽略的值
 * @return {Object}
 */
var Mix = function(aim, src, ignore) {
    for (var p in src) {
        if (!ignore || !Has(ignore, p)) {
            aim[p] = src[p];
        }
    }
    return aim;
};

Mix(Cache.prototype, {
    get: function(key) {
        var me = this;
        var c = me.c;
        var r;
        key = PATHNAME + key;
        if (Has(c, key)) {
            r = c[key];
            if (r.f >= 1) {
                r.f++;
                r.t = CacheLatest++;
                //
                r = r.v;
                //
            }
        }
        return r;
    },
    set: function(okey, value, onRemove) {
        var me = this;
        var c = me.c;

        var key = PATHNAME + okey;
        var r = c[key];

        if (!Has(c, key)) {
            if (c.length >= me.b) {
                c.sort(CacheSort);
                var t = me.b - me.x;
                while (t--) {
                    r = c.pop();
                    //
                    delete c[r.k];
                    if (r.m) {
                        SafeExec(r.m, r.o, r);
                    }
                }
            }
            r = {};
            c.push(r);
            c[key] = r;
        }
        r.o = okey;
        r.k = key;
        r.v = value;
        r.f = 1;
        r.t = CacheLatest++;
        r.m = onRemove;
        return value;
    },
    del: function(k) {
        k = PATHNAME + k;
        var c = this.c;
        var r = c[k];
        if (r) {
            r.f = -1E5;
            r.v = EMPTY;
            delete c[k];
            if (r.m) {
                SafeExec(r.m, r.o, r);
                r.m = EMPTY;
            }
        }
    },
    has: function(k) {
        k = PATHNAME + k;
        return Has(this.c, k);
    }
});

var PathToObjCache = Cache(60);
var PathCache = Cache();

/**
 * 以try cache方式执行方法，忽略掉任何异常
 * @param  {Array} fns     函数数组
 * @param  {Array} args    参数数组
 * @param  {Object} context 在待执行的方法内部，this的指向
 * @return {Object} 返回执行的最后一个方法的返回值
 */
var SafeExec = function(fns, args, context, i, r, e) {
    if (!Magix.isArray(fns)) {
        fns = [fns];
    }
    if (!args || (!Magix.isArray(args) && !args.callee)) {
        args = [args];
    }
    for (i = 0; i < fns.length; i++) {
        
        e = fns[i];
        r = e && e.apply(context, args);
        
             
        
    }
    return r;
};


/**
 * Magix对象，提供常用方法
 * @name Magix
 * @namespace
 */
var Magix = {
    /**
     * @lends Magix
     */
    /**
     * 判断o是否为数组
     * @function
     * @param {Object} o 待检测的对象
     * @return {Boolean}
     */
    
    /**
     * 判断o是否为对象
     * @function
     * @param {Object} o 待检测的对象
     * @return {Boolean}
     */
    
    /**
     * 判断o是否为函数
     * @function
     * @param {Object} o 待检测的对象
     * @return {Boolean}
     */
    
    /**
     * 判断o是否为正则
     * @function
     * @param {Object} o 待检测的对象
     * @return {Boolean}
     */
    
    /**
     * 判断o是否为字符串
     * @function
     * @param {Object} o 待检测的对象
     * @return {Boolean}
     */
    
    /**
     * 判断o是否为数字
     * @function
     * @param {Object} o 待检测的对象
     * @return {Boolean}
     */
    
    /**
     * 判断是否可转为数字
     * @param  {Object}  o 待检测的对象
     * @return {Boolean}
     */
    isNumeric: function(o) {
        return !isNaN(parseFloat(o)) && isFinite(o);
    },
    /**
     * 利用底层类库的包机制加载js文件，仅Magix内部使用，不推荐在app中使用
     * @function
     * @param {String} name 形如app/views/home这样的字符串
     * @param {Function} fn 加载完成后的回调方法
     * @private
     */
    
    /**
     * 通过xhr同步获取文件的内容，仅开发magix自身时使用
     * @function
     * @param {String} path 文件路径
     * @return {String} 文件内容
     * @private
     */
    
    /**
     * 把src对象的值混入到aim对象上
     * @function
     * @param  {Object} aim    要mix的目标对象
     * @param  {Object} src    mix的来源对象
     * @param  {Object} [ignore] 在复制时，需要忽略的key
     * @example
     *   var o1={
     *       a:10
     *   };
     *   var o2={
     *       b:20,
     *       c:30
     *   };
     *
     *   Magix.mix(o1,o2);//{a:10,b:20,c:30}
     *
     *   Magix.mix(o1,o2,{c:true});//{a:10,b:20}
     *
     *
     * @return {Object}
     */
    mix: Mix,
    /**
     * 未实现的方法
     * @function
     * @type {Function}
     * @private
     */
    
    /**
     * 检测某个对象是否拥有某个属性
     * @function
     * @param  {Object}  owner 检测对象
     * @param  {String}  prop  属性
     * @example
     *   var obj={
     *       key1:undefined,
     *       key2:0
     *   }
     *
     *   Magix.has(obj,'key1');//true
     *   Magix.has(obj,'key2');//true
     *   Magix.has(obj,'key3');//false
     *
     *
     * @return {Boolean} 是否拥有prop属性
     */
    has: Has,
    /**
     * 以try catch的方式执行方法，忽略掉任何异常
     * @function
     * @param  {Array} fns     函数数组
     * @param  {Array} args    参数数组
     * @param  {Object} context 在待执行的方法内部，this的指向
     * @return {Object} 返回执行的最后一个方法的返回值
     * @example
     * var f1=function(){
     *      throw new Error('msg');
     * };
     *
     * var f2=function(msg){
     *      return 'new_'+msg;
     * };
     *
     * var result=Magix.safeExec([f1,f2],new Date().getTime());
     *
     * S.log(result);//得到f2的返回值
     */
    safeExec: SafeExec,
    /**
     * 空方法
     * @function
     */
    noop: Noop,
    /**
     * 配置信息对象
     */
    /**
     * 设置或获取配置信息
     * @function
     * @param {Object} [cfg] 配置信息对象
     * @return {Object} 配置信息对象
     * @example
     * Magix.config({
     *      naviveHistory:true,
     *      rootId:'J_app_main'
     * });
     *
     * var config=Magix.config();
     *
     * S.log(config.rootId);
     */
    config: GSObj(Cfg),
    /**
     * 应用初始化入口
     * @param  {Object} cfg 初始化配置参数对象
     * @param {Boolean} cfg.nativeHistory 是否使用history state,当为true，并且浏览器支持的情况下会用history.pushState修改url，您应该确保服务器能给予支持。如果nativeHistory为false将使用hash修改url
     * @param {String} cfg.defaultView 默认加载的view
     * @param {String} cfg.defaultPathname 默认view对应的pathname
     * @param {String} cfg.notFoundView 404时加载的view
     * @param {Object} cfg.routes pathname与view映射关系表
     * @param {String} cfg.iniFile ini文件位置
     * @param {String} cfg.rootId 根view的id
     * @param {Array} cfg.extensions 需要加载的扩展
     * @param {Function} cfg.execError 发布版以try catch执行一些用户重写的核心流程，当出错时，允许开发者通过该配置项进行捕获。注意：您不应该在该方法内再次抛出任何错误！
     * @example
     * Magix.start({
     *      useHistoryState:true,
     *      rootId:'J_app_main',
     *      iniFile:'',//是否有ini配置文件
     *      defaultView:'app/views/layouts/default',//默认加载的view
     *      defaultPathname:'/home',
     *      routes:{
     *          "/home":"app/views/layouts/default"
     *      }
     * });
     */
    start: function(cfg) {
        var me = this;
        Mix(Cfg, cfg);
        me.libRequire(Cfg.iniFile, function(I) {
            Cfg = Mix(Cfg, I, cfg);
            Cfg['!tnc'] = Cfg.tagName != DefaultTagName;

            var progress = Cfg.progress;
            me.libRequire(['magix/router', 'magix/vom'], function(R, V) {
                R.on('!ul', V.locChged);
                R.on('changed', V.locChged);
                if (progress) {
                    V.on('progress', progress);
                }
                me.libRequire(Cfg.extensions, R.start);
            });
        });
    },
    /**
     * 获取对象的keys
     * @function
     * @param  {Object} obj 要获取key的对象
     * @example
     *    var obj={
     *        key1:20,
     *        key2:60,
     *        a:3
     *    };
     *
     *    Magix.keys(obj);//['key1','key2','a']
     *
     * @return {Array}
     */
    keys: Object.keys || function(obj) {
        var keys = [];
        for (var p in obj) {
            if (Has(obj, p)) {
                keys.push(p);
            }
        }
        return keys;
    },
    /**
     * 获取或设置本地数据，您可以把整个app需要共享的数据，通过该方法进行全局存储，方便您在任意view中访问这份数据
     * @function
     * @param {String|Object} key 获取或设置数据的key
     * @param {[type]} [val] 设置的对象
     * @return {Object|Undefined}
     * @example
     * Magix.local({//以对象的形式存值
     *      userId:'58782'
     * });
     *
     * Magix.local('userName','xinglie.lkf');
     *
     * var userId=Magix.local('userId');//获取userId
     *
     * var locals=Magix.local();//获取所有的值
     *
     * S.log(locals);
     */
    local: GSObj({}),
    /**
     * 路径
     * @param  {String} url  参考地址
     * @param  {String} part 相对参考地址的片断
     * @return {String}
     * @example
     * http://www.a.com/a/b.html?a=b#!/home?e=f   /   => http://www.a.com/
     * http://www.a.com/a/b.html?a=b#!/home?e=f   ./     =>http://www.a.com/a/
     * http://www.a.com/a/b.html?a=b#!/home?e=f   ../../    => http://www.a.com/
     * http://www.a.com/a/b.html?a=b#!/home?e=f   ./../  => http://www.a.com/
     */
    path: function(url, part) {
        var key = url + '\n' + part;
        var result = PathCache.get(key);
        if (!result) {
            if (ProtocalReg.test(part)) {
                result = part;
            } else {
                url = url.replace(PathTrimParamsReg, EMPTY).replace(PathTrimFileReg, EMPTY) + Slash;

                if (part.charAt(0) == Slash) {
                    var ds = ProtocalReg.test(url) ? 8 : 0;
                    var fs = url.indexOf(Slash, ds);

                    /* if(fs==-1){
                        result=url+part;
                    }else{*/
                    result = url.substring(0, fs) + part;
                    //}

                } else {
                    result = url + part;
                }
            }
            while (PathRelativeReg.test(result)) {
                //
                result = result.replace(PathRelativeReg, '$1/');
            }
            PathCache.set(key, result);
        }
        return result;
    },
    /**
     * 把路径字符串转换成对象
     * @param  {String} path 路径字符串
     * @param {Boolean} decode 是否对value进行decodeURIComponent
     * @return {Object} 解析后的对象
     * @example
     * var obj=Magix.pathToObject('/xxx/?a=b&c=d');
     * //obj={pathname:'/xxx/',params:{a:'b',c:'d'}}
     */
    pathToObject: function(path, decode) {
        //把形如 /xxx/a=b&c=d 转换成对象 {pathname:'/xxx/',params:{a:'b',c:'d'}}
        //1. /xxx/a.b.c.html?a=b&c=d  pathname /xxx/a.b.c.html
        //2. /xxx/?a=b&c=d  pathname /xxx/
        //3. /xxx/#?a=b => pathname /xxx/
        //4. /xxx/index.html# => pathname /xxx/index.html
        //5. /xxx/index.html  => pathname /xxx/index.html
        //6. /xxx/#           => pathname /xxx/
        //7. a=b&c=d          => pathname ''
        //8. /s?src=b#        => pathname /s params:{src:'b'}
        var r = PathToObjCache.get(path);
        if (!r) {
            r = {};
            var params = {};

            var pathname = EMPTY;
            if (PathTrimParamsReg.test(path)) { //有#?号，表示有pathname
                pathname = path.replace(PathTrimParamsReg, EMPTY);
            } else if (!~path.indexOf('=')) { //没有=号，路径可能是 xxx 相对路径
                pathname = path;
            }
            var querys = path.replace(pathname, EMPTY);
            if (pathname) {
                if (ProtocalReg.test(pathname)) { //解析以https?:开头的网址
                    var first = pathname.indexOf(Slash, 8); //找最近的 /
                    if (~first) {
                        pathname = pathname.substring(first); //截取
                    } else { //未找到，比如 http://etao.com
                        pathname = Slash; //则pathname为  /
                    }
                }
            }
            querys.replace(ParamsReg, function(match, name, value) {
                if (decode) {
                    try {
                        value = decodeURIComponent(value);
                    } catch (e) {

                    }
                }
                params[name] = value;
            });
            r[PATHNAME] = pathname;
            r.params = params;
            PathToObjCache.set(path, r);
        }
        return r;
    },
    /**
     * 把对象内容转换成字符串路径
     * @param  {Object} obj 对象
     * @param {Boolean} [encode] 是否对value进行encodeURIComponent
     * @param {Object} [keo] 是否保留空白值的对象
     * @return {String} 字符串路径
     * @example
     * var str=Magix.objectToPath({pathname:'/xxx/',params:{a:'b',c:'d'}});
     * //str==/xxx/?a=b&c=d
     *
     * var str=Magix.objectToPath({pathname:'/xxx/',params:{a:'',c:2}});
     *
     * //str==/xxx/?c=2
     *
     * var str=Magix.objectToPath({pathname:'/xxx/',params:{a:'',c:2}},{a:1});
     *
     * //str==/xxx/?a=&c=2
     */
    objectToPath: function(obj, encode, keo) { //上个方法的逆向
        var pn = obj[PATHNAME];
        var params = [];
        var oPs = obj.params;
        var v;
        for (var p in oPs) {
            v = oPs[p];
            if (!keo || v || Has(keo, p)) {
                if (encode) {
                    v = encodeURIComponent(v);
                }
                params.push(p + '=' + v);
            }
        }
        if (params.length) {
            pn = pn + '?' + params.join('&');
        }
        return pn;
    },
    /**
     * 读取或设置view的模板
     * @param  {String} key   形如~seed/app/common/footer的字符串
     * @param  {String} [value] 模板字符串
     * @return {String}
     */
    /*tmpl: function(key, value) {
        if (arguments.length == 1) {
            return {
                v: Templates[key],
                h: has(Templates, key)
            };
        }
        Templates[key] = value;
        return value;
    },*/
    /**
     * 把列表转化成hash对象
     * @param  {Array} list 源数组
     * @param  {String} key  以数组中对象的哪个key的value做为hahs的key
     * @return {Object}
     * @example
     * var map=Magix.listToMap([1,2,3,5,6]);
     * //=> {1:1,2:1,3:1,4:1,5:1,6:1}
     *
     * var map=Magix.listToMap([{id:20},{id:30},{id:40}],'id');
     * //=>{20:{id:20},30:{id:30},40:{id:40}}
     *
     * var map=Magix.listToMap('submit,focusin,focusout,mouseenter,mouseleave,mousewheel,change');
     *
     * //=>{submit:1,focusin:1,focusout:1,mouseenter:1,mouseleave:1,mousewheel:1,change:1}
     *
     */
    listToMap: function(list, key) {
        var i, e, map = {}, l;
        if (Magix.isString(list)) {
            list = list.split(',');
        }
        if (list && (l = list.length)) {
            for (i = 0; i < l; i++) {
                e = list[i];
                map[key ? e[key] : e] = key ? e : 1;
            }
        }
        return map;
    },
    /**
     * 创建缓存对象
     * @function
     * @param {Integer} max 最大缓存数
     * @param {Integer} buffer 缓冲区大小
     * @example
     * var c=Magix.cache(5,2);//创建一个可缓存5个，且缓存区为2个的缓存对象
     * c.set('key1',{});//缓存
     * c.get('key1');//获取
     * c.del('key1');//删除
     * c.has('key1');//判断
     * //注意：缓存通常配合其它方法使用，不建议单独使用。在Magix中，对路径的解释等使用了缓存。在使用缓存优化性能时，可以达到节省CPU和内存的双赢效果
     */
    cache: Cache
};
    return Mix(Magix, {
        
        libRequire: function(name, fn) {
            if (name) {
                S.use(String(name), function(S) {
                    if (fn) {
                        fn.apply(S, Slice.call(arguments, 1));
                    }
                });
            } else if (fn) {
                fn();
            }
        },
        isArray: S.isArray,
        isFunction: S.isFunction,
        isObject: S.isObject,
        isRegExp: S.isRegExp,
        isString: S.isString,
        isNumber: S.isNumber
    });
});
/**
 * @fileOverview 路由
 * @author 行列
 * @version 1.0
 */
KISSY.add('magix/router',function(S,Magix,Event,SE){
    var WIN = window;
var EMPTY = '';
var PATHNAME = 'pathname';
var VIEW = 'view';

var Has = Magix.has;
var Mix = Magix.mix;
var D = document;
var OKeys = Magix.keys;
var IsUtf8 = /^UTF-8$/i.test(D.charset || D.characterSet || 'UTF-8');
var MxConfig = Magix.config();
var HrefCache = Magix.cache();
var ChgdCache = Magix.cache(40);

var TLoc, LLoc = {
    params: {},
    href: EMPTY
}, Pnr;
var TrimHashReg = /#.*$/,
    TrimQueryReg = /^[^#]*#?!?/;
var PARAMS = 'params';
var UseNativeHistory = MxConfig.nativeHistory;
var SupportState, HashAsNativeHistory;

var IsParam = function(params, r, ps) {
    if (params) {
        ps = this[PARAMS];
        if (Magix.isString(params)) params = params.split(',');
        for (var i = 0; i < params.length; i++) {
            r = Has(ps, params[i]);
            if (r) break;
        }
    }
    return r;
};
var IsPathname = function() {
    return this[PATHNAME];
};
var IsView = function() {
    return this[VIEW];
};


var GetSetParam = function(key, value, me, params) {
    me = this;
    params = me[PARAMS];
    return arguments.length > 1 ? params[key] = value : params[key];
};


var Path = function(path) {
    var o = Magix.pathToObject(path, IsUtf8);
    var pn = o[PATHNAME];
    if (pn && HashAsNativeHistory) { //如果不是以/开头的并且要使用history state,当前浏览器又不支持history state则放hash中的pathname要进行处理
        o[PATHNAME] = Magix.path(WIN.location[PATHNAME], pn);
    }
    return o;
};

//var PathTrimFileParamsReg=/(\/)?[^\/]*[=#]$/;//).replace(,'$1').replace(,EMPTY);
//var PathTrimSearch=/\?.*$/;
/**
 * 路由对象，操作URL
 * @name Router
 * @namespace
 * @borrows Event.on as on
 * @borrows Event.fire as fire
 * @borrows Event.off as off
 * @borrows Event.once as once
 */
var Router = Mix({
    /**
     * @lends Router
     */
    /**
     * 使用history state做为改变url的方式来保存当前页面的状态
     * @function
     * @private
     */
    
    /**
     * 使用hash做为改变url的方式来保存当前页面的状态
     * @function
     * @private
     */
    
    /**
     * 根据地址栏中的pathname获取对应的前端view
     * @param  {String} pathname 形如/list/index这样的pathname
     * @param {Object} loc 内部临时使用的对象
     * @return {Object} 返回形如{view:'app/views/default',pathname:'/home'}这样的对象
     * @private
     */
    viewInfo: function(pathname, loc) {
        var r, result;
        if (!Pnr) {
            Pnr = {
                rs: MxConfig.routes || {},
                nf: MxConfig.notFoundView
            };
            //var home=pathCfg.defaultView;//处理默认加载的view
            //var dPathname=pathCfg.defaultPathname||EMPTY;
            var defaultView = MxConfig.defaultView;
            /*if (!defaultView) {
                throw new Error('unset defaultView');
            }*/
            Pnr.dv = defaultView;
            var defaultPathname = MxConfig.defaultPathname || EMPTY;
            //if(!Magix.isFunction(temp.rs)){
            r = Pnr.rs;
            Pnr.f = Magix.isFunction(r);
            if (!Pnr.f && !r[defaultPathname] && defaultView) {
                r[defaultPathname] = defaultView;
            }
            Pnr[PATHNAME] = defaultPathname;
        }

        if (!pathname) pathname = Pnr[PATHNAME];

        r = Pnr.rs;
        if (Pnr.f) {
            result = r.call(MxConfig, pathname, loc);
        } else {
            result = r[pathname]; //简单的在映射表中找
        }
        return {
            view: result || Pnr.nf || Pnr.dv,
            pathname: result || UseNativeHistory || Pnr.nf ? pathname : Pnr[PATHNAME]
        };
    },
    /**
     * 开始路由工作
     * @private
     */
    start: function() {
        var me = Router;
        var H = WIN.history;

        SupportState = UseNativeHistory && H.pushState;
        HashAsNativeHistory = UseNativeHistory && !SupportState;

        if (SupportState) {
            me.useState();
        } else {
            me.useHash();
        }
        me.route(); //页面首次加载，初始化整个页面
    },

    /**
     * 解析href的query和hash，默认href为window.location.href
     * @param {String} [href] href
     * @return {Object} 解析的对象
     */
    parseQH: function(href, inner) {
        href = href || WIN.location.href;

        var me = Router;
        /*var cfg=Magix.config();
        if(!cfg.originalHREF){
            try{
                href=DECODE(href);//解码有问题 http://fashion.s.etao.com/search?q=%CF%CA%BB%A8&initiative_id=setao_20120529&tbpm=t => error:URIError: malformed URI sequence
            }catch(ignore){

            }
        }*/
        var result = HrefCache.get(href);
        if (!result) {
            var query = href.replace(TrimHashReg, EMPTY);
            //
            //var query=tPathname+params.replace(/^([^#]+).*$/g,'$1');
            var hash = href.replace(TrimQueryReg, EMPTY); //原始hash
            //
            var queryObj = Path(query);
            //
            var hashObj = Path(hash); //去掉可能的！开始符号
            //
            var comObj = {}; //把query和hash解析的参数进行合并，用于hash和pushState之间的过度
            Mix(comObj, queryObj[PARAMS]);
            Mix(comObj, hashObj[PARAMS]);
            result = {
                get: GetSetParam,
                set: GetSetParam,
                href: href,
                refHref: LLoc.href,
                srcQuery: query,
                srcHash: hash,
                query: queryObj,
                hash: hashObj,
                params: comObj
            };
            HrefCache.set(href, result);
        }
        if (inner && !result[VIEW]) {
            //
            var tempPathname;
            /*
                1.在选择pathname时，不能简单的把hash中的覆盖query中的。有可能是从不支持history state浏览器上拷贝链接到支持的浏览器上，分情况而定：
                如果hash中存在pathname则使用hash中的，否则用query中的

                2.如果指定不用history state则直接使用hash中的pathname

                以下是对第1条带hash的讨论
                // http://etao.com/list/?a=b#!/home?page=2&rows=20
                //  /list/index
                //  /home
                //   http://etao.com/list?page=3#!/home?page=2;
                // 情形A. pathname不变 http://etao.com/list?page=3#!/list?page=2 到支持history state的浏览器上 参数合并;
                // 情形B .pathname有变化 http://etao.com/list?page=3#!/home?page=2 到支持history state的浏览器上 参数合并,pathname以hash中的为准;
            */
            if (UseNativeHistory) { //指定使用history state
                /*
                if(me.supportState()){//当前浏览器也支持
                    if(hashObj[PATHNAME]){//优先使用hash中的，理由见上1
                        tempPathname=hashObj[PATHNAME];
                    }else{
                        tempPathname=queryObj[PATHNAME];
                    }
                }else{//指定使用history 但浏览器不支持 说明服务器支持这个路径，规则同上
                    if(hashObj[PATHNAME]){//优先使用hash中的，理由见上1
                        tempPathname=hashObj[PATHNAME];
                    }else{
                        tempPathname=queryObj[PATHNAME];
                    }
                }
                合并后如下：
                */
                //
                tempPathname = result.hash[PATHNAME] || result.query[PATHNAME];
            } else { //指定不用history state ，那咱还能说什么呢，直接用hash
                tempPathname = result.hash[PATHNAME];
            }
            var view = me.viewInfo(tempPathname, result);
            Mix(result, view);
        }
        return result;
    },
    /**
     * 获取2个location对象之间的差异部分
     * @param  {Object} oldLocation 原始的location对象
     * @param  {Object} newLocation 当前的location对象
     * @return {Object} 返回包含差异信息的对象
     * @private
     */
    getChged: function(oldLocation, newLocation) {
        var oKey = oldLocation.href;
        var nKey = newLocation.href;
        var tKey = oKey + '\n' + nKey;
        var result = ChgdCache.get(tKey);
        if (!result) {
            var hasChanged, from, to;
            result = {};
            result[VIEW] = to;
            result[PATHNAME] = to;
            result[PARAMS] = {};
            var tArr = [PATHNAME, VIEW],
                idx, key;
            for (idx = 1; idx >= 0; idx--) {
                key = tArr[idx];
                from = oldLocation[key];
                to = newLocation[key];
                if (from != to) {
                    result[key] = {
                        from: from,
                        to: to
                    };
                    hasChanged = 1;
                }
            }


            var oldParams = oldLocation[PARAMS],
                newParams = newLocation[PARAMS];
            tArr = OKeys(oldParams).concat(OKeys(newParams));
            for (idx = tArr.length - 1; idx >= 0; idx--) {
                key = tArr[idx];
                from = oldParams[key];
                to = newParams[key];
                if (from != to) {
                    result[PARAMS][key] = {
                        from: from,
                        to: to
                    };
                    hasChanged = 1;
                }
            }
            result.occur = hasChanged;
            result.isParam = IsParam;
            result.isPathname = IsPathname;
            result.isView = IsView;
            ChgdCache.set(tKey, result);
        }
        return result;
    },
    /**
     * 根据window.location.href路由并派发相应的事件
     */
    route: function() {
        var me = Router;
        var location = me.parseQH(0, 1);
        var firstFire = !LLoc.get; //是否强制触发的changed，对于首次加载会强制触发一次
        var changed = me.getChged(LLoc, location);
        LLoc = location;
        if (changed.occur) {
            TLoc = location;
            me.fire('changed', {
                location: location,
                changed: changed,
                force: firstFire
            });
        }
    },
    /**
     * 导航到新的地址
     * @param  {Object|String} pn pathname或参数字符串或参数对象
     * @param {String|Object} [params] 参数对象
     * @param {Boolean} [replace] 是否替换当前历史记录
     * @example
     * KISSY.use('magix/router',function(S,R){
     *      R.navigate('/list?page=2&rows=20');//改变pathname和相关的参数，地址栏上的其它参数会进行丢弃，不会保留
     *      R.navigate('page=2&rows=20');//只修改参数，地址栏上的其它参数会保留
     *      R.navigate({//通过对象修改参数，地址栏上的其它参数会保留
     *          page:2,
     *          rows:20
     *      });
     *      R.navigate('/list',{//改变pathname和相关参数，丢弃地址栏上原有的其它参数
     *          page:2,
     *          rows:20
     *      });
     *
     *      //凡是带pathname的修改地址栏，都会把原来地址栏中的参数丢弃
     *
     * });
     */
    navigate: function(pn, params, replace) {
        var me = Router;

        if (!params && Magix.isObject(pn)) {
            params = pn;
            pn = EMPTY;
        }
        if (params) {
            pn = Magix.objectToPath({
                params: params,
                pathname: pn
            }, IsUtf8);
        }
        //TLoc引用
        //pathObj引用
        //
        //temp={params:{},pathname:{}}
        //
        //Mix(temp,TLoc,temp);
        //
        //

        if (pn) {

            var pathObj = Path(pn);
            var temp = {};
            temp[PARAMS] = Mix({}, pathObj[PARAMS]);
            temp[PATHNAME] = pathObj[PATHNAME];

            if (temp[PATHNAME]) {
                if (HashAsNativeHistory) { //指定使用history state但浏览器不支持，需要把query中的存在的参数以空格替换掉
                    var query = TLoc.query[PARAMS];
                    for (var p in query) {
                        if (Has(query, p) && !Has(temp[PARAMS], p)) {
                            temp[PARAMS][p] = EMPTY;
                        }
                    }
                }
            } else {
                var ps = Mix({}, TLoc[PARAMS]);
                temp[PARAMS] = Mix(ps, temp[PARAMS]);
                temp[PATHNAME] = TLoc[PATHNAME];
            }
            var tempPath = Magix.objectToPath(temp, IsUtf8, TLoc.query[PARAMS]);
            var navigate;

            if (SupportState) {
                navigate = tempPath != TLoc.srcQuery;
            } else {
                navigate = tempPath != TLoc.srcHash;
            }

            if (navigate) {

                if (SupportState) { //如果使用pushState
                    me.poped = 1;
                    history[replace ? 'replaceState' : 'pushState'](EMPTY, EMPTY, tempPath);
                    me.route();
                } else {
                    Mix(temp, TLoc, temp);
                    temp.srcHash = tempPath;
                    temp.hash = {
                        params: temp[PARAMS],
                        pathname: temp[PATHNAME]
                    };
                    /*
                        window.onhashchange=function(e){
                        };
                        (function(){
                            location.hash='a';
                            location.hash='b';
                            location.hash='c';
                        }());


                     */
                    me.fire('!ul', {
                        loc: TLoc = temp
                    }); //hack 更新view的location属性
                    tempPath = '#!' + tempPath;
                    if (replace) {
                        location.replace(tempPath);
                    } else {
                        location.hash = tempPath;
                    }
                }
            }
        }
    }

    /**
     * 当window.location.href有改变化时触发
     * @name Router.changed
     * @event
     * @param {Object} e 事件对象
     * @param {Object} e.location 地址解析出来的对象，包括query hash 以及 query和hash合并出来的params等
     * @param {Object} e.changed 有哪些值发生改变的对象，可通过读取该对象下面的pathname,view或params，来识别值是从(from)什么值变成(to)什么值
     * @param {Boolean} e.force 标识是否是第一次强制触发的changed，对于首次加载完Magix，会强制触发一次changed
     */

    /**
     * 当window.location.href有改变化时触发（该事件在扩展中实现）
     * @name Router.change
     * @event
     * @param {Object} e 事件对象
     * @param {Object} e.location 地址解析出来的对象，包括query hash 以及 query和hash合并出来的params等
     * @param {Function} e.back 回退到变化前的地址上，阻止跳转
     */

}, Event);
    Router.useState=function(){
        var me=Router,initialURL=location.href;
        SE.on(WIN,'popstate',function(e){
            var equal=location.href==initialURL;
            if(!me.poped&&equal)return;
            me.poped=1;
            me.route();
        });
    };
    Router.useHash=function(){//extension impl change event
        SE.on(WIN,'hashchange',Router.route);
    };
    return Router;
},{
    requires:["magix/magix","magix/event","event"]
});
/**
 * @fileOverview body事件代理
 * @author 行列<xinglie.lkf@taobao.com>
 * @version 1.0
 **/
KISSY.add('magix/body', function(S, Magix) {
    var Has = Magix.has;
var Mix = Magix.mix;
//依赖类库才能支持冒泡的事件
var DependLibEvents = {};
var RootNode = document.body;
var RootEvents = {};
var MxEvtSplit = String.fromCharCode(26);

var MxOwner = 'mx-owner';
var MxIgnore = 'mx-ei';
var TypesRegCache = {};
var IdCounter = 1 << 16;

var IdIt = function(dom) {
    return dom.id || (dom.id = 'mx-e-' + (IdCounter--));
};
var GetSetAttribute = function(dom, attrKey, attrVal) {
    if (dom && dom.setAttribute) {
        if (attrVal) {
            dom.setAttribute(attrKey, attrVal);
        } else {
            attrVal = dom.getAttribute(attrKey);
        }
    }
    return attrVal;
};
var VOM;
var Body = {
    
    special: function(events) {
        Mix(DependLibEvents, events);
    },
    process: function(e) {
        var target = e.target || e.srcElement;
        while (target && target.nodeType != 1) {
            target = target.parentNode;
        }
        var current = target;
        var eventType = e.type;
        var eventReg = TypesRegCache[eventType] || (TypesRegCache[eventType] = new RegExp(',' + eventType + '(?:,|$)'));
        //
        if (!eventReg.test(GetSetAttribute(target, MxIgnore))) {
            var type = 'mx-' + eventType;
            var info;
            var ignore;
            var arr = [];
            while (current && current != RootNode) { //找事件附近有mx[a-z]+事件的DOM节点
                info = GetSetAttribute(current, type);
                ignore = GetSetAttribute(current, MxIgnore); //current.getAttribute(MxIgnore);
                if (info || eventReg.test(ignore)) {
                    break;
                } else {
                    //
                    arr.push(current);
                    current = current.parentNode;
                }
            }
            if (info) { //有事件
                //找处理事件的vframe
                var vId;
                var ts = info.split(MxEvtSplit);
                if (ts.length > 1) {
                    vId = ts[0];
                    info = ts.pop();
                }
                var handler = GetSetAttribute(current, MxOwner) || vId; //current.getAttribute(MxOwner);
                if (!handler) { //如果没有则找最近的vframe
                    var begin = current;
                    var vfs = VOM.all();
                    while (begin && begin != RootNode) {
                        if (Has(vfs, begin.id)) {
                            GetSetAttribute(current, MxOwner, handler = begin.id);
                            //current.setAttribute(MxOwner,handler=begin.id);
                            break;
                        }
                        begin = begin.parentNode;
                    }
                }
                if (handler) { //有处理的vframe,派发事件，让对应的vframe进行处理

                    var vframe = VOM.get(handler);
                    var view = vframe && vframe.view;
                    if (view) {
                        view.processEvent({
                            info: info,
                            se: e,
                            st: eventType,
                            tId: IdIt(target),
                            cId: IdIt(current)
                        });
                    }
                } else {
                    throw Error('miss ' + MxOwner + ':' + info);
                }
            } else {
                var node;
                while (arr.length) {
                    node = arr.shift();
                    ignore = GetSetAttribute(node, MxIgnore) || ''; //node.getAttribute(MxIgnore);
                    if (!eventReg.test(ignore)) {
                        ignore = ignore + ',' + eventType;
                        GetSetAttribute(node, MxIgnore, ignore);
                        //node.setAttribute(MxIgnore,ignore);
                    }
                }
            }
        }
    },
    on: function(type, vom) {
        var me = this;
        if (!RootEvents[type]) {

            VOM = vom;
            RootEvents[type] = 0;
            var lib = DependLibEvents[type];
            if (lib) {
                me.lib(0, RootNode, type);
            } else {
                RootNode['on' + type] = function(e) {
                    e = e || window.event;
                    if (e) {
                        me.process(e);
                    }
                };
            }
        }
        RootEvents[type]++;
    },
    off: function(type) {
        var me = this;
        var counter = RootEvents[type];
        if (counter > 0) {
            counter--;
            if (!counter) {
                var lib = DependLibEvents[type];
                if (lib) {
                    me.lib(1, RootNode, type);
                } else {
                    RootNode['on' + type] = null;
                }
            }
            RootEvents[type] = counter;
        }
    }
};
    return Body;
}, {
    requires: ['magix/magix']
});
/**
 * @fileOverview 多播事件对象
 * @author 行列<xinglie.lkf@taobao.com>
 * @version 1.0
 **/
KISSY.add("magix/event",function(S,Magix){
    /**
 * 根据名称生成事件数组的key
 * @param {Strig} name 事件名称
 * @return {String} 包装后的key
 */
var GenKey = function(name) {
    return '~' + name;
};

var SafeExec = Magix.safeExec;
/**
 * 多播事件对象
 * @name Event
 * @namespace
 */
var Event = {
    /**
     * @lends Event
     */
    /**
     * 触发事件
     * @param {String} name 事件名称
     * @param {Object} data 事件对象
     * @param {Boolean} remove 事件触发完成后是否移除这个事件的所有监听
     * @param {Boolean} lastToFirst 是否从后向前触发事件的监听列表
     */
    fire: function(name, data, remove, lastToFirst) {
        var key = GenKey(name),
            me = this,
            list = me[key];
        if (list) {
            if (!data) data = {};
            if (!data.type) data.type = name;
            var end = list.length,
                len = end - 1,
                idx, t;
            while (end--) {
                idx = lastToFirst ? end : len - end;
                t = list[idx];
                if (t.d || t.r) {
                    list.splice(idx, 1);
                    len--;
                }
                if (!t.d) SafeExec(t.f, data, me);
            }
        }
        if (remove) {
            delete me[key];
        }
    },
    /**
     * 绑定事件
     * @param {String} name 事件名称
     * @param {Function} fn 事件回调
     * @param {Interger} insert 事件监听插入的位置
     * @example
     * var T=Magix.mix({},Event);
        T.on('done',function(e){
            alert(1);
        });
        T.on('done',function(e){
            alert(2);
            T.off('done',arguments.callee);
        });
        T.on('done',function(e){
            alert(3);
        },0);//监听插入到开始位置

        T.once('done',function(e){
            alert('once');
        });

        T.fire('done',{data:'test'});
        T.fire('done',{data:'test2'});
     */
    on: function(name, fn, insert) {
        var key = GenKey(name);
        var list = this[key] || (this[key] = []);
        if (Magix.isNumeric(insert)) {
            list.splice(insert, 0, {
                f: fn
            });
        } else {
            list.push({
                f: fn,
                r: insert
            });
        }
    },
    /**
     * 解除事件绑定
     * @param {String} name 事件名称
     * @param {Function} fn 事件回调
     */
    off: function(name, fn) {
        var key = GenKey(name),
            list = this[key];
        if (list) {
            if (fn) {
                for (var i = list.length - 1, t; i >= 0; i--) {
                    t = list[i];
                    if (t.f == fn && !t.d) {
                        t.d = 1;
                        break;
                    }
                }
            } else {
                delete this[key];
            }
        }
    },
    /**
     * 绑定事件，触发一次后即解绑
     * @param {String} name 事件名称
     * @param {Function} fn 事件回调
     */
    once: function(name, fn) {
        this.on(name, fn, true);
    }
};
    return Event;
},{
    requires:["magix/magix"]
});
/**
 * @fileOverview Vframe类
 * @author 行列
 * @version 1.0
 */
KISSY.add('magix/vframe',function(S,Magix,Event,BaseView){
    var D = document;
var B = D.body;
var VframeIdCounter = 1 << 16;

var SafeExec = Magix.safeExec;
var EmptyArr = [];
var Slice = EmptyArr.slice;


var Mix = Magix.mix;

var TagName = Magix.config('tagName');
var RootId = Magix.config('rootId');
var TagNameChanged = Magix.config('!tnc');
var Has = Magix.has;

var MxBuild = TagNameChanged ? 'mx-vframe' : 'mx-defer';
var SupportContains = B.contains;

var UseQSA = TagNameChanged && B.querySelectorAll;
var Selector = ' ' + TagName + '[mx-vframe]';

var Alter = 'alter';
var Created = 'created';
var RootVframe;
var GlobalAlter;

var $ = function(id) {
    return typeof id == 'object' ? id : D.getElementById(id);
};
var $$ = function(id, node, arr) {
    node = $(id);
    if (node) {
        arr = UseQSA ? D.querySelectorAll('#' + node.id + Selector) : node.getElementsByTagName(TagName);
    }
    return arr || EmptyArr;
};

var IdIt = function(dom) {
    return dom.id || (dom.id = 'magix_vf_' + (VframeIdCounter--));
};


var NodeIn = function(a, b, r) {
    a = $(a);
    b = $(b);
    if (a && b) {
        if (a !== b) {
            try {
                r = SupportContains ? b.contains(a) : b.compareDocumentPosition(a) & 16;
            } catch (e) {
                r = 0;
            }
        } else {
            r = 1;
        }
    }
    return r;
};
//var ScriptsReg = /<script[^>]*>[\s\S]*?<\/script>/ig;
var RefLoc, RefChged, RefVOM;
/**
 * Vframe类
 * @name Vframe
 * @class
 * @constructor
 * @borrows Event.on as #on
 * @borrows Event.fire as #fire
 * @borrows Event.off as #off
 * @borrows Event.once as #once
 * @param {String} id vframe id
 * @property {String} id vframe id
 * @property {View} view view对象
 * @property {VOM} owner VOM对象
 * @property {Boolean} viewInited view是否完成初始化，即view的inited事件有没有派发
 * @property {String} pId 父vframe的id，如果是根节点则为undefined
 */
var Vframe = function(id) {
    var me = this;
    me.id = id;
    //me.vId=id+'_v';
    me.cM = {};
    me.cC = 0;
    me.rC = 0;
    me.sign = 1 << 30;
    me.rM = {};
    me.owner = RefVOM;
};

Mix(Vframe, {
    /**
     * @lends Vframe
     */
    /**
     * 获取根vframe
     * @param {VOM} vom vom对象
     * @param {Object} refLoc 引用的Router解析出来的location对象
     * @param {Object} refChged 引用的URL变化对象
     * @return {Vframe}
     * @private
     */
    root: function(owner, refLoc, refChged) {
        if (!RootVframe) {
            RefLoc = refLoc;
            RefChged = refChged;
            RefVOM = owner;
            var e = $(RootId);
            if (!e) {
                e = D.createElement(TagName);
                e.id = RootId;
                B.insertBefore(e, B.firstChild);
            }
            RootVframe = new Vframe(RootId);
            owner.add(RootVframe);
        }
        return RootVframe;
    }
});
/*
    修正IE下标签问题
    @2012.11.23
    暂时先不修正，如果页面上有vframe标签先create一下好了，用这么多代码代替一个document.createElement('vframe')太不值得
 */
/*(function(){
    var badVframes=$$(D,'/'+Vframe.tagName);
    var temp=[];
    for(var i=0,j=badVframes.length;i<j;i++){
        temp.push(badVframes[i]);
    }
    badVframes=temp;
    for(var i=0,j=badVframes.length;i<j;i++){
        var bVf=badVframes[i];
        var pv=bVf.previousSibling;
        var rVf=$C(Vframe.tagName);
        var pNode=pv.parentNode;
        var anchorNode=bVf.nextSibling;
        var vframeId;
        var vframeViewName;
        pNode.removeChild(bVf);
        temp=[];
        while(pv){
            if(pv.tagName&&pv.tagName.toLowerCase()==Vframe.tagName){
                vframeId=pv.id;
                vframeViewName=pv.getAttribute('mx-view');
                pNode.removeChild(pv);
                break;
            }else{
                temp.push(pv);
                pv=pv.previousSibling;
            }
        }
        while(temp.length){
            rVf.appendChild(temp.pop());
        }
        pNode.insertBefore(rVf,anchorNode);
        if(vframeId){
            rVf.id=vframeId;
        }
        if(vframeViewName){
            rVf.setAttribute('mx-view',vframeViewName);
        }
    }
}());*/
//

Mix(Mix(Vframe.prototype, Event), {
    /**
     * @lends Vframe#
     */
    /**
     * 是否启用场景转场动画，相关的动画并未在该类中实现，如需动画，需要mxext/vfanim扩展来实现，设计为方法而不是属性可方便针对某些vframe使用动画
     * @return {Boolean}
     * @default false
     * @function
     */
    //useAnimUpdate:Magix.noop,
    /**
     * 转场动画时或当view启用刷新动画时，旧的view销毁时调用
     * @function
     */
    //oldViewDestroy:Magix.noop,
    /**
     * 转场动画时或当view启用刷新动画时，为新view准备好填充的容器
     * @function
     */
    //prepareNextView:Magix.noop,
    /**
     * 转场动画时或当view启用刷新动画时，新的view创建完成时调用
     * @function
     */
    //newViewCreated:Magix.noop,
    /**
     * 加载对应的view
     * @param {String} viewPath 形如:app/views/home?type=1&page=2 这样的view路径
     * @param {Object|Null} viewInitParams 调用view的init方法时传递的参数
     * @param {Function} callback view在触发inited事件后的回调
     */
    mountView: function(viewPath, viewInitParams, callback) {
        var me = this;
        var node = $(me.id);
        if (!node._bak) {
            node._bak = 1;
            node._tmpl = node.innerHTML; //.replace(ScriptsReg, '');
        } else {
            node._chgd = 1;
        }
        //var useTurnaround=me.viewInited&&me.useAnimUpdate();
        me.unmountView();
        if (viewPath) {
            var path = Magix.pathToObject(viewPath);
            var vn = path.pathname;
            var sign = --me.sign;
            Magix.libRequire(vn, function(View) {
                if (sign == me.sign) { //有可能在view载入后，vframe已经卸载了

                    BaseView.prepare(View);

                    var view = new View({
                        owner: me,
                        id: me.id,
                        $: $,
                        path: vn,
                        vom: RefVOM,
                        location: RefLoc
                    });
                    me.view = view;
                    view.on('interact', function(e) { //view准备好后触发
                        if (!e.tmpl) {

                            if (node._chgd) {
                                node.innerHTML = node._tmpl;
                            }

                            me.mountZoneVframes();
                        }
                        view.on('rendered', function() { //再绑定rendered
                            //
                            me.mountZoneVframes();
                        });
                        view.on('prerender', function() {
                            if (!me.unmountZoneVframes(0, 1)) {
                                me.cAlter();
                            }
                        });

                        view.on('inited', function() {
                            me.viewInited = 1;
                            me.fire('viewInited', {
                                view: view
                            });
                            if (callback) {
                                SafeExec(callback, view, me);
                            }
                        });
                    }, 0);
                    viewInitParams = viewInitParams || {};
                    view.load(Mix(viewInitParams, path.params, viewInitParams), RefChged);
                }
            });
        }
    },
    /**
     * 销毁对应的view
     */
    unmountView: function() {
        var me = this;
        if (me.view) {
            if (!GlobalAlter) {
                GlobalAlter = {};
            }
            me.unmountZoneVframes(0, 1);
            me.cAlter(GlobalAlter);
            me.view.oust();
            var node = $(me.id);
            if (node && node._bak) {
                node.innerHTML = node._tmpl;
            }
            delete me.view;
            delete me.viewInited;
            GlobalAlter = 0;
            me.fire('viewUnmounted');
        }
        me.sign--;
    },
    /**
     * 加载vframe
     * @param  {String} id             节点id
     * @param  {String} viewPath       view路径
     * @param  {Object} viewInitParams 传递给view init方法的参数
     * @param {Function} callback view在触发inited事件后的回调
     * @return {Vframe} vframe对象
     * @example
     * //html
     * &lt;div id="magix_vf_defer"&gt;&lt;/div&gt;
     *
     *
     * //js
     * view.owner.mountVframe('magix_vf_defer','app/views/list',{page:2})
     * //注意：动态向某个节点渲染view时，该节点无须是vframe标签
     */
    mountVframe: function(id, viewPath, viewInitParams, callback) {
        var me = this;
        //var vom = me.owner;
        var vf = RefVOM.get(id);
        if (!vf) {
            vf = new Vframe(id);

            vf.pId = me.id;

            if (!Has(me.cM, id)) {
                me.cC++;
            }
            me.cM[id] = 1;
            RefVOM.add(vf);
        }
        vf.mountView(viewPath, viewInitParams, callback);
        return vf;
    },
    /**
     * 加载当前view下面的子view，因为view的持有对象是vframe，所以是加载vframes
     * @param {HTMLElement|String} zoneId 节点对象或id
     * @param {Object} viewInitParams 传递给view init方法的参数
     * @param {Function} callback view在触发inited事件后的回调
     */
    mountZoneVframes: function(zoneId, viewInitParams, callback) {
        var me = this;

        var node = zoneId || me.id;
        me.unmountZoneVframes(node, 1);

        var vframes = $$(node);
        var count = vframes.length;
        var subs = {};

        if (count) {
            for (var i = 0, vframe, key, mxView, mxBuild; i < count; i++) {
                vframe = vframes[i];

                key = IdIt(vframe);
                if (!Has(subs, key)) {
                    mxView = vframe.getAttribute('mx-view');
                    mxBuild = !vframe.getAttribute(MxBuild);
                    mxBuild = mxBuild != TagNameChanged;

                    if (mxBuild || mxView) {
                        me.mountVframe(key, mxView, viewInitParams, callback);
                        var svs = $$(vframe);
                        for (var j = 0, c = svs.length, temp; j < c; j++) {
                            temp = svs[j];
                            subs[IdIt(temp)] = 1;
                        }
                    }
                }
            }
        }
        //if (me.cC == me.rC) { //有可能在渲染某个vframe时，里面有n个vframes，但立即调用了mountZoneVframes，这个下面没有vframes，所以要等待
        me.cCreated();
        //}
    },
    /**
     * 销毁vframe
     * @param  {String} [id]      节点id
     * @param {Boolean} [inner] 内部调用时传递
     */
    unmountVframe: function(id, inner) { //inner 标识是否是由内部调用，外部不应该传递该参数
        var me = this;
        id = id || me.id;
        //var vom = me.owner;
        var vf = RefVOM.get(id);
        if (vf) {
            var fcc = vf.fcc;
            vf.unmountView();
            RefVOM.remove(id, fcc);
            var p = RefVOM.get(vf.pId);
            if (p && Has(p.cM, id)) {
                delete p.cM[id];
                p.cC--;
                if (!inner) {
                    p.cCreated();
                }
            }
        }
    },
    /**
     * 销毁某个区域下面的所有子vframes
     * @param {HTMLElement|String} [zoneId]节点对象或id
     * @param {Boolean} [inner] 内部调用时传递
     */
    unmountZoneVframes: function(zoneId, inner) {
        var me = this;
        var hasVframe;
        var p;
        var cm = me.cM;
        for (p in cm) {
            if (zoneId) {
                if (NodeIn(p, zoneId)) {
                    me.unmountVframe(p, hasVframe = 1);
                }
            } else {
                me.unmountVframe(p, hasVframe = 1);
            }
        }
        if (!inner) {
            me.cCreated();
        }
        return hasVframe;
    },
    /**
     * 调用view中的方法
     * @param  {String} methodName 方法名
     * @param {Object} [args1,args2] 向方法传递的参数
     * @return {Object}
     */
    invokeView: function(methodName) {
        var me = this;
        var view = me.view;
        var fn = me.viewInited && view[methodName];
        var args = Slice.call(arguments, 1);
        var r;
        if (fn) {
            r = SafeExec(fn, args, view);
        }
        return r;
    },
    /**
     * 通知所有的子view创建完成
     * @private
     */
    cCreated: function(e) {
        var me = this;
        if (me.cC == me.rC) {
            var view = me.view;
            if (view && !me.fcc) {
                me.fcc = 1;
                delete me.fca;
                view.fire(Created, e);
                me.fire(Created, e);
            }
            //var vom = me.owner;
            RefVOM.vfCreated();

            var mId = me.id;
            var p = RefVOM.get(me.pId);
            if (p && !Has(p.rM, mId)) {

                p.rM[mId] = p.cM[mId];
                p.rC++;
                p.cCreated(e);

            }
        }
    },
    /**
     * 通知子vframe有变化
     * @private
     */
    cAlter: function(e) {
        var me = this;
        if (!e) e = {};
        delete me.fcc;
        if (!me.fca) {
            var view = me.view;
            var mId = me.id;
            if (view) {
                me.fca = 1;
                view.fire(Alter, e);
                me.fire(Alter, e);
            }
            //var vom = me.owner;
            var p = RefVOM.get(me.pId);

            if (p && Has(p.rM, mId)) {
                p.rC--;
                delete p.rM[mId];
                p.cAlter(e);
            }
        }
    },
    /**
     * 通知当前vframe，地址栏发生变化
     * @private
     */
    locChged: function() {
        var me = this;
        var view = me.view;
        if (view && view.sign > 0 && view.rendered) { //存在view时才进行广播，对于加载中的可在加载完成后通过调用view.location拿到对应的window.location.href对象，对于销毁的也不需要广播

            var isChanged = view.olChanged(RefChged);
            /**
             * 事件对象
             * @type {Object}
             * @ignore
             */
            var args = {
                location: RefLoc,
                changed: RefChged,
                /**
                 * 阻止向所有的子view传递
                 * @ignore
                 */
                prevent: function() {
                    this.cs = EmptyArr;
                },
                /**
                 * 向特定的子view传递
                 * @param  {Array} c 子view数组
                 * @ignore
                 */
                toChildren: function(c) {
                    c = c || EmptyArr;
                    if (Magix.isString(c)) {
                        c = c.split(',');
                    }
                    this.cs = c;
                }
            };
            if (isChanged) { //检测view所关注的相应的参数是否发生了变化
                //safeExec(view.render,[],view);//如果关注的参数有变化，默认调用render方法
                //否定了这个想法，有时关注的参数有变化，不一定需要调用render方法
                SafeExec(view.locationChange, args, view);
            }
            var cs = args.cs || Magix.keys(me.cM);
            //
            for (var i = 0, j = cs.length, vf; i < j; i++) {
                vf = RefVOM.get(cs[i]);
                if (vf) {
                    vf.locChged();
                }
            }
        }
    }
    /**
     * view初始化完成后触发，由于vframe可以渲染不同的view，也就是可以通过mountView来渲染其它view，所以viewInited可能触发多次
     * @name Vframe#viewInited
     * @event
     * @param {Object} e
     */

    /**
     * view卸载时触发，由于vframe可以渲染不同的view，因此该事件可能被触发多次
     * @name Vframe#viewUnmounted
     * @event
     * @param {Object} e
     */

    /**
     * 子孙view修改时触发
     * @name Vframe#alter
     * @event
     * @param {Object} e
     */

    /**
     * 子孙view创建完成时触发
     * @name Vframe#created
     * @event
     * @param {Object} e
     */

    /**
     * vframe销毁时触发
     * @name Vframe#destroy
     * @event
     * @param {Object} e
     */
});

/**
 * Vframe 中的2条线
 * 一：
 *     渲染
 *     每个Vframe有cC(childrenCount)属性和cM(childrenItems)属性
 *
 * 二：
 *     修改与创建完成
 *     每个Vframe有rC(readyCount)属性和rM(readyMap)属性
 *
 *      fca firstChildrenAlter  fcc firstChildrenCreated
 */
    return Vframe;
},{
    requires:["magix/magix","magix/event","magix/view"]
});
/**
 * @fileOverview view类
 * @author 行列
 * @version 1.0
 */
KISSY.add('magix/view', function(S, Magix, Event, Body, IO) {

    var SafeExec = Magix.safeExec;
var Has = Magix.has;
var COMMA = ',';
var EMPTY_ARRAY = [];
var Noop = Magix.noop;
var Mix = Magix.mix;
var WrapAsynUpdateNames = {
    render: 1,
    renderUI: 1
};
var WrapKey = '~';
var WrapFn = function(fn) {
    return function() {
        var me = this;
        var r;
        var u = me.notifyUpdate();
        if (u) {
            r = fn.apply(me, arguments);
        }
        return r;
    };
};

var EvtInfoCache = Magix.cache(40);


var MxEvt = /\smx-(?!view|defer|owner|vframe)[a-z]+\s*=\s*"/g;
var MxEvtSplit = String.fromCharCode(26);
var DefaultLocationChange = function() {
    this.render();
};


var WEvent = {
    prevent: function(e) {
        e = e || this.domEvent;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    stop: function(e) {
        e = e || this.domEvent;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },
    halt: function(e) {
        this.prevent(e);
        this.stop(e);
    }
};
var EvtInfoReg = /(\w+)(?:<(\w+)>)?(?:{([\s\S]*)})?/;
var EvtParamsReg = /(\w+):([^,]+)/g;
var EvtMethodReg = /([$\w]+)<([\w,]+)>/;
/**
 * View类
 * @name View
 * @class
 * @constructor
 * @borrows Event.on as #on
 * @borrows Event.fire as #fire
 * @borrows Event.off as #off
 * @borrows Event.once as #once
 * @param {Object} ops 创建view时，需要附加到view对象上的其它属性
 * @property {String} id 当前view与页面vframe节点对应的id
 * @property {Vframe} owner 拥有当前view的vframe对象
 * @property {Object} vom vom对象
 * @property {Integer} sign view的签名，用于刷新，销毁等的异步标识判断，当view销毁时，该属性是小于等于零的数
 * @property {String} template 当前view对应的模板字符串(当hasTmpl为true时)，该属性在interact事件触发后才存在
 * @property {Boolean} rendered 标识当前view有没有渲染过，即primed事件有没有触发过
 * @property {Object} location window.locaiton.href解析出来的对象
 * @example
 * 关于事件:
 * 示例：
 *   html写法：
 *
 *   &lt;input type="button" mx-click="test{id:100,name:xinglie}" value="test" /&gt;
 *   &lt;a href="http://etao.com" mx-click="test&lt;prevent&gt;{com:etao.com}"&gt;http://etao.com&lt;/a&gt;
 *
 *   view写法：
 *
 *     'test&lt;click&gt;':function(e){
 *          //e.currentId 处理事件的dom节点id(即带有mx-click属性的节点)
 *          //e.targetId 触发事件的dom节点id(即鼠标点中的节点，在currentId里包含其它节点时，currentId与targetId有可能不一样)
 *          //e.params  传递的参数
 *          //e.params.com,e.params.id,e.params.name
 *      },
 *      'test&lt;mousedown&gt;':function(e){
 *
 *       }
 *
 *  //上述示例对test方法标注了click与mousedown事件，也可以合写成：
 *  'test&lt;click,mousedown&gt;':function(e){
 *      alert(e.type);//可通过type识别是哪种事件类型
 *  }
 */


var View = function(ops) {
    var me = this;
    Mix(me, ops);
    me.sign = 1; //标识view是否刷新过，对于托管的函数资源，在回调这个函数时，不但要确保view没有销毁，而且要确保view没有刷新过，如果刷新过则不回调
    SafeExec(View.ms, [ops], me);
};
View.ms = [];
View.prepare = function(oView) {
    var me = this;
    var superclass = oView.superclass;
    if (superclass) {
        me.prepare(superclass.constructor);
    }
    if (!oView[WrapKey]) { //只处理一次
        oView[WrapKey] = 1;
        //oView.extend = me.extend;
        var prop = oView.prototype;
        var old, temp, name, evts, idx, revts = {};
        for (var p in prop) {
            if (Has(prop, p)) {
                old = prop[p];
                temp = p.match(EvtMethodReg);
                if (temp) {
                    name = temp[1];
                    evts = temp[2];
                    evts = evts.split(COMMA);
                    for (idx = evts.length - 1; idx > -1; idx--) {
                        temp = evts[idx];
                        revts[temp] = 1;
                        prop[name + MxEvtSplit + temp] = old;
                    }
                } else if (Has(WrapAsynUpdateNames, p) && old != Noop) {
                    prop[p] = WrapFn(old);
                }
            }
        }
        if (evts) {
            prop.$evts = revts;
        }
    }
};

/**
 * 扩展View
 * @param  {Object} props 扩展到原型上的方法
 * @param  {Function} ctor  在初始化view时进行调用的方法
 * @example
 * KISSY.add('app/tview',function(S,View){
 *     return View.mixin({
 *         test:function(){
 *             alert(this.$attr);
 *         }
 *     },function(){
 *          this.$attr='test';
 *     });
 * },{
 *     requires:['magix/view']
 * });
 * //加入Magix.start的extensions中
 *
 *  Magix.start({
 *      //...
 *      extensions:['app/tview']
 *
 *  });
 *
 * //这样完成后，所有的view对象都会有一个$attr属性和test方法
 * //当前上述功能也可以用继承实现，但继承层次太多时，可以考虑使用扩展来消除多层次的继承
 *
 */
View.mixin = function(props, ctor) {
    if (ctor) View.ms.push(ctor);
    Mix(View.prototype, props);
};

Mix(Mix(View.prototype, Event), {
    /**
     * @lends View#
     */
    /**
     * 使用xhr获取当前view对应的模板内容，仅在开发app阶段时使用，打包上线后html与js打包在一起，不会调用这个方法
     * @function
     * @param {String} path 路径
     * @param {Function} fn 获取完成后的回调
     * @private
     */
    
    /**
     * 渲染view，供最终view开发者覆盖
     * @function
     */
    render: Noop,
    /**
     * 当window.location.href有变化时调用该方法（如果您通过observeLocation指定了相关参数，则这些相关参数有变化时才调用locationChange，否则不会调用），供最终的view开发人员进行覆盖
     * @function
     * @param {Object} e 事件对象
     * @param {Object} e.location window.location.href解析出来的对象
     * @param {Object} e.changed 包含有哪些变化的对象
     * @param {Function} e.prevent 阻止向所有子view传递locationChange的消息
     * @param {Function} e.toChildren 向特定的子view传递locationChange的消息
     * @example
     * //example1
     * locationChange:function(e){
     *     if(e.changed.isPathname()){//pathname的改变
     *         //...
     *         e.prevent();//阻止向所有子view传递改变的消息
     *     }
     * }
     *
     * //example2
     * locationChange:function(e){
     *     if(e.changed.isParam('menu')){//menu参数发生改变
     *         e.toChildren('magix_vf_menus');//只向id为 magix_vf_menus的view传递这个消息
     *     }
     * }
     *
     * //example3
     * //当不调用e.prevent或e.toChildren，则向所有子view传递消息
     * locationChange:function(e){
     *     //...
     * }
     */
    locationChange: Noop,
    /**
     * 初始化方法，供最终的view开发人员进行覆盖
     * @param {Object} extra 初始化时，外部传递的参数
     * @param {Object} locChanged 地址栏变化的相关信息，比如从某个pathname过来的
     * @function
     */
    init: Noop,
    /**
     * 标识当前view是否有模板文件
     * @default true
     */
    hasTmpl: true,
    /**
     * 是否启用DOM事件(test<click,mousedown>事件是否生效)
     * @default true
     * @example
     * 该属性在做浏览器兼容时有用：支持pushState的浏览器阻止a标签的默认行为，转用pushState，不支持时直接a标签跳转，view不启用事件
     * Q:为什么不支持history state的浏览器上还要使用view？
     * A:考虑 http://etao.com/list?page=2#!/list?page=3; 在IE6上，实际的页码是3，但后台生成时候生成的页码是2，<br />所以需要magix/view载入后对相应的a标签链接进行处理成实际的3。用户点击链接时，由于view没启用事件，不会阻止a标签的默认行为，后续才是正确的结果
     */
    enableEvent: true,
    /**
     * view刷新时是否采用动画
     * @type {Boolean}
     */
    //enableAnim:false,
    /**
     * 加载view内容
     * @private
     */
    load: function() {
        var me = this;
        var hasTmpl = me.hasTmpl;
        var args = arguments;
        var sign = me.sign;
        // var tmplReady = Has(me, 'template');
        var ready = function(tmpl) {
            if (sign == me.sign) {
                //if (!tmplReady) {
                me.template = me.wrapMxEvent(tmpl);
                // }
                me.delegateEvents();
                /*
                    关于interact事件的设计 ：
                    首先这个事件是对内的，当然外部也可以用，API文档上就不再体现了

                    interact : view准备好，让外部尽早介入，进行其它事件的监听 ，当这个事件触发时，view有可能已经有html了(无模板的情况)，所以此时外部可以去加载相应的子view了，同时要考虑在调用render方法后，有可能在该方法内通过setViewHTML更新html，所以在使用setViewHTML更新界面前，一定要先监听prerender rendered事件，因此设计了该  interact事件

                 */
                me.fire('interact', {
                    tmpl: hasTmpl
                }, 1); //可交互
                SafeExec(me.init, args, me);
                me.fire('inited', 0, 1);
                SafeExec(me.render, EMPTY_ARRAY, me);
                //
                var noTemplateAndNoRendered = !hasTmpl && !me.rendered; //没模板，调用render后，render里面也没调用setViewHTML

                if (noTemplateAndNoRendered) { //监视有没有在调用render方法内更新view，对于没有模板的view，需要派发一次事件
                    me.rendered = true;
                    me.fire('primed', 0, 1); //primed事件只触发一次
                }
            }
        };
        if (hasTmpl) {
            me.fetchTmpl(ready);
        } else {
            ready();
        }
    },
    /**
     * 通知当前view即将开始进行html的更新
     */
    beginUpdate: function() {
        var me = this;
        if (me.sign > 0 && me.rendered) {
            me.fire('refresh', 0, 1);
            me.fire('prerender');
        }
    },
    /**
     * 通知当前view结束html的更新
     */
    endUpdate: function() {
        var me = this;
        if (me.sign > 0) {
            /*if(me.rendered&&me.enableAnim){
                var owner=me.owner;
                SafeExec(owner.newViewCreated,EMPTY_ARRAY,owner);
            }*/
            if (!me.rendered) { //触发一次primed事件
                me.fire('primed', 0, 1);
                me.rendered = true;
            }

            me.fire('rendered'); //可以在rendered事件中访问view.rendered属性

        }
    },
    /**
     * 通知当前view进行更新，与beginUpdate不同的是：begin是开始更新html，notify是开始调用更新的方法，通常render与renderUI已经自动做了处理，对于用户自定义的获取数据并更新界面时，在开始更新前，需要调用一下该方法
     * @return {Integer} 当前view的签名
     */
    notifyUpdate: function() {
        var me = this;
        if (me.sign > 0) {
            me.sign++;
            me.fire('rendercall');
        }
        return me.sign;
    },
    /**
     * 包装mx-event，自动添加vframe id,用于事件发生时，调用该view处理
     * @param {String} html html字符串
     * @returns {String} 返回处理后的字符串
     */
    wrapMxEvent: function(html) {
        return String(html).replace(MxEvt, '$&' + this.id + MxEvtSplit);
    },
    /**
     * 设置view的html内容
     * @param {Strig} html html字符串
     * @example
     * render:function(){
     *     this.setViewHTML(this.template);//渲染界面，当界面复杂时，请考虑用其它方案进行更新
     * }
     */
    /*
        1.首次调用：
            setNodeHTML -> delegate unbubble events -> rendered(事件) -> primed(事件)

        2.再次调用
            refresh(事件) -> prerender(事件) -> undelegate unbubble events -> anim... -> setNodeHTML -> delegate unbubble events -> rendered(事件)

        当prerender、rendered事件触发时，在vframe中

        prerender : unloadSubVframes

        rendered : loadSubVframes
     */
    setViewHTML: function(html) {
        var me = this,
            n;
        me.beginUpdate();
        if (me.sign > 0) {
            n = me.$(me.id);
            if (n) n.innerHTML = html;
        }
        me.endUpdate();
    },
    /**
     * 监视地址栏中的参数或pathname，有变动时，才调用当前view的locationChange方法。通常情况下location有变化就会引起当前view的locationChange被调用，但这会带来一些不必要的麻烦，所以你可以指定地址栏中哪些参数有变化时才引起locationChange调用，使得view只关注与自已需要刷新有关的参数
     * @param {Array|String|Object} args  数组字符串或对象
     * @example
     * return View.extend({
     *      init:function(){
     *          this.observeLocation('page,rows');//关注地址栏中的page rows2个参数的变化，当其中的任意一个改变时，才引起当前view的locationChange被调用
     *          this.observeLocation({
     *              pathname:true//关注pathname的变化
     *          });
     *          //也可以写成下面的形式
     *          //this.observeLocation({
     *          //    keys:['page','rows'],
     *          //    pathname:true
     *          //})
     *      },
     *      locationChange:function(e){
     *          if(e.changed.isParam('page')){};//检测是否是page发生的改变
     *          if(e.changed.isParam('rows')){};//检测是否是rows发生的改变
     *      }
     * });
     */
    observeLocation: function(args) {
        var me = this,
            loc;
        if (!me.$ol) me.$ol = {
            keys: []
        };
        loc = me.$ol;
        var keys = loc.keys;
        if (Magix.isObject(args)) {
            loc.pn = args.pathname;
            args = args.keys;
        }
        if (args) {
            loc.keys = keys.concat(String(args).split(COMMA));
        }
        if (me.locationChange == Noop) {
            me.locationChange = DefaultLocationChange;
        }
    },
    /**
     * 指定监控地址栏中pathname的改变
     * @example
     * return View.extend({
     *      init:function(){
     *          this.observePathname();//关注地址栏中pathname的改变，pathname改变才引起当前view的locationChange被调用
     *      },
     *      locationChange:function(e){
     *          if(e.changed.isPathname()){};//是否是pathname发生的改变
     *      }
     * });
     */
    /*observePathname:function(){
        var me=this;
        if(!me.$loc)me.$loc={};
        me.$loc.pn=true;
    },*/
    /**
     * 指定要监视地址栏中的哪些值有变化时，当前view的locationChange才会被调用。通常情况下location有变化就会引起当前view的locationChange被调用，但这会带来一些不必要的麻烦，所以你可以指定地址栏中哪些值有变化时才引起locationChange调用，使得view只关注与自已需要刷新有关的参数
     * @param {Array|String} keys            key数组或字符串
     * @param {Boolean} observePathname 是否监视pathname
     * @example
     * return View.extend({
     *      init:function(){
     *          this.observeParams('page,rows');//关注地址栏中的page rows2个参数的变化，当其中的任意一个改变时，才引起当前view的locationChange被调用
     *      },
     *      locationChange:function(e){
     *          if(e.changed.isParam('page')){};//检测是否是page发生的改变
     *          if(e.changed.isParam('rows')){};//检测是否是rows发生的改变
     *      }
     * });
     */
    /*observeParams:function(keys){
        var me=this;
        if(!me.$loc)me.$loc={};
        me.$loc.keys=Magix.isArray(keys)?keys:String(keys).split(COMMA);
    },*/
    /**
     * 检测通过observeLocation方法指定的key对应的值有没有发生变化
     * @param {Object} changed 对象
     * @return {Boolean} 是否发生改变
     * @private
     */
    olChanged: function(changed) {
        var me = this;
        var location = me.$ol;
        if (location) {
            var res = 0;
            if (location.pn) {
                res = changed.isPathname();
            }
            if (!res) {
                var keys = location.keys;
                res = changed.isParam(keys);
            }
            return res;
        }
        return 1;
    },

    /**
     * 销毁当前view
     * @private
     */
    oust: function() {
        var me = this;
        if (me.sign > 0) {
            me.sign = 0;
            me.fire('refresh', 0, 1);
            me.fire('destroy', 0, 1, 1);
            me.delegateEvents(1);
        }
        me.sign--;
    },
    /**
     * 获取渲染当前view的父view
     * @return {View}
     */
    /*parentView: function() {
        var me = this,
            vom = me.vom,
            owner = me.owner;
        var pVframe = vom.get(owner.pId),
            r = null;
        if (pVframe && pVframe.viewInited) {
            r = pVframe.view;
        }
        return r;
    },*/
    /**
     * 处理dom事件
     * @param {Object} e 事件信息对象
     * @private
     */
    processEvent: function(e) {
        var me = this;
        if (me.enableEvent && me.sign > 0) {
            var info = e.info;
            var domEvent = e.se;

            var m = EvtInfoCache.get(info);

            if (!m) {
                m = info.match(EvtInfoReg);
                m = {
                    n: m[1],
                    f: m[2],
                    i: m[3],
                    p: {}
                };
                if (m.i) {
                    m.i.replace(EvtParamsReg, function(x, a, b) {
                        m.p[a] = b;
                    });
                }
                EvtInfoCache.set(info, m);
            }
            var name = m.n + MxEvtSplit + e.st;
            var fn = me[name];
            if (fn) {
                var tfn = WEvent[m.f];
                if (tfn) {
                    tfn.call(WEvent, domEvent);
                }
                SafeExec(fn, Mix({
                    currentId: e.cId,
                    targetId: e.tId,
                    type: e.st,
                    domEvent: domEvent,
                    params: m.p
                }, WEvent), me);
            }
        }
    },
    /**
     * 处理代理事件
     * @param {Boolean} bubble  是否冒泡的事件
     * @param {Boolean} dispose 是否销毁
     * @private
     */
    delegateEvents: function(destroy) {
        var me = this;
        var events = me.$evts;
        var fn = destroy ? Body.off : Body.on;
        var vom = me.vom;
        for (var p in events) {
            fn.call(Body, p, vom);
        }
    }
    /**
     * 当您采用setViewHTML方法异步更新html时，通知view做好异步更新的准备，<b>注意:该方法最好和manage，setViewHTML一起使用。当您采用其它方式异步更新整个view的html时，仍需调用该方法</b>，建议对所有的异步更新回调使用manage方法托管，对更新整个view html前，调用beginAsyncUpdate进行更新通知
     * @example
     * // 什么是异步更新html？
     * render:function(){
     *      var _self=this;
     *      var m=new Model({uri:'user:list'});
     *      m.load({
     *          success:_self.manage(function(data){
     *              var html=Mu.to_html(_self.template,data);
     *              _self.setViewHTML(html);
     *          }),
     *          error:_self.manage(function(msg){
     *              _self.setViewHTML(msg);
     *          })
     *      })
     * }
     *
     * //如上所示，当调用render方法时，render方法内部使用model异步获取数据后才完成html的更新则这个render就是采用异步更新html的
     *
     * //异步更新带来的问题：
     * //view对象监听地址栏中的某个参数，当这个参数发生变化时，view调用render方法进行刷新，因为是异步的，所以并不能立即更新界面，
     * //当监控的这个参数连续变化时，view会多次调用render方法进行刷新，由于异步，你并不能保证最后刷新时发出的异步请求最后返回，
     * //有可能先发出的请求后返回，这样就会出现界面与url并不符合的情况，比如tabs的切换和tabPanel的更新，连续点击tab1 tab2 tab3
     * //会引起tabPanel这个view刷新，但是异步返回有可能3先回来2最后回来，会导致明明选中的是tab3，却显示着tab2的内容
     * //所以要么你自已在回调中做判断，要么把上面的示例改写成下面这样的：
     *  render:function(){
     *      var _self=this;
     *      _self.beginAsyncUpdate();//开始异步更新
     *      var m=new Model({uri:'user:list'});
     *      m.load({
     *          success:_self.manage(function(data){
     *              var html=Mu.to_html(_self.template,data);
     *              _self.setViewHTML(html);
     *          }),
     *          error:_self.manage(function(msg){
     *              _self.setViewHTML(msg);
     *          })
     *      });
     *      _self.endAsyncUpdate();//结束异步更新
     * }
     * //其中endAsyncUpdate是备用的，把你的异步更新的代码放begin end之间即可
     * //当然如果在每个异步更新的都需要这样写的话来带来差劲的编码体验，所以View会对render,renderUI,updateUI三个方法自动进行异步更新包装
     * //您在使用这三个方法异步更新html时无须调用beginAsyncUpdate和endAsyncUpdate方法
     * //如果除了这三个方法外你还要添加其它的异步更新方法，可调用View静态方法View.registerAsyncUpdateName来注册自已的方法
     * //请优先考虑使用render renderUI updateUI 这三个方法来实现view的html更新，其中render方法magix会自动调用，您就考虑后2个方法吧
     * //比如这样：
     *
     * renderUI:function(){//当方法名为 render renderUI updateUI时您不需要考虑异步更新带来的问题
     *      var _self=this;
     *      setTimeout(this.manage(function(){
     *          _self.setViewHTML(_self.template);
     *      }),5000);
     * },
     *
     * receiveMessage:function(e){
     *      if(e.action=='render'){
     *          this.renderUI();
     *      }
     * }
     *
     * //当您需要自定义异步更新方法时，可以这样：
     * KISSY.add("app/views/list",function(S,MxView){
     *      var ListView=MxView.extend({
     *          updateHTMLByXHR:function(){
     *              var _self=this;
     *              S.io({
     *                  success:_self.manage(function(html){
     *                      //TODO
     *                      _self.setViewHTML(html);
     *                  })
     *              });
     *          },
     *          receiveMessage:function(e){
     *              if(e.action=='update'){
     *                  this.updateHTMLByXHR();
     *              }
     *          }
     *      });
     *      ListView.registerAsyncUpdateName('updateHTMLByXHR');//注册异步更新html的方法名
     *      return ListView;
     * },{
     *      requires:["magix/view"]
     * })
     * //当您不想托管回调方法，又想消除异步更新带来的隐患时，可以这样：
     *
     * updateHTML:function(){
     *      var _self=this;
     *      var begin=_self.beginAsyncUpdate();//记录异步更新标识
     *      S.io({
     *          success:function(html){
     *              //if(_self.sign){//不托管方法时，您需要自已判断view有没有销毁(使用异步更新标识时，不需要判断exist)
     *                  var end=_self.endAsyncUpdate();//结束异步更新
     *                  if(begin==end){//开始和结束时的标识一样，表示view没有更新过
     *                      _self.setViewHTML(html);
     *                  }
     *              //}
     *          }
     *      });
     * }
     *
     * //顺带说一下signature
     * //并不是所有的异步更新都需要托管，考虑这样的情况：
     *
     * render:function(){
     *      ModelFactory.fetchAll({
     *          type:'User_List',
     *          cacheKey:'User_List'
     *      },function(m){
     *          //render
     *      });
     * },
     * //...
     * click:{
     *      addUser:function(e){
     *          var m=ModelFactory.getIf('User_List');
     *          var userList=m.get("userList");
     *          m.beginTransaction();
     *          userList.push({
     *              id:'xinglie',
     *              name:'xl'
     *          });
     *
     *          m.save({
     *              success:function(){//该回调不太适合托管
     *                  m.endTransaction();
     *                  Helper.tipMsg('添加成功')
     *              },
     *              error:function(msg){//该方法同样不适合托管，当数据保存失败时，需要回滚数据，而如果此时view有刷新或销毁，会导致该方法不被调用，无法达到数据的回滚
     *                  m.rollbackTransaction();
     *                  Helper.tipMsg('添加失败')
     *              }
     *          })
     *
     *      }
     * }
     *
     * //以上click中的方法这样写较合适：
     *
     * click:{
     *      addUser:function(e){
     *          var m=ModelFactory.getIf('User_List');
     *          var userList=m.get("userList");
     *          m.beginTransaction();
     *          userList.push({
     *              id:'xinglie',
     *              name:'xl'
     *          });
     *
     *          var sign=e.view.signature();//获取签名
     *
     *          m.save({
     *              success:function(){//该回调不太适合托管
     *                  m.endTransaction();
     *                  if(sign==e.view.signature()){//相等时表示view即没刷新也没销毁，此时才提示
     *                      Helper.tipMsg('添加成功')
     *                  }
     *              },
     *              error:function(msg){//该方法同样不适合托管，当数据保存失败时，需要回滚数据，而如果此时view有刷新或销毁，会导致该方法不被调用，无法达到数据的回滚
     *                  m.rollbackTransaction();
     *                  if(sign==e.view.signature()){//view即没刷新也没销毁
     *                      Helper.tipMsg('添加失败')
     *                  }
     *              }
     *          })
     *
     *      }
     * }
     *
     * //如果您无法识别哪些需要托管，哪些需要签名，统一使用托管方法就好了
     */
    /*beginAsyncUpdate:function(){
        return this.sign++;//更新sign
    },*/
    /**
     * 获取view在当前状态下的签名，view在刷新或销毁时，均会更新签名。(通过签名可识别view有没有搞过什么动作)
     */
    /*    signature:function(){
        return this.sign;
    },*/
    /**
     * 通知view结束异步更新html
     * @see View#beginAsyncUpdate
     */
    /*endAsyncUpdate:function(){
        return this.sign;
    },*/
    /**
     * 当view调用setViewHTML刷新前触发
     * @name View#prerender
     * @event
     * @param {Object} e
     */

    /**
     * 当view首次完成界面的html设置后触发，view有没有模板均会触发该事件，对于有模板的view，会等到模板取回，第一次调用setViewHTML更新界面后才触发，总之该事件触发后，您就可以访问view的HTML DOM节点对象（该事件仅代表自身的html创建完成，如果需要对整个子view也要监控，请使用created事件）
     * @name View#primed
     * @event
     * @param {Object} e view首次调用render完成界面的创建后触发
     */

    /**
     * 每次调用setViewHTML更新view内容完成后触发
     * @name View#rendered
     * @event
     * @param {Object} e view每次调用setViewHTML完成后触发，当hasTmpl属性为false时，并不会触发该事 件，但会触发primed首次完成创建界面的事件
     */

    /**
     * view销毁时触发
     * @name View#destroy
     * @event
     * @param {Object} e
     */

    /**
     * view调用init方法后触发
     * @name View#inited
     * @event
     * @param {Object} e
     */

    /**
     * view自身和所有子孙view创建完成后触发，常用于要在某个view中统一绑定事件或统一做字段校验，而这个view是由许多子孙view组成的，通过监听该事件可知道子孙view什么时间创建完成（注意：当view中有子view，且该子view是通过程序动态mountView而不是通过mx-view指定时，该事件会也会等待到view创建完成触发，而对于您在某个view中有如下代码：<div><vframe></vframe></div>，有一个空的vframe且未指定mx-view属性，同时您在这个view中没有动态渲染vframe对应的view，则该事件不会触发，magix无法识别出您留空vframe的意图，到底是需要动态mount还是手误，不过在具体应用中，出现空vframe且没有动态mount几乎是不存在的^_^）
     * @name View#created
     * @event
     * @param {Object} e
     * @example
     * init:function(){
     *      this.on('created',function(){
     *          //
     *      })
     * }
     */

    /**
     * view自身和所有子孙view有改动时触发，改动包括刷新和重新mountView，与created一起使用，当view自身和所有子孙view创建完成会触发created，当其中的一个view刷新或重新mountView，会触发childrenAlter，当是刷新时，刷新完成会再次触发created事件，因此这2个事件不只触发一次！！但这2个事件会成对触发，比如触发几次childrenAlter就会触发几次created
     * @name View#alter
     * @event
     * @param {Object} e
     */

    /**
     * 异步更新ui的方法(render,renderUI)被调用前触发
     * @name View#rendercall
     * @event
     * @param {Object} e
     */


    /**
     * 每次调用beginUpdate更新view内容前触发
     * @name View#refresh
     * @event
     * @param {Object} e
     * 与prerender不同的是：refresh触发后即删除监听列表
     */
    /**
     * 当view准备好模板(模板有可能是异步获取的)，调用init和render之前触发。可在该事件内对template进行一次处理
     * @name View#interact
     * @event
     * @param {Object} e
     */
});
    var AppRoot, AppInfo;
    var Suffix = '?t=' + S.now();

    /*var ProcessObject = function(props, proto, enterObject) {
        for (var p in proto) {
            if (S.isObject(proto[p])) {
                if (!Has(props, p)) props[p] = {};
                ProcessObject(props[p], proto[p], 1);
            } else if (enterObject) {
                props[p] = proto[p];
            }
        }
    };*/

    var Tmpls = {}, Locker = {};
    View.prototype.fetchTmpl = function(fn) {
        var me = this;
        var hasTemplate = 'template' in me;
        if (!hasTemplate) {
            if (Has(Tmpls, me.path)) {
                fn(Tmpls[me.path]);
            } else {
                if (!AppRoot) {
                    var name = me.path.substring(0, me.path.indexOf('/'));
                    AppInfo = S.Config.packages[name];
                    AppRoot = AppInfo.base || AppInfo.path;
                }
                var path = me.path;
                if (AppInfo.ignorePackageNameInUri) {
                    path = path.replace(AppInfo.name, '');
                }
                var file = AppRoot + path + '.html';
                var l = Locker[file];
                var onload = function(tmpl) {
                    fn(Tmpls[me.path] = tmpl);
                };
                if (l) {
                    l.push(onload);
                } else {
                    l = Locker[file] = [onload];
                    IO({
                        url: file + Suffix,
                        success: function(x) {
                            SafeExec(l, x);
                            delete Locker[file];
                        },
                        error: function(e, m) {
                            SafeExec(l, m);
                            delete Locker[file];
                        }
                    });
                }
            }
        } else {
            fn(me.template);
        }
    };

    View.extend = function(props, ctor, statics) {
        var me = this;
        var BaseView = function() {
            BaseView.superclass.constructor.apply(this, arguments);
            if (ctor) {
                SafeExec(ctor, arguments, this);
            }
        };
        BaseView.extend = me.extend;
        return S.extend(BaseView, me, props, statics);
    };

    return View;
}, {
    requires: ['magix/magix', 'magix/event', 'magix/body', 'ajax']
});
/**
 * @fileOverview VOM
 * @author 行列
 * @version 1.0
 */
KISSY.add("magix/vom",function(S,Vframe,Magix,Event){
    var Has = Magix.has;
var Mix = Magix.mix;
var VframesCount = 0;
var FirstVframesLoaded = 0;
var LastPercent = 0;
var FirstReady = 0;
var Vframes = {};
var Loc = {};
var Chged = {};
/**
 * VOM对象
 * @name VOM
 * @namespace
 * @borrows Event.on as on
 * @borrows Event.fire as fire
 * @borrows Event.off as off
 * @borrows Event.once as once
 */
var VOM = Magix.mix({
    /**
     * @lends VOM
     */
    /**
     * 获取所有的vframe对象
     * @return {Object}
     */
    all: function() {
        return Vframes;
    },
    /**
     * 注册vframe对象
     * @param {Vframe} vf Vframe对象
     */
    add: function(vf) {
        if (!Has(Vframes, vf.id)) {
            VframesCount++;
            Vframes[vf.id] = vf;
            VOM.fire('add', {
                vframe: vf
            });
        }
    },
    /**
     * 根据vframe的id获取vframe对象
     * @param {String} id vframe的id
     * @return {Vframe|Null} vframe对象
     */
    get: function(id) {
        return Vframes[id];
    },
    /**
     * 删除已注册的vframe对象
     * @param {String} id vframe对象的id
     * @param {Boolean} fcc 内部使用
     */
    remove: function(id, fcc) {
        var vf = Vframes[id];
        if (vf) {
            VframesCount--;
            if (fcc) FirstVframesLoaded--;
            delete Vframes[id];
            VOM.fire('remove', {
                vframe: vf
            });
        }
    },
    /**
     * 通知其中的一个vframe创建完成
     * @private
     */
    vfCreated: function() {
        if (!FirstReady) {
            FirstVframesLoaded++;
            var np = FirstVframesLoaded / VframesCount;
            if (LastPercent < np) {
                VOM.fire('progress', {
                    percent: LastPercent = np
                }, FirstReady = (np == 1));
            }
        }
    },
    /**
     * 向vframe通知地址栏发生变化
     * @param {Object} e 事件对象
     * @param {Object} e.location window.location.href解析出来的对象
     * @param {Object} e.changed 包含有哪些变化的对象
     * @private
     */
    locChged: function(e) {
        var loc = e.loc;
        var hack;
        if (loc) {
            hack = 1;
        } else {
            loc = e.location;
        }
        Mix(Loc, loc);
        if (!hack) {
            Mix(Chged, e.changed);
            var vf = Vframe.root(VOM, Loc, Chged);
            if (Chged.view) {
                vf.mountView(loc.view);
            } else {
                vf.locChged();
            }
        }
    }
    /**
     * view加载完成进度
     * @name VOM.progress
     * @event
     * @param {Object} e
     * @param {Float} e.precent 百分比
     */
    /**
     * 注册vframe对象时触发
     * @name VOM.add
     * @event
     * @param {Object} e
     * @param {Vframe} e.vframe
     */
    /**
     * 删除vframe对象时触发
     * @name VOM.remove
     * @event
     * @param {Object} e
     * @param {Vframe} e.vframe
     */
}, Event);
    return VOM;
},{
    requires:["magix/vframe","magix/magix","magix/event"]
});;document.createElement("vframe");