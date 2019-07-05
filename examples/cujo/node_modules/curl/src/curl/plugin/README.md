curl.js loader plugins
===

Please see the wiki for information about using plugins.  If you're interested
in creating your own plugins, please check out the Plugin Author's Guide
on the wiki (TBD).

All of these plugins conform to the AMD specification.  However, that
doesn't necessarily mean that they'll work with other AMD loaders or
builders.  Until the build-time API of AMD is finalized, there will be
incompatibilities.

Modules that should work with any loader/builder:

async!
domReady!
js!
link!

TODO:

json! (auto-detects xdomain and uses JSON-P)
