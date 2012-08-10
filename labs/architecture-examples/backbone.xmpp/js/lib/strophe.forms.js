//    XMPP plugins for Strophe v0.2

//    (c) 2012 Yiorgis Gozadinos.
//    strophe.plugins is distributed under the MIT license.
//    http://github.com/ggozad/strophe.plugins


// Helpers for dealing with
// [XEP-0004: Data Forms](http://xmpp.org/extensions/xep-0004.html)

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'underscore', 'strophe'], function ($, _, Strophe) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (Strophe.x = factory($, _, Strophe));
        });
    } else {
        // Browser globals
        Strophe.x = factory(root.$, root._, root.Strophe);
    }
}(this,function ($, _, Strophe) {

    // **Option** contructor
    var Option = function (opts) {

        opts = opts || {};
        this.value = opts.value || '';
        this.label = opts.label;

    };

    // **Option.prototype** **toXMl** and **toJSON** extensions.
    _.extend(Option.prototype, {

        toXML: function () {
            var el, attrs = {};
            if (this.label) attrs.label = this.label;
            el = $build('option', attrs)
                .c('value').t(this.value.toString());
            return el.tree();
        },

        toJSON: function () {
            return {
                label: this.label,
                value: this.value
            };
        }

    });

    // Creates an **Option** from XML
    Option.fromXML = function (xml) {

        return new Option({
            label: ($(xml)).attr('label'),
            value: ($(xml)).text()
        });

    };

    // **Field** constructor
    var Field = function (opts) {

        opts = opts || {};
        this.type = opts.type || 'text-single';
        this['var'] = opts['var'] || 'undefined';
        this.desc = opts.desc;
        this.label = opts.label;
        this.required = opts.required === true || opts.required === 'true' || false;
        this.options = opts.options || [];
        this.values = opts.values || [];
        if (opts.value) this.values.push(opts.value);

        return this;
    };

    // **Field.prototype** **toXMl** and **toJSON** extensions.
    _.extend(Field.prototype, {

        toXML: function() {

            var attrs = {
                type: this.type,
                'var': this['var']
            };
            if (this.label) attrs.label = this.label;
            xml = $build('field', attrs);
            if (this.desc) xml.c('desc').t(this.desc).up();
            if (this.required) xml.c('required').up();
            _.each(this.values, function (value) {
                xml.c('value').t(value.toString()).up();
            });
            _.each(this.options, function (option) {
                xml.cnode(option.toXML()).up();
            });
            return xml.tree();

        },

        toJSON: function () {

            return {
                type: this.type,
                'var': this['var'],
                desc: this.desc,
                label: this.label,
                required: this.required,
                options: _.map(this.options, function (option) { return option.toJSON(); }),
                values: this.values
            };

        }

    });

    // Creates a **Field** from XML
    Field.fromXML = function (xml) {

        xml = $(xml);
        return new Field({
            type: xml.attr('type'),
            'var': xml.attr('var'),
            label: xml.attr('label'),
            desc: xml.find('desc').text(),
            required: xml.find('required').length === 1,
            options: _.map($('option', xml), function (option) { return new Option.fromXML(option);}),
            values: _.map($('>value', xml), function (value) { return $(value).text(); })
        });

    };

    // **Form** constructor
    var Form = function (opts) {

        opts = opts || {};
        this.type = opts.type || 'form';
        this.fields = opts.fields || [];
        this.title = opts.title;
        this.instructions = opts.instructions;
        return this;

    };

    // **Form.prototype** **toXMl** and **toJSON** extensions.
    _.extend(Form.prototype, {

        toXML: function () {
            var xml = $build('x', {
                    xmlns: 'jabber:x:data',
                    type: this.type
                });

            if (this.title) xml.c('title').t(this.title.toString()).up();
            if (this.instructions) xml.c('instructions').t(this.instructions.toString()).up();
            _.each(this.fields, function (field) { xml.cnode(field.toXML()).up(); });
            return xml.tree();
        },

        toJSON: function () {

            return {
                type: this.type,
                title: this.title,
                instructions: this.instructions,
                fields: _.map(this.fields, function (field) { return field.toJSON(); })
            };

        }
    });

    // Creates a **Form** from XML
    Form.fromXML = function (xml) {

        xml = $(xml);
        return new Form({
            type: xml.attr('type'),
            title: xml.find('title').text(),
            instructions: xml.find('instructions').text(),
            fields: _.map($('>field', xml), function (field) { return new Field.fromXML(field); })
        });

    };

    // Attach to **Strophe** as `x`. No need for a plugin.
    return {
        Form: Form,
        Field: Field,
        Option: Option
    };
}));
