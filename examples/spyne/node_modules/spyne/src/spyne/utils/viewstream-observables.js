import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {flip, mergeRight, clone, forEach, propSatisfies} from 'ramda';
export class ViewStreamObservable {
  constructor(props) {
    /**
     * @module ViewStreamObservable
     * @type internal
     *
     * @constructor
     * @desc
     * Internal observable that creates the ViewStream Observable that branches out to parent, internal and child directions
     */
    this.props.observableStreams = ViewStreamObservable.createDirectionalObservables();
  }

  static createDirectionalFiltersObject() {
    const dirInternal = 'internal';
    const dirParent = 'parent';
    const dirChild = 'child';
    return {
      P: [dirParent],
      C: [dirChild],
      PCI: [dirParent, dirInternal, dirChild],
      CI: [dirChild, dirInternal],
      PI: [dirParent, dirInternal],
      PC: [dirParent, dirChild]
    };
  }

  static addDefaultDir(obj) {
    const defaults = flip(mergeRight);
    return defaults({ $dir:['internal'] }, clone(obj));
  }

  static addDownInternalDir(obj, arr = ['internal', 'down']) {
    const defaults = flip(mergeRight);
    return defaults(clone(obj), { $dir:arr });
  }

  static addChildAndInternalDir(obj, arr = ['child', 'down']) {
    const defaults = flip(mergeRight);
    return defaults(clone(obj), { $dir:arr });
  }

  static mapToDefaultDir(p) {
    return this.addDefaultDir(p);
  }

  static createDirectionalObservables(obs$ = new Subject(), viewName, vsid) {
    if (viewName !== undefined && vsid !== undefined) {
      obs$['viewName'] = viewName;
      obs$['vsid'] = vsid;
    }

    const filterStreams = val => propSatisfies(arrType => arrType.includes(val), '$dir');
    const filterParent = filterStreams('parent');
    const filterChild = filterStreams('child');
    const filterInternal = filterStreams('internal');

    const addfrom$ = relStr => mergeRight({ from$:relStr });
    const addParentfrom$ = addfrom$('child');
    const addInternalfrom$ = addfrom$('internal');
    const addChildfrom$ = addfrom$('parent');

    const raw$ =  obs$
      .pipe(filter((payload) => payload !== undefined && payload.action !== undefined));
    // .filter(p => p.$dir !== undefined)
    // .do(p => console.log('payload : ', p.$dir, p));
    const toInternal$ = obs$.pipe(filter(filterInternal), map(addInternalfrom$));
    const toParent$ = obs$.pipe(filter(filterParent), map(addParentfrom$));
    const toChild$ = obs$.pipe(filter(filterChild), map(addChildfrom$));
    // const upObs$ = obs$.do(p => console.log('UP: ', p));
    const streamObj = {
      parent: toParent$,
      internal: toInternal$,
      child: toChild$
    };

    const completeStream = (arr = []) => {
      const endStream = o => {
        o.complete();
        o.isStopped = true;
      };

      const setCompleteStream = (str) => {
        if (streamObj[str] !== undefined) {
          let obs$ = streamObj[str];
          endStream(obs$);
        }
      };

      if (arr !== undefined && arr.length >= 1) {
        arr.forEach(setCompleteStream);
      }
    };
    const completeAll = () => {
      let completeStream = o => {
        o.complete();
        o.isStopped = true;
      };
      forEach(completeStream, [raw$, toInternal$, toParent$, toChild$]);
    };

    return {
      raw$, toInternal$, toParent$, toChild$, completeAll, completeStream
    };
  }
}
