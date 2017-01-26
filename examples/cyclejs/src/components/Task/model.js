import xs from 'xstream';

function makeReducer$(action$) {
  let startEditReducer$ = action$
    .filter(action => action.type === 'startEdit')
    .mapTo(function startEditReducer(data) {
      return {
        ...data,
        editing: true
      };
    });

  let doneEditReducer$ = action$
    .filter(action => action.type === 'doneEdit')
    .map(action => function doneEditReducer(data) {
      return {
        ...data,
        title: action.payload,
        editing: false
      };
    });

  let cancelEditReducer$ = action$
    .filter(action => action.type === 'cancelEdit')
    .mapTo(function cancelEditReducer(data) {
      return {
        ...data,
        editing: false
      };
    });

  let toggleReducer$ = action$
    .filter(action => action.type === 'toggle')
    .map(action => function toggleReducer(data) {
      return {
        ...data,
        completed: action.payload
      };
    });

  return xs.merge(
    startEditReducer$,
    doneEditReducer$,
    cancelEditReducer$,
    toggleReducer$
  );
}

function model(props$, action$) {
  // THE SANITIZED PROPERTIES
  // If the list item has no data set it as empty and not completed.
  let sanitizedProps$ = props$.startWith({title: '', completed: false});
  let reducer$ = makeReducer$(action$);

  return sanitizedProps$.map(props =>
    reducer$.fold((data, reducer) => reducer(data), props)
  ).flatten().remember();
}

export default model;
