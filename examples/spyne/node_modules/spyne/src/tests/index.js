
// let getGlobalObj = constants.getGlobalObj;

// import {CDN}  from "../app/app-contants";

// const appConst =  require("../app/app-contants.js");

f;
// let CDN = require("../app/app-contants.js").CDN;

function maybeFirst(array) {
  if (array && array.length) {
    return array[0];
  }
}

var assert = require('assert');

describe('maybeFirst', function() {
  it('returns the first element of an array', function() {
    var result = maybeFirst([1, 2, 3]);

    assert.equal(result, 1, 'maybeFirst([1, 2, 3]) is 1');
  });
});

/*

describe('getGlobalObj', function(){

    it ('is a string ', function(){
        let str = CDN;

        assert.isPrototypeOf(str,"String");

    })

})
*/
