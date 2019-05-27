[![NPM version](https://img.shields.io/npm/v/spyne.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/spyne)
[![GitHub license](https://img.shields.io/github/license/spynejs/spyne.svg?longCache=true&style=flat-square)](https://github.com/spynejs/spyne/blob/master/LICENSE)
# Spyne
<em>Spyne is a full-featured, reactive framework that creates ‘easy to reason about’ code</em>

### Spyne introduces several innovations to frontend frameworks:

* ViewStreams and Channels communicate globally while remaining encapsulated
* Chainable ViewStreams reactively maintain state
* Events are first class citizens, and are streamed as data, in the form of Channels
* Routing based on a configurable map object
* Supercharges declarative 'backbonesque' style of coding with reactive and functional patterns, using [rxjs](https://rxjs-dev.firebaseapp.com) and [ramda](https://ramdajs.com)


## Getting Started ##
**View Documentation**<br/>
https://spynejs.org

#### Install ##
```
npm install spyne
```
**A Basic Spyne app**
```
import {SpyneApp, ViewStream} from 'spyne';
const spyne = new SpyneApp();

const app = new ViewStream({
   id: 'app'
});
app.appendToDom(document.body);
app.appendView(
    new ViewStream({tagName: 'h1', 'data': 'Hello World!'})
);

```
**Todos Example**<br/>
https://todos.spynejs.org</br>

**Download or Fork Example App**<br/>
https://github.com/spynejs/spyne-example-app <br>


**Spyne and the DCI Pattern**<br/>
Spyne is based on the *Data Context Interaction* pattern, which in a nutshell is organized to adjust the Context (HTML tags) of a site by broadcasting Interactive (ViewStream) events and  by listening to Data (Channels).

