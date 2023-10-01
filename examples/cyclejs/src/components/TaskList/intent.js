import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import {ENTER_KEY, ESC_KEY} from '../../utils';

// THE INTENT FOR THE LIST
export default function intent(DOMSource, History) {
  return xs.merge(
    // THE ROUTE STREAM
    // A stream that provides the path whenever the route changes.
    History
      .startWith({pathname: '/'})
      .map(location => location.pathname)
      .compose(dropRepeats())
      .map(payload => ({type: 'changeRoute', payload})),

    // THE URL STREAM
    // A stream of URL clicks in the app
    DOMSource.select('a').events('click')
      .map(event =>  event.target.hash.replace('#', ''))
      .map(payload => ({type: 'url', payload})),

    // CLEAR INPUT STREAM
    // A stream of ESC key strokes in the `.new-todo` field.
    DOMSource.select('.new-todo').events('keydown')
      .filter(ev => ev.keyCode === ESC_KEY)
      .map(payload => ({type: 'clearInput', payload})),

    // ENTER KEY STREAM
    // A stream of ENTER key strokes in the `.new-todo` field.
    DOMSource.select('.new-todo').events('keydown')
      // Trim value and only let the data through when there
      // is anything but whitespace in the field and the ENTER key was hit.
      .filter(ev => {
        let trimmedVal = String(ev.target.value).trim();
        return ev.keyCode === ENTER_KEY && trimmedVal;
      })
      // Return the trimmed value.
      .map(ev => String(ev.target.value).trim())
      .map(payload => ({type: 'insertTodo', payload})),

    // TOGGLE ALL STREAM
    // Create a stream out of the clicks on the `.toggle-all` button.
    DOMSource.select('.toggle-all').events('click')
      .map(ev => ev.target.checked)
      .map(payload => ({type: 'toggleAll', payload})),

    // DELETE COMPLETED TODOS STREAM
    // A stream of click events on the `.clear-completed` element.
    DOMSource.select('.clear-completed').events('click')
      .mapTo({type: 'deleteCompleteds'})
  );
};
