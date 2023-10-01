import xs from 'xstream';
import concat from 'xstream/extra/concat';

// A helper function that provides filter functions
// depending on the route value.
function getFilterFn(route) {
  switch (route) {
    case '/active': return (task => task.completed === false);
    case '/completed': return (task => task.completed === true);
    default: return () => true; // allow anything
  }
}

// MAKE REDUCER STREAM
// A function that takes the actions on the todo list
// and returns a stream of "reducers": functions that expect the current
// todosData (the state) and return a new version of todosData.
function makeReducer$(action$) {
  let clearInputReducer$ = action$
    .filter(a => a.type === 'clearInput')
    .mapTo(function clearInputReducer(todosData) {
      return todosData;
    });

  let changeRouteReducer$ = action$
    .filter(a => a.type === 'changeRoute')
    .map(a => a.payload)
    .startWith('/')
    .map(path => {
      let filterFn = getFilterFn(path);
      return function changeRouteReducer(todosData) {
        todosData.filter = path.replace('/', '').trim();
        todosData.filterFn = filterFn;
        return todosData;
      };
    });

  return xs.merge(
    clearInputReducer$,
    changeRouteReducer$
  );
}

// THIS IS THE MODEL FUNCTION
// It expects the actions coming in from the sources
function model(action$, sourceTodosData$) {
  // THE BUSINESS LOGIC
  // Actions are passed to the `makeReducer$` function
  // which creates a stream of reducer functions that needs
  // to be applied on the todoData when an action happens.
  let reducer$ = makeReducer$(action$);

  // RETURN THE MODEL DATA
  return sourceTodosData$.map(sourceTodosData =>
    reducer$.fold((todosData, reducer) => reducer(todosData), sourceTodosData)
  ).flatten()
  // Make this remember its latest event, so late listeners
  // will be updated with the latest state.
  .remember();
}

export default model;
