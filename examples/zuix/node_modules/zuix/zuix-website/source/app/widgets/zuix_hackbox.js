/**
 * @license
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * Find more details about ZUIX here:
 *   http://zuix.it
 *   https://github.com/genielabs/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */

zuix.controller(function (cp) {
    var mainToolbox = null,
        pageView = null,
        pageViewContainer = null,
        logListContainer = null;
    /** @type {ComponentContext} */
    var logListView;
    var logTimers = [];

    var logCache = [],
        timeout = null,
        editorOpen = false,
        monitorDisabled = false,
        zuixEditor = null;

    var PAGE_COMPONENTS = 0,
        PAGE_LOG = 1,
        PAGE_BUNDLE = 2;

    var bundleBox = null, logBox = null, componentsBox;
    var logOverlay = null, fabMenu = null, buttonHide = null;

    cp.init = function () {
        // disable zuix logging to console
        window.zuixNoConsoleOutput = true;
    };

    cp.create = function () {
        var userAgent = window.navigator.userAgent;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            // hackbox currenly won't work properly on iPad or iPhone
            cp.view().hide();
            return;
        }

        // the main toolbox fragment
        mainToolbox = cp.field('toolbox').hide();
        pageViewContainer = cp.field('paged-view').on('component:ready', function () {
            pageView = zuix.context(this);
            pageView.setPage(PAGE_LOG);
            pageView.setPage(PAGE_COMPONENTS);
        });
        logListContainer = cp.field('log-list').on('component:ready', function () {
            logListView = zuix.context(this);
            logListView.config({
                htmlMode: false
            });
        });
        // the components fragment
        componentsBox = cp.field('fragment-components').hide();
        // the bundle fragment
        bundleBox = cp.field('fragment-bundle').hide();
        // the debug log fragment
        logBox = cp.field('fragment-log').show();
        // the fab button
        fabMenu = cp.field('fab-menu');
        fabMenu.on('click', showToolbox);
        // the hide button
        buttonHide = cp.field('button-hide')
            .on('click', backOrHide);
        // move overlay to the document root
        logOverlay = cp.field('log-overlay');
        logOverlay.css({
            overflow: 'hidden',
            position: 'absolute',
            left: 0, top: 0, bottom: 0, right: 0
        });
        document.body.appendChild(logOverlay.get());
        // event listeners
        cp.field('button-fullscreen').on('click', function () {
            if (cp.view().css('height') != '')
                cp.view().css('height', '');
            else
                cp.view().css('height', '90%');
        });
        cp.field('button-bundle').on('click', showBundle);
        cp.field('button-log').on('click', showLog);
        cp.field('button-save').on('click', saveBundle);
        cp.field('button-load').on('click', function () {
            cp.field('button-load').attr('disabled', true);
            cp.field('button-save').attr('disabled', true);
            cp.field('bundle-progress').show();
            monitorDisabled = true;
            zuix.bundle(true, function () {
                cp.field('bundle-progress').hide();
                cp.field('button-save')
                    .attr('disabled', null)
                    .animateCss('tada');
                monitorDisabled = false;
            });
        });
        cp.field('button-components').on('click', function () {
            showComponents();
        });
        cp.field('fragmemnt-components').on('component:ready', function (e, ctx) {
            zuixEditor = zuix.context(this);
            // if editor is ready, register event handler
            zuixEditor.on('page:change', function (e, data) {
                if (data.page == 'editor') {
                    cp.field('editor-info').html(data.context.model().componentId);
                    cp.field('button-bundle').hide();
                    cp.field('button-log').hide();
                    editorOpen = true;
                } else {
                    cp.field('editor-info').html('');
                    cp.field('button-bundle').show();
                    cp.field('button-log').show();
                    editorOpen = false;
                }
            });
        });
        // hide the toolbox at startup
        backOrHide(false);
        // init
        initialize();
        cp.expose('saveBundle', saveBundle);
    };

    function updateLog() {
        if (logListView == null) return;
        logListView.model({
            itemList: logCache,
            getItem: function (index, item) {
                return {
                    // unique identifier for this item
                    itemId: index,
                    // display as "bundle item"
                    componentId: 'ui/widgets/zuix_hackbox/log_item',
                    // loading options
                    options: {
                        model: item,
                        lazyLoad: true,
                        static: true,
                        height: '32px',
                        on: {
                            'item:enter': function (e, sourceView) {
                                highlightComponent(sourceView, true);
                            },
                            'item:leave': function (e, sourceView) {
                                highlightComponent(sourceView, false);
                            },
                            'item:click': function (e, sourceView) {
                                highlightComponent(sourceView, false);
                                sourceView.get()
                                    .scrollIntoView({
                                        //block: 'end',
                                        //behavior: 'smooth'
                                    });
                                highlightComponent(sourceView, true);
                            }
                        },
                        ready: function () {
                            // TODO: ...
                        }
                    }
                }
            }
        });
    }

    function highlightComponent(view, enable) {
        if (enable) {
            var p = view.position();
            if (!p.visible) return;
            var boxElement = document.createElement('div');
            zuix.$(boxElement).css({
                'left': p.x + 'px',
                'top': p.y + 'px',
                'width': view.get().offsetWidth + 'px',
                'height': view.get().offsetHeight + 'px',
                'position': 'absolute',
                'border': 'solid 4px rgba(255,0,100,0.8)',
                'padding': '2px',
                'z-index': 900,
                'background-color': 'rgba(255,255,0,0.3)'
            }).animateCss('flash', {duration: '0.25s'/*, 'iteration-count': '3'*/});
            view.get().hackBoxRef = boxElement;
            logOverlay.append(boxElement);
        } else if (view.get().hackBoxRef) {
            logOverlay.get().removeChild(view.get().hackBoxRef);
            view.get().hackBoxRef = null;
            delete view.get().hackBoxRef;
        }
    }

    function startLogTimer(name, startTime) {
        logTimers.push({
            name: name,
            timestamp: startTime
        });
    }

    function stopLogTimer(name, stopTime) {
        for(var i = 0; i < logTimers.length; i++) {
            var t = logTimers[i];
            if (t.name == name) {
                return (stopTime - t.timestamp);
            }
        }
        return 0;
    }

    function initialize() {
        zuix.monitor = function (level, args) {
            if (monitorDisabled) return;
            if (/*level == 'TRACE' ||*/
                args[0].toString().indexOf('load:end') == 0 ||
                args[0].toString().indexOf('componentize:count') == 0 ||
                args[0].toString().indexOf('componentize:begin') == 0 ||
                args[0].toString().indexOf('componentize:end') == 0 ||
                args[0].toString().indexOf('ui/controls/list_view') == 0 ||
                args[0].toString().indexOf('/zuix_') > 0) // args[0] == 'load:end' || args[0].toString().indexOf('componentize:') == 0 || args[0].toString().indexOf('/zuix_hackbox/') > 0)
                return;

            var timestamp = new Date();
            var elapsedString = '';

            for(var i = 0; i < args.length; i++) {
                if (typeof args[i] == 'string' && args[i].indexOf('timer:') == 0) {
                    var t = args[i].split(':');
                    if (t.length == 3) {
                        switch (t[2]) {
                            case 'start':
                                startLogTimer(args[0]+':'+t[1], timestamp);
                                break;
                            case 'stop':
                                var elapsed = stopLogTimer(args[0]+':'+t[1], timestamp);
                                if (elapsed > 200)
                                    elapsedString = '<span style="color:red">'+args[i]+' '+elapsed+'ms</div>';
                                else if (elapsed > 100)
                                    elapsedString = '<span style="color:orangered">'+args[i]+' '+elapsed+'ms</div>';
                                else
                                    elapsedString = '<span style="color:lime">'+args[i]+' '+elapsed+'ms</div>';
                                break;
                        }
                    }
                }
            }
            logCache.push({
                level: level,
                args: args,
                time: (timestamp.toISOString().substring(11).replace('Z', '')),
                timestamp: timestamp.getTime(),
                elapsed: elapsedString
            });
            if (timeout != null)
                clearTimeout(timeout);
            var updateTimeout = function () {
                cp.view('.alert').animateCss('tada', { duration: '5s' });
                cp.view('.mdl-badge').attr('data-badge', zuix.bundle().length);
                if (zuixEditor) zuixEditor.update();
                updateLog();
            };
            timeout = setTimeout(updateTimeout, 1000);
        };
        cp.field('bundle-progress').hide();
    }

    function showLog() {
        cp.field('button-bundle').removeClass('is-active');
        cp.field('button-log').addClass('is-active');
        cp.field('button-components').addClass('mdl-badge--no-background');
        pageView.setPage(PAGE_LOG);
    }

    function showComponents() {
        cp.field('button-log').removeClass('is-active');
        cp.field('button-bundle').removeClass('is-active');
        cp.field('button-components').removeClass('mdl-badge--no-background');
        pageView.setPage(PAGE_COMPONENTS);
        if (zuixEditor) zuixEditor.show();
        // force loading of visible lazy-elements (log items)
        setTimeout(function () {
            zuix.componentize(componentsBox.get());
        }, 500);
    }

    function showBundle() {
//        bundleBox.show().animateCss('fadeInRight', { duration: '0.5s' });
        cp.field('button-log').removeClass('is-active');
        cp.field('button-bundle').addClass('is-active');
        cp.field('button-components').addClass('mdl-badge--no-background');
        pageView.setPage(PAGE_BUNDLE);
    }

    function showToolbox() {
        cp.view().css('width', '');
        cp.view().css('height', '');
        mainToolbox.animateCss('fadeInLeftBig').show();
        fabMenu.css('z-index', '-10');
        fabMenu.animateCss('zoomOutDown', function () {
            fabMenu.css('z-index', '0').hide();
        });
        // force loading of visible lazy-elements (log items)
        setTimeout(function () {
            zuix.componentize(componentsBox.get());
        }, 500);
    }

    function backOrHide(animate) {
        if (editorOpen) {
            // close editor / go back to components list
            zuixEditor.show();
        } else {
            // hide toolbox
            var hide = function () {
                mainToolbox.hide();
                cp.view().css('width', '0');
                cp.view().css('height', '64px');
            };
            if (animate)
                mainToolbox.animateCss('fadeOutLeft', function () {
                    hide();
                });
            else hide();
            fabMenu.animateCss('fadeInUp').show();
        }
    }

    // 'saveAs' polyfill
    var saveAs = function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
    function saveBundle() {
        // TODO: should clear/ignore `log_item.js` for a faster bundle creation.
        var bundle = zuixEditor.serialize(zuix.bundle());
        // revert loaded status before exporting
        bundle = bundle.replace(/data-ui-loaded=\\"true\\"/g, 'data-ui-loaded=\\"false\\"');
        bundle = bundle.replace(/zuix-loaded=\\"true\\"/g, 'zuix-loaded=\\"false\\"');
        // save bundle
        var blob = new Blob(['zuix.bundle('+bundle+');'], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "app.bundle.js");
        return bundle;
    }

});
