# Spyne.js
Spyne is a full-featured, Javascript framework that reactively renders to the Real DOM.

[![NPM version](https://img.shields.io/npm/v/spyne.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/spyne)
[![GitHub license](https://img.shields.io/github/license/spynejs/spyne.svg?longCache=true&style=flat-square)](https://github.com/spynejs/spyne/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/spynejs/spyne.svg?branch=master)](https://travis-ci.com/spynejs/spyne)

### Spyne.js’ key features includes:

* Real DOM architecture provides clarity and performance over Virtual DOM abstractions
* Chainable <b>ViewStreams</b> reactively maintains state
* Intuitive <b>Channel</b> data layer harnesses the power of RxJs
* Versatile process of extending components with pure, static functions
* Spyne debugger assists in 'wiring' Channels and ViewStreams
* Two dependencies, [RxJs](https://rxjs-dev.firebaseapp.com) and [ramda](https://ramdajs.com)




## Getting Started ##
**View Documentation**<br/>
https://spynejs.org

#### Install ##
```
npm install spyne
```
**Hello World**<br>
[Edit in codepen](https://codepen.io/nybatista/pen/Pvvweb)
```
// INIT SPYNE APP
const spyneApp = new spyne.SpyneApp({debug:true});

// PROPERTIES
const channelName    = 'CHANNEL_HELLO_WORLD';
const channelAction  = 'CHANNEL_HELLO_WORLD_DEFAULT_EVENT';
const channelConfig  = {sendCachedPayload:true};
const channelPayload = {text: "Hello World!"}

// CHANNEL INIT
let helloWorld$ = new spyne.Channel(channelName, channelConfig);
// REGISTER ACTION
helloWorld$.addRegisteredActions = ()=>[channelAction];
// REGISTER CHANNEL
spyneApp.registerChannel(helloWorld$)
// SEND CHANNEL PAYLOAD
helloWorld$.sendChannelPayload(channelAction, channelPayload);

// VIEWSTREAM
class App extends spyne.ViewStream {
  constructor() {
    super();
  }
  addActionListeners() {
    return [
      [channelAction, 'onHelloWorld'],
    ];
  }
  onHelloWorld(e){
     this.props.el.innerText = e.props().text;
  }
  onRendered() {
     this.addChannel(channelName);
  }
 
}

new App().appendToDom(document.body);


 
```
**Download or Fork Example App** (Tutorial to be added soon)<br/>
https://github.com/spynejs/spyne-example-app <br>

**Todos Example**<br/>
https://todos.spynejs.org</br>

### Feedback
Spyne was just released as an open source project in May, 2019, and any feedback would be greatly appreciated!<br>
To suggest a feature or report a bug: https://github.com/spynejs/spyne/issues

[<img src="https://bstacksupport.zendesk.com/attachments/token/PhEt6nTTBau6HVpyq3IJsmUIG/?name=browserstack-logo-600x315.png" title="BrowsersStack.com Logo" height="100">](https://browserstack.com)<br>
BrowserStack.com supports open source projects like Spyne.js<br> 
Unit and Integration tests will run on real browsers and devices using BrowserStack's Automate system.<br><br>


Copyright (c) 2017-Present Frank Batista, Relevant Context LLC                   

