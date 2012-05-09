var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.I18n", ["js.core.Component"], function(Component) {
        return Component.inherit({
            defaults: {
                path: 'app/locale',
                locale: null,
                suffix: '.json',
                translations: {}
            },

            initialize: function() {
                this.callBase();

                this.loadLocale(this.$.locale);
            },

            _commitChangedAttributes: function(attributes) {
                if (attributes.locale) {
                    this.loadLocale(attributes.locale);
                }
            },

            loadLocale: function(locale, callback) {

                if (!locale) {
                    throw "locale not defined";
                }

                var self = this;
                rAppid.require(['json!' + this.$.path + '/' + this.$.locale + this.$.suffix], function (translations) {
                    if (callback) {
                        callback();
                    }

                    self.set({
                        translations: translations
                    });
                });
            },

            /**
             * @param [num] for plural or singular
             * @param key translation key
             * @param - replacement for %0
             * @param - replacement for %1 ...
             */
            translate: function() {

                var args = Array.prototype.slice.call(arguments);
                var key = args.shift(), isPlural;
                if(rAppid._.isNumber(key)){
                    isPlural = key !== 1;
                    key = args.shift();
                }
                if(isPlural){
                    key += "_plural";
                }

                var value = this.$.translations[key] || "";

                for (var i = 0; i < args.length; i++) {
                    // replace, placeholder
                    value = value.split("%" + i).join(args[i]);
                }

                return value;
            }.onChange("translations")
        })
    })
});