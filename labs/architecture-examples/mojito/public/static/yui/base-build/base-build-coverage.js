/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/base-build/base-build.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/base-build/base-build.js",
    code: []
};
_yuitest_coverage["build/base-build/base-build.js"].code=["YUI.add('base-build', function (Y, NAME) {","","    /**","     * The base-build submodule provides Base.build functionality, which","     * can be used to create custom classes, by aggregating extensions onto ","     * a main class.","     *","     * @module base","     * @submodule base-build","     * @for Base","     */","    var Base = Y.Base,","        L = Y.Lang,","        INITIALIZER = \"initializer\",","        DESTRUCTOR = \"destructor\",","        build,","        arrayAggregator = function (prop, r, s) {","            if (s[prop]) {","                r[prop] = (r[prop] || []).concat(s[prop]);","            }    ","        };","","    Base._build = function(name, main, extensions, px, sx, cfg) {","","        var build = Base._build,","","            builtClass = build._ctor(main, cfg),","            buildCfg = build._cfg(main, cfg, extensions),","","            _mixCust = build._mixCust,","","            dynamic = builtClass._yuibuild.dynamic,","","            i, l, extClass, extProto,","            initializer,","            destructor;","","        // Augment/Aggregate","        for (i = 0, l = extensions.length; i < l; i++) {","            extClass = extensions[i];","","            extProto = extClass.prototype;","            ","            initializer = extProto[INITIALIZER];","            destructor = extProto[DESTRUCTOR];","            delete extProto[INITIALIZER];","            delete extProto[DESTRUCTOR];","","            // Prototype, old non-displacing augment","            Y.mix(builtClass, extClass, true, null, 1);","","            // Custom Statics","            _mixCust(builtClass, extClass, buildCfg);","","            if (initializer) { ","                extProto[INITIALIZER] = initializer;","            }","","            if (destructor) {","                extProto[DESTRUCTOR] = destructor;","            }","","            builtClass._yuibuild.exts.push(extClass);","        }","","        if (px) {","            Y.mix(builtClass.prototype, px, true);","        }","","        if (sx) {","            Y.mix(builtClass, build._clean(sx, buildCfg), true);","            _mixCust(builtClass, sx, buildCfg);","        }","","        builtClass.prototype.hasImpl = build._impl;","","        if (dynamic) {","            builtClass.NAME = name;","            builtClass.prototype.constructor = builtClass;","        }","","        return builtClass;","    };","","    build = Base._build;","","    Y.mix(build, {","","        _mixCust: function(r, s, cfg) {","            ","            var aggregates, ","                custom, ","                statics,","                aggr,","                l,","                i;","                ","            if (cfg) {","                aggregates = cfg.aggregates;","                custom = cfg.custom;","                statics = cfg.statics;","            }","","            if (statics) {","                Y.mix(r, s, true, statics);","            }","","            if (aggregates) {","                for (i = 0, l = aggregates.length; i < l; i++) {","                    aggr = aggregates[i];","                    if (!r.hasOwnProperty(aggr) && s.hasOwnProperty(aggr)) {","                        r[aggr] = L.isArray(s[aggr]) ? [] : {};","                    }","                    Y.aggregate(r, s, true, [aggr]);","                }","            }","","            if (custom) {","                for (i in custom) {","                    if (custom.hasOwnProperty(i)) {","                        custom[i](i, r, s);","                    }","                }","            }","            ","        },","","        _tmpl: function(main) {","","            function BuiltClass() {","                BuiltClass.superclass.constructor.apply(this, arguments);","            }","            Y.extend(BuiltClass, main);","","            return BuiltClass;","        },","","        _impl : function(extClass) {","            var classes = this._getClasses(), i, l, cls, exts, ll, j;","            for (i = 0, l = classes.length; i < l; i++) {","                cls = classes[i];","                if (cls._yuibuild) {","                    exts = cls._yuibuild.exts;","                    ll = exts.length;","    ","                    for (j = 0; j < ll; j++) {","                        if (exts[j] === extClass) {","                            return true;","                        }","                    }","                }","            }","            return false;","        },","","        _ctor : function(main, cfg) {","","           var dynamic = (cfg && false === cfg.dynamic) ? false : true,","               builtClass = (dynamic) ? build._tmpl(main) : main,","               buildCfg = builtClass._yuibuild;","","            if (!buildCfg) {","                buildCfg = builtClass._yuibuild = {};","            }","","            buildCfg.id = buildCfg.id || null;","            buildCfg.exts = buildCfg.exts || [];","            buildCfg.dynamic = dynamic;","","            return builtClass;","        },","","        _cfg : function(main, cfg, exts) {","            var aggr = [], ","                cust = {},","                statics = [],","                buildCfg,","                cfgAggr = (cfg && cfg.aggregates),","                cfgCustBuild = (cfg && cfg.custom),","                cfgStatics = (cfg && cfg.statics),","                c = main,","                i, ","                l;","","            // Prototype Chain","            while (c && c.prototype) {","                buildCfg = c._buildCfg;","                if (buildCfg) {","                    if (buildCfg.aggregates) {","                        aggr = aggr.concat(buildCfg.aggregates);","                    }","                    if (buildCfg.custom) {","                        Y.mix(cust, buildCfg.custom, true);","                    }","                    if (buildCfg.statics) {","                        statics = statics.concat(buildCfg.statics);","                    }","                }","                c = c.superclass ? c.superclass.constructor : null;","            }","","            // Exts","            if (exts) {","                for (i = 0, l = exts.length; i < l; i++) {","                    c = exts[i];","                    buildCfg = c._buildCfg;","                    if (buildCfg) {","                        if (buildCfg.aggregates) {","                            aggr = aggr.concat(buildCfg.aggregates);","                        }","                        if (buildCfg.custom) {","                            Y.mix(cust, buildCfg.custom, true);","                        }","                        if (buildCfg.statics) {","                            statics = statics.concat(buildCfg.statics);","                        }","                    }                    ","                }","            }","","            if (cfgAggr) {","                aggr = aggr.concat(cfgAggr);","            }","","            if (cfgCustBuild) {","                Y.mix(cust, cfg.cfgBuild, true);","            }","","            if (cfgStatics) {","                statics = statics.concat(cfgStatics);","            }","","            return {","                aggregates: aggr,","                custom: cust,","                statics: statics","            };","        },","","        _clean : function(sx, cfg) {","            var prop, i, l, sxclone = Y.merge(sx),","                aggregates = cfg.aggregates,","                custom = cfg.custom;","","            for (prop in custom) {","                if (sxclone.hasOwnProperty(prop)) {","                    delete sxclone[prop];","                }","            }","","            for (i = 0, l = aggregates.length; i < l; i++) {","                prop = aggregates[i];","                if (sxclone.hasOwnProperty(prop)) {","                    delete sxclone[prop];","                }","            }","","            return sxclone;","        }","    });","","    /**","     * <p>","     * Builds a custom constructor function (class) from the","     * main function, and array of extension functions (classes)","     * provided. The NAME field for the constructor function is ","     * defined by the first argument passed in.","     * </p>","     * <p>","     * The cfg object supports the following properties","     * </p>","     * <dl>","     *    <dt>dynamic &#60;boolean&#62;</dt>","     *    <dd>","     *    <p>If true (default), a completely new class","     *    is created which extends the main class, and acts as the ","     *    host on which the extension classes are augmented.</p>","     *    <p>If false, the extensions classes are augmented directly to","     *    the main class, modifying the main class' prototype.</p>","     *    </dd>","     *    <dt>aggregates &#60;String[]&#62;</dt>","     *    <dd>An array of static property names, which will get aggregated","     *    on to the built class, in addition to the default properties build ","     *    will always aggregate as defined by the main class' static _buildCfg","     *    property.","     *    </dd>","     * </dl>","     *","     * @method build","     * @deprecated Use the more convenient Base.create and Base.mix methods instead","     * @static","     * @param {Function} name The name of the new class. Used to define the NAME property for the new class.","     * @param {Function} main The main class on which to base the built class","     * @param {Function[]} extensions The set of extension classes which will be","     * augmented/aggregated to the built class.","     * @param {Object} cfg Optional. Build configuration for the class (see description).","     * @return {Function} A custom class, created from the provided main and extension classes","     */","    Base.build = function(name, main, extensions, cfg) {","        return build(name, main, extensions, null, null, cfg);","    };","","    /**","     * Creates a new class (constructor function) which extends the base class passed in as the second argument, ","     * and mixes in the array of extensions provided.","     * ","     * Prototype properties or methods can be added to the new class, using the px argument (similar to Y.extend).","     * ","     * Static properties or methods can be added to the new class, using the sx argument (similar to Y.extend).","     * ","     * **NOTE FOR COMPONENT DEVELOPERS**: Both the `base` class, and `extensions` can define static a `_buildCfg` ","     * property, which acts as class creation meta-data, and drives how special static properties from the base ","     * class, or extensions should be copied, aggregated or (custom) mixed into the newly created class.","     * ","     * The `_buildCfg` property is a hash with 3 supported properties: `statics`, `aggregates` and `custom`, e.g:","     * ","     *     // If the Base/Main class is the thing introducing the property:","     * ","     *     MyBaseClass._buildCfg = {","     *     ","     *        // Static properties/methods to copy (Alias) to the built class.","     *        statics: [\"CopyThisMethod\", \"CopyThisProperty\"],","     * ","     *        // Static props to aggregate onto the built class.","     *        aggregates: [\"AggregateThisProperty\"],","     * ","     *        // Static properties which need custom handling (e.g. deep merge etc.)","     *        custom: {","     *           \"CustomProperty\" : function(property, Receiver, Supplier) {","     *              ...","     *              var triggers = Receiver.CustomProperty.triggers; ","                    Receiver.CustomProperty.triggers = triggers.concat(Supplier.CustomProperty.triggers);","     *              ...","     *           }","     *        }","     *     };","     * ","     *     MyBaseClass.CopyThisMethod = function() {...}; ","     *     MyBaseClass.CopyThisProperty = \"foo\";","     *     MyBaseClass.AggregateThisProperty = {...};","     *     MyBaseClass.CustomProperty = {","     *        triggers: [...]","     *     }","     *","     *     // Or, if the Extension is the thing introducing the property:","     * ","     *     MyExtension._buildCfg = {","     *         statics : ...","     *         aggregates : ...","     *         custom : ...  ","     *     }    ","     * ","     * This way, when users pass your base or extension class to `Y.Base.create` or `Y.Base.mix`, they don't need to","     * know which properties need special handling. `Y.Base` has a buildCfg which defines `ATTRS` for custom mix handling","     * (to protect the static config objects), and `Y.Widget` has a buildCfg which specifies `HTML_PARSER` for ","     * straight up aggregation.","     *","     * @method create","     * @static","     * @param {Function} name The name of the newly created class. Used to define the NAME property for the new class.","     * @param {Function} main The base class which the new class should extend. This class needs to be Base or a class derived from base (e.g. Widget).","     * @param {Function[]} extensions The list of extensions which will be mixed into the built class.","     * @param {Object} px The set of prototype properties/methods to add to the built class.","     * @param {Object} sx The set of static properties/methods to add to the built class.","     * @return {Function} The newly created class.","     */","    Base.create = function(name, base, extensions, px, sx) {","        return build(name, base, extensions, px, sx);","    };","","    /**","     * <p>Mixes in a list of extensions to an existing class.</p>","     * @method mix","     * @static","     * @param {Function} main The existing class into which the extensions should be mixed.  The class needs to be Base or a class derived from Base (e.g. Widget)","     * @param {Function[]} extensions The set of extension classes which will mixed into the existing main class.","     * @return {Function} The modified main class, with extensions mixed in.","     */","    Base.mix = function(main, extensions) {","        return build(null, main, extensions, null, null, {dynamic:false});","    };","","    /**","     * The build configuration for the Base class.","     *","     * Defines the static fields which need to be aggregated","     * when the Base class is used as the main class passed to","     * the <a href=\"#method_Base.build\">Base.build</a> method.","     *","     * @property _buildCfg","     * @type Object","     * @static","     * @final","     * @private","     */","    Base._buildCfg = {","        custom : {","            ATTRS : function(prop, r, s) {","","                r.ATTRS = r.ATTRS || {};","","                if (s.ATTRS) {","","                    var sAttrs = s.ATTRS,","                        rAttrs = r.ATTRS,","                        a;","","                    for (a in sAttrs) {","                        if (sAttrs.hasOwnProperty(a)) {","                            rAttrs[a] = rAttrs[a] || {};","                            Y.mix(rAttrs[a], sAttrs[a], true);","                        }","                    }","                }","            },","            _NON_ATTRS_CFG : arrayAggregator","        },","        aggregates : [\"_PLUG\", \"_UNPLUG\"]","    };","","","}, '3.7.3', {\"requires\": [\"base-base\"]});"];
_yuitest_coverage["build/base-build/base-build.js"].lines = {"1":0,"12":0,"18":0,"19":0,"23":0,"25":0,"39":0,"40":0,"42":0,"44":0,"45":0,"46":0,"47":0,"50":0,"53":0,"55":0,"56":0,"59":0,"60":0,"63":0,"66":0,"67":0,"70":0,"71":0,"72":0,"75":0,"77":0,"78":0,"79":0,"82":0,"85":0,"87":0,"91":0,"98":0,"99":0,"100":0,"101":0,"104":0,"105":0,"108":0,"109":0,"110":0,"111":0,"112":0,"114":0,"118":0,"119":0,"120":0,"121":0,"130":0,"131":0,"133":0,"135":0,"139":0,"140":0,"141":0,"142":0,"143":0,"144":0,"146":0,"147":0,"148":0,"153":0,"158":0,"162":0,"163":0,"166":0,"167":0,"168":0,"170":0,"174":0,"186":0,"187":0,"188":0,"189":0,"190":0,"192":0,"193":0,"195":0,"196":0,"199":0,"203":0,"204":0,"205":0,"206":0,"207":0,"208":0,"209":0,"211":0,"212":0,"214":0,"215":0,"221":0,"222":0,"225":0,"226":0,"229":0,"230":0,"233":0,"241":0,"245":0,"246":0,"247":0,"251":0,"252":0,"253":0,"254":0,"258":0,"299":0,"300":0,"367":0,"368":0,"379":0,"380":0,"396":0,"400":0,"402":0,"404":0,"408":0,"409":0,"410":0,"411":0};
_yuitest_coverage["build/base-build/base-build.js"].functions = {"arrayAggregator:17":0,"_build:23":0,"_mixCust:89":0,"BuiltClass:130":0,"_tmpl:128":0,"_impl:138":0,"_ctor:156":0,"_cfg:173":0,"_clean:240":0,"build:299":0,"create:367":0,"mix:379":0,"ATTRS:398":0,"(anonymous 1):1":0};
_yuitest_coverage["build/base-build/base-build.js"].coveredLines = 122;
_yuitest_coverage["build/base-build/base-build.js"].coveredFunctions = 14;
_yuitest_coverline("build/base-build/base-build.js", 1);
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
    _yuitest_coverfunc("build/base-build/base-build.js", "(anonymous 1)", 1);
