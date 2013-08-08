/**
 * Implement and manage single loop for WebApp life cycle
 * Provide tweening API for both property animation and frame animation(canvas or css)
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("mo/mainloop", [
    "./lang",
    "./easing/base"
], function(_, easing){

    var window = this,
        ANIMATE_FRAME = "RequestAnimationFrame",
        LONG_AFTER = 4000000000000,

        animateFrame = window['webkit' + ANIMATE_FRAME] || 
            window['moz' + ANIMATE_FRAME] || 
            window['o' + ANIMATE_FRAME] || 
            window['ms' + ANIMATE_FRAME],
        suid = 1,
        ruid = 1,
        fps_limit = 0,
        activeStages = [],
        renderlib = {},
        stageLib = {},

        _default_config = {
            fps: 0,
            easing: _.copy(easing.functions)
        };

    function loop(timestamp){
        for (var i = 0, stage, l = activeStages.length; i < l; i++) {
            stage = activeStages[i];
            if (stage) {
                if (timestamp - stage.lastLoop >= fps_limit) {
                    stage.lastLoop = timestamp;
                    stage.renders.call(stage, timestamp);
                }
            }
        }
    }

    var mainloop = {

        config: function(opt){
            _.config(this, opt, _default_config);
            if (opt.fps) {
                fps_limit = this.fps ? (1000/this.fps) : 0;
            }
            return this;
        },

        run: function(name){
            if (name) {
                var stage = stageLib[name];
                if (!stage) {
                    this.addStage(name);
                    stage = stageLib[name];
                }
                if (stage && !stage.state) {
                    stage.state = 1;
                    activeStages.push(stage);
                    stage.renders.forEach(function(render){
                        var _delay = this.delays[render._rid];
                        if (_delay) {
                            _delay[3] = +new Date();
                            _delay[0] = setTimeout(_delay[1], _delay[2]);
                        }
                    }, stage);
                }
                if (this.globalSignal) {
                    return this;
                }
            }

            var self = this,
                frameFn = animateFrame,
                clearInterv = clearInterval,
                _loop = loop,
                timer,
                signal = ++suid;

            this.globalSignal = 1;

            function step(){
                if (suid === signal) {
                    var timestamp = +new Date();
                    _loop(timestamp);
                    if (self.globalSignal) {
                        if (frameFn) {
                            frameFn(step);
                        }
                    } else {
                        clearInterv(timer);
                    }
                }
            }

            if (frameFn) {
                frameFn(step);
            } else {
                timer = setInterval(step, 15);
            }
            return this;
        },

        pause: function(name){
            if (name) {
                var n = activeStages.indexOf(stageLib[name]);
                if (n >= 0) {
                    var stage = stageLib[name];
                    activeStages.splice(n, 1);
                    stage.state = 0;
                    stage.pauseTime = +new Date();
                    stage.renders.forEach(function(render){
                        var _delay = this.delays[render._rid];
                        if (_delay) {
                            clearTimeout(_delay[0]);
                            _delay[2] -= (this.pauseTime - _delay[3]);
                        }
                    }, stage);
                }
            } else {
                this.globalSignal = 0;
            }
            return this;
        },

        complete: function(name){
            var stage = stageLib[name];
            if (stage && stage.state) {
                stage.renders.forEach(function(render){
                    var _delay = stage.delays[render._rid];
                    if (_delay) {
                        clearTimeout(_delay[0]);
                        _delay[1]();
                    }
                    render.call(stage, this);
                }, LONG_AFTER);
                return this.remove(name);
            }
            return this;
        },

        remove: function(name, fn){
            if (fn) {
                var stage = stageLib[name];
                if (stage) {
                    clearTimeout((stage.delays[fn._rid] || [])[0]);
                    stage.renders.clear(fn);
                }
            } else {
                this.pause(name);
                delete stageLib[name];
            }
            return this;
        },

        info: function(name){
            return stageLib[name];
        },

        isRunning: function(name){
            return !!(stageLib[name] || {}).state;
        },

        addStage: function(name, ctx){
            if (name) {
                stageLib[name] = {
                    name: name,
                    ctx: ctx,
                    state: 0,
                    lastLoop: 0,
                    pauseTime: 0,
                    delays: {},
                    renders: _.fnQueue()
                };
            }
            return this;
        },

        addRender: function(name, fn, ctx){
            if (!stageLib[name]) {
                this.addStage(name, ctx);
            }
            this._lastestRender = fn;
            stageLib[name].renders.push(fn);
            return this;
        },

        getRender: function(renderId){
            return renderlib[renderId] || this._lastestRender;
        },

        addTween: function(name, current, end, duration, opt){
            var self = this,
                start, _delays,
                rid = opt.renderId,
                easing = opt.easing,
                lastPause = 0,
                d = end - current;
            function render(timestamp){
                if (lastPause !== this.pauseTime && start < this.pauseTime) {
                    lastPause = this.pauseTime;
                    start += +new Date() - lastPause;
                }
                var v, time = timestamp - start,
                    p = time/duration;
                if (time <= 0) {
                    return;
                }
                if (p < 1) {
                    if (easing) {
                        p = self.easing[easing](p, time, 0, 1, duration);
                    }
                    if (d < 0) {
                        p = 1 - p;
                        v = end + -1 * d * p;
                    } else {
                        v = current + d * p;
                    }
                }
                if (time >= duration) {
                    opt.step(end, duration);
                    self.remove(name, render);
                    if (opt.callback) {
                        opt.callback();
                    }
                } else {
                    opt.step(v, time);
                }
            }
            if (opt.delay) {
                if (!stageLib[name]) {
                    this.addStage(name);
                }
                if (!rid) {
                    rid = opt.renderId = '_oz_mainloop_' + ruid++;
                }
                _delays = stageLib[name].delays;
                var _timer = setTimeout(add_render, opt.delay);
                _delays[rid] = [_timer, add_render, opt.delay, +new Date()];
            } else {
                add_render();
            }
            if (rid) {
                render._rid = rid;
                renderlib[rid] = render;
            }
            function add_render(){
                if (_delays) {
                    delete _delays[rid];
                }
                if (duration) {
                    opt.step(current, 0);
                } else {
                    opt.step(end, 0);
                    if (opt.callback) {
                        setTimeout(function(){
                            opt.callback();
                        }, 0);
                    }
                    return;
                }
                start = +new Date();
                self.addRender(name, render);
            }
            return this;
        }

    };

    mainloop.config(_default_config);

    return mainloop;

});
