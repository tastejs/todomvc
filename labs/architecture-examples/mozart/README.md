# TodoMVC Mozart

A TodoMVC example in the [Mozart](http://mozart.io/) Framework.

Full details, downloads and documentation for Mozart can be found on [The official website](http://mozart.io/) 

Please see [The official TodoMVC website](http://todomvc.com/) for more details on the TodoMVC project.


### Implementation

TodoMVC Mozart is implemented as a single controller and a set of views. A single model stores the todo items, persisted to LocalStorage by the built-in Mozart LocalStorage module.

app/controllers/

### Dependencies
- [Node.js](http://nodejs.org/)

```
npm install
```

### Run development server

```
grunt run
```

The development server runs at [http://localhost:8080/](http://localhost:8080/)

### Testing

The application can be tested from the command line:

```
grunt test
```

The spec runner is also available at [http://localhost:8080/specs/](http://localhost:8080/specs/)

### Notes

The Mozart TodoMVC app demonstrates:

- Views, Controllers, Models
- Custom Controls
- Binding
- Hash Routing
- LocalStorage persistence

Departures from specification:

- The Mozart LocalStorage places each entity record in a seperate key for speed of access, this is a departure from the TodoMVC application spec which states a single key with a large data blob.
- As this is a compiled example, a 'Full Source' link has been provided to the [standalone todomvc-mozart Github project](https://github.com/tomcully/todomvc-mozart).