_yuitest_coverline("build/base-build/base-build.js", 12);
var Base = Y.Base,
        L = Y.Lang,
        INITIALIZER = "initializer",
        DESTRUCTOR = "destructor",
        build,
        arrayAggregator = function (prop, r, s) {
            _yuitest_coverfunc("build/base-build/base-build.js", "arrayAggregator", 17);
_yuitest_coverline("build/base-build/base-build.js", 18);
if (s[prop]) {
                _yuitest_coverline("build/base-build/base-build.js", 19);
r[prop] = (r[prop] || []).concat(s[prop]);
            }    
        };

    _yuitest_coverline("build/base-build/base-build.js", 23);
Base._build = function(name, main, extensions, px, sx, cfg) {

        _yuitest_coverfunc("build/base-build/base-build.js", "_build", 23);
_yuitest_coverline("build/base-build/base-build.js", 25);
var build = Base._build,

            builtClass = build._ctor(main, cfg),
            buildCfg = build._cfg(main, cfg, extensions),

            _mixCust = build._mixCust,

            dynamic = builtClass._yuibuild.dynamic,

            i, l, extClass, extProto,
            initializer,
            destructor;

        // Augment/Aggregate
        _yuitest_coverline("build/base-build/base-build.js", 39);
for (i = 0, l = extensions.length; i < l; i++) {
            _yuitest_coverline("build/base-build/base-build.js", 40);
extClass = extensions[i];

            _yuitest_coverline("build/base-build/base-build.js", 42);
extProto = extClass.prototype;
            
            _yuitest_coverline("build/base-build/base-build.js", 44);
initializer = extProto[INITIALIZER];
            _yuitest_coverline("build/base-build/base-build.js", 45);
destructor = extProto[DESTRUCTOR];
            _yuitest_coverline("build/base-build/base-build.js", 46);
delete extProto[INITIALIZER];
            _yuitest_coverline("build/base-build/base-build.js", 47);
delete extProto[DESTRUCTOR];

            // Prototype, old non-displacing augment
            _yuitest_coverline("build/base-build/base-build.js", 50);
Y.mix(builtClass, extClass, true, null, 1);

            // Custom Statics
            _yuitest_coverline("build/base-build/base-build.js", 53);
_mixCust(builtClass, extClass, buildCfg);

            _yuitest_coverline("build/base-build/base-build.js", 55);
if (initializer) { 
                _yuitest_coverline("build/base-build/base-build.js", 56);
extProto[INITIALIZER] = initializer;
            }

            _yuitest_coverline("build/base-build/base-build.js", 59);
if (destructor) {
                _yuitest_coverline("build/base-build/base-build.js", 60);
extProto[DESTRUCTOR] = destructor;
            }

            _yuitest_coverline("build/base-build/base-build.js", 63);
builtClass._yuibuild.exts.push(extClass);
        }

        _yuitest_coverline("build/base-build/base-build.js", 66);
if (px) {
            _yuitest_coverline("build/base-build/base-build.js", 67);
Y.mix(builtClass.prototype, px, true);
        }

        _yuitest_coverline("build/base-build/base-build.js", 70);
if (sx) {
            _yuitest_coverline("build/base-build/base-build.js", 71);
Y.mix(builtClass, build._clean(sx, buildCfg), true);
            _yuitest_coverline("build/base-build/base-build.js", 72);
_mixCust(builtClass, sx, buildCfg);
        }

        _yuitest_coverline("build/base-build/base-build.js", 75);
builtClass.prototype.hasImpl = build._impl;

        _yuitest_coverline("build/base-build/base-build.js", 77);
if (dynamic) {
            _yuitest_coverline("build/base-build/base-build.js", 78);
builtClass.NAME = name;
            _yuitest_coverline("build/base-build/base-build.js", 79);
builtClass.prototype.constructor = builtClass;
        }

        _yuitest_coverline("build/base-build/base-build.js", 82);
return builtClass;
    };

    _yuitest_coverline("build/base-build/base-build.js", 85);
