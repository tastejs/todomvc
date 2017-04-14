/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('app-content', function (Y, NAME) {

/**
`Y.App` extension that provides pjax-style content fetching and handling.

@module app
@submodule app-content
@since 3.7.0
**/

var PjaxContent = Y.PjaxContent;

/**
`Y.App` extension that provides pjax-style content fetching and handling.

This makes it easy to fetch server rendered content for URLs using Ajax. The
HTML content returned from the server will be view-ified and set as the app's
main content, making it seamless to use a mixture of server and client rendered
views.

When the `"app-content"` module is used, it will automatically mix itself into
`Y.App`, and it provides three main features:

  - **`Y.App.Content.route`**: A stack of middleware which forms a pjax-style
    content route.

  - **`loadContent()`**: Route middleware which load content from a server. This
    makes an Ajax request for the requested URL, parses the returned content and
    puts it on the route's response object.

  - **`showContent()`**: Method which provides an easy way to view-ify HTML
    content which should be shown as an app's active/visible view.

The following is an example of how these features can be used:

    // Creates a new app and registers the `"post"` view.
    var app = new Y.App({
        views: {
            post: {type: Y.PostView}
        }
    });

    // Uses a simple server rendered content route for the About page.
    app.route('/about/', Y.App.Content.route);

    // Uses the `loadContent()` middleware to fetch the contents of the post
    // from the server and shows that content in a `"post"` view.
    app.route('/posts/:id/', 'loadContent', function (req, res, next) {
        this.showContent(res.content.node, {view: 'post'});
    });

@class App.Content
@uses PjaxContent
@extensionfor App
@since 3.7.0
**/
function AppContent() {
    PjaxContent.apply(this, arguments);
}

/**
A stack of middleware which forms a pjax-style content route.

This route will load the rendered HTML content from the server, then create and
show a new view using those contents.

@property route
@type Array
@static
@since 3.7.0
**/
AppContent.route = ['loadContent', '_contentRoute'];

AppContent.prototype = {
    // -- Public Methods -------------------------------------------------------

    /**
    Sets this app's `activeView` attribute using the specified `content`.

    This provides an easy way to view-ify HTML content which should be shown as
    this app's active/visible view. This method will determine the appropriate
    view `container` node based on the specified `content`. By default, a new
    `Y.View` instance will be created unless `options.view` is specified.

    Under the hood, this method calls the `showView()` method, so refer to its
    docs for more information.

    @method showContent
    @param {HTMLElement|Node|String} content The content to show, it may be
        provided as a selector string, a DOM element, or a `Y.Node` instance.
    @param {Object} [options] Optional objects containing any of the following
        properties in addition to any `showView()` options:

      @param {Object|String} [options.view] The name of a view defined in this
          app's `views`, or an object with the following properties:

        @param {String} options.view.name The name of a view defined in this
            app's `views`.
        @param {Object} [options.view.config] Optional configuration to use when
            creating the new view instance. This config object can also be used
            to update an existing or preserved view's attributes when
            `options.update` is `true`. **Note:** If a `container` is specified,
            it will be overridden by the `content` specified in the first
            argument.

    @param {Function} [callback] Optional callback function to call after the
        new `activeView` is ready to use. **Note:** this will override
        `options.callback` and it can be specified as either the second or third
        argument. The function will be passed the following:

      @param {View} callback.view A reference to the new `activeView`.

    @since 3.7.0
    @see App.showView()
    **/
    showContent: function (content, options, callback) {
        // Makes sure we have a node instance, and will query selector strings.
        content = Y.one(content);

        // Support the callback function being either the second or third arg.
        if (typeof options === 'function') {
            options  = {callback: options};
            callback = null;
        }

        // Mix in default option to *not* render the view because presumably we
        // have pre-rendered content here. This also creates a copy so we can
        // modify the object.
        options = Y.merge({render: false}, options);

        var view       = options.view || '',
            viewName   = typeof view === 'string' ? view : view.name,
            viewConfig = typeof view !== 'string' ? view.config : {},
            viewInfo   = this.getViewInfo(viewName),
            container, template, type, ViewConstructor;

        // Remove `view` from the `options` which will be passed along to the
        // `showView()` method.
        delete options.view;

        // When the specified `content` is a document fragment, we want to see
        // if it only contains a single node, and use that as the content. This
        // checks `childNodes` which will include text nodes.
        if (content && content.isFragment() &&
                content.get('childNodes').size() === 1) {

            content = content.get('firstChild');
        }

        // When the `content` is an element node (`nodeType` 1), we can use it
        // as-is for the `container`. Otherwise, we'll construct a new container
        // based on the `options.view`'s `containerTemplate`.
        if (content && content.get('nodeType') === 1) {
            container = content;
        } else {
            type = (viewInfo && viewInfo.type) || Y.View;

            // Looks for a namespaced constructor function on `Y`.
            ViewConstructor = typeof type === 'string' ?
                    Y.Object.getValue(Y, type.split('.')) : type;

            // Find the correct node template for the view.
            template  = ViewConstructor.prototype.containerTemplate;
            container = Y.Node.create(template);

            // Append the document fragment to the newly created `container`
            // node. This is the worst case where we have to create a wrapper
            // node around the `content`.
            container.append(content);
        }

        // Makes sure the view is created using _our_ `container` node.
        viewConfig = Y.merge(viewConfig, {container: container});

        // Finally switch to the new `activeView`. We want to make sure `view`
        // is a string if it's falsy, that way a new view will be created.
        return this.showView(viewName, viewConfig, options, callback);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Provides a default content route which will show a server rendered view.

    **Note:** This route callback assumes that it's called after the
    `loadContent()` middleware.

    @method _contentRoute
    @param {Object} req Request object.
    @param {Object} res Response Object.
    @param {Function} next Function to pass control to the next route callback.
    @protected
    @since 3.7.0
    @see Y.App.Content.route
    **/
    _contentRoute: function (req, res, next) {
        var content = res.content,
            doc     = Y.config.doc,
            activeViewHandle;

        // We must have some content to work with.
        if (!(content && content.node)) { return next(); }

        if (content.title && doc) {
            // Make sure the `activeView` does actually change before we go
            // messing with the page title.
            activeViewHandle = this.onceAfter('activeViewChange', function () {
                doc.title = content.title;
            });
        }

        this.showContent(content.node);

        // Detach the handle just in case.
        if (activeViewHandle) {
            activeViewHandle.detach();
        }

        next();
    }
};

// Mix statics.
Y.mix(AppContent, PjaxContent);
// Mix prototype.
Y.mix(AppContent, PjaxContent, false, null, 1);

// -- Namespace ----------------------------------------------------------------
Y.App.Content = AppContent;
Y.Base.mix(Y.App, [AppContent]);


}, '3.7.3', {"requires": ["app-base", "pjax-content"]});
