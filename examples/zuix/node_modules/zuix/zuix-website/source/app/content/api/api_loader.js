"use strict";
zuix.controller(function (cp) {

    const resourcePath = zuix.store('config').resourcePath;

    cp.create = function () {

        const apiName = cp.view().attr('data-ui-api');
        cp.view().html('Loading '+apiName+' API...');

        // download the jsDoc data file and HTML-format it.
        zuix.$.ajax({
            url: resourcePath+'content/api/data/'+apiName+'.json?'+Date.now(),
            success: function(json) {
                cp.view().html('');
                const dox = JSON.parse(json);

                const apiDocs = {};
                apiDocs.name = apiName;
                apiDocs.constructor = null;
                apiDocs.parameters = []; // constructor parameters
                apiDocs.methods = [];
                apiDocs.properties = [];
                apiDocs.types = []; // custom object/types used in this object
                apiDocs.callbacks = []; // callback functions

                zuix.$.each(dox, function() {

                    const skipItem = (this.isPrivate || (this.ctx != null && (this.ctx.name !== apiName && this.ctx.cons !== apiName)) || this.tags == null || this.tags.length === 0);
                    if (skipItem) {
                        return true;
                    }

                    if (this.isConstructor === true) {
                        apiDocs.constructor = addConstructor(this);
                        return true;
                    }

                    const apiMember = (!this.isPrivate && this.ctx != null && (this.ctx.cons === apiName));
                    if (apiMember) {
                        apiDocs.methods.push(addMember(this));
                        return true;
                    }

                    const itemType = this.tags[0].type;
                    switch (itemType) {
                        case 'param':
                            apiDocs.parameters.push(addType(this));
                            break;
                        case 'typedef':
                            const type = addType(this);
                            if (type.name === apiName)
                                apiDocs.properties = type.properties;
                            else
                                apiDocs.types.push(type);
                            break;
                        case 'callback':
                            apiDocs.callbacks.push(addHandler(this));
                            break;
                    }

                });

                zuix.load('content/api/api_template', {
                    data: apiDocs,
                    markdown: cp.options().markdown,
                    prism: cp.options().prism,
                    ready: function (ctx) {
                        const view = zuix.$(ctx.view());
                        view.addClass('animated')
                            .addClass('fadeIn');
                        cp.view().append(view.get());
                    }
                });

            },
            error: function() {
                cp.view().html('Error loading '+apiName+' API!');
            }
        });

    };

    function addConstructor(constructor) {
        const item = {};
        item.name = constructor.ctx.name;
        item.description = constructor.description.full || constructor.description;
        item.parameters = [];
        item.return = {};
        zuix.$.each(constructor.tags, function (i) {
            const param = getParam(this);
            if (this.type === 'param') {
                item.parameters.push(param);
            } else if (this.type === 'example') {
                item.example = this.string;
            } else if (this.type === 'return') {
                item.return = param;
            }
        });
        return item;
    }

    function addMember(member) {
        const item = {};
        item.name = member.ctx.name;
        item.description = member.description.full || member.description;
        item.parameters = [];
        item.return = [];
        item.example = '';
        zuix.$.each(member.tags, function () {
            const param = getParam(this);
            if (this.type === 'param') {
                item.parameters.push(param);
            } else if (this.type === 'example') {
                item.example = this.string;
            } else if (this.type === 'return') {
                item.return.push(param);
            }
        });
        return item;
    }

    function addType(typeDef) {
        const item = {};
        item.name = '';
        item.description = typeDef.description.full || typeDef.description;
        item.properties = [];
        item.example = '';
        zuix.$.each(typeDef.tags, function () {
            if (this.type === 'property') {
                const property = getParam(this);
                item.properties.push(property);
            } else if (this.type === 'example') {
                item.example = this.string;
            } else if (this.type === 'typedef') {
                item.name = this.string;
                if (item.name.indexOf('}') > 0)
                    item.name = item.name.substring(item.name.lastIndexOf('}')+1).trim();
            }
        });
        return item;
    }

    function addHandler(handler) {
        const item = {};
        item.name = handler.name;
        item.description = handler.description.full || handler.description;
        item.parameters = [];
        item.context = {};
        item.return = {};
        item.example = '';
        zuix.$.each(handler.tags, function (i) {
            const param = getParam(this);
            if (this.type === 'callback') {
                item.name = item.name || this.string;
            } else if (this.type === 'param') {
                item.parameters.push(param);
            } else if (this.type === 'example') {
                item.example = this.string;
            } else if (this.type === 'this') {
                item.context = this.string;
            } else if (this.type === 'return') {
                item.return = param;
            }
        });
        return item;
    }

    function getParam(parameter) {
        const param = {};
        param.name = parameter.name != null ? parameter.name.replace('[','').replace(']','') : null;
        param.description = parameter.description;
        param.types = parameter.types;
        param.optional = parameter.optional;
        return param;
    }

});
