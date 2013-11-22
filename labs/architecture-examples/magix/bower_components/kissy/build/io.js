/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 13 21:48
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 io/form-serializer
 io/base
 io/xhr-transport-base
 io/sub-domain-transport
 io/xdr-flash-transport
 io/xhr-transport
 io/script-transport
 io/jsonp
 io/form
 io/iframe-transport
 io/methods
 io
*/

/**
 * @ignore
 * form data  serialization util
 * @author yiminghe@gmail.com
 */
KISSY.add('io/form-serializer', function (S, Dom) {
    var rselectTextarea = /^(?:select|textarea)/i,
        rCRLF = /\r?\n/g,
        FormSerializer,
        rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;

    function normalizeCRLF(v) {
        return v.replace(rCRLF, '\r\n');
    }

    return FormSerializer = {
        /**
         * form serialization
         * @method
         * @param {HTMLElement[]|HTMLElement|KISSY.NodeList} forms form elements
         * @return {String} serialized string represent form elements
         * @param {Boolean}[serializeArray=false] See {@link KISSY#method-param} 同名参数
         * @member KISSY.IO
         * @static
         */
        serialize: function (forms, serializeArray) {
            // 名值键值对序列化,数组元素名字前不加 []
            return S.param(FormSerializer.getFormData(forms), undefined, undefined,
                serializeArray || false);
        },

        getFormData: function (forms) {
            var elements = [], data = {};
            S.each(Dom.query(forms), function (el) {
                // form 取其表单元素集合
                // 其他直接取自身
                var subs = el.elements ? S.makeArray(el.elements) : [el];
                elements.push.apply(elements, subs);
            });
            // 对表单元素进行过滤，具备有效值的才保留
            elements = S.filter(elements, function (el) {
                // 有名字
                return el.name &&
                    // 不被禁用
                    !el.disabled &&
                    (
                        // radio,checkbox 被选择了
                        el.checked ||
                            // select 或者 textarea
                            rselectTextarea.test(el.nodeName) ||
                            // input 类型
                            rinput.test(el.type)
                        );

                // 这样子才取值
            });
            S.each(elements, function (el) {
                var val = Dom.val(el), vs;

                // <select></select> select nothing!
                // #297
                if (val === null) {
                    return;
                }

                // 字符串换行平台归一化
                if (S.isArray(val)) {
                    val = S.map(val, normalizeCRLF);
                } else {
                    val = normalizeCRLF(val);
                }

                vs = data[el.name];
                if (!vs) {
                    data[el.name] = val;
                    return;
                }
                if (vs && !S.isArray(vs)) {
                    // 多个元素重名时搞成数组
                    vs = data[el.name] = [vs];
                }
                vs.push.apply(vs, S.makeArray(val));
            });
            return data;
        }
    };
}, {
    requires: ['dom']
});
/**
 * @ignore
 * a scalable client io framework
 * @author yiminghe@gmail.com
 */
