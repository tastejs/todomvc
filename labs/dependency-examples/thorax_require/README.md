Thorax + RequireJS TodoMVC
==========================
Unlike the vanilla Thorax and Thorax + Lumbar implementations, this example does not make use of the Thorax registry / named views and templates. The views are still assigned a name property for debugging and consistency (each view's element will be assigned a data-view-name HTML attribute), but each dependency is explicitly pulled in via `define` instead of being pulled in by the `view` or `template` helpers, or automatic assignment of templates to views when they share a name. For example in the require.js app:

    # views/app.js

    template: Handlebars.compile(appTemplate),

    initialize: function() {
      this.statsView = new StatsView;
    }

    # templates/app.handlebars
    {{view statsView}}

In the Lumbar or vanilla Thorax implementations simply setting the name will auto assign the template of the same name, and the "stats" view can be included by name, rather than having to first initialize it.

    # views/app.js

    name: 'app'

    # templates/app.handlebars

    {{view "stats"}}

Thorax is flexible enough that the approach used in the require.js app will still work within lumbar or vanilla Thorax implementations, but the approach used in the require.js environment is the only one that will work with require.js