/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('view', function (Y, NAME) {

/**
Represents a logical piece of an application's user interface, and provides a
lightweight, overridable API for rendering content and handling delegated DOM
events on a container element.

@module app
@submodule view
@since 3.4.0
**/

/**
Represents a logical piece of an application's user interface, and provides a
lightweight, overridable API for rendering content and handling delegated DOM
events on a container element.

The View class imposes little structure and provides only minimal functionality
of its own: it's basically just an overridable API interface that helps you
implement custom views.

As of YUI 3.5.0, View allows ad-hoc attributes to be specified at instantiation
time, so you don't need to subclass `Y.View` to add custom attributes. Just pass
them to the constructor:

    var view = new Y.View({foo: 'bar'});
    view.get('foo'); // => "bar"

@class View
@constructor
@extends Base
@since 3.4.0
**/

function View() {
    View.superclass.constructor.apply(this, arguments);
}

Y.View = Y.extend(View, Y.Base, {
    // -- Public Properties ----------------------------------------------------

    /**
    Template for this view's container.

    @property containerTemplate
    @type String
    @default "<div/>"
    @since 3.5.0
    **/
    containerTemplate: '<div/>',

    /**
    Hash of CSS selectors mapped to events to delegate to elements matching
    those selectors.

    CSS selectors are relative to the `container` element. Events are attached
    to the container, and delegation is used so that subscribers are only
    notified of events that occur on elements inside the container that match
    the specified selectors. This allows the container's contents to be re-
    rendered as needed without losing event subscriptions.

    Event handlers can be specified either as functions or as strings that map
    to function names on this view instance or its prototype.

    The `this` object in event handlers will refer to this view instance. If
    you'd prefer `this` to be something else, use `Y.bind()` to bind a custom
    `this` object.

    @example

        var view = new Y.View({
            events: {
                // Call `this.toggle()` whenever the element with the id
                // "toggle-button" is clicked.
                '#toggle-button': {click: 'toggle'},

                // Call `this.hoverOn()` when the mouse moves over any element
                // with the "hoverable" class, and `this.hoverOff()` when the
                // mouse moves out of any element with the "hoverable" class.
                '.hoverable': {
                    mouseover: 'hoverOn',
                    mouseout : 'hoverOff'
                }
            }
        });

    @property events
    @type Object
    @default {}
    **/
    events: {},

    /**
    Template for this view's contents.

    This is a convenience property that has no default behavior of its own.
    It's only provided as a convention to allow you to store whatever you
    consider to be a template, whether that's an HTML string, a `Y.Node`
    instance, a Mustache template, or anything else your little heart
    desires.

    How this template gets used is entirely up to you and your custom
    `render()` method.

    @property template
    @type mixed
    @default ''
    **/
    template: '',

    // -- Protected Properties -------------------------------------------------

    /**
    This tells `Y.Base` that it should create ad-hoc attributes for config
    properties passed to View's constructor. This makes it possible to
    instantiate a view and set a bunch of attributes without having to subclass
    `Y.View` and declare all those attributes first.

    @property _allowAdHocAttrs
    @type Boolean
    @default true
    @protected
    @since 3.5.0
    **/
    _allowAdHocAttrs: true,

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        config || (config = {});

        // Set instance properties specified in the config.
        config.containerTemplate &&
            (this.containerTemplate = config.containerTemplate);

        config.template && (this.template = config.template);

        // Merge events from the config into events in `this.events`.
        this.events = config.events ? Y.merge(this.events, config.events) :
            this.events;

        // When the container node changes (or when it's set for the first
        // time), we'll attach events to it, but not until then. This allows the
        // container to be created lazily the first time it's accessed rather
        // than always on init.
        this.after('containerChange', this._afterContainerChange);
    },

    /**
    Destroys this View, detaching any DOM events and optionally also destroying
    its container node.

    By default, the container node will not be destroyed. Pass an _options_
    object with a truthy `remove` property to destroy the container as well.

    @method destroy
    @param {Object} [options] Options.
        @param {Boolean} [options.remove=false] If `true`, this View's container
            will be removed from the DOM and destroyed as well.
    @chainable
    */
    destroy: function (options) {
        // We also accept `delete` as a synonym for `remove`.
        if (options && (options.remove || options['delete'])) {
            // Attaching an event handler here because the `destroy` event is
            // preventable. If we destroyed the container before calling the
            // superclass's `destroy()` method and the event was prevented, the
            // class would end up in a broken state.
            this.onceAfter('destroy', function () {
                this._destroyContainer();
            });
        }

        return View.superclass.destroy.call(this);
    },

    destructor: function () {
        this.detachEvents();
        delete this._container;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Attaches delegated event handlers to this view's container element. This
    method is called internally to subscribe to events configured in the
    `events` attribute when the view is initialized.

    You may override this method to customize the event attaching logic.

    @method attachEvents
    @param {Object} [events] Hash of events to attach. See the docs for the
        `events` attribute for details on the format. If not specified, this
        view's `events` property will be used.
    @chainable
    @see detachEvents
    **/
    attachEvents: function (events) {
        var container = this.get('container'),
            owns      = Y.Object.owns,
            handler, handlers, name, selector;

        this.detachEvents();

        events || (events = this.events);

        for (selector in events) {
            if (!owns(events, selector)) { continue; }

            handlers = events[selector];

            for (name in handlers) {
                if (!owns(handlers, name)) { continue; }

                handler = handlers[name];

                // TODO: Make this more robust by using lazy-binding:
                // `handler = Y.bind(handler, this);`
                if (typeof handler === 'string') {
                    handler = this[handler];
                }

                if (!handler) {
                    Y.log('Missing handler for ' + selector + ' ' + name + ' event.', 'warn', 'View');
                    continue;
                }

                this._attachedViewEvents.push(
                    container.delegate(name, handler, selector, this));
            }
        }

        return this;
    },

    /**
    Creates and returns a container node for this view.

    By default, the container is created from the HTML template specified in the
    `containerTemplate` property, and is _not_ added to the DOM automatically.

    You may override this method to customize how the container node is created
    (such as by rendering it from a custom template format). Your method must
    return a `Y.Node` instance.

    @method create
    @param {HTMLElement|Node|String} [container] Selector string, `Y.Node`
        instance, or DOM element to use at the container node.
    @return {Node} Node instance of the created container node.
    **/
    create: function (container) {
        return container ? Y.one(container) :
                Y.Node.create(this.containerTemplate);
    },

    /**
    Detaches DOM events that have previously been attached to the container by
    `attachEvents()`.

    @method detachEvents
    @chainable
    @see attachEvents
    **/
    detachEvents: function () {
        Y.Array.each(this._attachedViewEvents, function (handle) {
            if (handle) {
                handle.detach();
            }
        });

        this._attachedViewEvents = [];
        return this;
    },

    /**
    Removes this view's container element from the DOM (if it's in the DOM),
    but doesn't destroy it or any event listeners attached to it.

    @method remove
    @chainable
    **/
    remove: function () {
        var container = this.get('container');
        container && container.remove();
        return this;
    },

    /**
    Renders this view.

    This method is a noop by default. Override it to provide a custom
    implementation that renders this view's content and appends it to the
    container element. Ideally your `render` method should also return `this` as
    the end to allow chaining, but that's up to you.

    Since there's no default renderer, you're free to render your view however
    you see fit, whether that means manipulating the DOM directly, dumping
    strings into `innerHTML`, or using a template language of some kind.

    For basic templating needs, `Y.Node.create()` and `Y.Lang.sub()` may
    suffice, but there are no restrictions on what tools or techniques you can
    use to render your view. All you need to do is append something to the
    container element at some point, and optionally append the container
    to the DOM if it's not there already.

    @method render
    @chainable
    **/
    render: function () {
        return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Removes the `container` from the DOM and purges all its event listeners.

    @method _destroyContainer
    @protected
    **/
    _destroyContainer: function () {
        var container = this.get('container');
        container && container.remove(true);
    },

    /**
    Getter for the `container` attribute.

    @method _getContainer
    @param {Node|null} value Current attribute value.
    @return {Node} Container node.
    @protected
    @since 3.5.0
    **/
    _getContainer: function (value) {
        // This wackiness is necessary to enable fully lazy creation of the
        // container node both when no container is specified and when one is
        // specified via a valueFn.

        if (!this._container) {
            if (value) {
                // Attach events to the container when it's specified via a
                // valueFn, which won't fire the containerChange event.
                this._container = value;
                this.attachEvents();
            } else {
                // Create a default container and set that as the new attribute
                // value. The `this._container` property prevents infinite
                // recursion.
                value = this._container = this.create();
                this._set('container', value);
            }
        }

        return value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `containerChange` events. Detaches event handlers from the old
    container (if any) and attaches them to the new container.

    Right now the `container` attr is initOnly so this event should only ever
    fire the first time the container is created, but in the future (once Y.App
    can handle it) we may allow runtime container changes.

    @method _afterContainerChange
    @protected
    @since 3.5.0
    **/
    _afterContainerChange: function () {
        this.attachEvents(this.events);
    }
}, {
    NAME: 'view',

    ATTRS: {
        /**
        Container node into which this view's content will be rendered.

        The container node serves as the host for all DOM events attached by the
        view. Delegation is used to handle events on children of the container,
        allowing the container's contents to be re-rendered at any time without
        losing event subscriptions.

        The default container is a `<div>` Node, but you can override this in
        a subclass, or by passing in a custom `container` config value at
        instantiation time. If you override the default container in a subclass
        using `ATTRS`, you must use the `valueFn` property. The view's constructor
        will ignore any assignments using `value`.

        When `container` is overridden by a subclass or passed as a config
        option at instantiation time, you can provide it as a selector string, a
        DOM element, a `Y.Node` instance, or (if you are subclassing and modifying
        the attribute), a `valueFn` function that returns a `Y.Node` instance.
        The value will be converted into a `Y.Node` instance if it isn't one
        already.

        The container is not added to the page automatically. This allows you to
        have full control over how and when your view is actually rendered to
        the page.

        @attribute container
        @type HTMLElement|Node|String
        @default Y.Node.create(this.containerTemplate)
        @writeOnce
        **/
        container: {
            getter   : '_getContainer',
            setter   : Y.one,
            writeOnce: true
        }
    },

    /**
    Properties that shouldn't be turned into ad-hoc attributes when passed to
    View's constructor.

    @property _NON_ATTRS_CFG
    @type Array
    @static
    @protected
    @since 3.5.0
    **/
    _NON_ATTRS_CFG: [
        'containerTemplate',
        'events',
        'template'
    ]
});



}, '3.7.3', {"requires": ["base-build", "node-event-delegate"]});