KISSY.add('io/base', function (S, CustomEvent, Promise, undefined) {
    var rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget)$/,
        rspace = /\s+/,
        logger = S.getLogger('s/io'),
        mirror = function (s) {
            return s;
        },
        rnoContent = /^(?:GET|HEAD)$/,
        win = S.Env.host,
        location = win.location || {},
        simulatedLocation = /**
         @type KISSY.Uri
         @ignore*/new S.Uri(location.href),
        isLocal = simulatedLocation && rlocalProtocol.test(simulatedLocation.getScheme()),
        transports = {},
        defaultConfig = {
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            async: true,
            serializeArray: true,
            processData: true,
            accepts: {
                xml: 'application/xml, text/xml',
                html: 'text/html',
                text: 'text/plain',
                json: 'application/json, text/javascript',
                '*': '*/*'
            },
            converters: {
                text: {
                    json: S.parseJson,
                    html: mirror,
                    text: mirror,
                    xml: S.parseXML
                }
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            }
        };

    defaultConfig.converters.html = defaultConfig.converters.text;

    function setUpConfig(c) {

        // deep mix,exclude context!
        var context = c.context;
        delete c.context;
        c = S.mix(S.clone(defaultConfig), c, {
            deep: true
        });
        c.context = context || c;

        var data, uri,
            type = c.type,
            dataType = c.dataType;

        uri = c.uri = simulatedLocation.resolve(c.url);

        // see method _getUrlForSend
        c.uri.setQuery('');

        if (!('crossDomain' in c)) {
            c.crossDomain = !c.uri.isSameOriginAs(simulatedLocation);
        }

        type = c.type = type.toUpperCase();
        c.hasContent = !rnoContent.test(type);

        if (c.processData && (data = c.data) && typeof data != 'string') {
            // normalize to string
            c.data = S.param(data, undefined, undefined, c.serializeArray);
        }

        // 数据类型处理链，一步步将前面的数据类型转化成最后一个
        dataType = c.dataType = S.trim(dataType || '*').split(rspace);

        if (!('cache' in c) && S.inArray(dataType[0], ['script', 'jsonp'])) {
            c.cache = false;
        }

        if (!c.hasContent) {
            if (c.data) {
                uri.query.add(S.unparam(c.data));
            }
            if (c.cache === false) {
                uri.query.set('_ksTS', (S.now() + '_' + S.guid()));
            }
        }
        return c;
    }

    /**
     * Return a io object and send request by config.
     *
     * @class KISSY.IO
     * @extends KISSY.Promise
     *
     * @cfg {String} url
     * request destination
     *
     * @cfg {String} type request type.
     * eg: 'get','post'
     * Default to: 'get'
     *
     * @cfg {String} contentType
     * Default to: 'application/x-www-form-urlencoded; charset=UTF-8'
     * Data will always be transmitted to the server using UTF-8 charset
     *
     * @cfg {Object} accepts
     * Default to: depends on DataType.
     * The content type sent in request header that tells the server
     * what kind of response it will accept in return.
     * It is recommended to do so once in the {@link KISSY.IO#method-setupConfig}
     *
     * @cfg {Boolean} async
     * Default to: true
     * whether request is sent asynchronously
     *
     * @cfg {Boolean} cache
     * Default to: true ,false for dataType 'script' and 'jsonp'
     * if set false,will append _ksTs=Date.now() to url automatically
     *
     * @cfg {Object} contents
     * a name-regexp map to determine request data's dataType
     * It is recommended to do so once in the {@link KISSY.IO#method-setupConfig}
     *
     * @cfg {Object} context
     * specify the context of this request 's callback (success,error,complete)
     *
     * @cfg {Object} converters
     * Default to: {text:{json:Json.parse,html:mirror,text:mirror,xml:KISSY.parseXML}}
     * specified how to transform one dataType to another dataType
     * It is recommended to do so once in the {@link KISSY.IO#method-setupConfig}
     *
     * @cfg {Boolean} crossDomain
     * Default to: false for same-domain request,true for cross-domain request
     * if server-side jsonp redirect to another domain, you should set this to true.
     * if you want use script for jsonp for same domain request, you should set this to true.
     *
     * @cfg {Object} data
     * Data sent to server.if processData is true,data will be serialized to String type.
     * if value if an Array, serialization will be based on serializeArray.
     *
     * @cfg {String} dataType
     * return data as a specified type
     * Default to: Based on server contentType header
     * 'xml' : a XML document
     * 'text'/'html': raw server data
     * 'script': evaluate the return data as script
     * 'json': parse the return data as json and return the result as final data
     * 'jsonp': load json data via jsonp
     *
     * @cfg {Object} headers
     * additional name-value header to send along with this request.
     *
     * @cfg {String} jsonp
     * Default to: 'callback'
     * Override the callback function name in a jsonp request. eg:
     * set 'callback2' , then jsonp url will append  'callback2=?'.
     *
     * @cfg {String} jsonpCallback
     * Specify the callback function name for a jsonp request.
     * set this value will replace the auto generated function name.
     * eg:
     * set 'customCall' , then jsonp url will append 'callback=customCall'
     *
     * @cfg {String} mimeType
     * override xhr 's mime type
     *
     * @cfg {String} ifModified
     * whether enter if modified mode.
     * Defaults to false.
     *
     * @cfg {Boolean} processData
     * Default to: true
     * whether data will be serialized as String
     *
     * @cfg {String} scriptCharset
     * only for dataType 'jsonp' and 'script' and 'get' type.
     * force the script to certain charset.
     *
     * @cfg {Function} beforeSend
     * beforeSend(io,config)
     * callback function called before the request is sent.this function has 2 arguments
     *
     * 1. current KISSY io object
     *
     * 2. current io config
     *
     * note: can be used for add progress event listener for native xhr's upload attribute
     * see <a href='http://www.w3.org/TR/XMLHttpRequest/#event-xhr-progress'>XMLHttpRequest2</a>
     *
     * @cfg {Function} success
     * success(data,textStatus,xhr)
     * callback function called if the request succeeds.this function has 3 arguments
     *
     * 1. data returned from this request with type specified by dataType
     *
     * 2. status of this request with type String
     *
     * 3. io object of this request , for details {@link KISSY.IO}
     *
     * @cfg {Function} error
     * success(data,textStatus,xhr)
     * callback function called if the request occurs error.this function has 3 arguments
     *
     * 1. null value
     *
     * 2. status of this request with type String,such as 'timeout','Not Found','parsererror:...'
     *
     * 3. io object of this request , for details {@link KISSY.IO}
     *
     * @cfg {Function} complete
     * success(data,textStatus,xhr)
     * callback function called if the request finished(success or error).this function has 3 arguments
     *
     * 1. null value if error occurs or data returned from server
     *
     * 2. status of this request with type String,such as success:'ok',
     * error:'timeout','Not Found','parsererror:...'
     *
     * 3. io object of this request , for details {@link KISSY.IO}
     *
     * @cfg {Number} timeout
     * Set a timeout(in seconds) for this request.if will call error when timeout
     *
     * @cfg {Boolean} serializeArray
     * whether add [] to data's name when data's value is array in serialization
     *
     * @cfg {Object} xhrFields
     * name-value to set to native xhr.set as xhrFields:{withCredentials:true}
     * note: withCredentials defaults to true.
     *
     * @cfg {String} username
     * a username tobe used in response to HTTP access authentication request
     *
     * @cfg {String} password
     * a password tobe used in response to HTTP access authentication request
     *
     * @cfg {Object} xdr
     * cross domain request config object, contains sub config:
     *
     * xdr.src
     * Default to: KISSY 's flash url
     * flash sender url
     *
     * xdr.use
     * if set to 'use', it will always use flash for cross domain request even in chrome/firefox
     *
     * xdr.subDomain
     * cross sub domain request config object
     *
     * xdr.subDomain.proxy
     * proxy page,eg:     *
     * a.t.cn/a.htm send request to b.t.cn/b.htm:
     *
     * 1. a.htm set <code> document.domain='t.cn' </code>
     *
     * 2. b.t.cn/proxy.htm 's content is <code> &lt;script>document.domain='t.cn'&lt;/script> </code>
     *
     * 3. in a.htm , call <code> IO({xdr:{subDomain:{proxy:'/proxy.htm'}}}) </code>
     *
     */
    function IO(c) {

        var self = this;

        if (!(self instanceof IO)) {
            return new IO(c);
        }

        Promise.call(self);

        c = setUpConfig(c);

        S.mix(self, {
            // 结构化数据，如 json
            responseData: null,
            /**
             * config of current IO instance.
             * @member KISSY.IO
             * @property config
             * @type Object
             */
            config: c || {},
            timeoutTimer: null,

            /**
             * String typed data returned from server
             * @type String
             */
            responseText: null,
            /**
             * xml typed data returned from server
             * @type String
             */
            responseXML: null,
            responseHeadersString: '',
            responseHeaders: null,
            requestHeaders: {},
            /**
             * readyState of current request
             * 0: initialized
             * 1: send
             * 4: completed
             * @type Number
             */
            readyState: 0,
            state: 0,
            /**
             * HTTP statusText of current request
             * @type String
             */
            statusText: null,
            /**
             * HTTP Status Code of current request
             * eg:
             * 200: ok
             * 404: Not Found
             * 500: Server Error
             * @type String
             */
            status: 0,
            transport: null
        });

        Promise.Defer(self);

        var transportConstructor,
            transport;

        /**
         * fired before generating request object
         * @event start
         * @member KISSY.IO
         * @static
         * @param {KISSY.Event.CustomEvent.Object} e
         * @param {KISSY.IO} e.io current io
         */
        IO.fire('start', {
            // 兼容
            ajaxConfig: c,
            io: self
        });

        transportConstructor = transports[c.dataType[0]] || transports['*'];
        transport = new transportConstructor(self);

        self.transport = transport;

        if (c.contentType) {
            self.setRequestHeader('Content-Type', c.contentType);
        }

        var dataType = c.dataType[0],
            i,
            timeout = c.timeout,
            context = c.context,
            headers = c.headers,
            accepts = c.accepts;

        // Set the Accepts header for the server, depending on the dataType
        self.setRequestHeader(
            'Accept',
            dataType && accepts[dataType] ?
                accepts[ dataType ] + (dataType === '*' ? '' : ', */*; q=0.01'  ) :
                accepts[ '*' ]
        );

        // Check for headers option
        for (i in headers) {
            self.setRequestHeader(i, headers[ i ]);
        }


        // allow setup native listener
        // such as xhr.upload.addEventListener('progress', function (ev) {})
        if (c.beforeSend && ( c.beforeSend.call(context, self, c) === false)) {
            return self;
        }

        self.readyState = 1;

        /**
         * fired before sending request
         * @event send
         * @member KISSY.IO
         * @static
         * @param {KISSY.Event.CustomEvent.Object} e
         * @param {KISSY.IO} e.io current io
         */

        IO.fire('send', {
            // 兼容
            ajaxConfig: c,
            io: self
        });

        // Timeout
        if (c.async && timeout > 0) {
            self.timeoutTimer = setTimeout(function () {
                self.abort('timeout');
            }, timeout * 1000);
        }

        try {
            // flag as sending
            self.state = 1;
            transport.send();
        } catch (e) {
            // Propagate exception as error if not done
            if (self.state < 2) {
                S.log(e.stack || e, 'error');
                setTimeout(function () {
                    throw e;
                }, 0);
                self._ioReady(-1, e.message);
                // Simply rethrow otherwise
            } else {
                S.error(e);
            }
        }

        return self;
    }

    S.mix(IO, CustomEvent.targetObject);

    S.mix(IO, {
        /**
         * whether current application is a local application
         * (protocal is file://,widget://,about://)
         * @type {Boolean}
         * @member KISSY.IO
         * @static
         */
        isLocal: isLocal,
        /**
         * name-value object that set default config value for io class
         * @param {Object} setting
         * @member KISSY.IO
         * @static
         */
        setupConfig: function (setting) {
            S.mix(defaultConfig, setting, {
                deep: true
            });
        },
        /**
         * @private
         * @member KISSY.IO
         * @static
         */
        'setupTransport': function (name, fn) {
            transports[name] = fn;
        },
        /**
         * @private
         * @member KISSY.IO
         * @static
         */
        'getTransport': function (name) {
            return transports[name];
        },
        /**
         * get default config value for io request
         * @return {Object}
         * @member KISSY.IO
         * @static
         */
        getConfig: function () {
            return defaultConfig;
        }
    });

    return IO;
}, {
    requires: ['event/custom', 'promise']
});

