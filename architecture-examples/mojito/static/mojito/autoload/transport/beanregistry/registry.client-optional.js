/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/*
 * The breg module is a place to register beans that will be injected by the
 * BeanInitilizer module. It provides static access to methods that register
 * beans by name, get beans, or get the name of a bean instance.
 * @module breg
 * @private
 */
YUI.add('breg', function(Y) {

    var NAME = 'beanRegistry',
        BEAN_REGISTRY_STARTED = 'rstart',
        REGISTRATION_COMPLETE = 'rdone',
        REINITIALIZING_BEAN = 'reinits',
        REINITIALIZED_BEAN = 'reinitd',
        INITIALIZATION_COMPLETE = 'initd',
        INJECTION_COMPLETE = 'injd',
        isFunction = Y.Lang.isFunction,
        _bInstantiated = false,
        _initialInjectionComplete = false,
        _c = {},
        _b = {},
        _ni = 0,
        DaliBeanRegistry;


    DaliBeanRegistry = function() {
        DaliBeanRegistry.superclass.constructor.apply(this, arguments);
    };


    DaliBeanRegistry.NAME = NAME;


    function _doInject(injection, name, into, intoName) {
        var setter;

        // if it is a Y.Base obj and there is a setter function that matches, it
        // gets called with the injection
        if (into.getAttrs && into.getAttrs().hasOwnProperty(name)) {
            // Y.log('setting ' + name + ' into ' + intoName, 'life', NAME);
            into.set(name, injection);
            _ni += 1;
        } else {
            // it might also be a normal object with a normal setter
            setter = into['set' + name.substr(0, 1).toUpperCase() +
                name.substr(1)];
            if (setter && isFunction(setter)) {
                // Y.log('setting ' + name + ' into ' + intoName, 'life', NAME);
                setter.call(into, injection);
                _ni += 1;
            }
        }
    }


    function _inject(injectionBean, injectionBeanName, subjects) {
        var subject;

        // ignore beans that don't want to be injected
        if (injectionBean.inject === false) {
            // Y.log(injectionBeanName +
            //     " doesn't want to be injected, skipping", 'info', NAME);
            return;
        }

        // inner loop is for the subjects of the injection
        for (subject in subjects) {
            if (subjects.hasOwnProperty(subject)) {
                _doInject(injectionBean, injectionBeanName, subjects[subject],
                    subject);
            }
        }
    }

    function _getInjections(subjectBean, subjectName, injectionBeans) {
        var injectionName;

        for (injectionName in injectionBeans) {
            if (injectionBeans.hasOwnProperty(injectionName)) {
                _doInject(injectionBeans[injectionName], injectionName,
                    subjectBean, subjectName);
            }
        }
    }


    Y.extend(DaliBeanRegistry, Y.EventTarget, {

        /*
         * Called to ensure all beans refer to an instance of the bean, not the
         * bean constructor. Loops through all registered beans, and if the
         * reference is still a Function, not an Object, it will execute the
         * constructor and replace the reference with the resulting object.
         * After ensuring this, a notification message is sent to the newly
         * created object so it can do any internal initialization it needs.
         */
        _instantiateBeans: function() {
            var name;

            this.fire(REGISTRATION_COMPLETE);
            for (name in _c) {
                if (_c.hasOwnProperty(name)) {
                    if (isFunction(_c[name])) {
                        _b[name] = new _c[name]();
                        // Y.log('created new instance of bean: ' + name,
                        //     'life', NAME);
                    } else {
                        // Y.log(name +
                        //     ' registered as a bean object and used as-is',
                        //     'info', NAME);
                        _b[name] = _c[name];
                    }
                }
            }
            _bInstantiated = true;
            // notify each bean that instantiation is complete
            this.fire(INITIALIZATION_COMPLETE);
        },


        _getNumberOfInjections: function() {
            return _ni;
        },


        initializer: function() {
            this.fire(BEAN_REGISTRY_STARTED);
        },


        /**
         * Called to register a bean or bean constructor with the bean registry.
         * If this method is called twice with the same bean, the last bean
         * wins. Only one type of bean can be in the system at a time.
         * @param {string} name Required identifier of this bean.
         * @param {Object} bean Either a constructor Function or an instance
         *     object of a bean.
         */
        registerBean: function(name, bean) {
            // Y.log('registering bean: ' + name, 'info', NAME);
            _c[name] = bean;
            // re-initialzie and inject bean if initial registration is complete
            if (_initialInjectionComplete) {
                this.reInitializeBean(name);
            }
        },


        /**
         * If the bean system has not been instatiated yet, this will
         * instantiate all beans!
         * @return {Object} contains all beans, each bean is accessible by bean
         *     name.
         */
        getBeans: function() {
            return _b;
        },


        /**
         * If the bean system has not been instatiated yet, this will
         * instantiate all beans! Then one bean instance is returned by name.
         * @return {Object} the bean instance, or undefined if it is not
         *     registered.
         */
        getBean: function(name) {
            return _b[name];
        },


        /**
         * Given an instance of a bean, returns the String name
         * @return {String} name of the registered bean, or undefined if it is
         *     not a registered bean.
         */
        getName: function(inst) {
            var name;

            for (name in _b) {
                if (_b.hasOwnProperty(name)) {
                    if (inst === _b[name]) {
                        return name;
                    }
                }
            }
        },


        reInitializeBean: function(name) {
            var reinitChildBeans = false,
                prop,
                childBeanName,
                oldBean = _b[name];

            this.fire(REINITIALIZING_BEAN, {bean: name});
            if (oldBean && oldBean.destroy && isFunction(oldBean.destroy)) {
                reinitChildBeans = oldBean.destroy() || false;
            }
            if (reinitChildBeans) {
                for (prop in oldBean) {
                    if (oldBean.hasOwnProperty(prop)) {
                        if (oldBean[prop] instanceof Function &&
                                prop.substr(0, 3) === 'set') {
                            childBeanName = prop.substr(3, 1).toLowerCase() +
                                prop.substr(4);

                            // only re-init beans that exist (prevents normal
                            // setters from triggering reinitialization
                            if (_b[childBeanName]) {
                                this.reInitializeBean(childBeanName);
                            }
                        }
                    }
                }
            }
            delete _b[name];
            _b[name] = isFunction(_c[name]) ? new _c[name]() : _c[name];
            _getInjections(_b[name], name, _b);
            _inject(_b[name], name, _b);
            this.fire(REINITIALIZED_BEAN, {bean: name});
        },


        doInjection: function() {
            var injection,
                injectionBean,
                eventToFire;

            if (!_initialInjectionComplete) {
                this._instantiateBeans();
                eventToFire = INJECTION_COMPLETE;
            }

            for (injection in _b) {
                if (_b.hasOwnProperty(injection)) {
                    injectionBean = _b[injection];
                    _inject(injectionBean, injection, _b);
                }
            }

            this.fire(eventToFire);
            _initialInjectionComplete = true;
        },


        clear: function() {
            var bname,
                b;

            for (bname in _b) {
                if (_b.hasOwnProperty(bname)) {
                    b = _b[bname];
                    if (b.destroy && isFunction(b.destroy)) { b.destroy(); }
                    delete _b[bname];
                    delete _c[bname];
                }
            }
            _initialInjectionComplete = false;
            _bInstantiated = false;
            _ni = 0;
        }
    });

    Y.namespace('Dali');
    Y.Dali.beanRegistry = new DaliBeanRegistry();

}, '1.6.3', {requires: [
    'oop',
    'event-custom'
]});
