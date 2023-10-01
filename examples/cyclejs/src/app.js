import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHistoryDriver} from '@cycle/history'
import {createHistory} from 'history';
import storageDriver from '@cycle/storage';
// THE MAIN FUNCTION
// This is the todo list component.
import TaskList from './components/TaskList/index';

const main = TaskList;

// THE ENTRY POINT
// This is where the whole story starts.
// `run` receives a main function and an object
// with the drivers.
run(main, {
  // THE DOM DRIVER
  // `makeDOMDriver(container)` from Cycle DOM returns a
  // driver function to interact with the DOM.
  DOM: makeDOMDriver('.todoapp', {transposition: true}),
  // THE HISTORY DRIVER
  // A driver to interact with browser history
  History: makeHistoryDriver(createHistory(), {capture: true}),
  // THE STORAGE DRIVER
  // The storage driver which can be used to access values for
  // local- and sessionStorage keys as streams.
  storage: storageDriver
});