/*

 // !TODO
 // 去除 event/custom 依赖，用户不载入就不能监听
 // 载入后通过 custom.on(IO,type) 监听


 2012-08-16
 - transform IO to class, remove XhrObject class.
 - support ifModified
 - http://bugs.jquery.com/ticket/8394
 - http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 - https://github.com/kissyteam/kissy/issues/203

 2012-07-18 yiminghe@gmail.com
 - refactor by KISSY.Uri

 2012-2-07 yiminghe@gmail.com
 - 返回 Promise 类型对象，可以链式操作啦！

 2011 yiminghe@gmail.com
 - 借鉴 jquery，优化减少闭包使用

 */
/**
 * @ignore
 * base for xhr and subdomain
 * @author yiminghe@gmail.com
 */
KISSY.add('io/xhr-transport-base', function (S, IO) {
    var OK_CODE = 200,
        win = S.Env.host,
        logger = S.getLogger('s/io'),
    // http://msdn.microsoft.com/en-us/library/cc288060(v=vs.85).aspx
        _XDomainRequest = S.UA.ie > 7 && win['XDomainRequest'],
        NO_CONTENT_CODE = 204,
        NOT_FOUND_CODE = 404,
        NO_CONTENT_CODE2 = 1223,
        XhrTransportBase = {
            proto: {}
        }, lastModifiedCached = {},
        eTagCached = {};

    IO.__lastModifiedCached = lastModifiedCached;
    IO.__eTagCached = eTagCached;

    function createStandardXHR(_, refWin) {
        try {
            return new (refWin || win)['XMLHttpRequest']();
        } catch (e) {
        }
        return undefined;
    }

    function createActiveXHR(_, refWin) {
        try {
            return new (refWin || win)['ActiveXObject']('Microsoft.XMLHTTP');
        } catch (e) {
        }
        return undefined;
    }

    XhrTransportBase.nativeXhr = win['ActiveXObject'] ? function (crossDomain, refWin) {
        // consider ie10
        if (!supportCORS && crossDomain && _XDomainRequest) {
            return new _XDomainRequest();
        }
        // ie7 XMLHttpRequest 不能访问本地文件
        return !IO.isLocal && createStandardXHR(crossDomain, refWin) ||
            createActiveXHR(crossDomain, refWin);
    } : createStandardXHR;

    XhrTransportBase._XDomainRequest = _XDomainRequest;

    var supportCORS = XhrTransportBase.supportCORS =
        ('withCredentials' in XhrTransportBase.nativeXhr());

    function isInstanceOfXDomainRequest(xhr) {
        return _XDomainRequest && (xhr instanceof _XDomainRequest);
    }

    function getIfModifiedKey(c) {
        var ifModified = c.ifModified,
            ifModifiedKey;
        if (ifModified) {
            ifModifiedKey = c.uri;
            if (c.cache === false) {
                ifModifiedKey = ifModifiedKey.clone();
                // remove random timestamp
                // random timestamp is forced to fetch code file from server
                ifModifiedKey.query.remove('_ksTS');
            }
            ifModifiedKey = ifModifiedKey.toString();
        }
        return ifModifiedKey;
    }

    S.mix(XhrTransportBase.proto, {
        sendInternal: function () {
            var self = this,
                io = self.io,
                c = io.config,
                nativeXhr = self.nativeXhr,
                files = c.files,
                type = files ? 'post' : c.type,
                async = c.async,
                username,
                mimeType = io.mimeType,
                requestHeaders = io.requestHeaders || {},
                url = io._getUrlForSend(),
                xhrFields,
                ifModifiedKey = getIfModifiedKey(c),
                cacheValue,
                i;

            if (ifModifiedKey) {
                // if io want a conditional load
                // (response status is 304 and responseText is null)
                // u need to set if-modified-since manually!
                // or else
                // u will always get response status 200 and full responseText
                // which is also conditional load but process transparently by browser
                if (cacheValue = lastModifiedCached[ifModifiedKey]) {
                    requestHeaders['If-Modified-Since'] = cacheValue;
                }
                if (cacheValue = eTagCached[ifModifiedKey]) {
                    requestHeaders['If-None-Match'] = cacheValue;
                }
            }

            xhrFields = c['xhrFields'] || {};

            // must set after open in mobile!
            if ('withCredentials' in xhrFields) {
                if (!supportCORS) {
                    delete xhrFields.withCredentials;
                }
            }

            if (username = c['username']) {
                nativeXhr.open(type, url, async, username, c.password)
            } else {
                nativeXhr.open(type, url, async);
            }

            for (i in xhrFields) {
                try {
                    nativeXhr[ i ] = xhrFields[ i ];
                } catch (e) {
                    logger.error(e);
                }
            }
            // Override mime type if supported
            if (mimeType && nativeXhr.overrideMimeType) {
                nativeXhr.overrideMimeType(mimeType);
            }

            var xRequestHeader = requestHeaders['X-Requested-With'];

            if (xRequestHeader === false) {
                delete requestHeaders['X-Requested-With'];
            }

            // ie<10 XDomainRequest does not support setRequestHeader
            if (typeof nativeXhr.setRequestHeader !== 'undefined') {
                for (i in requestHeaders) {
                    nativeXhr.setRequestHeader(i, requestHeaders[ i ]);
                }
            }

            var sendContent = c.hasContent && c.data || null;

            // support html5 file upload api
            if (files) {
                var originalSentContent = sendContent,
                    data = {};
                if (originalSentContent) {
                    data = S.unparam(originalSentContent);
                }
                data = S.mix(data, files);
                sendContent = new FormData();
                S.each(data, function (vs, k) {
                    if (S.isArray(vs)) {
                        S.each(vs, function (v) {
                            sendContent.append(k + (c.serializeArray ? '[]' : ''), v);
                        });
                    } else {
                        sendContent.append(k, vs);
                    }
                });
            }

            nativeXhr.send(sendContent);

            if (!async || nativeXhr.readyState == 4) {
                self._callback();
            } else {
                // _XDomainRequest 单独的回调机制
                if (isInstanceOfXDomainRequest(nativeXhr)) {
                    nativeXhr.onload = function () {
                        nativeXhr.readyState = 4;
                        nativeXhr.status = 200;
                        self._callback();
                    };
                    nativeXhr.onerror = function () {
                        nativeXhr.readyState = 4;
                        nativeXhr.status = 500;
                        self._callback();
                    };
                } else {
                    nativeXhr.onreadystatechange = function () {
                        self._callback();
                    };
                }
            }
        },
        // 由 io.abort 调用，自己不可以调用 io.abort
        abort: function () {
            this._callback(0, 1);
        },

        _callback: function (event, abort) {
            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occurred
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            var self = this,
                nativeXhr = self.nativeXhr,
                io = self.io,
                ifModifiedKey,
                lastModified,
                eTag,
                statusText,
                xml,
                c = io.config;
            try {
                //abort or complete
                if (abort || nativeXhr.readyState == 4) {
                    // ie6 ActiveObject 设置不恰当属性导致出错
                    if (isInstanceOfXDomainRequest(nativeXhr)) {
                        nativeXhr.onerror = S.noop;
                        nativeXhr.onload = S.noop;
                    } else {
                        // ie6 ActiveObject 只能设置，不能读取这个属性，否则出错！
                        nativeXhr.onreadystatechange = S.noop;
                    }

                    if (abort) {
                        // 完成以后 abort 不要调用
                        if (nativeXhr.readyState !== 4) {
                            nativeXhr.abort();
                        }
                    } else {
                        ifModifiedKey = getIfModifiedKey(c);

                        var status = nativeXhr.status;

                        // _XDomainRequest 不能获取响应头
                        if (!isInstanceOfXDomainRequest(nativeXhr)) {
                            io.responseHeadersString = nativeXhr.getAllResponseHeaders();
                        }

                        if (ifModifiedKey) {
                            lastModified = nativeXhr.getResponseHeader('Last-Modified');
                            eTag = nativeXhr.getResponseHeader('ETag');
                            // if u want to set if-modified-since manually
                            // u need to save last-modified after the first request
                            if (lastModified) {
                                lastModifiedCached[ifModifiedKey] = lastModified;
                            }
                            if (eTag) {
                                eTagCached[eTag] = eTag;
                            }
                        }

                        xml = nativeXhr.responseXML;

                        // Construct response list
                        if (xml && xml.documentElement /* #4958 */) {
                            io.responseXML = xml;
                        }

                        var text = io.responseText = nativeXhr.responseText;

                        // same with old-ie iframe-upload
                        if (c.files && text) {
                            var bodyIndex, lastBodyIndex;
                            if ((bodyIndex = text.indexOf('<body>')) != -1) {
                                lastBodyIndex = text.lastIndexOf('</body>');
                                if (lastBodyIndex == -1) {
                                    lastBodyIndex = text.length;
                                }
                                text = text.slice(bodyIndex + 6, lastBodyIndex);
                            }
                            // same with old-ie logic
                            io.responseText = S.unEscapeHtml(text);
                        }

                        // Firefox throws an exception when accessing
                        // statusText for faulty cross-domain requests
                        try {
                            statusText = nativeXhr.statusText;
                        } catch (e) {
                            logger.error('xhr statusText error: ');
                            logger.error(e);
                            // We normalize with Webkit giving an empty statusText
                            statusText = '';
                        }

                        // Filter status for non standard behaviors
                        // If the request is local and we have data: assume a success
                        // (success with no data won't get notified, that's the best we
                        // can do given current implementations)
                        if (!status && IO.isLocal && !c.crossDomain) {
                            status = io.responseText ? OK_CODE : NOT_FOUND_CODE;
                            // IE - #1450: sometimes returns 1223 when it should be 204
                        } else if (status === NO_CONTENT_CODE2) {
                            status = NO_CONTENT_CODE;
                        }

                        io._ioReady(status, statusText);
                    }
                }
            } catch (e) {
                S.log(e.stack || e, 'error');
                // success throw error
                setTimeout(function () {
                    throw e;
                }, 0);
                nativeXhr.onreadystatechange = S.noop;
                if (!abort) {
                    io._ioReady(-1, e);
                }
            }
        }
    })
    ;

    return XhrTransportBase;
}, {
    requires: ['./base']
});
/**
 * @ignore
 * solve io between sub domains using proxy page
 * @author yiminghe@gmail.com
 */
