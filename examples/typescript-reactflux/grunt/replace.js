
// @see https://github.com/yoniholmes/grunt-text-replace
// @see https://github.com/jbrantly/ts-jsx-loader/blob/master/index.js

'use strict';

var reactTools = require('react-tools');

module.exports =  function (grunt) {

    var replace = function (matchedWord, index, fullText, regexMatches) {
      var jsx = regexMatches && regexMatches[0];
      var reactCode;
      if( jsx )
      {
        try {
          reactCode = reactTools.transform(jsx, { harmony: false })
        }
        catch (ex) {
          console.error('Problem transforming the following:\n' + jsx + '\n\n' + ex);
        }
      }
      return '(' + reactCode + ')';
    };

    return {
        'jsx': {
            src: ['<%= config.build %>/src/**/*.ts'],
            overwrite: true,
            replacements: [
                // using template strings
                {
                    from: /React\.jsx\(`([^`\\]*(\\.[^`\\]*)*)`\)/gm,
                    to: replace
                },
                // using multiline comments
                {
                    from: /React\.jsx\(\/\*((.|[\r\n])*?)\*\/\)/gm,
                    to: replace('$1')
                },
                // using jsx comments
                {
                    from: /\/\*jsx\*\/((.|[\r\n])*?)\/\*jsx\*\//gm,
                    to: replace('$1')
                }
            ]
        }
    };
};
