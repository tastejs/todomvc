import intent from './intent';
import model from './model';
import view from './view';

// THE TODO ITEM FUNCTION
// This is a simple todo item component,
// structured with the MVI-pattern.
function Task(sources) {
  let action$ = intent(sources);
  let state$ = model(sources.props$, action$);
  let vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$,
    state$
  };
}

export default Task;