KISSY.add('io/sub-domain-transport', function (S, XhrTransportBase, Event, Dom) {
    var PROXY_PAGE = '/sub_domain_proxy.html',
        logger= S.getLogger('s/io'),
        doc = S.Env.host.document,
        iframeMap = {
            // hostname:{iframe: , ready:}
        };

    function SubDomainTransport(io) {
        var self = this,
            c = io.config;
        self.io = io;
        c.crossDomain = false;
        logger.info('use SubDomainTransport for: ' + c.url);
    }

    S.augment(SubDomainTransport, XhrTransportBase.proto, {
        // get nativeXhr from iframe document
        // not from current document directly like XhrTransport
        send: function () {
            var self = this,
                c = self.io.config,
                uri = c.uri,
                hostname = uri.getHostname(),
                iframe,
                iframeUri,
                iframeDesc = iframeMap[hostname];

            var proxy = PROXY_PAGE;

            if (c['xdr'] && c['xdr']['subDomain'] && c['xdr']['subDomain'].proxy) {
                proxy = c['xdr']['subDomain'].proxy;
            }

            if (iframeDesc && iframeDesc.ready) {
                self.nativeXhr = XhrTransportBase.nativeXhr(0, iframeDesc.iframe.contentWindow);
                if (self.nativeXhr) {
                    self.sendInternal();
                } else {
                    S.error('document.domain not set correctly!');
                }
                return;
            }

            if (!iframeDesc) {
                iframeDesc = iframeMap[hostname] = {};
                iframe = iframeDesc.iframe = doc.createElement('iframe');
                Dom.css(iframe, {
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px'
                });
                Dom.prepend(iframe, doc.body || doc.documentElement);
                iframeUri = new S.Uri();
                iframeUri.setScheme(uri.getScheme());
                iframeUri.setPort(uri.getPort());
                iframeUri.setHostname(hostname);
                iframeUri.setPath(proxy);
                iframe.src = iframeUri.toString();
            } else {
                iframe = iframeDesc.iframe;
            }

            Event.on(iframe, 'load', _onLoad, self);

        }
    });

    function _onLoad() {
        var self = this,
            c = self.io.config,
            uri = c.uri,
            hostname = uri.getHostname(),
            iframeDesc = iframeMap[hostname];
        iframeDesc.ready = 1;
        Event.detach(iframeDesc.iframe, 'load', _onLoad, self);
        self.send();
    }

    return SubDomainTransport;
}, {
    requires: ['./xhr-transport-base', 'event', 'dom']
});
/**
 * @ignore
 * use flash to accomplish cross domain request, usage scenario ? why not jsonp ?
 * @author yiminghe@gmail.com
 */
KISSY.add('io/xdr-flash-transport', function (S, IO, Dom) {
    var // current running request instances
        maps = {},
        logger= S.getLogger('s/io'),
        ID = 'io_swf',
    // flash transporter
        flash,
        doc = S.Env.host.document,
    // whether create the flash transporter
        init = false;

    // create the flash transporter
    function _swf(uri, _, uid) {
        if (init) {
            return;
        }
        init = true;
        var o = '<object id="' + ID +
                '" type="application/x-shockwave-flash" data="' +
                uri + '" width="0" height="0">' +
                '<param name="movie" value="' +
                uri + '" />' +
                '<param name="FlashVars" value="yid=' +
                _ + '&uid=' +
                uid +
                '&host=KISSY.IO" />' +
                '<param name="allowScriptAccess" value="always" />' +
                '</object>',
            c = doc.createElement('div');
        Dom.prepend(c, doc.body || doc.documentElement);
        c.innerHTML = o;
    }

    function XdrFlashTransport(io) {
        logger.info('use XdrFlashTransport for: ' + io.config.url);
        this.io = io;
    }

    S.augment(XdrFlashTransport, {
        // rewrite send to support flash xdr
        send: function () {
            var self = this,
                io = self.io,
                c = io.config,
                xdr = c['xdr'] || {};
            // 不提供则使用 cdn 默认的 flash
            _swf(xdr.src || (S.Config.base + 'io/assets/io.swf'), 1, 1);
            // 简便起见，用轮训
            if (!flash) {
                setTimeout(function () {
                    self.send();
                }, 200);
                return;
            }
            self._uid = S.guid();
            maps[self._uid] = self;

            // ie67 send 出错？
            flash.send(io._getUrlForSend(), {
                id: self._uid,
                uid: self._uid,
                method: c.type,
                data: c.hasContent && c.data || {}
            });
        },

        abort: function () {
            flash.abort(this._uid);
        },

        _xdrResponse: function (e, o) {
            var self = this,
                ret,
                id = o.id,
                responseText,
                c = o.c,
                io = self.io;

            // need decodeURI to get real value from flash returned value
            if (c && (responseText = c.responseText)) {
                io.responseText = decodeURI(responseText);
            }

            switch (e) {
                case 'success':
                    ret = { status: 200, statusText: 'success' };
                    delete maps[id];
                    break;
                case 'abort':
                    delete maps[id];
                    break;
                case 'timeout':
                case 'transport error':
                case 'failure':
                    delete maps[id];
                    ret = {
                        status: 'status' in c ? c.status : 500,
                        statusText: c.statusText || e
                    };
                    break;
            }
            if (ret) {
                io._ioReady(ret.status, ret.statusText);
            }
        }
    });

    /*called by flash*/
    IO['applyTo'] = function (_, cmd, args) {
        var cmds = cmd.split('.').slice(1),
            func = IO;
        S.each(cmds, function (c) {
            func = func[c];
        });
        func.apply(null, args);
    };

    // when flash is loaded
    IO['xdrReady'] = function () {
        flash = doc.getElementById(ID);
    };

    /*
     when response is returned from server
     @param e response status
     @param o internal data
     */
    IO['xdrResponse'] = function (e, o) {
        var xhr = maps[o.uid];
        xhr && xhr._xdrResponse(e, o);
    };

    return XdrFlashTransport;
}, {
    requires: ['./base', 'dom']
});
/**
 * @ignore
 * io xhr transport class, route subdomain, xdr
 * @author yiminghe@gmail.com
 */
