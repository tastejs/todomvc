# Promise(executor)

- [Description](#description)
- [Signature](#signature)
	- [Static members](#static-members)
		- [Promise.resolve](#promiseresolve)
		- [Promise.reject](#promisereject)
		- [Promise.all](#promiseall)
		- [Promise.race](#promiserace)
	- [Instance members](#instance-members)
	  - [promise.then](#promisethen)
	  - [promise.catch](#promisecatch)
- [How it works](#how-it-works)
- [Promise chaining](#promise-chaining)
- [Promise absorption](#promise-absorption)
- [Error handling](#error-handling)
- [Shorthands](#shorthands)
- [Multiple promises](#multiple-promises)
- [Why not callbacks](#why-not-callbacks)

---

### Description

An [ES6 Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) polyfill.

A Promise is a mechanism for working with asynchronous computations.

Mithril provides a polyfill when the environment does not support Promises. The polyfill can also be referenced specifically via `m.PromisePolyfill`.

---

### Signature

`promise = new Promise(executor)`

Argument    | Type                          | Required | Description
----------- | ----------------------------- | -------- | ---
`executor`  | `(Function, Function) -> any` | Yes      | A function that determines how the promise will be resolved or rejected
**returns** | `Promise`                     |          | Returns a promise

[How to read signatures](signatures.md)

---

##### executor

`executor(resolve, reject)`

Argument    | Type                          | Required | Description
----------- | ----------------------------- | -------- | ---
`resolve`   | `any -> any`                  | No       | Call this function to resolve the promise
`reject`    | `any -> any`                  | No       | Call this function to reject the promise
**returns** |                               |          | The return value is ignored

[How to read signatures](signatures.md)

---

#### Static members

##### Promise.resolve

`promise = Promise.resolve(value)`

Argument    | Type                          | Required | Description
----------- | ----------------------------- | -------- | ---
`value`     | `any`                         | No       | A value to resolve to
**returns** | `Promise`                     |          | A promise resolved to `value`

[How to read signatures](signatures.md)

---

##### Promise.reject

`promise = Promise.reject(value)`

Argument    | Type                          | Required | Description
----------- | ----------------------------- | -------- | ---
`value`     | `any`                         | No       | A value to reject as
**returns** | `Promise`                     |          | A rejected promise with `value` as its reason

[How to read signatures](signatures.md)

---

##### Promise.all

`promise = Promise.all(promises)`

Argument    | Type                          | Required | Description
----------- | ----------------------------- | -------- | ---
`promises`  | `Array<Promise|any>`          | Yes      | A list of promises to wait for. If an item is not a promise, it's equivalent to calling `Promise.resolve` on it
**returns** | `Promise`                     |          | A promise that resolves only after all `promises` resolve, or rejects if any of them are rejected.

[How to read signatures](signatures.md)

---

##### Promise.race

`promise = Promise.race(promises)`

Argument    | Type                          | Required | Description
----------- | ----------------------------- | -------- | ---
`promises`  | `Array<Promise|any>`          | Yes      | A list of promises to wait for. If an item is not a promise, it's equivalent to calling `Promise.resolve` on it
**returns** | `Promise`                     |          | A promise that resolves as soon as one of the `promises` is resolved or rejected.

[How to read signatures](signatures.md)

---

#### Instance members

##### promise.then

`nextPromise = promise.then(onFulfilled, onRejected)`

Argument      | Type                    | Required | Description
------------- | ----------------------- | -------- | ---
`onFulfilled` | `any -> (any|Promise)`  | No       | A function that is called if the promise is resolved. The first parameter of this function is the value that this promise was resolved with. If the return value of this function is not a Promise, it is used as the value for resolving `nextPromise`. If the returned value is a Promise, the value of `nextPromise` depends on the inner Promise's status. If this function throws, `nextPromise` is rejected with the error as its reason. If `onFulfilled` is `null`, it's ignored
`onRejected`  | `any -> (any|Promise)`  | No       | A function that is called when the promise is rejected. The first parameter of this function is a value that represents the reason why the promise was rejected. If the return value of this function is not a Promise, it is used as the value for resolving `nextPromise`. If the returned value is a Promise, then value of `nextPromise` depends on the inner Promise's status. If this function throws, `nextPromise` is rejected with the error as its reason. If `onRejected` is `null`, it's ignored
**returns** | `Promise`                 |          | A promise whose value depends on the status of the current promise

[How to read signatures](signatures.md)

---

##### promise.catch

`nextPromise = promise.catch(onRejected)`

Argument      | Type                    | Required | Description
------------- | ----------------------- | -------- | ---
`onRejected`  | `any -> (any|Promise)`  | No       | A function that is called when the promise is rejected. The first parameter of this function is a value that represents the reason why the promise was rejected. If the return value of this function is not a Promise, it is used as the value for resolving `nextPromise`. If the returned value is a Promise, then value of `nextPromise` depends on the inner Promise's status. If this function throws, `nextPromise` is rejected with the error as its reason. If `onRejected` is `null`, it's ignored
**returns** | `Promise`                 |          | A promise whose value depends on the status of the current promise

[How to read signatures](signatures.md)

---

### How it works

A Promise is an object that represents a value which may be available in the future

```javascript
// this promise resolves after one second
var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve("hello")
  }, 1000)
})

promise.then(function(value) {
  // logs "hello" after one second
  console.log(value)
})
```

Promises are useful for working with asynchronous APIs, such as [`m.request`](request.md)

Asynchronous APIs are those which typically take a long time to run, and therefore would take too long to return a value using the `return` statement of a function. Instead, they do their work in the background, allowing other JavaScript code to run in the meantime. When they are done, they call a function with their results.

The `m.request` function takes time to run because it makes an HTTP request to a remote server and has to wait for a response, which may take several milliseconds due to network latency.

---

### Promise chaining

Promises can be chained. Returning a value from a `then` callback makes it available as the argument to the next `then` callback. This allows refactoring code into smaller functions

```javascript
function getUsers() {return m.request("/api/v1/users")}

// AVOID: hard to test god functions
getUsers().then(function(users) {
  var firstTen = users.slice(0, 9)
  var firstTenNames = firstTen.map(function(user) {return user.firstName + " " + user.lastName})
  alert(firstTenNames)
})

// PREFER: easy to test small functions
function getFirstTen(items) {return items.slice(0, 9)}
function getUserName(user) {return user.firstName + " " + user.lastName}
function getUserNames(users) {return users.map(getUserName)}

getUsers()
  .then(getFirstTen)
  .then(getUserNames)
  .then(alert)
```

In the refactored code, `getUsers()` returns a promise, and we chain three callbacks. When `getUsers()` resolves, the `getFirstTen` function is called with a list of users as its first argument. This function returns a list of ten items. `getUserNames` returns a list of names for the 10 items that were passed as the argument to it. Finally, the list of names is alerted.

In the original code above, it's very difficult to test the god function since you must make an HTTP request to run the code, and there's an `alert()` call at the end of the function

In the refactored version, it's trivial to test whether `getFirstTen` has any off-by-one errors, or whether we forgot to add a space between the first and last names in `getUserName`.

---

### Promise absorption

Promises absorb other promises. Basically, this means you can never receive a Promise as an argument to `onFulfilled` or `onRejected` callbacks for `then` and `catch` methods. This feature allows us to flatten nested promises to make code more manageable.

```javascript
function searchUsers(q) {return m.request("/api/v1/users/search", {params: {q: q}})}
function getUserProjects(id) {return m.request("/api/v1/users/" + id + "/projects")}

// AVOID: pyramid of doom
searchUsers("John").then(function(users) {
  getUserProjects(users[0].id).then(function(projects) {
    var titles = projects.map(function(project) {return project.title})
    alert(titles)
  })
})

// PREFER: flat code flow
function getFirstId(items) {return items[0].id}
function getProjectTitles(projects) {return projects.map(getProjectTitle)}
function getProjectTitle(project) {return project.title}

searchUsers("John")
  .then(getFirstId)
  .then(getUserProjects)
  .then(getProjectTitles)
  .then(alert)
```

In the refactored code, `getFirstId` returns an id, which is passed as the first argument to `getUserProjects`. That, in turn, returns a promise that resolves to a list of projects. This promise is absorbed, so the first argument to `getProjectTitles` is not a promise, but the list of projects. `getProjectTitles` returns a list of titles, and that list is finally alerted.

---

### Error handling

Promises can propagate errors to appropriate handlers.

```javascript
searchUsers("John")
  .then(getFirstId)
  .then(getUserProjects)
  .then(getProjectTitles)
  .then(alert)
  .catch(function(e) {
    console.log(e)
  })
```

Here's the previous example with error handling. The `searchUsers` function could fail if the network was offline, resulting in an error. In that case, none of the `.then` callbacks would be triggered, and the `.catch` callback would log the error to console.

If the request in `getUserProjects` failed, then similarly, `getProjectTitles` and `alert` would not be called. Again, the `.catch` callback would log the error.

The error handler would also catch a null reference exception if `searchUsers` returned no results, and `getFirstId` attempted to access the `id` property of a non-existent array item.

Thanks to these error propagation semantics, it's easy to keep each function small and testable without sprinkling `try`/`catch` blocks everywhere.

---

### Shorthands

Sometimes, you already have a value, but want to wrap it in a Promise. It's for this purpose that `Promise.resolve` and `Promise.reject` exist.

```javascript
// suppose this list came from localStorage
var users = [{id: 1, firstName: "John", lastName: "Doe"}]

// in that case, `users` may or may not exist depending on whether there was data in localStorage
var promise = users ? Promise.resolve(users) : getUsers()
promise
  .then(getFirstTen)
  .then(getUserNames)
  .then(alert)
```

---

### Multiple promises

In some occasions, you may need to make HTTP requests in parallel, and run code after all requests complete. This can be accomplished by `Promise.all`

```javascript
Promise.all([
  searchUsers("John"),
  searchUsers("Mary"),
])
.then(function(data) {
  // data[0] is an array of users whose names are John
  // data[1] is an array of users whose names are Mary

  // the returned value is equivalent to [
  //   getUserNames(data[0]),
  //   getUserNames(data[1]),
  // ]
  return data.map(getUserNames)
})
.then(alert)
```

In the example above, there are two user searches happening in parallel. Once they both complete, we take the names of all the users and alert them.

This example also illustrates another benefit of smaller functions: we reused the `getUserNames` function we had created above.

---

### Why not callbacks

Callbacks are another mechanism for working with asynchronous computations, and are indeed more adequate to use if an asynchronous computation may occur more than one time (for example, an `onscroll` event handler).

However, for asynchronous computations that only occur once in response to an action, promises can be refactored more effectively, reducing code smells known as pyramids of doom (deeply nested series of callbacks with unmanaged state being used across several closure levels).

In addition, promises can considerably reduce boilerplate related to error handling.
