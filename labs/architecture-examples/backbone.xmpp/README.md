Introduction
------------

This is a demo of the TodoMVC app using [Backbone.xmpp](http://github.com/ggozad/Backbone.xmpp).

Backbone.xmpp allows use to use XMPP PubSub nodes for syncing your Backbone models/collections, providing real-time updates.


Installation of the XMPP server (ejabberd)
------------------------------------------

In the `server` directory scripts are included to help you build and configure an XMPP server without too much hussle. You will need to have erlang and python installed to compile it for your platform. Specify the path to the erlang binary by changing the `erlang-path` variable in the `buildout.cfg` file.

    cd server
    python bootstrap.py
    ./bin/buildout

Once buildout completes, you should have a compiled ejabberd.
Proceed by setting up the `admin` user:

    ./bin/ejabberdctl register admin localhost admin

and start ejabberd

    ./bin/ejabberd

Usage
-----

While ejabberd is running, you can open the `index.html` and a few browser windows (use different browsers, or "incognito" mode) to observe real-time updates across them.



