import { of } from 'rxjs';
import {
  tap
} from 'rxjs/operators';

export const getTodos = keys =>
[
  'clean bathroom',
  'wash dishes',
  'go for a run'
].filter(e => e.indexOf(keys.toLowerCase()) > -1);

export const fakeRequest = keys =>
  of(getTodos(keys)).pipe(
    tap(_ => console.log(`API CALL at ${new Date()}`))
  );