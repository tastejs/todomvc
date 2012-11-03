# PlastronJS TodoMVC app

A todo app using [PlastronJS](https://github.com/rhysbrettbowen/PlastronJS) and [Closure Tools](https://developers.google.com/closure/)


## Run

Just open the index.html in your browser


## Run uncompiled

The app is built with [Plovr](http://plovr.com/). To run the unminified version you need to [download Plovr](http://plovr.com/download.html), create a directory called "build" and put the jar file in the build folder.

You will then need to [download PlastronJS](https://github.com/rhysbrettbowen/PlastronJS) to js/lib (you will need to create the folder).

Next open a command prompt in the base directory of the PlastronJS TodoMVC example and type in:

```shell
java -jar build/plovr.jar serve plovr.json
```

Change the script src at the bottom of the index.html from js/compiled.js to:

```
http://localhost:9810/compile?id=todomvc&mode=raw
```

You can now view the uncompiled example and play around with it!


# Compilation

Once you have done the steps above you can compile any changes you make by running the below command:

```
java -jar build/plovr.jar build plovr.json
```

and view the compiled version for the page by changing the bottom script src back to js/compiled.


## Need help?

Message Rhys on [twitter](https://twitter.com/RhysBB)


## Credit

Created by [Rhys Brett-Bowen](http://rhysbrettbowen.com)
