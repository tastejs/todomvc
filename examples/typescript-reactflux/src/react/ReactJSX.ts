///<reference path='../../typings/react/react.d.ts'/>
///<reference path='../../typings/react/react-addons.d.ts'/>
///<reference path='../../typings/react-tools/react-tools.d.ts'/>

import React = require('react/addons');
import ReactTools = require('react-tools');

var _react = React;

interface MapStringTo<T> {
  [key:string]: T
}

/*
  Horrible, horrible trick using evil eval in order to create a function from a
  template string that has been transformed by ReactTools.transform().

  That said, this technique is probably not known to many fellow devs.
  At least I didn't find it mentioned in this post that everybody refers to:
  http://perfectionkills.com/global-eval-what-are-the-options/
*/

function ReactJSX<T>( jsx: string, owner: any = null, imports: MapStringTo<any> = {} ): React.ReactElement<T> {
  var reactCode: string = 'function jsx(imports) { \n';

  // No need to let every call site add React to the imports.
  // That one comes for free, we'll add it here:
  reactCode += 'var React = imports.React;\n';
  imports['React'] = _react;

  for( var im in imports ) {
    reactCode += 'var ' + im + ' = imports.' + im + ';\n';
  }

  reactCode += 'return (' + ReactTools.transform(jsx, { harmony: false }) + '); }; jsx;';

  // I believe the discussion in http://perfectionkills.com/global-eval-what-are-the-options/
  // missed that you can eval code that creates a function.
  // If done right, that function can be used like any other function in the caller's domain
  // as long as all scope variables are captured in 'imports'.
  var fn: () => React.ReactElement<T> = eval.call(null,reactCode);
  var element: React.ReactElement<T> = fn.call(owner, imports);
  return element;
}

export = ReactJSX;
