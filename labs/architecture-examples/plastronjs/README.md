# PlastronJS • [TodoMVC](http://todomvc.com)

A todo app using [PlastronJS](https://github.com/rhysbrettbowen/PlastronJS)
and [Closure Tools](https://developers.google.com/closure/)

## Run

Just open the index.html in your browser

## Run uncompiled

The app is built with [Plovr](http://plovr.com/). You can run an unminified version of the site by openning the folder in your commandline and typing:

```
java -jar build/plovr serve plovr.json
```

and changing the script src at the bottom of the index.html from js/compiled.js to:

```
http://localhost:9810/compile?id=todomvc&mode=raw
```

## Need help?

shoot me a quick message on [twitter](https://twitter.com/#!/RhysBB)

## Credit

Created by [Rhys Brett-Bowen](http://rhysbrettbowen.com)
