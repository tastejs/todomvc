import * as R from 'ramda';
import { findStrOrRegexMatchStr } from '../../spyne/utils/frp-tools';
import { ViewStreamHashMethodsObj } from '../mocks/utils-data';

const hashMethodsObj = ViewStreamHashMethodsObj;

describe('functional reactive methods tests', () => {
  let methodStrFound = 'UI_EVENT_CLICK';
  let methodRegExFound = 'UI_EVENT_FOCUS';
  let methodNotFound = 'UI_EVEN1T_FOCUS33';

  describe('should find first string match from regex', () => {
    let findMethodName = findStrOrRegexMatchStr(hashMethodsObj, methodStrFound);
    // console.log('str found ', findMethodName,methodStrFound );

    expect(findMethodName).to.equal(methodStrFound);
  });

  describe('should not find the String, but the regex', () => {
    let findMethodName = findStrOrRegexMatchStr(hashMethodsObj, methodRegExFound);

    // console.log('regex found ', findMethodName, methodRegExFound );
    expect(findMethodName).to.equal('UI_EVENT_.*');
  });

  describe('should not find the String, or the regex', () => {
    let findMethodName = findStrOrRegexMatchStr(hashMethodsObj, methodNotFound);
    // console.log('neither str or regex found ', findMethodName, methodNotFound );
    // console.log(' -------- ');
    expect(findMethodName).to.equal(undefined);
  });

  describe('should pull in closure args and test for local match', () => {
    return true;
  });
});
