# TodoMVC on SocketStream

SocketStream is an open source Node.js framework. SocketStream is designed to work well alongside other NPM modules. SocketStream gives you a set of  essential functionalities and lets you extend it with the NPM modules you want and need. This makes a good base to build from but doesn't force you to change all the NPM modules you are using.

# This TodoMVC example

This example is built with SocketStream and uses ss-hogan as its template Engine, I have kept the number of NPM modules to a minimum. I have not added any more NPM modules for the risk of confusing StocketsStream's functionality with any other module’s functionality. 

I have decided to keep all the logic on the client side in this example. You can build a similar app with the logic on the server side by only moving the functions to server side and making calling them an rpc call to the server. In this example the server asks for the list of todos when a new user connects and broadcast all the changes you do to the rest of the connected clients. 

# To install 

Make sure you have Node.js installed. You can test that you have Node.js installed by running "node -v" in your terminal if Node.js is installed you should get a response similar to v0.6.17 but the version you have installed. If you don’t have Node.js installed go to [nodejs.org](http://nodejs.org/) 

When you have Node.js installed you cd in to the root folder of the this app.

When you are in the root folder write "npm install" in your terminal. This will install all the dependencies of this project. The dependencies is ss-hogan and socketstream. 

Now when you have all installed it time to rune the app. You rune the app by writing “node app.js” in your terminal. This will start the app on your localhost and port 3000 so open your browser and go to http://localhost:3000. 

You should open two or more browser windows and go to this site. If you now add a todo in one of the windows you can see how its immediately appear’s in all the other windows. 

You can have a look in your terminal when running the app to see what is going over the server. 

# Help

If you are having problems getting it to work please contact me on me@dennis.is and we will try to get it to work for you.