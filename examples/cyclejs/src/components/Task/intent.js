import xs from 'xstream';
import {ENTER_KEY, ESC_KEY} from '../../utils';

// THE TODO ITEM INTENT
// This intent function returns a stream of all the different,
// actions that can be taken on a todo.
function intent(sources) {
  // THE INTENT MERGE
  // Merge all actions into one stream.
  return xs.merge(
    // THE DESTROY ACTION STREAM
    sources.DOM.select('.destroy').events('click')
      .mapTo({type: 'destroy'}),

    // THE TOGGLE ACTION STREAM
    sources.DOM.select('.toggle').events('change')
      .map(ev => ev.target.checked)
      .map(payload => ({type: 'toggle', payload})),
    sources.action$
      .filter(action => action.type === 'toggleAll')
      .map(action => ({...action, type: 'toggle'})),

    // THE START EDIT ACTION STREAM
    sources.DOM.select('label').events('dblclick')
      .mapTo({type: 'startEdit'}),

    // THE ESC KEY ACTION STREAM
    sources.DOM.select('.edit').events('keyup')
      .filter(ev => ev.keyCode === ESC_KEY)
      .mapTo({type: 'cancelEdit'}),

    // THE ENTER KEY ACTION STREAM
    sources.DOM.select('.edit').events('keyup')
      .filter(ev => ev.keyCode === ENTER_KEY)
      .compose(s => xs.merge(s, sources.DOM.select('.edit').events('blur', true)))
      .map(ev => ({title: ev.target.value, type: 'doneEdit'}))
  );
}

export default intent;
