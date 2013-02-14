/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('base-build', function (Y, NAME) {

    /**
     * The base-build submodule provides Base.build functionality, which
     * can be used to create custom classes, by aggregating extensions onto 
     * a main class.
     *
     * @module base
     * @submodule base-build
     * @for Base
     */
    var Base = Y.Base,
        L = Y.Lang,
        INITIALIZER = "initializer",
        DESTRUCTOR = "destructor",
        build,
        arrayAggregator = function (prop, r, s) {
            if (s[prop]) {
                r[prop] = (r[prop] || []).concat(s[prop]);
            }    
        };

    Base._build = function(name, main, extensions, px, sx, cfg) {

        var build = Base._build,

            builtClass = build._ctor(main, cfg),
            buildCfg = build._cfg(main, cfg, extensions),

            _mixCust = build._mixCust,

            dynamic = builtClass._yuibuild.dynamic,

            i, l, extClass, extProto,
            initializer,
            destructor;

        // Augment/Aggregate
        for (i = 0, l = extensions.length; i < l; i++) {
            extClass = extensions[i];

            extProto = extClass.prototype;
            
            initializer = extProto[INITIALIZER];
            destructor = extProto[DESTRUCTOR];
            delete extProto[INITIALIZER];
            delete extProto[DESTRUCTOR];

            // Prototype, old non-displacing augment
            Y.mix(builtClass, extClass, true, null, 1);

            // Custom Statics
            _mixCust(builtClass, extClass, buildCfg);

            if (initializer) { 
                extProto[INITIALIZER] = initializer;
            }

            if (destructor) {
                extProto[DESTRUCTOR] = destructor;
            }

            builtClass._yuibuild.exts.push(extClass);
        }

        if (px) {
            Y.mix(builtClass.prototype, px, true);
        }

        if (sx) {
            Y.mix(builtClass, build._clean(sx, buildCfg), true);
            _mixCust(builtClass, sx, buildCfg);
        }

        builtClass.prototype.hasImpl = build._impl;

        if (dynamic) {
            builtClass.NAME = name;
            builtClass.prototype.constructor = builtClass;
        }

        return builtClass;
    };

    build = Base._build;

    Y.mix(build, {

        _mixCust: function(r, s, cfg) {
            
            var aggregates, 
                custom, 
                statics,
                aggr,
                l,
                i;
                
            if (cfg) {
                aggregates = cfg.aggregates;
                custom = cfg.custom;
                statics = cfg.statics;
            }

            if (statics) {
                Y.mix(r, s, true, statics);
            }

            if (aggregates) {
                for (i = 0, l = aggregates.length; i < l; i++) {
                    aggr = aggregates[i];
                    if (!r.hasOwnProperty(aggr) && s.hasOwnProperty(aggr)) {
                        r[aggr] = L.isArray(s[aggr]) ? [] : {};
                    }
                    Y.aggregate(r, s, true, [aggr]);
                }
            }

            if (custom) {
                for (i in custom) {
                    if (custom.hasOwnProperty(i)) {
                        custom[i](i, r, s);
                    }
                }
            }
            
        },

        _tmpl: function(main) {

            function BuiltClass() {
                BuiltClass.superclass.constructor.apply(this, arguments);
            }
            Y.extend(BuiltClass, main);

            return BuiltClass;
        },

        _impl : function(extClass) {
            var classes = this._getClasses(), i, l, cls, exts, ll, j;
            for (i = 0, l = classes.length; i < l; i++) {
                cls = classes[i];
                if (cls._yuibuild) {
                    exts = cls._yuibuild.exts;
                    ll = exts.length;
    
                    for (j = 0; j < ll; j++) {
                        if (exts[j] === extClass) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        _ctor : function(main, cfg) {

           var dynamic = (cfg && false === cfg.dynamic) ? false : true,
               builtClass = (dynamic) ? build._tmpl(main) : main,
               buildCfg = builtClass._yuibuild;

            if (!buildCfg) {
                buildCfg = builtClass._yuibuild = {};
            }

            buildCfg.id = buildCfg.id || null;
            buildCfg.exts = buildCfg.exts || [];
            buildCfg.dynamic = dynamic;

            return builtClass;
        },

        _cfg : function(main, cfg, exts) {
            var aggr = [], 
                cust = {},
                statics = [],
                buildCfg,
                cfgAggr = (cfg && cfg.aggregates),
                cfgCustBuild = (cfg && cfg.custom),
                cfgStatics = (cfg && cfg.statics),
                c = main,
                i, 
                l;

            // Prototype Chain
            while (c && c.prototype) {
                buildCfg = c._buildCfg;
                if (buildCfg) {
                    if (buildCfg.aggregates) {
                        aggr = aggr.concat(buildCfg.aggregates);
                    }
                    if (buildCfg.custom) {
                        Y.mix(cust, buildCfg.custom, true);
                    }
                    if (buildCfg.statics) {
                        statics = statics.concat(buildCfg.statics);
                    }
                }
                c = c.superclass ? c.superclass.constructor : null;
            }

            // Exts
            if (exts) {
                for (i = 0, l = exts.length; i < l; i++) {
                    c = exts[i];
                    buildCfg = c._buildCfg;
                    if (buildCfg) {
                        if (buildCfg.aggregates) {
                            aggr = aggr.concat(buildCfg.aggregates);
                        }
                        if (buildCfg.custom) {
                            Y.mix(cust, buildCfg.custom, true);
                        }
                        if (buildCfg.statics) {
                            statics = statics.concat(buildCfg.statics);
                        }
                    }                    
                }
            }

            if (cfgAggr) {
                aggr = aggr.concat(cfgAggr);
            }

            if (cfgCustBuild) {
                Y.mix(cust, cfg.cfgBuild, true);
            }

            if (cfgStatics) {
                statics = statics.concat(cfgStatics);
            }

            return {
                aggregates: aggr,
                custom: cust,
                statics: statics
            };
        },

        _clean : function(sx, cfg) {
            var prop, i, l, sxclone = Y.merge(sx),
                aggregates = cfg.aggregates,
                custom = cfg.custom;

            for (prop in custom) {
                if (sxclone.hasOwnProperty(prop)) {
                    delete sxclone[prop];
                }
            }

            for (i = 0, l = aggregates.length; i < l; i++) {
                prop = aggregates[i];
                if (sxclone.hasOwnProperty(prop)) {
                    delete sxclone[prop];
                }
            }

            return sxclone;
        }
    });

    /**
     * <p>
     * Builds a custom constructor function (class) from the
     * main function, and array of extension functions (classes)
     * provided. The NAME field for the constructor function is 
     * defined by the first argument passed in.
     * </p>
     * <p>
     * The cfg object supports the following properties
     * </p>
     * <dl>
     *    <dt>dynamic &#60;boolean&#62;</dt>
     *    <dd>
     *    <p>If true (default), a completely new class
     *    is created which extends the main class, and acts as the 
     *    host on which the extension classes are augmented.</p>
     *    <p>If false, the extensions classes are augmented directly to
     *    the main class, modifying the main class' prototype.</p>
     *    </dd>
     *    <dt>aggregates &#60;String[]&#62;</dt>
     *    <dd>An array of static property names, which will get aggregated
     *    on to the built class, in addition to the default properties build 
     *    will always aggregate as defined by the main class' static _buildCfg
     *    property.
     *    </dd>
     * </dl>
     *
     * @method build
     * @deprecated Use the more convenient Base.create and Base.mix methods instead
     * @static
     * @param {Function} name The name of the new class. Used to define the NAME property for the new class.
     * @param {Function} main The main class on which to base the built class
     * @param {Function[]} extensions The set of extension classes which will be
     * augmented/aggregated to the built class.
     * @param {Object} cfg Optional. Build configuration for the class (see description).
     * @return {Function} A custom class, created from the provided main and extension classes
     */
    Base.build = function(name, main, extensions, cfg) {
        return build(name, main, extensions, null, null, cfg);
    };

    /**
     * Creates a new class (constructor function) which extends the base class passed in as the second argument, 
     * and mixes in the array of extensions provided.
     * 
     * Prototype properties or methods can be added to the new class, using the px argument (similar to Y.extend).
     * 
     * Static properties or methods can be added to the new class, using the sx argument (similar to Y.extend).
     * 
     * **NOTE FOR COMPONENT DEVELOPERS**: Both the `base` class, and `extensions` can define static a `_buildCfg` 
     * property, which acts as class creation meta-data, and drives how special static properties from the base 
     * class, or extensions should be copied, aggregated or (custom) mixed into the newly created class.
     * 
     * The `_buildCfg` property is a hash with 3 supported properties: `statics`, `aggregates` and `custom`, e.g:
     * 
     *     // If the Base/Main class is the thing introducing the property:
     * 
     *     MyBaseClass._buildCfg = {
     *     
     *        // Static properties/methods to copy (Alias) to the built class.
     *        statics: ["CopyThisMethod", "CopyThisProperty"],
     * 
     *        // Static props to aggregate onto the built class.
     *        aggregates: ["AggregateThisProperty"],
     * 
     *        // Static properties which need custom handling (e.g. deep merge etc.)
     *        custom: {
     *           "CustomProperty" : function(property, Receiver, Supplier) {
     *              ...
     *              var triggers = Receiver.CustomProperty.triggers; 
                    Receiver.CustomProperty.triggers = triggers.concat(Supplier.CustomProperty.triggers);
     *              ...
     *           }
     *        }
     *     };
     * 
     *     MyBaseClass.CopyThisMethod = function() {...}; 
     *     MyBaseClass.CopyThisProperty = "foo";
     *     MyBaseClass.AggregateThisProperty = {...};
     *     MyBaseClass.CustomProperty = {
     *        triggers: [...]
     *     }
     *
     *     // Or, if the Extension is the thing introducing the property:
     * 
     *     MyExtension._buildCfg = {
     *         statics : ...
     *         aggregates : ...
     *         custom : ...  
     *     }    
     * 
     * This way, when users pass your base or extension class to `Y.Base.create` or `Y.Base.mix`, they don't need to
     * know which properties need special handling. `Y.Base` has a buildCfg which defines `ATTRS` for custom mix handling
     * (to protect the static config objects), and `Y.Widget` has a buildCfg which specifies `HTML_PARSER` for 
     * straight up aggregation.
     *
     * @method create
     * @static
     * @param {Function} name The name of the newly created class. Used to define the NAME property for the new class.
     * @param {Function} main The base class which the new class should extend. This class needs to be Base or a class derived from base (e.g. Widget).
     * @param {Function[]} extensions The list of extensions which will be mixed into the built class.
     * @param {Object} px The set of prototype properties/methods to add to the built class.
     * @param {Object} sx The set of static properties/methods to add to the built class.
     * @return {Function} The newly created class.
     */
    Base.create = function(name, base, extensions, px, sx) {
        return build(name, base, extensions, px, sx);
    };

    /**
     * <p>Mixes in a list of extensions to an existing class.</p>
     * @method mix
     * @static
     * @param {Function} main The existing class into which the extensions should be mixed.  The class needs to be Base or a class derived from Base (e.g. Widget)
     * @param {Function[]} extensions The set of extension classes which will mixed into the existing main class.
     * @return {Function} The modified main class, with extensions mixed in.
     */
    Base.mix = function(main, extensions) {
        return build(null, main, extensions, null, null, {dynamic:false});
    };

    /**
     * The build configuration for the Base class.
     *
     * Defines the static fields which need to be aggregated
     * when the Base class is used as the main class passed to
     * the <a href="#method_Base.build">Base.build</a> method.
     *
     * @property _buildCfg
     * @type Object
     * @static
     * @final
     * @private
     */
    Base._buildCfg = {
        custom : {
            ATTRS : function(prop, r, s) {

                r.ATTRS = r.ATTRS || {};

                if (s.ATTRS) {

                    var sAttrs = s.ATTRS,
                        rAttrs = r.ATTRS,
                        a;

                    for (a in sAttrs) {
                        if (sAttrs.hasOwnProperty(a)) {
                            rAttrs[a] = rAttrs[a] || {};
                            Y.mix(rAttrs[a], sAttrs[a], true);
                        }
                    }
                }
            },
            _NON_ATTRS_CFG : arrayAggregator
        },
        aggregates : ["_PLUG", "_UNPLUG"]
    };


}, '3.7.3', {"requires": ["base-base"]});