build = Base._build;

    _yuitest_coverline("build/base-build/base-build.js", 87);
Y.mix(build, {

        _mixCust: function(r, s, cfg) {
            
            _yuitest_coverfunc("build/base-build/base-build.js", "_mixCust", 89);
_yuitest_coverline("build/base-build/base-build.js", 91);
var aggregates, 
                custom, 
                statics,
                aggr,
                l,
                i;
                
            _yuitest_coverline("build/base-build/base-build.js", 98);
if (cfg) {
                _yuitest_coverline("build/base-build/base-build.js", 99);
aggregates = cfg.aggregates;
                _yuitest_coverline("build/base-build/base-build.js", 100);
custom = cfg.custom;
                _yuitest_coverline("build/base-build/base-build.js", 101);
statics = cfg.statics;
            }

            _yuitest_coverline("build/base-build/base-build.js", 104);
if (statics) {
                _yuitest_coverline("build/base-build/base-build.js", 105);
Y.mix(r, s, true, statics);
            }

            _yuitest_coverline("build/base-build/base-build.js", 108);
if (aggregates) {
                _yuitest_coverline("build/base-build/base-build.js", 109);
for (i = 0, l = aggregates.length; i < l; i++) {
                    _yuitest_coverline("build/base-build/base-build.js", 110);
aggr = aggregates[i];
                    _yuitest_coverline("build/base-build/base-build.js", 111);
if (!r.hasOwnProperty(aggr) && s.hasOwnProperty(aggr)) {
                        _yuitest_coverline("build/base-build/base-build.js", 112);
r[aggr] = L.isArray(s[aggr]) ? [] : {};
                    }
                    _yuitest_coverline("build/base-build/base-build.js", 114);
Y.aggregate(r, s, true, [aggr]);
                }
            }

            _yuitest_coverline("build/base-build/base-build.js", 118);
if (custom) {
                _yuitest_coverline("build/base-build/base-build.js", 119);
for (i in custom) {
                    _yuitest_coverline("build/base-build/base-build.js", 120);
if (custom.hasOwnProperty(i)) {
                        _yuitest_coverline("build/base-build/base-build.js", 121);
custom[i](i, r, s);
                    }
                }
            }
            
        },

        _tmpl: function(main) {

            _yuitest_coverfunc("build/base-build/base-build.js", "_tmpl", 128);
_yuitest_coverline("build/base-build/base-build.js", 130);
function BuiltClass() {
                _yuitest_coverfunc("build/base-build/base-build.js", "BuiltClass", 130);
_yuitest_coverline("build/base-build/base-build.js", 131);
BuiltClass.superclass.constructor.apply(this, arguments);
            }
            _yuitest_coverline("build/base-build/base-build.js", 133);
Y.extend(BuiltClass, main);

            _yuitest_coverline("build/base-build/base-build.js", 135);
return BuiltClass;
        },

        _impl : function(extClass) {
            _yuitest_coverfunc("build/base-build/base-build.js", "_impl", 138);
_yuitest_coverline("build/base-build/base-build.js", 139);
var classes = this._getClasses(), i, l, cls, exts, ll, j;
            _yuitest_coverline("build/base-build/base-build.js", 140);
for (i = 0, l = classes.length; i < l; i++) {
                _yuitest_coverline("build/base-build/base-build.js", 141);
cls = classes[i];
                _yuitest_coverline("build/base-build/base-build.js", 142);
if (cls._yuibuild) {
                    _yuitest_coverline("build/base-build/base-build.js", 143);
exts = cls._yuibuild.exts;
                    _yuitest_coverline("build/base-build/base-build.js", 144);
ll = exts.length;
    
                    _yuitest_coverline("build/base-build/base-build.js", 146);
for (j = 0; j < ll; j++) {
                        _yuitest_coverline("build/base-build/base-build.js", 147);
if (exts[j] === extClass) {
                            _yuitest_coverline("build/base-build/base-build.js", 148);
return true;
                        }
                    }
                }
            }
            _yuitest_coverline("build/base-build/base-build.js", 153);
return false;
        },

        _ctor : function(main, cfg) {

           _yuitest_coverfunc("build/base-build/base-build.js", "_ctor", 156);
_yuitest_coverline("build/base-build/base-build.js", 158);
var dynamic = (cfg && false === cfg.dynamic) ? false : true,
               builtClass = (dynamic) ? build._tmpl(main) : main,
               buildCfg = builtClass._yuibuild;

            _yuitest_coverline("build/base-build/base-build.js", 162);
if (!buildCfg) {
                _yuitest_coverline("build/base-build/base-build.js", 163);
buildCfg = builtClass._yuibuild = {};
            }

            _yuitest_coverline("build/base-build/base-build.js", 166);
buildCfg.id = buildCfg.id || null;
            _yuitest_coverline("build/base-build/base-build.js", 167);
buildCfg.exts = buildCfg.exts || [];
            _yuitest_coverline("build/base-build/base-build.js", 168);
buildCfg.dynamic = dynamic;

            _yuitest_coverline("build/base-build/base-build.js", 170);
return builtClass;
        },

        _cfg : function(main, cfg, exts) {
            _yuitest_coverfunc("build/base-build/base-build.js", "_cfg", 173);
_yuitest_coverline("build/base-build/base-build.js", 174);
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
            _yuitest_coverline("build/base-build/base-build.js", 186);
while (c && c.prototype) {
                _yuitest_coverline("build/base-build/base-build.js", 187);
buildCfg = c._buildCfg;
                _yuitest_coverline("build/base-build/base-build.js", 188);
if (buildCfg) {
                    _yuitest_coverline("build/base-build/base-build.js", 189);
if (buildCfg.aggregates) {
                        _yuitest_coverline("build/base-build/base-build.js", 190);
aggr = aggr.concat(buildCfg.aggregates);
                    }
                    _yuitest_coverline("build/base-build/base-build.js", 192);
if (buildCfg.custom) {
                        _yuitest_coverline("build/base-build/base-build.js", 193);
Y.mix(cust, buildCfg.custom, true);
                    }
                    _yuitest_coverline("build/base-build/base-build.js", 195);
if (buildCfg.statics) {
                        _yuitest_coverline("build/base-build/base-build.js", 196);
statics = statics.concat(buildCfg.statics);
                    }
                }
                _yuitest_coverline("build/base-build/base-build.js", 199);
c = c.superclass ? c.superclass.constructor : null;
            }

            // Exts
            _yuitest_coverline("build/base-build/base-build.js", 203);
if (exts) {
                _yuitest_coverline("build/base-build/base-build.js", 204);
for (i = 0, l = exts.length; i < l; i++) {
                    _yuitest_coverline("build/base-build/base-build.js", 205);
c = exts[i];
                    _yuitest_coverline("build/base-build/base-build.js", 206);
buildCfg = c._buildCfg;
                    _yuitest_coverline("build/base-build/base-build.js", 207);
if (buildCfg) {
                        _yuitest_coverline("build/base-build/base-build.js", 208);
if (buildCfg.aggregates) {
                            _yuitest_coverline("build/base-build/base-build.js", 209);
aggr = aggr.concat(buildCfg.aggregates);
                        }
                        _yuitest_coverline("build/base-build/base-build.js", 211);
if (buildCfg.custom) {
                            _yuitest_coverline("build/base-build/base-build.js", 212);
Y.mix(cust, buildCfg.custom, true);
                        }
                        _yuitest_coverline("build/base-build/base-build.js", 214);
if (buildCfg.statics) {
                            _yuitest_coverline("build/base-build/base-build.js", 215);
statics = statics.concat(buildCfg.statics);
                        }
                    }                    
                }
            }

            _yuitest_coverline("build/base-build/base-build.js", 221);
if (cfgAggr) {
                _yuitest_coverline("build/base-build/base-build.js", 222);
aggr = aggr.concat(cfgAggr);
            }

            _yuitest_coverline("build/base-build/base-build.js", 225);
if (cfgCustBuild) {
                _yuitest_coverline("build/base-build/base-build.js", 226);
Y.mix(cust, cfg.cfgBuild, true);
            }

            _yuitest_coverline("build/base-build/base-build.js", 229);
if (cfgStatics) {
                _yuitest_coverline("build/base-build/base-build.js", 230);
statics = statics.concat(cfgStatics);
            }

            _yuitest_coverline("build/base-build/base-build.js", 233);
return {
                aggregates: aggr,
                custom: cust,
                statics: statics
            };
        },

        _clean : function(sx, cfg) {
            _yuitest_coverfunc("build/base-build/base-build.js", "_clean", 240);
_yuitest_coverline("build/base-build/base-build.js", 241);
var prop, i, l, sxclone = Y.merge(sx),
                aggregates = cfg.aggregates,
                custom = cfg.custom;

            _yuitest_coverline("build/base-build/base-build.js", 245);
for (prop in custom) {
                _yuitest_coverline("build/base-build/base-build.js", 246);
if (sxclone.hasOwnProperty(prop)) {
                    _yuitest_coverline("build/base-build/base-build.js", 247);
delete sxclone[prop];
                }
            }

            _yuitest_coverline("build/base-build/base-build.js", 251);
for (i = 0, l = aggregates.length; i < l; i++) {
                _yuitest_coverline("build/base-build/base-build.js", 252);
prop = aggregates[i];
                _yuitest_coverline("build/base-build/base-build.js", 253);
if (sxclone.hasOwnProperty(prop)) {
                    _yuitest_coverline("build/base-build/base-build.js", 254);
delete sxclone[prop];
                }
            }

            _yuitest_coverline("build/base-build/base-build.js", 258);
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
    _yuitest_coverline("build/base-build/base-build.js", 299);
Base.build = function(name, main, extensions, cfg) {
        _yuitest_coverfunc("build/base-build/base-build.js", "build", 299);
_yuitest_coverline("build/base-build/base-build.js", 300);
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
    _yuitest_coverline("build/base-build/base-build.js", 367);
Base.create = function(name, base, extensions, px, sx) {
        _yuitest_coverfunc("build/base-build/base-build.js", "create", 367);
_yuitest_coverline("build/base-build/base-build.js", 368);
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
    _yuitest_coverline("build/base-build/base-build.js", 379);
Base.mix = function(main, extensions) {
        _yuitest_coverfunc("build/base-build/base-build.js", "mix", 379);
_yuitest_coverline("build/base-build/base-build.js", 380);
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
    _yuitest_coverline("build/base-build/base-build.js", 396);
Base._buildCfg = {
        custom : {
            ATTRS : function(prop, r, s) {

                _yuitest_coverfunc("build/base-build/base-build.js", "ATTRS", 398);
_yuitest_coverline("build/base-build/base-build.js", 400);
r.ATTRS = r.ATTRS || {};

                _yuitest_coverline("build/base-build/base-build.js", 402);
if (s.ATTRS) {

                    _yuitest_coverline("build/base-build/base-build.js", 404);
var sAttrs = s.ATTRS,
                        rAttrs = r.ATTRS,
                        a;

                    _yuitest_coverline("build/base-build/base-build.js", 408);
for (a in sAttrs) {
                        _yuitest_coverline("build/base-build/base-build.js", 409);
if (sAttrs.hasOwnProperty(a)) {
                            _yuitest_coverline("build/base-build/base-build.js", 410);
rAttrs[a] = rAttrs[a] || {};
                            _yuitest_coverline("build/base-build/base-build.js", 411);
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
