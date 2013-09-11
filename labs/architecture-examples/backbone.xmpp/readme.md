#Introduction

This is a demo of the TodoMVC app using [Backbone.xmpp](http://github.com/ggozad/Backbone.xmpp).

Backbone.xmpp is a drop-in replacement for Backbone’s RESTful API, allowing models/collections to be persisted on XMPP Pub-Sub nodes. Naturally, Collections are mapped to nodes, whereas Models to the items of these nodes. Additionally, it listens for events on these nodes, receiving and propagating real-time updates of the models/collections from the server.

This makes it easy to build applications that receive updates in real-time without the need to revert to polling.

Migrating existing Backbone models/collections to use Backbone.xmpp is trivial: You can construct your models extending from `PubSubItem` instead of `Backbone.Model` and your collections from `PubSubNode` instead of `Backbone.Collection` as such:

```javascript
var MyModel = PubSubItem.extend({
    ...
});

var MyCollection = PubSubNode.extend({
    model: MyModel,
    ...
});
````

and you create instances of your collections passing the `id` of the node and your XMPP `connection` object.

```javascript

var mycollection = new MyCollection([], {id: 'mymodels', connection: connection});
```

Events are handled automatically, so when for instance a model is destroyed by some client, other clients will receive a `remove` event on their collections. Please refer to the [original](http://ggozad.com/Backbone.xmpp/) documentation for more information.
To have an idea of the effort involved, here is the diff between the localStorage version and the Backbone.xmpp one: https://github.com/ggozad/todomvc/compare/17ead933...f0729d79


#Installation of a demo XMPP server with the ejabberd installer

In the `server` directory scripts are included to help you build and configure an XMPP server without too much hussle.
If you wish you to use the ejabberd installer you can get it [here](http://www.process-one.net/en/ejabberd/downloads/). When prompted for the domain and admin user, use `localhost` as the domain and `admin` for the user with `admin` as password.
Once the installation is complete, run the following to generate a config file with all you need.

    cd server
    python bootstrap.py
    ./bin/buildout

Replace now the default `ejabberd.cfg` with the one found at `server/etc/ejabberd.cfg`.

#Installation of the demo XMPP server from source

You will need to have erlang and python installed to compile it for your platform. Follow the following steps:

 * Uncomment the `ejabberd` line in the parts section of `buildout.cfg`.
 * Specify the path to the erlang binary by changing the `erlang-path` variable in the `buildout.cfg` file.
 * Run buildout as in the section above.

Once buildout completes, you should have a compiled ejabberd.

Start ejabberd

    ./bin/ejabberd

and set up the `admin` user:

    ./bin/ejabberdctl register admin localhost admin

Usage
-----

While ejabberd is running, you can open the `index.html` and a few browser windows (use different browsers, or "incognito" mode) to observe real-time updates across them.
