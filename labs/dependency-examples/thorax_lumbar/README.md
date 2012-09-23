Thorax + Lumbar TodoMVC
=======================

This example uses [Thorax](http://thoraxjs.org) and [Lumbar](http://walmartlabs.github.com/lumbar). The compiled JavaScript is included in the repo, to re-build the files run: 

    npm install
    npm start

Lumbar will create a `public/base.js` file that contains the core libraries needed to run the application, and a master router that listens to all routes defined in `lumbar.json`. When one of those routes is visited the appropriate module file is loaded, in this case `public/todomvc.js`.