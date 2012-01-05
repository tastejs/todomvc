/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

/**
 * wire/aop plugin
 * Provides AOP for components created via wire, including Decorators,
 * Introductions (mixins), and Pointcut-based Aspect Weaving.
 */
define(['require', 'aop', 'when'], function(require, aop, when) {

	var ap, obj, tos, isArray, whenAll, chain, deferred, undef;
	
	ap = Array.prototype;
	obj = {};
	tos = Object.prototype.toString;

	isArray = Array.isArray || function(it) {
		return tos.call(it) == '[object Array]';
	};

    whenAll  = when.all;
    chain    = when.chain;
    deferred = when.defer;

    //
	// Decoration
	//

	function applyDecorator(target, Decorator, args) {
		args = args ? [target].concat(args) : [target];

		Decorator.apply(null, args);
	}
	
	function doDecorate(target, decorator, args, wire) {
		function apply(Decorator) {
            return args
                ? when(wire(args), function (resolvedArgs) {
                    applyDecorator(target, Decorator, resolvedArgs);
                })
                : applyDecorator(target, Decorator);
        }
        
        return when(wire.resolveRef(decorator), apply);
	}

	function decorateFacet(resolver, facet, wire) {
		var target, options, promises;

		target = facet.target;
		options = facet.options;
		promises = [];

		for(var d in options) {
			promises.push(doDecorate(target, d, options[d], wire));
		}

		chain(whenAll(promises), resolver);
	}

	//
	// Introductions
	//
	
	function introduce(target, src) {
		var name, s;

		for(name in src) {
			s = src[name];
			if(!(name in target) || (target[name] !== s && (!(name in obj) || obj[name] !== s))) {
				target[name] = s;
			}
		}

        return target;
	}

	function doIntroduction(target, introduction, wire) {
        return when(wire.resolveRef(introduction), function(resolved) {
            return introduce(target, resolved);
        });
	}

	function introduceFacet(resolver, facet, wire) {
		var target, intros;
		
		target = facet.target;
		intros = facet.options;
		
		if(!isArray(intros)) intros = [intros];
        
        chain(when.reduce(intros, function(target, intro) {
            return doIntroduction(target, intro, wire);
        }, target), resolver);
	}

	//
	// Aspect Weaving
	//

    function applyAspectCombined(target, aspect, wire, add) {
        return when(wire.resolveRef(aspect), function (aspect) {
            var pointcut = aspect.pointcut;

            if (pointcut) {
                add(target, pointcut, aspect);
            }
            
            return target;
        });
    }

    function applyAspectSeparate(target, aspect, wire, add) {
        var pointcut, advice;

        pointcut = aspect.pointcut;
        advice = aspect.advice;

        function applyAdvice(pointcut) {
            return when(wire.resolveRef(advice), function (aspect) {
                add(target, pointcut, aspect);
                return target;
            });
        }

        return typeof pointcut === 'string'
            ? when(wire.resolveRef(pointcut, applyAdvice))
            : applyAdvice(pointcut);
    }

    function weave(resolver, proxy, wire, options, add) {

        var target, path, aspects, applyAdvice;

        aspects = options.aspects;
        path = proxy.path;

        if (!aspects || path === undef) {
            resolver.resolve();
            return;
        }

        target = proxy.target;
        applyAdvice = applyAspectCombined;

        // Reduce will preserve order of aspects being applied
        chain(when.reduce(aspects, function(target, aspect) {
            var aspectPath;

            if (aspect.advice) {
                aspectPath = aspect.advice;
                applyAdvice = applyAspectSeparate;
            } else {
                aspectPath = aspect;
            }

            return typeof aspectPath === 'string' && aspectPath !== path
                ? applyAdvice(target, aspect, wire, add)
                : target;

        }, target), resolver);
    }

	return {
		/**
         * Creates wire/aop plugin instances.
         *
         * @param ready {Promise} promise that will be resolved when the context has been wired,
         *  rejected if there is an error during the wiring process, and will receive progress
         *  events for object creation, property setting, and initialization.
         * @param destroy {Promise} promise that will be resolved when the context has been destroyed,
         *  rejected if there is an error while destroying the context, and will receive progress
         *  events for objects being destroyed.
         * @param options {Object}
         */
		wire$plugin: function(ready, destroyed, options) {

            // Track aspects so they can be removed when the context is destroyed
            var woven = [];

            // Remove all aspects that we added in this context
            when(destroyed, function() {
                for(var i = woven.length; i >= 0; --i) {
                    woven[i].remove();
                } 
            });

            /**
             * Function to add an aspect and remember it in the current context
             * so that it can be removed when the context is destroyed.
             * @param target
             * @param pointcut
             * @param aspect
             */
            function add(target, pointcut, aspect) {
                woven.push(aop.add(target, pointcut, aspect))
            }

			function makeFacet(step, callback) {
				var facet = {};
				
				facet[step] = function(resolver, proxy, wire) {
					callback(resolver, proxy, wire);
				};

				return facet;
			}

			// Plugin
			return {
				facets: {
					decorate:  makeFacet('configure', decorateFacet),
					introduce: makeFacet('configure', introduceFacet)
				},
				create: function(resolver, proxy, wire) {
					weave(resolver, proxy, wire, options, add);
				}
			};
		}
	};
});