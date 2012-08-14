#Introduction

This is a demo of the TodoMVC app using [Backbone.xmpp](http://github.com/ggozad/Backbone.xmpp).

Backbone.xmpp allows use to use XMPP PubSub nodes for syncing your Backbone models/collections, providing real-time updates.



#Installation of the XMPP server with installer

In the `server` directory scripts are included to help you build and configure an XMPP server without too much hussle.
If you wish you to use the ejabberd installer you can get it [here](http://www.process-one.net/en/ejabberd/downloads/)
Once the installation is complete, run the following to generate a config file with all you need.


    cd server
    python bootstrap.py
    ./bin/buildout

Replace now the default `ejabberd.cfg` with the one found at `server/etc/ejabberd.cfg`.

#Installation of the XMPP server from source

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