KISSY.add('io/xhr-transport', function (S, IO, XhrTransportBase, SubDomainTransport, XdrFlashTransport) {
    var win = S.Env.host,
        doc = win.document,
        logger = S.getLogger('s/io'),
        _XDomainRequest = XhrTransportBase._XDomainRequest;

    function isSubDomain(hostname) {
        // phonegap does not have doc.domain
        return doc.domain && S.endsWith(hostname, doc.domain);
    }

    /**
     * @class
     * @ignore
     */
    function XhrTransport(io) {
        var c = io.config,
            crossDomain = c.crossDomain,
            self = this,
            xhr,
            xdrCfg = c['xdr'] || {},
            subDomain = xdrCfg.subDomain = xdrCfg.subDomain || {};

        self.io = io;

        if (crossDomain && !XhrTransportBase.supportCORS) {
            // 跨子域
            if (isSubDomain(c.uri.getHostname())) {
                // force to not use sub domain transport
                if (subDomain.proxy !== false) {
                    return new SubDomainTransport(io);
                }
            }

            /*
             ie>7 通过配置 use='flash' 强制使用 flash xdr
             使用 withCredentials 检测是否支持 CORS
             http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
             */
            if ((String(xdrCfg.use) === 'flash' || !_XDomainRequest)) {
                return new XdrFlashTransport(io);
            }
        }

        xhr = self.nativeXhr = XhrTransportBase.nativeXhr(crossDomain);

        var msg='crossDomain: ' + crossDomain + ', use ' +
            (_XDomainRequest && (xhr instanceof _XDomainRequest) ?
                'XDomainRequest' :
                'XhrTransport') + ' for: ' + c.url;
        logger.debug(msg);

        return self;
    }

    S.augment(XhrTransport, XhrTransportBase.proto, {
        send: function () {
            this.sendInternal();
        }
    });

    IO['setupTransport']('*', XhrTransport);

    return IO;
}, {
    requires: ['./base', './xhr-transport-base', './sub-domain-transport', './xdr-flash-transport']
});

/*
 2012-11-28 note ie port problem:
 - ie 的 xhr 可以跨端口发请求，例如 localhost:8888 发请求到 localhost:9999
 - ie iframe 间访问不设置 document.domain 完全不考虑 port！
 - localhost:8888 访问 iframe 内的 localhost:9999

 CORS : http://www.nczonline.net/blog/2010/05/25/cross-domain-io-with-cross-origin-resource-sharing/
 */
/**
 * @ignore
 * script transport for kissy io,
 * modified version of S.getScript,
 * add abort ability
 * @author yiminghe@gmail.com
 */
KISSY.add('io/script-transport', function (S, IO, _, undefined) {
    var win = S.Env.host,
        doc = win.document,
        logger= S.getLogger('s/io'),
        OK_CODE = 200,
        ERROR_CODE = 500;

    IO.setupConfig({
        accepts: {
            script: 'text/javascript, ' +
                'application/javascript, ' +
                'application/ecmascript, ' +
                'application/x-ecmascript'
        },

        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            text: {
                // 如果以 xhr+eval 需要下面的，
                // 否则直接 script node 不需要，引擎自己执行了，
                // 不需要手动 eval
                script: function (text) {
                    S.globalEval(text);
                    return text;
                }
            }
        }
    });

    function ScriptTransport(io) {
        var config = io.config;
        // 优先使用 xhr+eval 来执行脚本, ie 下可以探测到（更多）失败状态
        if (!config.crossDomain) {
            return new (IO['getTransport']('*'))(io);
        }
        this.io = io;
        logger.info('use ScriptTransport for: ' + config.url);
        return this;
    }

    S.augment(ScriptTransport, {
        send: function () {
            var self = this,
                script,
                io = self.io,
                c = io.config,
                head = doc['head'] ||
                    doc.getElementsByTagName('head')[0] ||
                    doc.documentElement;

            self.head = head;
            script = doc.createElement('script');
            self.script = script;
            script.async = true;

            if (c['scriptCharset']) {
                script.charset = c['scriptCharset'];
            }

            script.src = io._getUrlForSend();

            script.onerror =
                script.onload =
                    script.onreadystatechange = function (e) {
                        e = e || win.event;
                        // firefox onerror 没有 type ?!
                        self._callback((e.type || 'error').toLowerCase());
                    };

            head.insertBefore(script, head.firstChild);
        },

        _callback: function (event, abort) {
            var self = this,
                script = self.script,
                io = self.io,
                head = self.head;

            // 防止重复调用,成功后 abort
            if (!script) {
                return;
            }

            if (
                abort ||
                    !script.readyState ||
                    /loaded|complete/.test(script.readyState) ||
                    event == 'error'
                ) {

                script['onerror'] = script.onload = script.onreadystatechange = null;

                // Remove the script
                if (head && script.parentNode) {
                    // ie 报错载入无效 js
                    // 怎么 abort ??
                    // script.src = '#';
                    head.removeChild(script);
                }

                self.script = undefined;
                self.head = undefined;

                // Callback if not abort
                if (!abort && event != 'error') {
                    io._ioReady(OK_CODE, 'success');
                }
                // 非 ie<9 可以判断出来
                else if (event == 'error') {
                    io._ioReady(ERROR_CODE, 'script error');
                }
            }
        },

        abort: function () {
            this._callback(0, 1);
        }
    });

    IO['setupTransport']('script', ScriptTransport);

    return IO;
}, {
    requires: ['./base', './xhr-transport']
});
/**
 * @ignore
 * jsonp transport based on script transport
 * @author yiminghe@gmail.com
 */
