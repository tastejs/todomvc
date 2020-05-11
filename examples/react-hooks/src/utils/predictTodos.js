import { of } from 'rxjs';
import {
  tap
} from 'rxjs/operators';

export const getTodos = keys =>
[
  'clean bathroom',
  'wash dishes',
  'go for a run',
  'go to the store',
  'go for a bike',
  'wash teeth'
].filter(e => e.indexOf(keys.toLowerCase()) > -1);

// pipe acts like reduce 
export const fakeRequest = keys =>
  of(getTodos(keys)).pipe(
    tap(_ => console.log(`API CALL at ${new Date()}`))
  );