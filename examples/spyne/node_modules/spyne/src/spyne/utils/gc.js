import {forEach} from 'ramda';
export function gc() {
  let cleanup = () => {
    let loopM = m => void 0;
    forEach(loopM, this);
  };
  setTimeout(cleanup, 1);
}