KISSY.add('io/jsonp', function (S, IO) {
    var win = S.Env.host;
    IO.setupConfig({
        jsonp: 'callback',
        jsonpCallback: function () {
            // 不使用 now() ，极端情况下可能重复
            return S.guid('jsonp');
        }
    });
    IO.on('start', function (e) {
        var io = e.io,
            c = io.config,
            dataType = c.dataType;
        if (dataType[0] == 'jsonp') {
            // jsonp does not need contentType.
            // https://github.com/kissyteam/kissy/issues/394
            delete c.contentType;
            var response,
                cJsonpCallback = c.jsonpCallback,
                converters,
                jsonpCallback = typeof cJsonpCallback === 'function' ?
                    cJsonpCallback() :
                    cJsonpCallback,
                previous = win[ jsonpCallback ];

            c.uri.query.set(c.jsonp, jsonpCallback);

            // build temporary JSONP function
            win[jsonpCallback] = function (r) {
                // 使用数组，区别：故意调用了 jsonpCallback(undefined) 与 根本没有调用
                // jsonp 返回了数组
                if (arguments.length > 1) {
                    r = S.makeArray(arguments);
                }
                // 先存在内存里, onload 后再读出来处理
                response = [r];
            };

            // cleanup whether success or failure
            io.fin(function () {
                win[ jsonpCallback ] = previous;
                if (previous === undefined) {
                    try {
                        delete win[ jsonpCallback ];
                    } catch (e) {
                    }
                } else if (response) {
                    // after io success handler called
                    // then call original existed jsonpcallback
                    previous(response[0]);
                }
            });

            converters = c.converters;
            converters.script = converters.script || {};

            // script -> jsonp ,jsonp need to see json not as script
            // if ie onload a 404/500 file or all browsers onload an invalid script
            // 404/invalid will be caught here
            // because response is undefined( jsonp callback is never called)
            // error throwed will be caught in conversion step
            // and KISSY will notify user by error callback
            converters.script.json = function () {
                if (!response) {
                    S.error(' not call jsonpCallback: ' + jsonpCallback)
                }
                return response[0];
            };

            dataType.length = 2;
            // 利用 script transport 发送 script 请求
            dataType[0] = 'script';
            dataType[1] = 'json';
        }
    });

    return IO;
}, {
    requires: ['./base']
});
/**
 * @ignore
 * process form config
 * @author yiminghe@gmail.com
 */
KISSY.add('io/form', function (S, IO, Dom, FormSerializer) {

    var win = S.Env.host,
        slice = Array.prototype.slice,
        FormData = win['FormData'];

    IO.on('start', function (e) {
        var io = e.io,
            form,
            d,
            dataType,
            formParam,
            data,
            tmpForm,
            c = io.config;

        // serialize form if needed
        if (tmpForm = c.form) {
            form = Dom.get(tmpForm);
            data = c.data;
            var isUpload = false;
            var files = {};

            var inputs = Dom.query('input', form);
            for (var i = 0, l = inputs.length; i < l; i++) {
                var input = inputs[i];
                if (input.type.toLowerCase() == 'file') {
                    isUpload = true;
                    if (!FormData) {
                        break;
                    }
                    var selected = slice.call(input.files, 0);
                    files[Dom.attr(input, 'name')] = selected.length > 1 ? selected : (selected[0]||null);
                }
            }

            if (isUpload && FormData) {
                c.files = c.files || {};
                S.mix(c.files, files);
                // browser set contentType automatically for FileData
                delete c.contentType;
            }

            // 上传有其他方法
            if (!isUpload || FormData) {
                // when get need encode
                // when FormData exists, only collect non-file type input
                formParam = FormSerializer.getFormData(form);
                if (c.hasContent) {
                    formParam = S.param(formParam, undefined, undefined, c.serializeArray);
                    if (data) {
                        c.data += '&' + formParam;
                    } else {
                        c.data = formParam;
                    }
                } else {
                    // get 直接加到 url
                    c.uri.query.add(formParam);
                }
            } else {
                // for old-ie
                dataType = c.dataType;
                d = dataType[0];
                if (d == '*') {
                    d = 'text';
                }
                dataType.length = 2;
                dataType[0] = 'iframe';
                dataType[1] = d;
            }
        }
    });

    return IO;

}, {
    requires: ['./base', 'dom', './form-serializer']
});
/**
 * @ignore
 * non-refresh upload file with form by iframe
 * @author yiminghe@gmail.com
 */
KISSY.add('io/iframe-transport', function (S, Dom, Event, IO) {
    var doc = S.Env.host.document,
        OK_CODE = 200,
        logger= S.getLogger('s/io'),
        ERROR_CODE = 500,
        BREATH_INTERVAL = 30,
        iframeConverter = S.clone(IO.getConfig().converters.text);

    // https://github.com/kissyteam/kissy/issues/304
    // returned data must be escaped by server for json dataType
    // as data
    // eg:
    // <body>
    // {
    //    "&lt;a&gt;xx&lt;/a&gt;"
    // }
    // </body>
    // text or html dataType is of same effect.
    // same as normal ajax or html5 FileData
    iframeConverter.json = function (str) {
        return S.parseJson(S.unEscapeHtml(str));
    };

    // iframe 内的内容就是 body.innerText
    IO.setupConfig({
        converters: {
            // iframe 到其他类型的转化和 text 一样
            iframe: iframeConverter,
            text: {
                // fake type, just mirror
                iframe: function (text) {
                    return text;
                }
            },
            xml: {
                // fake type, just mirror
                iframe: function (xml) {
                    return xml;
                }
            }
        }
    });

    function createIframe(xhr) {
        var id = S.guid('io-iframe'),
            iframe,
        // empty src, so no history
            src = Dom.getEmptyIframeSrc();

        iframe = xhr.iframe = Dom.create('<iframe ' +
            // ie6 need this when cross domain
            (src ? (' src="' + src + '" ') : '') +
            ' id="' + id + '"' +
            // need name for target of form
            ' name="' + id + '"' +
            ' style="position:absolute;left:-9999px;top:-9999px;"/>');

        Dom.prepend(iframe, doc.body || doc.documentElement);
        return iframe;
    }

    function addDataToForm(query, form, serializeArray) {
        var ret = [], isArray, vs, i, e;
        S.each(query, function (data, k) {
            isArray = S.isArray(data);
            vs = S.makeArray(data);
            // 数组和原生一样对待，创建多个同名输入域
            for (i = 0; i < vs.length; i++) {
                e = doc.createElement('input');
                e.type = 'hidden';
                e.name = k + (isArray && serializeArray ? '[]' : '');
                e.value = vs[i];
                Dom.append(e, form);
                ret.push(e);
            }
        });
        return ret;
    }

    function removeFieldsFromData(fields) {
        Dom.remove(fields);
    }

    function IframeTransport(io) {
        this.io = io;
        logger.info('use IframeTransport for: ' + io.config.url);
    }

    S.augment(IframeTransport, {
        send: function () {

            var self = this,
                io = self.io,
                c = io.config,
                fields,
                iframe,
                query,
                data = c.data,
                form = Dom.get(c.form);

            self.attrs = {
                target: Dom.attr(form, 'target') || '',
                action: Dom.attr(form, 'action') || '',
                // enctype 区分 iframe 与 serialize
                encoding:Dom.attr(form, 'encoding'),
                enctype:Dom.attr(form, 'enctype'),
                method: Dom.attr(form, 'method')
            };
            self.form = form;

            iframe = createIframe(io);

            // set target to iframe to avoid main page refresh
            Dom.attr(form, {
                target: iframe.id,
                action: io._getUrlForSend(),
                method: 'post',
                enctype:'multipart/form-data',
                encoding:'multipart/form-data'
            });

            // unparam to kv map
            if (data) {
                query = S.unparam(data);
            }

            if (query) {
                fields = addDataToForm(query, form, c.serializeArray);
            }

            self.fields = fields;

            function go() {
                Event.on(iframe, 'load error', self._callback, self);
                form.submit();
            }

            // ie6 need a breath
            if (S.UA.ie == 6) {
                setTimeout(go, 0);
            } else {
                // can not setTimeout or else chrome will submit to top window
                go();
            }
        },

        _callback: function (event/*, abort*/) {
            var self = this,
                form = self.form,
                io = self.io,
                eventType = /**
                 @type String
                 @ignore*/event.type,
                iframeDoc,
                iframe = io.iframe;

            // 防止重复调用 , 成功后 abort
            if (!iframe) {
                return;
            }

            // ie6 立即设置 action 设置为空导致白屏
            if (eventType == 'abort' && S.UA.ie == 6) {
                setTimeout(function () {
                    Dom.attr(form, self.attrs);
                }, 0);
            } else {
                Dom.attr(form, self.attrs);
            }

            removeFieldsFromData(this.fields);

            Event.detach(iframe);

            setTimeout(function () {
                // firefox will keep loading if not set timeout
                Dom.remove(iframe);
            }, BREATH_INTERVAL);

            // nullify to prevent memory leak?
            io.iframe = null;

            if (eventType == 'load') {

                try {
                    iframeDoc = iframe.contentWindow.document;
                    // ie<9
                    if (iframeDoc && iframeDoc.body) {
                        // https://github.com/kissyteam/kissy/issues/304
                        io.responseText = Dom.html(iframeDoc.body);
                        // ie still can retrieve xml 's responseText
                        if (S.startsWith(io.responseText, '<?xml')) {
                            io.responseText = undefined;
                        }
                    }
                    // ie<9
                    // http://help.dottoro.com/ljbcjfot.php
                    // http://msdn.microsoft.com/en-us/library/windows/desktop/ms766512(v=vs.85).aspx
                    /*
                     In Internet Explorer, XML documents can also be embedded into HTML documents with the xml HTML elements.
                     To get an XMLDocument object that represents the embedded XML data island,
                     use the XMLDocument property of the xml element.
                     Note that the support for the XMLDocument property has been removed in Internet Explorer 9.
                     */
                    if (iframeDoc && iframeDoc['XMLDocument']) {
                        io.responseXML = iframeDoc['XMLDocument'];
                    }
                    // ie9 firefox chrome
                    else {
                        io.responseXML = iframeDoc;
                    }
                    if (iframeDoc) {
                        io._ioReady(OK_CODE, 'success');
                    } else {
                        // chrome does not throw exception:
                        // Unsafe JavaScript attempt to access frame with URL upload.jss from frame with URL test.html.
                        // Domains, protocols and ports must match.
                        // chrome will get iframeDoc to null
                        // so this error is parser error to normalize all browsers
                        io._ioReady(ERROR_CODE, 'parser error');
                    }
                } catch (e) {
                    // #245 submit to a  cross domain page except chrome
                    io._ioReady(ERROR_CODE, 'parser error');
                }
            } else if (eventType == 'error') {
                io._ioReady(ERROR_CODE, 'error');
            }
        },

        abort: function () {
            this._callback({
                type: 'abort'
            });
        }
    });

    IO['setupTransport']('iframe', IframeTransport);

    return IO;
}, {
    requires: ['dom', 'event', './base']
});
/**
 * @ignore
 * encapsulation of io object. as transaction object in yui3
 * @author yiminghe@gmail.com
 */
KISSY.add('io/methods', function (S, IO, Promise,undefined) {
    var OK_CODE = 200,
        logger = S.getLogger('s/logger'),
        MULTIPLE_CHOICES = 300,
        NOT_MODIFIED = 304,
    // get individual response header from response header str
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg;

    function handleResponseData(io) {

        // text xml 是否原生转化支持
        var text = io.responseText,
            xml = io.responseXML,
            c = io.config,
            converts = c.converters,
            type,
            contentType,
            responseData,
            contents = c.contents,
            dataType = c.dataType;

        // 例如 script 直接是js引擎执行，没有返回值，不需要自己处理初始返回值
        // jsonp 时还需要把 script 转换成 json，后面还得自己来
        if (text || xml) {

            contentType = io.mimeType || io.getResponseHeader('Content-Type');

            // 去除无用的通用格式
            while (dataType[0] == '*') {
                dataType.shift();
            }

            if (!dataType.length) {
                // 获取源数据格式，放在第一个
                for (type in contents) {
                    if (contents[type].test(contentType)) {
                        if (dataType[0] != type) {
                            dataType.unshift(type);
                        }
                        break;
                    }
                }
            }
            // 服务器端没有告知（并且客户端没有 mimetype ）默认 text 类型
            dataType[0] = dataType[0] || 'text';

            // 获得合适的初始数据
            for (var dataTypeIndex = 0; dataTypeIndex < dataType.length; dataTypeIndex++) {
                if (dataType[dataTypeIndex] == 'text' && text !== undefined) {
                    responseData = text;
                    break;
                }
                // 有 xml 值才直接取，否则可能还要从 xml 转
                else if (dataType[dataTypeIndex] == 'xml' && xml !== undefined) {
                    responseData = xml;
                    break;
                }
            }

            if (!responseData) {
                var rawData = {text: text, xml: xml};
                // 看能否从 text xml 转换到合适数据，并设置起始类型为 text/xml
                S.each(['text', 'xml'], function (prevType) {
                    var type = dataType[0],
                        converter = converts[prevType] && converts[prevType][type];
                    if (converter && rawData[prevType]) {
                        dataType.unshift(prevType);
                        responseData = prevType == 'text' ? text : xml;
                        return false;
                    }
                    return undefined;
                });
            }
        }
        var prevType = dataType[0];

        // 按照转化链把初始数据转换成我们想要的数据类型
        for (var i = 1; i < dataType.length; i++) {
            type = dataType[i];

            var converter = converts[prevType] && converts[prevType][type];

            if (!converter) {
                throw 'no covert for ' + prevType + ' => ' + type;
            }
            responseData = converter(responseData);

            prevType = type;
        }

        io.responseData = responseData;
    }

    S.extend(IO, Promise,
        {
            // Caches the header
            setRequestHeader: function (name, value) {
                var self = this;
                self.requestHeaders[ name ] = value;
                return self;
            },

            /**
             * get all response headers as string after request is completed.
             * @member KISSY.IO
             * @return {String}
             */
            getAllResponseHeaders: function () {
                var self = this;
                return self.state === 2 ? self.responseHeadersString : null;
            },

            /**
             * get header value in response to specified header name
             * @param {String} name header name
             * @return {String} header value
             * @member KISSY.IO
             */
            getResponseHeader: function (name) {
                var match, self = this, responseHeaders;
                if (self.state === 2) {
                    if (!(responseHeaders = self.responseHeaders)) {
                        responseHeaders = self.responseHeaders = {};
                        while (( match = rheaders.exec(self.responseHeadersString) )) {
                            responseHeaders[ match[1] ] = match[ 2 ];
                        }
                    }
                    match = responseHeaders[ name ];
                }
                return match === undefined ? null : match;
            },

            // Overrides response content-type header
            overrideMimeType: function (type) {
                var self = this;
                if (!self.state) {
                    self.mimeType = type;
                }
                return self;
            },

            /**
             * cancel this request
             * @member KISSY.IO
             * @param {String} [statusText=abort] error reason as current request object's statusText
             * @chainable
             */
            abort: function (statusText) {
                var self = this;
                statusText = statusText || 'abort';
                if (self.transport) {
                    self.transport.abort(statusText);
                }
                self._ioReady(0, statusText);
                return self;
            },

            /**
             * get native XMLHttpRequest
             * @member KISSY.IO
             * @return {XMLHttpRequest}
             */
            getNativeXhr: function () {
                var transport;
                if (transport = this.transport) {
                    return transport.nativeXhr;
                }
                return null;
            },

            _ioReady: function (status, statusText) {
                var self = this;
                // 只能执行一次，防止重复执行
                // 例如完成后，调用 abort

                // 到这要么成功，调用success
                // 要么失败，调用 error
                // 最终都会调用 complete
                if (self.state == 2) {
                    return;
                }
                self.state = 2;
                self.readyState = 4;
                var isSuccess;
                if (status >= OK_CODE && status < MULTIPLE_CHOICES || status == NOT_MODIFIED) {
                    // note: not same with nativeStatusText, such as 'OK'/'Not Modified'
                    // 为了整个框架的和谐以及兼容性，用小写，并改变写法
                    if (status == NOT_MODIFIED) {
                        statusText = 'not modified';
                        isSuccess = true;
                    } else {
                        try {
                            handleResponseData(self);
                            statusText = 'success';
                            isSuccess = true;
                        } catch (e) {
                            S.log(e.stack || e, 'error');
                            setTimeout(function(){
                                throw e;
                            },0);
                            statusText = 'parser error';
                        }
                    }

                } else {
                    if (status < 0) {
                        status = 0;
                    }
                }

                self.status = status;
                self.statusText = statusText;

                var defer = self.defer,
                    config = self.config,
                    timeoutTimer;
                if (timeoutTimer = self.timeoutTimer) {
                    clearTimeout(timeoutTimer);
                    self.timeoutTimer = 0;
                }
                /**
                 * fired after request completes (success or error)
                 * @event complete
                 * @member KISSY.IO
                 * @static
                 * @param {KISSY.Event.CustomEvent.Object} e
                 * @param {KISSY.IO} e.io current io
                 */

                /**
                 * fired after request succeeds
                 * @event success
                 * @member KISSY.IO
                 * @static
                 * @param {KISSY.Event.CustomEvent.Object} e
                 * @param {KISSY.IO} e.io current io
                 */

                /**
                 * fired after request occurs error
                 * @event error
                 * @member KISSY.IO
                 * @static
                 * @param {KISSY.Event.CustomEvent.Object} e
                 * @param {KISSY.IO} e.io current io
                 */
                var handler = isSuccess ? 'success' : 'error',
                    h,
                    v = [self.responseData, statusText, self],
                    context = config.context,
                    eventObject = {
                        // 兼容
                        ajaxConfig: config,
                        io: self
                    };
                if (h = config[handler]) {
                    h.apply(context, v);
                }
                if (h = config.complete) {
                    h.apply(context, v);
                }
                IO.fire(handler, eventObject);
                IO.fire('complete', eventObject);
                defer[isSuccess ? 'resolve' : 'reject'](v);
            },

            _getUrlForSend: function () {
                // for compatible, some server does not decode query
                // uri will encode query
                // x.html?t=1,2
                // =>
                // x.html?t=1%3c2
                // so trim original query when process other query
                // and append when send
                var c = this.config,
                    uri = c.uri,
                    originalQuery = S.Uri.getComponents(c.url).query || "",
                    url = uri.toString.call(uri, c.serializeArray);

                return url + (originalQuery ?
                    ((uri.query.has() ? '&' : '?') + originalQuery) :
                    originalQuery);
            }
        }
    );
}, {
    requires: ['./base','promise']
});
/**
 * @ignore
 * io shortcut
 * @author yiminghe@gmail.com
 */
KISSY.add('io', function (S, serializer, IO) {
    var undef = undefined;

    function get(url, data, callback, dataType, type) {
        // data 参数可省略
        if (typeof data === 'function') {
            dataType = callback;
            callback = data;
            data = undef;
        }

        return IO({
            type: type || 'get',
            url: url,
            data: data,
            success: callback,
            dataType: dataType
        });
    }

    // some shortcut
    S.mix(IO,
        {

            serialize: serializer.serialize,

            /**
             * perform a get request
             * @method
             * @param {String} url request destination
             * @param {Object} [data] name-value object associated with this request
             * @param {Function} [callback] success callback when this request is done
             * @param callback.data returned from this request with type specified by dataType
             * @param {String} callback.status status of this request with type String
             * @param {KISSY.IO} callback.io io object of this request
             * @param {String} [dataType] the type of data returns from this request
             * ('xml' or 'json' or 'text')
             * @return {KISSY.IO}
             * @member KISSY.IO
             * @static
             */
            get: get,

            /**
             * preform a post request
             * @param {String} url request destination
             * @param {Object} [data] name-value object associated with this request
             * @param {Function} [callback] success callback when this request is done.
             * @param callback.data returned from this request with type specified by dataType
             * @param {String} callback.status status of this request with type String
             * @param {KISSY.IO} callback.io io object of this request
             * @param {String} [dataType] the type of data returns from this request
             * ('xml' or 'json' or 'text')
             * @return {KISSY.IO}
             * @member KISSY.IO
             * @static
             */
            post: function (url, data, callback, dataType) {
                if (typeof data === 'function') {
                    dataType = /**
                     @type String
                     @ignore*/callback;
                    callback = data;
                    data = undef;
                }
                return get(url, data, callback, dataType, 'post');
            },

            /**
             * preform a jsonp request
             * @param {String} url request destination
             * @param {Object} [data] name-value object associated with this request
             * @param {Function} [callback] success callback when this request is done.
             * @param callback.data returned from this request with type specified by dataType
             * @param {String} callback.status status of this request with type String
             * @param {KISSY.IO} callback.io io object of this request
             * @return {KISSY.IO}
             * @member KISSY.IO
             * @static
             */
            jsonp: function (url, data, callback) {
                if (typeof data === 'function') {
                    callback = data;
                    data = undef;
                }
                return get(url, data, callback, 'jsonp');
            },

            // 和 S.getScript 保持一致
            // 更好的 getScript 可以用
            /*
             IO({
             dataType:'script'
             });
             */
            getScript: S.getScript,

            /**
             * perform a get request to fetch json data from server
             * @param {String} url request destination
             * @param {Object} [data] name-value object associated with this request
             * @param {Function} [callback] success callback when this request is done.@param callback.data returned from this request with type specified by dataType
             * @param {String} callback.status status of this request with type String
             * @param {KISSY.IO} callback.io io object of this request
             * @return {KISSY.IO}
             * @member KISSY.IO
             * @static
             */
            getJSON: function (url, data, callback) {
                if (typeof data === 'function') {
                    callback = data;
                    data = undef;
                }
                return get(url, data, callback, 'json');
            },

            /**
             * submit form without page refresh
             * @param {String} url request destination
             * @param {HTMLElement|KISSY.NodeList} form element tobe submited
             * @param {Object} [data] name-value object associated with this request
             * @param {Function} [callback]  success callback when this request is done.@param callback.data returned from this request with type specified by dataType
             * @param {String} callback.status status of this request with type String
             * @param {KISSY.IO} callback.io io object of this request
             * @param {String} [dataType] the type of data returns from this request
             * ('xml' or 'json' or 'text')
             * @return {KISSY.IO}
             * @member KISSY.IO
             * @static
             */
            upload: function (url, form, data, callback, dataType) {
                if (typeof data === 'function') {
                    dataType = /**
                     @type String
                     @ignore
                     */callback;
                    callback = data;
                    data = undef;
                }
                return IO({
                    url: url,
                    type: 'post',
                    dataType: dataType,
                    form: form,
                    data: data,
                    success: callback
                });
            }
        });

    S.mix(S, {
        // compatibility
        'Ajax': IO,
        'IO': IO,
        ajax: IO,
        io: IO,
        jsonp: IO.jsonp
    });

    return IO;
}, {
    requires: [
        'io/form-serializer',
        'io/base',
        'io/xhr-transport',
        'io/script-transport',
        'io/jsonp',
        'io/form',
        'io/iframe-transport',
        'io/methods']
});

