
(function() {
// lib/handlebars/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"hashSegments":29,"hashSegment":30,"ID":31,"EQUALS":32,"pathSegments":33,"SEP":34,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",31:"ID",32:"EQUALS",34:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[26,1],[29,2],[29,1],[30,3],[30,3],[21,1],[33,3],[33,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1] 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]) 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]) 
break;
case 4: this.$ = new yy.ProgramNode([]) 
break;
case 5: this.$ = [$$[$0]] 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 9: this.$ = $$[$0] 
break;
case 10: this.$ = $$[$0] 
break;
case 11: this.$ = new yy.ContentNode($$[$0]) 
break;
case 12: this.$ = new yy.CommentNode($$[$0]) 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 15: this.$ = $$[$0-1] 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true) 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]) 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]) 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]] 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null] 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]] 
break;
case 24: this.$ = [[$$[$0]], null] 
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 26: this.$ = [$$[$0]] 
break;
case 27: this.$ = $$[$0] 
break;
case 28: this.$ = new yy.StringNode($$[$0]) 
break;
case 29: this.$ = new yy.HashNode($$[$0]) 
break;
case 30: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 31: this.$ = [$$[$0]] 
break;
case 32: this.$ = [$$[$0-2], $$[$0]] 
break;
case 33: this.$ = [$$[$0-2], new yy.StringNode($$[$0])] 
break;
case 34: this.$ = new yy.IdNode($$[$0]) 
break;
case 35: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 36: this.$ = [$$[$0]] 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,31:[1,25],33:24},{17:26,21:23,31:[1,25],33:24},{17:27,21:23,31:[1,25],33:24},{17:28,21:23,31:[1,25],33:24},{21:29,31:[1,25],33:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,31:[1,25],33:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:39,30:42,31:[1,43],33:24},{18:[2,34],28:[2,34],31:[2,34],34:[1,44]},{18:[2,36],28:[2,36],31:[2,36],34:[2,36]},{18:[1,45]},{18:[1,46]},{18:[1,47]},{18:[1,48],21:49,31:[1,25],33:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:50,31:[1,25],33:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:51,27:52,28:[1,41],29:39,30:42,31:[1,43],33:24},{18:[2,23]},{18:[2,26],28:[2,26],31:[2,26]},{18:[2,29],30:53,31:[1,54]},{18:[2,27],28:[2,27],31:[2,27]},{18:[2,28],28:[2,28],31:[2,28]},{18:[2,31],31:[2,31]},{18:[2,36],28:[2,36],31:[2,36],32:[1,55],34:[2,36]},{31:[1,56]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,57]},{18:[1,58]},{18:[2,21]},{18:[2,25],28:[2,25],31:[2,25]},{18:[2,30],31:[2,30]},{32:[1,55]},{21:59,28:[1,60],31:[1,25],33:24},{18:[2,35],28:[2,35],31:[2,35],34:[2,35]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,32],31:[2,32]},{18:[2,33],31:[2,33]}],
defaultActions: {16:[2,1],37:[2,23],51:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: this.begin("mu"); if (yy_.yytext) return 14; 
break;
case 1: return 14; 
break;
case 2: return 24; 
break;
case 3: return 16; 
break;
case 4: return 20; 
break;
case 5: return 19; 
break;
case 6: return 19; 
break;
case 7: return 23; 
break;
case 8: return 23; 
break;
case 9: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.begin("INITIAL"); return 15; 
break;
case 10: return 22; 
break;
case 11: return 32; 
break;
case 12: return 31; 
break;
case 13: return 31; 
break;
case 14: return 34; 
break;
case 15: /*ignore whitespace*/ 
break;
case 16: this.begin("INITIAL"); return 18; 
break;
case 17: this.begin("INITIAL"); return 18; 
break;
case 18: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28; 
break;
case 19: return 31; 
break;
case 20: return 'INVALID'; 
break;
case 21: return 5; 
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^[a-zA-Z0-9_-]+(?=[=} /.])/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"inclusive":false},"INITIAL":{"rules":[0,1,21],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// lib/handlebars/base.js
Handlebars = {};

Handlebars.VERSION = "1.0.beta.1";

Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, fn, inverse) {
  inverse = inverse || function() {};

  var ret = "";
  var type = Object.prototype.toString.call(context);

  if(type === "[object Function]") {
    context = context();
  }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
}, function(context, fn) {
  return fn(context);
});

Handlebars.registerHelper('each', function(context, fn, inverse) {
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, fn, inverse) {
  if(!context || context == []) {
    return inverse(this);
  } else {
    return fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, fn, inverse) {
  return Handlebars.helpers['if'].call(this, context, inverse, fn);
});

Handlebars.registerHelper('with', function(context, fn) {
  return fn(context);
});

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { continue; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/visitor.js

Handlebars.Visitor = function() {};

Handlebars.Visitor.prototype = {
  accept: function(object) {
    return this[object.type](object);
  }
};;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  this.message = message;
};

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;"
  };

  var badChars = /&(?!\w+;)|[<>]/g;
  var possible = /[&<>]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;"
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    invokeInverse: 14,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 1,
    lookup: 1,
    invokeMustache: 2,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 2,
    invokePartial: 1,
    push: 1,
    invokeInverse: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options || {};
      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      this.ID(block.mustache.id);
      var programGuid = this.compileProgram(block.program);

      this.opcode('invokeInverse', programGuid);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'context');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original);

      if(mustache.escaped) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('push', '{}');
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if(JavaScriptCompiler.RESERVED_WORDS[name] || name.indexOf('-') !== -1) {
        return parent + "['" + name + "']";
      } else {
        return parent + "." + name;
      }
    },

    appendToBuffer: function(string) {
      return "buffer = buffer + " + string + ";";
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },
    // END PUBLIC API

    compile: function(environment, options) {
      this.environment = environment;
      this.options = options || {};

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = {list: []};

      this.compileChildren(environment, options);

      Handlebars.log(Handlebars.logger.DEBUG, environment.disassemble() + "\n\n");

      var opcodes = environment.opcodes, opcode, name, declareName, declareVal;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunction();
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];
      out.push("var buffer = " + this.initializeBuffer() + ", currentContext = context");

      var copies = "helpers = helpers || Handlebars.helpers;";
      if(this.environment.usePartial) { copies = copies + " partials = partials || Handlebars.partials;"; }
      out.push(copies);

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunction: function() {
      var container = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(i, helpers, partials, data) {
          var programWrapper = this.programs[i];
          if(data) {
            return Handlebars.VM.program(this.children[i], helpers, partials, data);
          } else if(programWrapper) {
            return programWrapper;
          } else {
            programWrapper = this.programs[i] = Handlebars.VM.program(this.children[i], helpers, partials);
            return programWrapper;
          }
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[0] = this.source[0] + ", " + locals.join(", ");
      }

      this.source[0] = this.source[0] + ";";

      this.source.push("return buffer;");

      var params = ["Handlebars", "context", "helpers", "partials"];

      if(this.options.data) { params.push("data"); }

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if(params.length === 4 && !this.environment.usePartial) { params.pop(); }

      params.push(this.source.join("\n"));

      var fn = Function.apply(this, params);
      fn.displayName = "Handlebars.js";

      Handlebars.log(Handlebars.logger.DEBUG, fn.toString() + "\n\n");

      container.render = fn;

      container.children = this.environment.children;

      return function(context, options, $depth) {
        try {
          options = options || {};
          var args = [Handlebars, context, options.helpers, options.partials, options.data];
          var depth = Array.prototype.slice.call(arguments, 2);
          args = args.concat(depth);
          return container.render.apply(container, args);
        } catch(e) {
          throw e;
        }
      };
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("this.escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;

        if(depth === 0) {
          this.source.push("currentContext = context;");
        } else {
          this.source.push("currentContext = depth" + depth + ";");
        }
      }
    },

    lookupWithHelpers: function(name) {
      if(name) {
        var topStack = this.nextStack();

        var toPush =  "if('" + name + "' in helpers) { " + topStack +
                      " = " + this.nameLookup('helpers', name, 'helper') +
                      "; } else { " + topStack + " = " +
                      this.nameLookup('currentContext', name, 'context') +
                      "; }";

        this.source.push(toPush);
      } else {
        this.pushStack("currentContext");
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = " + this.nameLookup(topStack, name, 'context') + ";");
    },

    pushStringParam: function(string) {
      this.pushStack("currentContext");
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, function(nextStack, helperMissingString, id) {
        this.source.push("else if(" + id + "=== undefined) { " + nextStack + " = helpers.helperMissing.call(" + helperMissingString + "); }");
        this.source.push("else { " + nextStack + " = " + id + "; }");
      });
    },

    invokeProgram: function(guid, paramSize) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, function(nextStack, helperMissingString, id) {
        this.source.push("else { " + nextStack + " = helpers.blockHelperMissing.call(" + helperMissingString + "); }");
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, fn) {
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam;

      var hash = this.popStack();

      this.register('tmp1', program);
      this.source.push('tmp1.hash = ' + hash + ';');

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push('tmp1');

      // TODO: This is legacy behavior. Deprecate and remove.
      if(inverse) {
        params.push(inverse);
      }

      this.populateCall(params, id, helperId || id, fn);
    },

    populateCall: function(params, id, helperId, fn) {
      var paramString = ["context"].concat(params).join(", ");
      var helperMissingString = ["context"].concat(helperId).concat(params).join(", ");

      nextStack = this.nextStack();

      this.source.push("if(typeof " + id + " === 'function') { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      fn.call(this, nextStack, helperMissingString, id);
    },

    invokeInverse: function(guid) {
      var program = this.programExpression(guid);

      var blockMissingParams = ["context", this.topStack(), "this.noop", program];
      this.pushStack("helpers.blockHelperMissing.call(" + blockMissingParams.join(", ") + ")");
    },

    invokePartial: function(context) {
      this.pushStack("this.invokePartial(" + this.nameLookup('partials', context, 'partial') + ", '" + context + "', " + this.popStack() + ", helpers, partials);");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;
      var compiled = [];

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        compiled[i] = compiler.compile(child, options);
      }

      environment.rawChildren = children;
      environment.children = compiled;
    },

    programExpression: function(guid) {
      if(guid == null) { return "this.noop"; }

      var programParams = [guid, "helpers", "partials"];

      var depths = this.environment.rawChildren[guid].depths.list;

      if(this.options.data) { programParams.push("data"); }

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("context"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(!this.environment.usePartial) {
        if(programParams[3]) {
          programParams[2] = "null";
        } else {
          programParams.pop();
        }
      }

      if(depths.length === 0) {
        return "this.program(" + programParams.join(", ") + ")";
      } else {
        programParams[0] = "this.children[" + guid + "]";
        return "this.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = ("break case catch continue default delete do else finally " +
                       "for function if in instanceof new return switch this throw " + 
                       "try typeof var void while with null true false").split(" ");

  compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.VM = {
  programWithDepth: function(fn, helpers, partials, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 4);

    return function(context, options) {
      options = options || {};

      options = {
        helpers: options.helpers || helpers,
        partials: options.partials || partials,
        data: options.data || data
      };

      return fn.apply(this, [context, options].concat(args));
    };
  },
  program: function(fn, helpers, partials, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, {
        helpers: options.helpers || helpers,
        partials: options.partials || partials,
        data: options.data || data
      });
    };
  },
  noop: function() { return ""; },
  compile: function(string, options) {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    return new Handlebars.JavaScriptCompiler().compile(environment, options);
  },
  invokePartial: function(partial, name, context, helpers, partials) {
    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, {helpers: helpers, partials: partials});
    } else {
      partials[name] = Handlebars.VM.compile(partial);
      return partials[name](context, {helpers: helpers, partials: partials});
    }
  }
};

Handlebars.compile = Handlebars.VM.compile;;

})();

(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ENV sc_assert */

if ('undefined' === typeof SC) {
/**
  @namespace
  @name SC
  @version 2.0.alpha

  All SproutCore methods and functions are defined inside of this namespace.
  You generally should not add new properties to this namespace as it may be
  overwritten by future versions of SproutCore.

  You can also use the shorthand "SC" instead of "SproutCore".

  SproutCore-Runtime is a framework that provides core functions for 
  SproutCore including cross-platform functions, support for property 
  observing and objects. Its focus is on small size and performance. You can 
  use this in place of or along-side other cross-platform libraries such as 
  jQuery.

  The core Runtime framework is based on the jQuery API with a number of
  performance optimizations.
*/
SC = {};

// aliases needed to keep minifiers from removing the global context
if ('undefined' !== typeof window) {
  window.SC = window.SproutCore = SproutCore = SC;
}

}

/**
  @static
  @type String
  @default '2.0.alpha'
  @constant
*/
SC.VERSION = '2.0.alpha';

/**
  @static
  @type Hash
  @constant
  
  Standard environmental variables.  You can define these in a global `ENV`
  variable before loading SproutCore to control various configuration 
  settings.
*/
SC.ENV = 'undefined' === typeof ENV ? {} : ENV;

/**
  Define an assertion that will throw an exception if the condition is not 
  met.  SproutCore build tools will remove any calls to sc_assert() when 
  doing a production build.
  
  ## Examples
  
      #js:
      
      // pass a simple Boolean value
      sc_assert('must pass a valid object', !!obj);

      // pass a function.  If the function returns false the assertion fails
      // any other return value (including void) will pass.
      sc_assert('a passed record must have a firstName', function() {
        if (obj instanceof SC.Record) {
          return !SC.empty(obj.firstName);
        }
      });
      
  @static
  @function
  @param {String} desc
    A description of the assertion.  This will become the text of the Error
    thrown if the assertion fails.
    
  @param {Boolean} test
    Must return true for the assertion to pass.  If you pass a function it
    will be executed.  If the function returns false an exception will be
    thrown.
*/
window.sc_assert = function sc_assert(desc, test) {
  if ('function' === typeof test) test = test()!==false;
  if (!test) throw new Error("assertion failed: "+desc);
};

})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */

/**
  @class

  Platform specific methods and feature detectors needed by the framework.
*/
SC.platform = {} ;

/**
  Identical to Object.create().  Implements if not available natively.
*/
SC.platform.create = Object.create;

//@if (legacy)
if (!SC.platform.create) {
  var O_ctor = function() {}, 
      O_proto = O_ctor.prototype;

  SC.platform.create = function(obj, descs) {
    O_ctor.prototype = obj;
    obj = new O_ctor();
    O_ctor.prototype = O_proto;
    
    if (descs !== undefined) {
      for(var key in descs) {
        if (!descs.hasOwnProperty(key)) continue;
        SC.platform.defineProperty(obj, key, descs[key]);
      }
    }
    
    return obj;
  };
  
  SC.platform.create.isSimulated = true;
}
//@endif

/**
  Identical to Object.defineProperty().  Implements as much functionality
  as possible if not available natively.
  
  @param {Object} obj The object to modify
  @param {String} keyName property name to modify
  @param {Object} desc descriptor hash
  @returns {void}
*/
SC.platform.defineProperty = Object.defineProperty;

/**
  Set to true if the platform supports native getters and setters.
*/
SC.platform.hasPropertyAccessors = true;

//@if (legacy)
if (!SC.platform.defineProperty) {
  SC.platform.hasPropertyAccessors = !!SC.platform.defineProperty;

  SC.platform.defineProperty = function(obj, keyName, desc) {
    sc_assert("property descriptor cannot have `get` or `set` on this platform", !desc.get && !desc.set);
    obj[keyName] = desc.value;
  };
  
  SC.platform.defineProperty.isSimulated = true;
}
//@endif


})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


// ..........................................................
// GUIDS
// 

// Used for guid generation...
var GUID_KEY = '__sc'+Date.now();
var uuid, numberCache, stringCache;

uuid         = 0;
numberCache  = [];
stringCache  = {};

var GUID_DESC = {
  configurable: true,
  writable: true,
  enumerable: false
};

var o_defineProperty = SC.platform.defineProperty;
var o_create = SC.platform.create;

/**
  @private
  @static
  @type String
  @constant

  A unique key used to assign guids and other private metadata to objects.
  If you inspect an object in your browser debugger you will often see these.
  They can be safely ignored.

  On browsers that support it, these properties are added with enumeration 
  disabled so they won't show up when you iterate over your properties.
*/
SC.GUID_KEY = GUID_KEY;

/**
  @private

  Generates a new guid, optionally saving the guid to the object that you
  pass in.  You will rarely need to use this method.  Instead you should
  call SC.guidFor(obj), which return an existing guid if available.

  @param {Object} obj
    Optional object the guid will be used for.  If passed in, the guid will
    be saved on the object and reused whenever you pass the same object 
    again.

    If no object is passed, just generate a new guid.

  @param {String} prefix
    Optional prefix to place in front of the guid.  Useful when you want to
    separate the guid into separate namespaces.

  @returns {String} the guid
*/
SC.generateGuid = function(obj, prefix) {
  if (!prefix) prefix = 'sc';
  var ret = (prefix + (uuid++));
  if (obj) {
    obj[GUID_KEY] = ret;
  }

  return ret ;
};

/**
  @private

  Returns a unique id for the object.  If the object does not yet have
  a guid, one will be assigned to it.  You can call this on any object,
  SC.Object-based or not, but be aware that it will add a _guid property.

  You can also use this method on DOM Element objects.

  @method
  @param obj {Object} any object, string, number, Element, or primitive
  @returns {String} the unique guid for this instance.
*/
SC.guidFor = function(obj) {

  // special cases where we don't want to add a key to object
  if (obj === undefined) return "(undefined)";
  if (obj === null) return "(null)";

  var cache, ret;
  var type = typeof obj;

  // Don't allow prototype changes to String etc. to change the guidFor
  switch(type) {
    case 'number':
      ret = numberCache[obj];
      if (!ret) ret = numberCache[obj] = 'nu'+obj;
      return ret;

    case 'string':
      ret = stringCache[obj];
      if (!ret) ret = stringCache[obj] = 'st'+(uuid++);
      return ret;

    case 'boolean':
      return obj ? '(true)' : '(false)';

    default:
      if (obj[GUID_KEY]) return obj[GUID_KEY];
      if (obj === Object) return '(Object)';
      if (obj === Array)  return '(Array)';
      return SC.generateGuid(obj, 'sc');
  }
};


// ..........................................................
// META
// 

var META_DESC = {
  writable:    true,
  confgurable: false,
  enumerable:  false,
  value: null
};

var META_KEY = SC.GUID_KEY+'_meta';

/**
  The key used to store meta information on object for property observing.

  @static
  @property
*/
SC.META_KEY = META_KEY;

// Placeholder for non-writable metas.
var EMPTY_META = {
  descs: {},
  watching: {}
}; 

if (Object.freeze) Object.freeze(EMPTY_META);

/**
  @private
  @function
  
  Retrieves the meta hash for an object.  If 'writable' is true ensures the
  hash is writable for this object as well.
  
  The meta object contains information about computed property descriptors as
  well as any watched properties and other information.  You generally will
  not access this information directly but instead work with higher level 
  methods that manipulate this has indirectly.

  @param {Object} obj
    The object to retrieve meta for
    
  @param {Boolean} writable
    Pass false if you do not intend to modify the meta hash, allowing the 
    method to avoid making an unnecessary copy.
    
  @returns {Hash}
*/
SC.meta = function meta(obj, writable) {
  var ret = obj[META_KEY];
  if (writable===false) return ret || EMPTY_META;

  if (!ret) {
    o_defineProperty(obj, META_KEY, META_DESC);
    ret = obj[META_KEY] = {
      descs: {},
      watching: {},
      values: {},
      lastSetValues: {},
      cache:  {},
      source: obj
    };
    
    // make sure we don't accidentally try to create constructor like desc
    ret.descs.constructor = null;
    
  } else if (ret.source !== obj) {
    ret = obj[META_KEY] = o_create(ret);
    ret.descs    = o_create(ret.descs);
    ret.values   = o_create(ret.values);
    ret.watching = o_create(ret.watching);
    ret.lastSetValues = {};
    ret.cache    = {};
    ret.source   = obj;
  }
  return ret;
};

/**
  @private

  Wraps the passed function so that `this._super` will point to the superFunc
  when the function is invoked.  This is the primitive we use to implement
  calls to super.
  
  @param {Function} func
    The function to call
    
  @param {Function} superFunc
    The super function.
    
  @returns {Function} wrapped function.
*/
SC.wrap = function(func, superFunc) {
  
  function K() {}
  
  var newFunc = function() {
    var ret, sup = this._super;
    this._super = superFunc || K;
    ret = func.apply(this, arguments);
    this._super = sup;
    return ret;
  };
  
  newFunc.base = func;
  return newFunc;
};

/**
  @function
  
  Returns YES if the passed object is an array or Array-like.

  SproutCore Array Protocol:

    - the object has an objectAt property
    - the object is a native Array
    - the object is an Object, and has a length property

  Unlike SC.typeOf this method returns true even if the passed object is
  not formally array but appears to be array-like (i.e. implements SC.Array)

  @param {Object} obj The object to test
  @returns {Boolean}
*/
SC.isArray = function(obj) {
  if (!obj || obj.setInterval) { return false; }
  if (Array.isArray && Array.isArray(obj)) { return true; }
  if (SC.Array && SC.Array.detect(obj)) { return true; }
  if ((obj.length !== undefined) && 'object'===typeof obj) { return true; }
  return false;
};

/**
  Forces the passed object to be part of an array.  If the object is already
  an array or array-like, returns the object.  Otherwise adds the object to
  an array.  If obj is null or undefined, returns an empty array.
  
  @param {Object} obj the object
  @returns {Array}
*/
SC.makeArray = function(obj) {
  if (obj==null) return [];
  return SC.isArray(obj) ? obj : [obj];
};



})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */



var USE_ACCESSORS = SC.platform.hasPropertyAccessors && SC.ENV.USE_ACCESSORS;
SC.USE_ACCESSORS = !!USE_ACCESSORS;

var meta = SC.meta;

// ..........................................................
// GET AND SET
// 
// If we are on a platform that supports accessors we can get use those.
// Otherwise simulate accessors by looking up the property directly on the
// object.

var get, set;

get = function get(obj, keyName) {
  if (keyName === undefined && 'string' === typeof obj) {
    keyName = obj;
    obj = SC;
  }
  
  if (!obj) return undefined;
  var ret = obj[keyName];
  if (ret===undefined && 'function'===typeof obj.unknownProperty) {
    ret = obj.unknownProperty(keyName);
  }
  return ret;
};

set = function set(obj, keyName, value) {
  if (('object'===typeof obj) && !(keyName in obj)) {
    if ('function' === typeof obj.setUnknownProperty) {
      obj.setUnknownProperty(keyName, value);
    } else if ('function' === typeof obj.unknownProperty) {
      obj.unknownProperty(keyName, value);
    } else obj[keyName] = value;
  } else {
    obj[keyName] = value;
  }
  return value;
};

if (!USE_ACCESSORS) {

  var o_get = get, o_set = set;
  
  get = function(obj, keyName) {

    if (keyName === undefined && 'string' === typeof obj) {
      keyName = obj;
      obj = SC;
    }

    if (!obj) return undefined;
    var desc = meta(obj, false).descs[keyName];
    if (desc) return desc.get(obj, keyName);
    else return o_get(obj, keyName);
  };

  set = function(obj, keyName, value) {
    var desc = meta(obj, false).descs[keyName];
    if (desc) desc.set(obj, keyName, value);
    else o_set(obj, keyName, value);
    return value;
  };

}

/**
  @function
  
  Gets the value of a property on an object.  If the property is computed,
  the function will be invoked.  If the property is not defined but the 
  object implements the unknownProperty() method then that will be invoked.
  
  If you plan to run on IE8 and older browsers then you should use this 
  method anytime you want to retrieve a property on an object that you don't
  know for sure is private.  (My convention only properties beginning with 
  an underscore '_' are considered private.)
  
  On all newer browsers, you only need to use this method to retrieve 
  properties if the property might not be defined on the object and you want
  to respect the unknownProperty() handler.  Otherwise you can ignore this
  method.
  
  Note that if the obj itself is null, this method will simply return 
  undefined.
  
  @param {Object} obj
    The object to retrieve from.
    
  @param {String} keyName
    The property key to retrieve
    
  @returns {Object} the property value or null.
*/
SC.get = get;

/**
  @function 
  
  Sets the value of a property on an object, respecting computed properties
  and notifying observers and other listeners of the change.  If the 
  property is not defined but the object implements the unknownProperty()
  method then that will be invoked as well.
  
  If you plan to run on IE8 and older browsers then you should use this 
  method anytime you want to set a property on an object that you don't
  know for sure is private.  (My convention only properties beginning with 
  an underscore '_' are considered private.)
  
  On all newer browsers, you only need to use this method to set 
  properties if the property might not be defined on the object and you want
  to respect the unknownProperty() handler.  Otherwise you can ignore this
  method.
  
  @param {Object} obj
    The object to modify.
    
  @param {String} keyName
    The property key to set
    
  @param {Object} value
    The value to set
    
  @returns {Object} the passed value.
*/
SC.set = set;

// ..........................................................
// PATHS
// 

function normalizePath(path) {
  sc_assert('must pass non-empty string to normalizePath()', 
    path && path!=='');
    
  if (path==='*') return path; //special case...
  var first = path[0];
  if(first==='.') return 'this'+path;
  if (first==='*' && path[1]!=='.') return 'this.'+path.slice(1);
  return path;
}

// assumes normalized input; no *, normalized path, always a target...
function getPath(target, path) {
  var len = path.length, idx, next, key;
  
  idx = path.indexOf('*');
  if (idx>0 && path[idx-1]!=='.') {
    return getPath(getPath(target, path.slice(0, idx)), path.slice(idx+1));
  }

  idx = 0;
  while(target && idx<len) {
    next = path.indexOf('.', idx);
    if (next<0) next = len;
    key = path.slice(idx, next);
    target = key==='*' ? target : get(target, key);
    idx = next+1;
  }
  return target ;
}

var TUPLE_RET = [];
var IS_GLOBAL = /^([A-Z$]|([0-9][A-Z$])).*[\.\*]/;
var IS_GLOBAL_SET = /^([A-Z$]|([0-9][A-Z$])).*[\.\*]?/;
var HAS_THIS  = /^this[\.\*]/;
var FIRST_KEY = /^([^\.\*]+)/;

function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

// assumes path is already normalized
function normalizeTuple(target, path) {
  var hasThis  = HAS_THIS.test(path),
      isGlobal = !hasThis && IS_GLOBAL.test(path),
      key;

  if (!target || isGlobal) target = window;
  if (hasThis) path = path.slice(5);
  
  var idx = path.indexOf('*');
  if (idx>0 && path[idx-1]!=='.') {
    
    // should not do lookup on a prototype object because the object isn't
    // really live yet.
    if (target && meta(target,false).proto!==target) {
      target = getPath(target, path.slice(0, idx));
    } else {
      target = null;
    }
    path   = path.slice(idx+1);

  } else if (target === window) {
    key = firstKey(path);
    target = get(target, key);
    path   = path.slice(key.length+1);
  }

  // must return some kind of path to be valid else other things will break.
  if (!path || path.length===0) throw new Error('Invalid Path');
  
  TUPLE_RET[0] = target;
  TUPLE_RET[1] = path;
  return TUPLE_RET;
}

/**
  @private

  Normalizes a path to support older-style property paths beginning with . or

  @function
  @param {String} path path to normalize
  @returns {String} normalized path  
*/
SC.normalizePath = normalizePath;

/**
  @private

  Normalizes a target/path pair to reflect that actual target/path that should
  be observed, etc.  This takes into account passing in global property 
  paths (i.e. a path beginning with a captial letter not defined on the 
  target) and * separators.
  
  @param {Object} target
    The current target.  May be null.
    
  @param {String} path
    A path on the target or a global property path.
    
  @returns {Array} a temporary array with the normalized target/path pair.
*/
SC.normalizeTuple = function(target, path) {
  return normalizeTuple(target, normalizePath(path));
};

SC.normalizeTuple.primitive = normalizeTuple;

SC.getPath = function(root, path) {
  var hasThis, isGlobal;
  
  if (!path && 'string'===typeof root) {
    path = root;
    root = null;
  }

  // detect complicated paths and normalize them
  path = normalizePath(path);
  hasThis  = HAS_THIS.test(path);
  isGlobal = !hasThis && IS_GLOBAL.test(path);
  if (!root || hasThis || isGlobal || path.indexOf('*')>0) {
    var tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
  } 
  
  return getPath(root, path);
};

SC.setPath = function(root, path, value) {
  var keyName;
  
  if (arguments.length===2 && 'string' === typeof root) {
    value = path;
    path = root;
    root = null;
  }
  
  path = normalizePath(path);
  if (path.indexOf('*')>0) {
    var tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
  }

  if (path.indexOf('.') > 0) {
    keyName = path.slice(path.lastIndexOf('.')+1);
    path    = path.slice(0, path.length-(keyName.length+1));
    if (!HAS_THIS.test(path) && IS_GLOBAL_SET.test(path) && path.indexOf('.')<0) {
      root = window[path]; // special case only works during set...
    } else if (path !== 'this') {
      root = SC.getPath(root, path);
    }

  } else {
    if (IS_GLOBAL_SET.test(path)) throw new Error('Invalid Path');
    keyName = path;
  }
  
  if (!keyName || keyName.length===0 || keyName==='*') {
    throw new Error('Invalid Path');
  }
  
  return SC.set(root, keyName, value);
};


})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */




var USE_ACCESSORS = SC.USE_ACCESSORS;
var GUID_KEY = SC.GUID_KEY;
var META_KEY = SC.META_KEY;
var meta = SC.meta;
var o_create = SC.platform.create;
var o_defineProperty = SC.platform.defineProperty;
var SIMPLE_PROPERTY, WATCHED_PROPERTY;

// ..........................................................
// DESCRIPTOR
// 

var SIMPLE_DESC = {
  writable: true,
  configurable: true,
  enumerable: true,
  value: null
};

/**
  @private
  @constructor
  
  Objects of this type can implement an interface to responds requests to
  get and set.  The default implementation handles simple properties.
  
  You generally won't need to create or subclass this directly.
*/
SC.Descriptor = function() {};

var Dp = SC.Descriptor.prototype;

/**
  Called whenever we want to set the property value.  Should set the value 
  and return the actual set value (which is usually the same but may be 
  different in the case of computed properties.)
  
  @param {Object} obj
    The object to set the value on.
    
  @param {String} keyName
    The key to set.
    
  @param {Object} value
    The new value
    
  @returns {Object} value actual set value
*/
Dp.set = function(obj, keyName, value) {
  obj[keyName] = value;
  return value;
};

/**
  Called whenever we want to get the property value.  Should retrieve the 
  current value.
  
  @param {Object} obj
    The object to get the value on.
    
  @param {String} keyName
    The key to retrieve
    
  @returns {Object} the current value
*/
Dp.get = function(obj, keyName) {
  return obj[keyName];
};

/**
  This is called on the descriptor to set it up on the object.  The 
  descriptor is responsible for actually defining the property on the object
  here.
  
  The passed `value` is the transferValue returned from any previous 
  descriptor.
  
  @param {Object} obj
    The object to set the value on.
    
  @param {String} keyName
    The key to set.
    
  @param {Object} value
    The transfer value from any previous descriptor.
  
  @returns {void}
*/
Dp.setup = function(obj, keyName, value) {
  SIMPLE_DESC.value = value;
  o_defineProperty(obj, keyName, SIMPLE_DESC);
  SIMPLE_DESC.value = null;
};

/**
  This is called on the descriptor just before another descriptor takes its
  place.  This method should at least return the 'transfer value' of the 
  property - which is the value you want to passed as the input to the new
  descriptor's setup() method.  
  
  It is not generally necessary to actually 'undefine' the property as a new
  property descriptor will redefine it immediately after this method returns.
  
  @param {Object} obj
    The object to set the value on.
    
  @param {String} keyName
    The key to set.
    
  @returns {Object} transfer value
*/
Dp.teardown = function(obj, keyName) {
  return obj[keyName];
};

Dp.val = function(obj, keyName) {
  return obj[keyName];
};

// ..........................................................
// SIMPLE AND WATCHED PROPERTIES
// 

// if accessors are disabled for the app then this will act as a guard when
// testing on browsers that do support accessors.  It will throw an exception
// if you do foo.bar instead of SC.get(foo, 'bar')

//@if (legacy)
if (!USE_ACCESSORS) {
  SC.Descriptor.MUST_USE_GETTER = function() {
    sc_assert('Must use SC.get() to access this property', false);
  };

  SC.Descriptor.MUST_USE_SETTER = function() {
    sc_assert('Must use SC.set() to access this property', false);
  };
}
//@endif

var WATCHED_DESC = {
  configurable: true,
  enumerable:   true,
  set: SC.Descriptor.MUST_USE_SETTER
};

function w_get(obj, keyName) {
  var m = meta(obj, false);
  return (m.source===obj) && m.values[keyName];
}

function w_set(obj, keyName, value) {
  var m = meta(obj), watching;
  
  watching = m.watching[keyName]>0 && value!==m.values[keyName];  
  if (watching) SC.propertyWillChange(obj, keyName);
  m.values[keyName] = value;
  if (watching) SC.propertyDidChange(obj, keyName);
  return value;
}

var WATCHED_GETTERS = {};
function mkWatchedGetter(keyName) {
  var ret = WATCHED_GETTERS[keyName];
  if (!ret) {
    ret = WATCHED_GETTERS[keyName] = function() { 
      return w_get(this, keyName); 
    };
  }
  return ret;
}

var WATCHED_SETTERS = {};
function mkWatchedSetter(keyName) {
  var ret = WATCHED_SETTERS[keyName];
  if (!ret) {
    ret = WATCHED_SETTERS[keyName] = function(value) {
      return w_set(this, keyName, value);
    };
  }
  return ret;
}

/**
  @private 
  
  Private version of simple property that invokes property change callbacks.
*/
WATCHED_PROPERTY = new SC.Descriptor();

if (SC.platform.hasPropertyAccessors) {
  WATCHED_PROPERTY.get = w_get ;
  WATCHED_PROPERTY.set = w_set ;

  if (USE_ACCESSORS) {
    WATCHED_PROPERTY.setup = function(obj, keyName, value) {
      WATCHED_DESC.get = mkWatchedGetter(keyName);
      WATCHED_DESC.set = mkWatchedSetter(keyName);
      o_defineProperty(obj, keyName, WATCHED_DESC);
      WATCHED_DESC.get = WATCHED_DESC.set = null;
      if (value !== undefined) meta(obj).values[keyName] = value;
    };

  } else {
    WATCHED_PROPERTY.setup = function(obj, keyName, value) {
      WATCHED_DESC.get = mkWatchedGetter(keyName);
      o_defineProperty(obj, keyName, WATCHED_DESC);
      WATCHED_DESC.get = null;
      if (value !== undefined) meta(obj).values[keyName] = value;
    };
  }

  WATCHED_PROPERTY.teardown = function(obj, keyName) {
    var ret = meta(obj).values[keyName];
    delete meta(obj).values[keyName];
    return ret;
  };

// NOTE: if platform does not have property accessors then we just have to 
// set values and hope for the best.  You just won't get any warnings...
} else {
  
  WATCHED_PROPERTY.set = function(obj, keyName, value) {
    var m = meta(obj), watching;

    watching = m.watching[keyName]>0 && value!==obj[keyName];  
    if (watching) SC.propertyWillChange(obj, keyName);
    obj[keyName] = value;
    if (watching) SC.propertyDidChange(obj, keyName);
    return value;
  };
  
}
  
/**
  The default descriptor for simple properties.  Pass as the third argument
  to SC.defineProperty() along with a value to set a simple value.
  
  @static
  @default SC.Descriptor
*/
SC.SIMPLE_PROPERTY = new SC.Descriptor();
SIMPLE_PROPERTY = SC.SIMPLE_PROPERTY;

SIMPLE_PROPERTY.unwatched = WATCHED_PROPERTY.unwatched = SIMPLE_PROPERTY;
SIMPLE_PROPERTY.watched   = WATCHED_PROPERTY.watched   = WATCHED_PROPERTY;


// ..........................................................
// DEFINING PROPERTIES API
// 

function hasDesc(descs, keyName) {
  if (keyName === 'toString') return 'function' !== typeof descs.toString;
  else return !!descs[keyName];
}

/**
  @private

  NOTE: This is a low-level method used by other parts of the API.  You almost
  never want to call this method directly.  Instead you should use SC.mixin()
  to define new properties.
  
  Defines a property on an object.  This method works much like the ES5 
  Object.defineProperty() method except that it can also accept computed 
  properties and other special descriptors. 

  Normally this method takes only three parameters.  However if you pass an
  instance of SC.Descriptor as the third param then you can pass an optional
  value as the fourth parameter.  This is often more efficient than creating
  new descriptor hashes for each property.
  
  ## Examples

      // ES5 compatible mode
      SC.defineProperty(contact, 'firstName', {
        writable: true,
        configurable: false,
        enumerable: true,
        value: 'Charles'
      });
      
      // define a simple property
      SC.defineProperty(contact, 'lastName', SC.SIMPLE_PROPERTY, 'Jolley');
      
      // define a computed property
      SC.defineProperty(contact, 'fullName', SC.computed(function() {
        return this.firstName+' '+this.lastName;
      }).property('firstName', 'lastName').cacheable());
*/
SC.defineProperty = function(obj, keyName, desc, val) {
  var m = meta(obj, false), descs = m.descs, watching = m.watching[keyName]>0;

  if (val === undefined) {
    val = hasDesc(descs, keyName) ? descs[keyName].teardown(obj, keyName) : obj[keyName];
  } else if (hasDesc(descs, keyName)) {
    descs[keyName].teardown(obj, keyName);
  }

  if (!desc) desc = SIMPLE_PROPERTY;
  
  if (desc instanceof SC.Descriptor) {
    m = meta(obj, true);
    descs = m.descs;
    
    desc = (watching ? desc.watched : desc.unwatched) || desc; 
    descs[keyName] = desc;
    desc.setup(obj, keyName, val, watching);

  // compatibility with ES5
  } else {
    if (descs[keyName]) meta(obj).descs[keyName] = null;
    o_defineProperty(obj, keyName, desc);
  }
  
  return this;
};

/**
  Creates a new object using the passed object as its prototype.  On browsers
  that support it, this uses the built in Object.create method.  Else one is
  simulated for you.
  
  This method is a better choice thant Object.create() because it will make 
  sure that any observers, event listeners, and computed properties are 
  inherited from the parent as well.
  
  @param {Object} obj
    The object you want to have as the prototype.
    
  @returns {Object} the newly created object
*/
SC.create = function(obj, props) {
  var ret = o_create(obj, props);
  if (GUID_KEY in ret) SC.generateGuid(ret, 'sc');
  if (META_KEY in ret) SC.rewatch(ret); // setup watch chains if needed.
  return ret;
};

/**
  @private

  Creates a new object using the passed object as its prototype.  This method
  acts like `SC.create()` in every way except that bindings, observers, and
  computed properties will be activated on the object.  
  
  The purpose of this method is to build an object for use in a prototype
  chain. (i.e. to be set as the `prototype` property on a constructor 
  function).  Prototype objects need to inherit bindings, observers and
  other configuration so they pass it on to their children.  However since
  they are never 'live' objects themselves, they should not fire or make
  other changes when various properties around them change.
  
  You should use this method anytime you want to create a new object for use
  in a prototype chain.

  @param {Object} obj
    The base object.

  @param {Object} hash
    Optional hash of properties to define on the object.

  @returns {Object} new object
*/
SC.createPrototype = function(obj, props) {
  var ret = o_create(obj, props);
  meta(ret, true).proto = ret;
  if (GUID_KEY in ret) SC.generateGuid(ret, 'sc');
  if (META_KEY in ret) SC.rewatch(ret); // setup watch chains if needed.
  return ret;
};
  

/**
  Tears down the meta on an object so that it can be garbage collected.
  Multiple calls will have no effect.
  
  @param {Object} obj  the object to destroy
  @returns {void}
*/
SC.destroy = function(obj) {
  if (obj[META_KEY]) obj[META_KEY] = null; 
};


})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */




var meta = SC.meta;
var guidFor = SC.guidFor;
var USE_ACCESSORS = SC.USE_ACCESSORS;
var a_slice = Array.prototype.slice;
var o_create = SC.platform.create;
var o_defineProperty = SC.platform.defineProperty;

// ..........................................................
// DEPENDENT KEYS
// 

// data structure:
//  meta.deps = { 
//   'depKey': { 
//     'keyName': count,
//     __scproto__: SRC_OBJ [to detect clones]
//     },
//   __scproto__: SRC_OBJ
//  }

function uniqDeps(obj, depKey) {
  var m = meta(obj), deps, ret;
  deps = m.deps;
  if (!deps) {
    deps = m.deps = { __scproto__: obj };
  } else if (deps.__scproto__ !== obj) {
    deps = m.deps = o_create(deps);
    deps.__scproto__ = obj;
  }
  
  ret = deps[depKey];
  if (!ret) {
    ret = deps[depKey] = { __scproto__: obj };
  } else if (ret.__scproto__ !== obj) {
    ret = deps[depKey] = o_create(ret);
    ret.__scproto__ = obj;
  }
  
  return ret;
}

function addDependentKey(obj, keyName, depKey) {
  var deps = uniqDeps(obj, depKey);
  deps[keyName] = (deps[keyName] || 0) + 1;
  SC.watch(obj, depKey);
}

function removeDependentKey(obj, keyName, depKey) {
  var deps = uniqDeps(obj, depKey);
  deps[keyName] = (deps[keyName] || 0) - 1;
  SC.unwatch(obj, depKey);
}

function addDependentKeys(desc, obj, keyName) {
  var keys = desc._dependentKeys, 
      len  = keys ? keys.length : 0;
  for(var idx=0;idx<len;idx++) addDependentKey(obj, keyName, keys[idx]);
}

// ..........................................................
// COMPUTED PROPERTY
//

function ComputedProperty(func, opts) {
  this.func = func;
  this._cacheable = opts && opts.cacheable;
  this._dependentKeys = opts && opts.dependentKeys;
}

SC.ComputedProperty = ComputedProperty;
ComputedProperty.prototype = new SC.Descriptor();

var CP_DESC = {
  configurable: true,
  enumerable:   true,
  get: function() { return undefined; }, // for when use_accessors is false.
  set: SC.Descriptor.MUST_USE_SETTER  // for when use_accessors is false
};

function mkCpGetter(keyName, desc) {
  var cacheable = desc._cacheable, 
      func     = desc.func;
      
  if (cacheable) {
    return function() {
      var ret, cache = meta(this).cache;
      if (keyName in cache) return cache[keyName];
      ret = cache[keyName] = func.call(this, keyName);
      return ret ;
    };
  } else {
    return function() {
      return func.call(this, keyName);
    };
  }
}

function mkCpSetter(keyName, desc) {
  var cacheable = desc._cacheable,
      func      = desc.func;
      
  return function(value) {
    var m = meta(this, cacheable),
        watched = (m.source===this) && m.watching[keyName]>0,
        ret, oldSuspended, lastSetValues;

    oldSuspended = desc._suspended;
    desc._suspended = this;

    watched = watched && m.lastSetValues[keyName]!==guidFor(value);
    if (watched) {
      m.lastSetValues[keyName] = guidFor(value);
      SC.propertyWillChange(this, keyName);
    }
    
    if (cacheable) delete m.cache[keyName];
    ret = func.call(this, keyName, value);
    if (cacheable) m.cache[keyName] = ret;
    if (watched) SC.propertyDidChange(this, keyName);
    desc._suspended = oldSuspended;
    return ret;
  };
}

var Cp = ComputedProperty.prototype;

/**
  Call on a computed property to set it into cacheable mode.  When in this
  mode the computed property will automatically cache the return value of 
  your function until one of the dependent keys changes.

  @param {Boolean} aFlag optional set to false to disable cacheing
  @returns {SC.ComputedProperty} receiver
*/
Cp.cacheable = function(aFlag) {
  this._cacheable = aFlag!==false;
  return this;
};

/**
  Sets the dependent keys on this computed property.  Pass any number of 
  arguments containing key paths that this computed property depends on.
  
  @param {String} path... zero or more property paths
  @returns {SC.ComputedProperty} receiver
*/
Cp.property = function() {
  this._dependentKeys = a_slice.call(arguments);
  return this;
};

/** @private - impl descriptor API */
Cp.setup = function(obj, keyName, value) {
  CP_DESC.get = mkCpGetter(keyName, this);
  CP_DESC.set = mkCpSetter(keyName, this);
  o_defineProperty(obj, keyName, CP_DESC);
  CP_DESC.get = CP_DESC.set = null;
  addDependentKeys(this, obj, keyName);
};

/** @private - impl descriptor API */
Cp.teardown = function(obj, keyName) {
  var keys = this._dependentKeys, 
      len  = keys ? keys.length : 0;
  for(var idx=0;idx<len;idx++) removeDependentKey(obj, keyName, keys[idx]);

  if (this._cacheable) delete meta(obj).cache[keyName];
  
  return null; // no value to restore
};

/** @private - impl descriptor API */
Cp.didChange = function(obj, keyName) {
  if (this._cacheable && (this._suspended !== obj)) {
    delete meta(obj).cache[keyName];
  }
};

/** @private - impl descriptor API */
Cp.get = function(obj, keyName) {
  var ret, cache;
  
  if (this._cacheable) {
    cache = meta(obj).cache;
    if (keyName in cache) return cache[keyName];
    ret = cache[keyName] = this.func.call(obj, keyName);
  } else {
    ret = this.func.call(obj, keyName);
  }
  return ret ;
};

/** @private - impl descriptor API */
Cp.set = function(obj, keyName, value) {
  var cacheable = this._cacheable;
  
  var m = meta(obj, cacheable),
      watched = (m.source===obj) && m.watching[keyName]>0,
      ret, oldSuspended, lastSetValues;

  oldSuspended = this._suspended;
  this._suspended = obj;

  watched = watched && m.lastSetValues[keyName]!==guidFor(value);
  if (watched) {
    m.lastSetValues[keyName] = guidFor(value);
    SC.propertyWillChange(obj, keyName);
  }
  
  if (cacheable) delete m.cache[keyName];
  ret = this.func.call(obj, keyName, value);
  if (cacheable) m.cache[keyName] = ret;
  if (watched) SC.propertyDidChange(obj, keyName);
  this._suspended = oldSuspended;
  return ret;
};

Cp.val = function(obj, keyName) {
  return meta(obj, false).values[keyName];
};

if (!SC.platform.hasPropertyAccessors) {
  Cp.setup = function(obj, keyName, value) {
    obj[keyName] = undefined; // so it shows up in key iteration
    addDependentKeys(this, obj, keyName);
  };
  
} else if (!USE_ACCESSORS) {
  Cp.setup = function(obj, keyName) {
    // throw exception if not using SC.get() and SC.set() when supported
    o_defineProperty(obj, keyName, CP_DESC);
    addDependentKeys(this, obj, keyName);
  };
} 

/**
  This helper returns a new property descriptor that wraps the passed 
  computed property function.  You can use this helper to define properties
  with mixins or via SC.defineProperty().
  
  The function you pass will be used to both get and set property values.
  The function should accept two parameters, key and value.  If value is not
  undefined you should set the value first.  In either case return the 
  current value of the property.
  
  @param {Function} func
    The computed property function.
    
  @returns {SC.ComputedProperty} property descriptor instance
*/
SC.computed = function(func) {
  return new ComputedProperty(func);
};

})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */



var o_create = SC.platform.create;
var meta = SC.meta;
var guidFor = SC.guidFor;
var a_slice = Array.prototype.slice;

function objectFor(m, obj, writable) {
  var len = arguments.length, idx, keyName, ret;
  
  for(idx=3; idx<len; idx++) {
    keyName = arguments[idx];
    ret = m[keyName];
    if (writable) {
      if (!ret) {
        ret = m[keyName] = { __scproto__: obj };
      } else if (ret.__scproto__ !== obj) {
        ret = m[keyName] = o_create(ret);
        ret.__scproto__ = obj;
      }
    } else if (!ret || (ret.__scproto__ !== obj)) {
      return undefined;
    }
    
    m = ret;
  }
  
  return ret;
}

function listenerSetFor(obj, eventName, target, writable) {
  return objectFor(meta(obj, writable), obj, writable, 'listeners', eventName, target);
}

var EV_SKIP = { __scproto__: true };

function invokeEvents(targets, params) {
  var tguid, mguid, methods, info, method, target;
  for(tguid in targets) {
    if (EV_SKIP[tguid]) continue;
    methods = targets[tguid];
    
    for(mguid in methods) {
      if (EV_SKIP[mguid] || !(info=methods[mguid])) continue;
      method = info.method;
      target = info.target;
      if (!target) target = params[0];  // object
      if ('string' === typeof method) method = target[method];
      if (info.xform) info.xform(target, method, params);
      else method.apply(target, params);
    }
  }
}

function addListener(obj, eventName, target, method, xform) {
  if (!method && 'function'===typeof target) {
    method = target;
    target = null;
  }

  var set  = listenerSetFor(obj, eventName, target, true), 
      guid = guidFor(method), ret;

  if (!set[guid]) {
    set[guid] = { target: target, method: method, xform: xform };
  } else {
    set[guid].xform = xform; // used by observers etc to map params
  }
  
  if (obj && 'function'===typeof obj.didAddListener) {
    obj.didAddListener(eventName, target, method);
  }
  
  return ret; // return true if this is the first listener.
}

function removeListener(obj, eventName, target, method) {
  if (!method && 'function'===typeof target) {
    method = target;
    target = null;
  }
  
  var set = listenerSetFor(obj, eventName, target, true),
      guid = guidFor(method);
      
  // can't delete since it might be inherited
  if (set && set[guid]) set[guid] = null; 

  if (obj && 'function'===typeof obj.didRemoveListener) {
    obj.didRemoveListener(eventName, target, method);
  }
}

// returns a list of currently watched events
function watchedEvents(obj) {
  var listeners = meta(obj, false).listeners, ret =[];
  if (listeners) {
    for(var eventName in listeners) {
      if (!EV_SKIP[eventName] && listeners[eventName]) ret.push(eventName);
    }
  }
  return ret;
}

function sendEvent(obj, eventName) {
  
  // first give object a change to handle it
  if (obj && 'function' === typeof obj.sendEvent) {
    obj.sendEvent.apply(obj, a_slice.call(arguments, 1));
  }
  
  var set = meta(obj, false).listeners;
  if (set && (set = set[eventName])) {
    invokeEvents(set, arguments);
    return true;
  }
  
  return false;
}

function hasListeners(obj, eventName) {
  var targets = meta(obj, false).listeners;
  if (targets) targets = targets[eventName];
  if (!targets) return false;
  
  var tguid, mguid, methods;
  for(tguid in targets) {
    if (EV_SKIP[tguid] || !targets[tguid]) continue;
    methods = targets[tguid];
    for(mguid in methods) {
      if (EV_SKIP[mguid] || !methods[mguid]) continue;
      return true; // stop as soon as we find a valid listener
    }
  }
  
  // no listeners!  might as well clean this up so it is faster later.
  var set = objectFor(meta(obj, true), obj, true, 'listeners');
  set[eventName] = null;
  
  return false;
}

function listenersFor(obj, eventName) {
  var targets = meta(obj, false).listeners, 
      ret = [];
      
  if (targets) targets = targets[eventName];
  if (!targets) return ret;
  
  var tguid, mguid, methods, info;
  for(tguid in targets) {
    if (EV_SKIP[tguid] || !targets[tguid]) continue;
    methods = targets[tguid];
    for(mguid in methods) {
      if (EV_SKIP[mguid] || !methods[mguid]) continue;
      info = methods[mguid];
      ret.push([info.target, info.method]);
    }
  }
  
  return ret;
}

SC.addListener = addListener;
SC.removeListener = removeListener;
SC.sendEvent = sendEvent;
SC.hasListeners = hasListeners;
SC.watchedEvents = watchedEvents;
SC.listenersFor = listenersFor;

})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */




var AFTER_OBSERVERS = ':change';
var BEFORE_OBSERVERS = ':before';
var guidFor = SC.guidFor;
var normalizePath = SC.normalizePath;

var suspended = 0;

var queue = [], queueSet = {};
function notifyObservers(obj, eventName) {
  if (suspended) {
    
    // if suspended add to the queue to send event later - but only send 
    // event once.
    var guid = guidFor(obj);
    if (!queueSet[guid]) queueSet[guid] = {};
    if (!queueSet[guid][eventName]) {
      queueSet[guid][eventName] = true;
      queue.push([obj, eventName]);
    }

  } else {
    SC.sendEvent(obj, eventName);
  }
}

function flushObserverQueue() {
  if (!queue || queue.length===0) return ;
  var q = queue;
  queue = []; queueSet = {};
  q.forEach(function(x){ SC.sendEvent(x[0], x[1]); });
}

SC.beginPropertyChanges = function() {
  suspended++;
  return this;
};

SC.endPropertyChanges = function() {
  suspended--;
  if (suspended<=0) flushObserverQueue();
};

function changeEvent(keyName) {
  return keyName+AFTER_OBSERVERS;
}

function beforeEvent(keyName) {
  return keyName+BEFORE_OBSERVERS;
}

function changeKey(eventName) {
  return eventName.slice(0, -7);
}

function beforeKey(eventName) {
  return eventName.slice(0, -7);
}

function xformChange(target, method, params) {
  var obj = params[0], keyName = changeKey(params[1]), val;
  if (method.length>2) val = SC.getPath(obj, keyName);
  method.call(target, obj, keyName, val);
}

function xformBefore(target, method, params) {
  var obj = params[0], keyName = beforeKey(params[1]), val;
  if (method.length>2) val = SC.getPath(obj, keyName);
  method.call(target, obj, keyName, val);
}

SC.addObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.addListener(obj, changeEvent(path), target, method, xformChange);
  SC.watch(obj, path);
  return this;
};

/** @private */
SC.observersFor = function(obj, path) {
  return SC.listenersFor(obj, changeEvent(path));
};

SC.removeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.unwatch(obj, path);
  SC.removeListener(obj, changeEvent(path), target, method);
  return this;
};

SC.addBeforeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.addListener(obj, beforeEvent(path), target, method, xformBefore);
  SC.watch(obj, path);
  return this;
};

/** @private */
SC.beforeObserversFor = function(obj, path) {
  return SC.listenersFor(obj, beforeEvent(path));
};

SC.removeBeforeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.unwatch(obj, path);
  SC.removeListener(obj, beforeEvent(path), target, method);
  return this;
};

/** @private */
SC.notifyObservers = function(obj, keyName) {
  notifyObservers(obj, changeEvent(keyName));
};

/** @private */
SC.notifyBeforeObservers = function(obj, keyName) {
  notifyObservers(obj, beforeEvent(keyName));
};


})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */





var guidFor = SC.guidFor;
var meta    = SC.meta;
var get = SC.get, set = SC.set;
var normalizeTuple = SC.normalizeTuple.primitive;
var normalizePath  = SC.normalizePath;
var SIMPLE_PROPERTY = SC.SIMPLE_PROPERTY;
var GUID_KEY = SC.GUID_KEY;
var notifyObservers = SC.notifyObservers;

var FIRST_KEY = /^([^\.\*]+)/;
var IS_PATH = /[\.\*]/;

function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

// returns true if the passed path is just a keyName
function isKeyName(path) {
  return path==='*' || !IS_PATH.test(path);
}

// ..........................................................
// DEPENDENT KEYS
// 

var DEP_SKIP = { __scproto__: true }; // skip some keys and toString
function iterDeps(methodName, obj, depKey, seen) {
  
  var guid = guidFor(obj);
  if (!seen[guid]) seen[guid] = {};
  if (seen[guid][depKey]) return ;
  seen[guid][depKey] = true;
  
  var deps = meta(obj, false).deps, method = SC[methodName];
  deps = deps && deps[depKey];
  if (deps) {
    for(var key in deps) {
      if (DEP_SKIP[key]) continue;
      method(obj, key);
    }
  }
}


var WILL_SEEN, DID_SEEN;

// called whenever a property is about to change to clear the cache of any dependent keys (and notify those properties of changes, etc...)
function dependentKeysWillChange(obj, depKey) {
  var seen = WILL_SEEN, top = !seen;
  if (top) seen = WILL_SEEN = {};
  iterDeps('propertyWillChange', obj, depKey, seen);
  if (top) WILL_SEEN = null;
}

// called whenever a property has just changed to update dependent keys
function dependentKeysDidChange(obj, depKey) {
  var seen = DID_SEEN, top = !seen;
  if (top) seen = DID_SEEN = {};
  iterDeps('propertyDidChange', obj, depKey, seen);
  if (top) DID_SEEN = null;
}

// ..........................................................
// CHAIN
// 

function addChainWatcher(obj, keyName, node) {
  if (!obj || ('object' !== typeof obj)) return; // nothing to do
  var m = meta(obj);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__scproto__ !== obj) {
    nodes = m.chainWatchers = { __scproto__: obj };
  }
  
  if (!nodes[keyName]) nodes[keyName] = {};
  nodes[keyName][guidFor(node)] = node;
  SC.watch(obj, keyName);
}

function removeChainWatcher(obj, keyName, node) {
  if (!obj || ('object' !== typeof obj)) return; // nothing to do
  var m = meta(obj, false);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__scproto__ !== obj) return; //nothing to do
  if (nodes[keyName]) delete nodes[keyName][guidFor(node)];
  SC.unwatch(obj, keyName);
}

var pendingQueue = [];

// attempts to add the pendingQueue chains again.  If some of them end up
// back in the queue and reschedule is true, schedules a timeout to try 
// again.
function flushPendingChains(reschedule) {
  if (pendingQueue.length===0) return ; // nothing to do
  
  var queue = pendingQueue;
  pendingQueue = [];
  
  queue.forEach(function(q) { q[0].add(q[1]); });
  if (reschedule!==false && pendingQueue.length>0) {
    setTimeout(flushPendingChains, 1);
  }
}

function isProto(pvalue) {
  return meta(pvalue, false).proto === pvalue;
}

// A ChainNode watches a single key on an object.  If you provide a starting
// value for the key then the node won't actually watch it.  For a root node 
// pass null for parent and key and object for value.
var ChainNode = function(parent, key, value, separator) {
  var obj;
  
  this._parent = parent;
  this._key    = key;
  this._watching = value===undefined;
  this._value  = value || (parent._value && !isProto(parent._value) && get(parent._value, key));
  this._separator = separator || '.';
  this._paths = {};

  if (this._watching) {
    this._object = parent._value;
    if (this._object) addChainWatcher(this._object, this._key, this);
  }
};


var Wp = ChainNode.prototype;

Wp.destroy = function() {
  if (this._watching) {
    var obj = this._object;
    if (obj) removeChainWatcher(obj, this._key, this);
    this._watching = false; // so future calls do nothing
  }
};

// copies a top level object only
Wp.copy = function(obj) {
  var ret = new ChainNode(null, null, obj, this._separator);
  var paths = this._paths, path;
  for(path in paths) {
    if (!(paths[path] > 0)) continue; // this check will also catch non-number vals.
    ret.add(path);
  }
  return ret;
};

// called on the root node of a chain to setup watchers on the specified 
// path.
Wp.add = function(path) {
  var obj, tuple, key, src, separator, paths;
  
  paths = this._paths;
  paths[path] = (paths[path] || 0) + 1 ;
  
  obj = this._value;
  tuple = normalizeTuple(obj, path);
  if (tuple[0] && (tuple[0] === obj)) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);

  // static path does not exist yet.  put into a queue and try to connect
  // later.
  } else if (!tuple[0]) {
    pendingQueue.push([this, path]);
    return;
    
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    separator = path.slice(key.length, key.length+1);
    path = tuple[1];
  }
  
  this.chain(key, path, src, separator);
};

// called on the root node of a chain to teardown watcher on the specified
// path
Wp.remove = function(path) {
  var obj, tuple, key, src, paths;

  paths = this._paths;
  if (paths[path] > 0) paths[path]--;

  obj = this._value;
  tuple = normalizeTuple(obj, path);
  if (tuple[0] === obj) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);
    
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    path = tuple[1];
  }
  
  this.unchain(key, path);
};

Wp.count = 0;

Wp.chain = function(key, path, src, separator) {
  var chains = this._chains, node;
  if (!chains) chains = this._chains = {};

  node = chains[key];
  if (!node) node = chains[key] = new ChainNode(this, key, src, separator);
  node.count++; // count chains...

  // chain rest of path if there is one
  if (path && path.length>0) {
    key = firstKey(path);
    path = path.slice(key.length+1);
    node.chain(key, path); // NOTE: no src means it will observe changes...
  }
};

Wp.unchain = function(key, path) {
  var chains = this._chains, node = chains[key];

  // unchain rest of path first...
  if (path && path.length>1) {
    key  = firstKey(path);
    path = path.slice(key.length+1);
    node.unchain(key, path);
  }

  // delete node if needed.
  node.count--;
  if (node.count<=0) {
    delete chains[node._key];
    node.destroy();
  }
  
};

Wp.willChange = function() {
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) continue;
      chains[key].willChange();
    }
  }
  
  if (this._parent) this._parent.chainWillChange(this, this._key, 1);
};

Wp.chainWillChange = function(chain, path, depth) {
  if (this._key) path = this._key+this._separator+path;
  
  if (this._parent) {
    this._parent.chainWillChange(this, path, depth+1);
  } else {
    if (depth>1) SC.propertyWillChange(this._value, path);
    path = 'this.'+path;
    if (this._paths[path]>0) SC.propertyWillChange(this._value, path);
  }
};

Wp.chainDidChange = function(chain, path, depth) {
  if (this._key) path = this._key+this._separator+path;
  if (this._parent) {
    this._parent.chainDidChange(this, path, depth+1);
  } else {
    if (depth>1) SC.propertyDidChange(this._value, path);
    path = 'this.'+path;
    if (this._paths[path]>0) SC.propertyDidChange(this._value, path);
  }
};

Wp.didChange = function() {
  // update my own value first.
  if (this._watching) {
    var obj = this._parent._value;
    if (obj !== this._object) {
      removeChainWatcher(this._object, this._key, this);
      this._object = obj;
      addChainWatcher(obj, this._key, this);
    }
    this._value  = obj && !isProto(obj) ? get(obj, this._key) : undefined;
  }
  
  // then notify chains...
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) continue;
      chains[key].didChange();
    }
  }

  // and finally tell parent about my path changing...
  if (this._parent) this._parent.chainDidChange(this, this._key, 1);
};

// get the chains for the current object.  If the current object has 
// chains inherited from the proto they will be cloned and reconfigured for
// the current object.
function chainsFor(obj) {
  var m   = meta(obj), ret = m.chains;
  if (!ret) {
    ret = m.chains = new ChainNode(null, null, obj);
  } else if (ret._value !== obj) {
    ret = m.chains = ret.copy(obj);
  }
  return ret ;
}



function notifyChains(obj, keyName, methodName) {
  var m = meta(obj, false);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__scproto__ !== obj) return; // nothing to do

  nodes = nodes[keyName];
  if (!nodes) return;
  
  for(var key in nodes) {
    if (!nodes.hasOwnProperty(key)) continue;
    nodes[key][methodName](obj, keyName);
  }
}

function chainsWillChange(obj, keyName) {
  notifyChains(obj, keyName, 'willChange');
}

function chainsDidChange(obj, keyName) {
  notifyChains(obj, keyName, 'didChange');
}

// ..........................................................
// WATCH
// 

var WATCHED_PROPERTY = SC.SIMPLE_PROPERTY.watched;

/**
  @private

  Starts watching a property on an object.  Whenever the property changes,
  invokes SC.propertyWillChange and SC.propertyDidChange.  This is the 
  primitive used by observers and dependent keys; usually you will never call
  this method directly but instead use higher level methods like
  SC.addObserver().
*/
SC.watch = function(obj, keyName) {

  // can't watch length on Array - it is special...
  if (keyName === 'length' && SC.typeOf(obj)==='array') return this;
  
  var m = meta(obj), watching = m.watching, desc;
  keyName = normalizePath(keyName);

  // activate watching first time
  if (!watching[keyName]) {
    watching[keyName] = 1;
    if (isKeyName(keyName)) {
      desc = m.descs[keyName];
      desc = desc ? desc.watched : WATCHED_PROPERTY;
      if (desc) SC.defineProperty(obj, keyName, desc);
    } else {
      chainsFor(obj).add(keyName);
    }

  }  else {
    watching[keyName] = (watching[keyName]||0)+1;
  }
  return this;
};

SC.watch.flushPending = flushPendingChains;

/** @private */
SC.unwatch = function(obj, keyName) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && SC.typeOf(obj)==='array') return this;

  var watching = meta(obj).watching, desc, descs;
  keyName = normalizePath(keyName);
  if (watching[keyName] === 1) {
    watching[keyName] = 0;
    if (isKeyName(keyName)) {
      desc = meta(obj).descs[keyName];
      desc = desc ? desc.unwatched : SIMPLE_PROPERTY;
      if (desc) SC.defineProperty(obj, keyName, desc);
    } else {
      chainsFor(obj).remove(keyName);
    }

  } else if (watching[keyName]>1) {
    watching[keyName]--;
  }
  
  return this;
};

/**
  @private

  Call on an object when you first beget it from another object.  This will
  setup any chained watchers on the object instance as needed.  This method is
  safe to call multiple times.
*/
SC.rewatch = function(obj) {
  var m = meta(obj, false), chains = m.chains, bindings = m.bindings, key, b;

  // make sure the object has its own guid.
  if (GUID_KEY in obj && !obj.hasOwnProperty(GUID_KEY)) {
    SC.generateGuid(obj, 'sc');
  }  

  // make sure any chained watchers update.
  if (chains && chains._value !== obj) chainsFor(obj);

  // if the object has bindings then sync them..
  if (bindings && m.proto!==obj) {
    for (key in bindings) {
      b = !DEP_SKIP[key] && obj[key];
      if (b && b instanceof SC.Binding) b.fromDidChange(obj);
    }
  }

  return this;
};

// ..........................................................
// PROPERTY CHANGES
// 

/**
  This function is called just before an object property is about to change.
  It will notify any before observers and prepare caches among other things.
  
  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method 
  manually along with `SC.propertyDidChange()` which you should call just 
  after the property value changes.
  
  @param {Object} obj
    The object with the property that will change
    
  @param {String} keyName
    The property key (or path) that will change.
    
  @returns {void}
*/
SC.propertyWillChange = function(obj, keyName) {
  var m = meta(obj, false), proto = m.proto, desc = m.descs[keyName];
  if (proto === obj) return ;
  if (desc && desc.willChange) desc.willChange(obj, keyName);
  dependentKeysWillChange(obj, keyName);
  chainsWillChange(obj, keyName);
  SC.notifyBeforeObservers(obj, keyName);
};

/**
  This function is called just after an object property has changed.
  It will notify any observers and clear caches among other things.
  
  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method 
  manually along with `SC.propertyWilLChange()` which you should call just 
  before the property value changes.
  
  @param {Object} obj
    The object with the property that will change
    
  @param {String} keyName
    The property key (or path) that will change.
    
  @returns {void}
*/
SC.propertyDidChange = function(obj, keyName) {
  var m = meta(obj, false), proto = m.proto, desc = m.descs[keyName];
  if (proto === obj) return ;
  if (desc && desc.didChange) desc.didChange(obj, keyName);
  dependentKeysDidChange(obj, keyName);
  chainsDidChange(obj, keyName);
  SC.notifyObservers(obj, keyName);
};

})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================






var Mixin, MixinDelegate, REQUIRED, Alias;
var classToString;

var a_map = Array.prototype.map;
var EMPTY_META = {}; // dummy for non-writable meta
var META_SKIP = { __scproto__: true, __sc_count__: true };

function meta(obj, writable) {
  var m = SC.meta(obj, writable!==false), ret = m.mixins;
  if (writable===false) return ret || EMPTY_META;
  
  if (!ret) {
    ret = m.mixins = { __scproto__: obj };
  } else if (ret.__scproto__ !== obj) {
    ret = m.mixins = Object.create(ret);
    ret.__scproto__ = obj;
  }
  return ret;
}

function initMixin(mixin, args) {
  if (args && args.length > 0) {
    mixin.mixins = a_map.call(args, function(x) {
      if (x instanceof Mixin) return x;
      
      // Note: Manually setup a primitive mixin here.  This is the only 
      // way to actually get a primitive mixin.  This way normal creation
      // of mixins will give you combined mixins...
      var mixin = new Mixin();
      mixin.properties = x;
      return mixin;
    });
  }
  return mixin;
} 

var NATIVES = [Boolean, Object, Number, Array, Date, String];
function isMethod(obj) {
  if ('function' !== typeof obj || obj.isMethod===false) return false;
  return NATIVES.indexOf(obj)<0;
}

function mergeMixins(mixins, m, descs, values, base) {
  var len = mixins.length, idx, mixin, guid, props, value, key, ovalue, concats;
  
  function removeKeys(keyName) {
    delete descs[keyName];
    delete values[keyName];
  }
  
  for(idx=0;idx<len;idx++) {
    
    mixin = mixins[idx];
    if (!mixin) throw new Error('Null value found in SC.mixin()');

    if (mixin instanceof Mixin) {
      guid = SC.guidFor(mixin);
      if (m[guid]) continue;
      m[guid] = mixin;
      props = mixin.properties; 
    } else {
      props = mixin; // apply anonymous mixin properties
    }

    if (props) {
      
      // reset before adding each new mixin to pickup concats from previous
      concats = values.concatenatedProperties || base.concatenatedProperties;
      if (props.concatenatedProperties) {
        concats = concats ? concats.concat(props.concatenatedProperties) : props.concatenatedProperties;
      }

      for (key in props) {
        if (!props.hasOwnProperty(key)) continue;
        value = props[key];
        if (value instanceof SC.Descriptor) {
          if (value === REQUIRED && descs[key]) { continue; }

          descs[key]  = value;
          values[key] = undefined;
        } else {
          
          // impl super if needed...
          if (isMethod(value)) {
            ovalue = (descs[key] === SC.SIMPLE_PROPERTY) && values[key];
            if (!ovalue) ovalue = base[key];
            if ('function' !== typeof ovalue) ovalue = null;
            if (ovalue) {
              var o = value.__sc_observes__, ob = value.__sc_observesBefore__; 
              value = SC.wrap(value, ovalue);
              value.__sc_observes__ = o;
              value.__sc_observesBefore__ = ob;
            }
          } else if ((concats && concats.indexOf(key)>=0) || key === 'concatenatedProperties') {
            var baseValue = values[key] || base[key];
            value = baseValue ? baseValue.concat(value) : SC.makeArray(value);
          }
          
          descs[key]  = SC.SIMPLE_PROPERTY;
          values[key] = value;
        }
      }
      
      
    } else if (mixin.mixins) {
      mergeMixins(mixin.mixins, m, descs, values, base);
      if (mixin._without) mixin._without.forEach(removeKeys);
    }
  }
}

var defineProperty = SC.defineProperty;

function writableReq(obj) {
  var m = SC.meta(obj), req = m.required;
  if (!req || (req.__scproto__ !== obj)) {
    req = m.required = req ? Object.create(req) : { __sc_count__: 0 };
    req.__scproto__ = obj;
  }
  return req;
}

function getObserverPaths(value) {
  return ('function' === typeof value) && value.__sc_observes__;
}

function getBeforeObserverPaths(value) {
  return ('function' === typeof value) && value.__sc_observesBefore__;
}

SC._mixinBindings = function(obj, key, value, m) {
  return value;
};

function applyMixin(obj, mixins, partial) {
  var descs = {}, values = {}, m = SC.meta(obj), req = m.required;
  var key, willApply, didApply, value, desc;
  
  var mixinBindings = SC._mixinBindings;
  
  mergeMixins(mixins, meta(obj), descs, values, obj);

  if (MixinDelegate.detect(obj)) {
    willApply = values.willApplyProperty || obj.willApplyProperty;
    didApply  = values.didApplyProperty || obj.didApplyProperty;
  }

  for(key in descs) {
    if (!descs.hasOwnProperty(key)) continue;
    
    desc = descs[key];
    value = values[key];
     
    if (desc === REQUIRED) {
      if (!(key in obj)) {
        if (!partial) throw new Error('Required property not defined: '+key);
        
        // for partial applies add to hash of required keys
        req = writableReq(obj);
        req.__sc_count__++;
        req[key] = true;
      }
      
    } else {
      
      while (desc instanceof Alias) {
        
        var altKey = desc.methodName; 
        if (descs[altKey]) {
          value = values[altKey];
          desc  = descs[altKey];
        } else if (m.descs[altKey]) {
          desc  = m.descs[altKey];
          value = desc.val(obj, altKey);
        } else {
          value = obj[altKey];
          desc  = SC.SIMPLE_PROPERTY;
        }
      }
      
      if (willApply) willApply.call(obj, key);
      
      var observerPaths = getObserverPaths(value),
          curObserverPaths = observerPaths && getObserverPaths(obj[key]),
          beforeObserverPaths = getBeforeObserverPaths(value),
          curBeforeObserverPaths = beforeObserverPaths && getBeforeObserverPaths(obj[key]),
          len, idx;
          
      if (curObserverPaths) {
        len = curObserverPaths.length;
        for(idx=0;idx<len;idx++) {
          SC.removeObserver(obj, curObserverPaths[idx], null, key);
        }
      }

      if (curBeforeObserverPaths) {
        len = curBeforeObserverPaths.length;
        for(idx=0;idx<len;idx++) {
          SC.removeBeforeObserver(obj, curBeforeObserverPaths[idx], null,key);
        }
      }

      // TODO: less hacky way for sproutcore-runtime to add bindings.
      value = mixinBindings(obj, key, value, m);
      
      defineProperty(obj, key, desc, value);
      
      if (observerPaths) {
        len = observerPaths.length;
        for(idx=0;idx<len;idx++) {
          SC.addObserver(obj, observerPaths[idx], null, key);
        }
      }

      if (beforeObserverPaths) {
        len = beforeObserverPaths.length;
        for(idx=0;idx<len;idx++) {
          SC.addBeforeObserver(obj, beforeObserverPaths[idx], null, key);
        }
      }
      
      if (req && req[key]) {
        req = writableReq(obj);
        req.__sc_count__--;
        req[key] = false;
      }

      if (didApply) didApply.call(obj, key);

    }
  }
  
  // Make sure no required attrs remain
  if (!partial && req && req.__sc_count__>0) {
    var keys = [];
    for(key in req) {
      if (META_SKIP[key]) continue;
      keys.push(key);
    }
    throw new Error('Required properties not defined: '+keys.join(','));
  }
  return obj;
}

SC.mixin = function(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  return applyMixin(obj, args, false);
};


Mixin = function() { return initMixin(this, arguments); };

Mixin._apply = applyMixin;

Mixin.applyPartial = function(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  return applyMixin(obj, args, true);
};

Mixin.create = function() {
  classToString.processed = false;
  var M = this;
  return initMixin(new M(), arguments);
};

Mixin.prototype.reopen = function() {
  
  var mixin, tmp;
  
  if (this.properties) {
    mixin = Mixin.create();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  }
  
  var len = arguments.length, mixins = this.mixins, idx;

  for(idx=0;idx<len;idx++) {
    mixin = arguments[idx];
    if (mixin instanceof Mixin) {
      mixins.push(mixin);
    } else {
      tmp = Mixin.create();
      tmp.properties = mixin;
      mixins.push(tmp);
    }
  }
  
  return this;
};

var TMP_ARRAY = [];
Mixin.prototype.apply = function(obj) {
  TMP_ARRAY.length=0;
  TMP_ARRAY[0] = this;
  return applyMixin(obj, TMP_ARRAY, false);
};

Mixin.prototype.applyPartial = function(obj) {
  TMP_ARRAY.length=0;
  TMP_ARRAY[0] = this;
  return applyMixin(obj, TMP_ARRAY, true);
};

function _detect(curMixin, targetMixin, seen) {
  var guid = SC.guidFor(curMixin);

  if (seen[guid]) return false;
  seen[guid] = true;
  
  if (curMixin === targetMixin) return true;
  var mixins = curMixin.mixins, loc = mixins ? mixins.length : 0;
  while(--loc >= 0) {
    if (_detect(mixins[loc], targetMixin, seen)) return true;
  }
  return false;
}

Mixin.prototype.detect = function(obj) {
  if (!obj) return false;
  if (obj instanceof Mixin) return _detect(obj, this, {});
  return !!meta(obj, false)[SC.guidFor(this)];
};

Mixin.prototype.without = function() {
  var ret = new Mixin(this);
  ret._without = Array.prototype.slice.call(arguments);
  return ret;
};

function _keys(ret, mixin, seen) {
  if (seen[SC.guidFor(mixin)]) return;
  seen[SC.guidFor(mixin)] = true;
  
  if (mixin.properties) {
    var props = mixin.properties;
    for(var key in props) {
      if (props.hasOwnProperty(key)) ret[key] = true;
    }
  } else if (mixin.mixins) {
    mixin.mixins.forEach(function(x) { _keys(ret, x, seen); });
  }
}

Mixin.prototype.keys = function() {
  var keys = {}, seen = {}, ret = [];
  _keys(keys, this, seen);
  for(var key in keys) {
    if (keys.hasOwnProperty(key)) ret.push(key);
  }
  return ret;
};

/** @private - make Mixin's have nice displayNames */

var NAME_KEY = SC.GUID_KEY+'_name';

function processNames(paths, root, seen) {
  var idx = paths.length;
  for(var key in root) {
    if (!root.hasOwnProperty(key)) continue;
    var obj = root[key];
    paths[idx] = key;

    if (obj && obj.toString === classToString) {
      obj[NAME_KEY] = paths.join('.');
    } else if (key==='SC' || (obj instanceof SC.Namespace)) {
      if (seen[SC.guidFor(obj)]) continue;
      seen[SC.guidFor(obj)] = true;
      processNames(paths, obj, seen);
    }

  }
  paths.length = idx; // cut out last item
}

classToString = function() {
  if (!this[NAME_KEY] && !classToString.processed) {
    classToString.processed = true;
    processNames([], window, {});
  }
  return this[NAME_KEY] || "(unknown mixin)";
};

Mixin.prototype.toString = classToString;

// returns the mixins currently applied to the specified object
// TODO: Make SC.mixin
Mixin.mixins = function(obj) {
  var ret = [], mixins = meta(obj, false), key, mixin;
  for(key in mixins) {
    if (META_SKIP[key]) continue;
    mixin = mixins[key];
    
    // skip primitive mixins since these are always anonymous
    if (!mixin.properties) ret.push(mixins[key]);
  }
  return ret;
};

REQUIRED = new SC.Descriptor();
REQUIRED.toString = function() { return '(Required Property)'; };

SC.required = function() {
  return REQUIRED;
};

Alias = function(methodName) {
  this.methodName = methodName;
};
Alias.prototype = new SC.Descriptor();

SC.alias = function(methodName) {
  return new Alias(methodName);
};

SC.Mixin = Mixin;

MixinDelegate = Mixin.create({

  willApplyProperty: SC.required(),
  didApplyProperty:  SC.required()
  
});

SC.MixinDelegate = MixinDelegate;


// ..........................................................
// OBSERVER HELPER
// 

SC.observer = function(func) {
  var paths = Array.prototype.slice.call(arguments, 1);
  func.__sc_observes__ = paths;
  return func;
};

SC.beforeObserver = function(func) {
  var paths = Array.prototype.slice.call(arguments, 1);
  func.__sc_observesBefore__ = paths;
  return func;
};







})();


(function() {
// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================










})();

(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ENV sc_assert */

// ........................................
// GLOBAL CONSTANTS
//

/**
  @name YES
  @static
  @type Boolean
  @default true
  @constant
*/
YES = true;

/**
  @name NO
  @static
  @type Boolean
  @default NO
  @constant
*/
NO = false;

//@if (legacy)
// ensure no undefined errors in browsers where console doesn't exist
if (typeof console === 'undefined') {
  window.console = {};
  console.log = console.info = console.warn = console.error = function() {};
}
//@endif

// ..........................................................
// BOOTSTRAP
// 

/**
  @static
  @type Boolean
  @default YES
  @constant
  
  Determines whether SproutCore should enhances some built-in object 
  prototypes to provide a more friendly API.  If enabled, a few methods 
  will be added to Function, String, and Array.  Object.prototype will not be
  enhanced, which is the one that causes most troubles for people.
  
  In general we recommend leaving this option set to true since it rarely
  conflicts with other code.  If you need to turn it off however, you can
  define an ENV.ENHANCE_PROTOTYPES config to disable it.
*/  
SC.EXTEND_PROTOTYPES = (SC.ENV.EXTEND_PROTOTYPES !== false);

// ........................................
// TYPING & ARRAY MESSAGING
//

var TYPE_MAP = {};
var t ="Boolean Number String Function Array Date RegExp Object".split(" ");
t.forEach(function(name) {
	TYPE_MAP[ "[object " + name + "]" ] = name.toLowerCase();
});

var toString = Object.prototype.toString;

/**
  Returns a consistant type for the passed item.

  Use this instead of the built-in SC.typeOf() to get the type of an item.
  It will return the same result across all browsers and includes a bit
  more detail.  Here is what will be returned:

  | Return Value Constant | Meaning |
  | 'string' | String primitive |
  | 'number' | Number primitive |
  | 'boolean' | Boolean primitive |
  | 'null' | Null value |
  | 'undefined' | Undefined value |
  | 'function' | A function |
  | 'array' | An instance of Array |
  | 'class' | A SproutCore class (created using SC.Object.extend()) |
  | 'object' | A SproutCore object instance |
  | 'error' | An instance of the Error object |
  | 'hash' | A JavaScript object not inheriting from SC.Object |

  @param item {Object} the item to check
  @returns {String} the type
*/
SC.typeOf = function(item) {
  var ret;
  
  ret = item==null ? String(item) : TYPE_MAP[toString.call(item)]||'object';

  if (ret === 'function') {
    if (SC.Object && SC.Object.detect(item)) ret = 'class';
  } else if (ret === 'object') {
    if (item instanceof Error) ret = 'error';
    else if (SC.Object && item instanceof SC.Object) ret = 'instance';
    else ret = 'object';
  }
  
  return ret;
};

/**
  Returns YES if the passed value is null or undefined.  This avoids errors
  from JSLint complaining about use of ==, which can be technically
  confusing.

  @param {Object} obj Value to test
  @returns {Boolean}
*/
SC.none = function(obj) {
  return obj === null || obj === undefined;
};

/**
  Verifies that a value is either null or an empty string. Return false if
  the object is not a string.

  @param {Object} obj Value to test
  @returns {Boolean}
*/
SC.empty = function(obj) {
  return obj === null || obj === undefined || obj === '';
};

/**
  @function
  
  Returns YES if the passed object is an array or Array-like.

  SproutCore Array Protocol:

    - the object has an objectAt property
    - the object is a native Array
    - the object is an Object, and has a length property

  Unlike SC.typeOf this method returns true even if the passed object is
  not formally array but appears to be array-like (i.e. implements SC.Array)

  @param {Object} obj The object to test
  @returns {Boolean}
*/
SC.isArray = function(obj) {
  if (!obj || obj.setInterval) { return false; }
  if (Array.isArray && Array.isArray(obj)) { return true; }
  if (SC.Array && SC.Array.detect(obj)) { return true; }
  if ((obj.length !== undefined) && 'object'===typeof obj) { return true; }
  return false;
};

/**
 This will compare two javascript values of possibly different types.
 It will tell you which one is greater than the other by returning:

  - -1 if the first is smaller than the second,
  - 0 if both are equal,
  - 1 if the first is greater than the second.

 The order is calculated based on SC.ORDER_DEFINITION, if types are different.
 In case they have the same type an appropriate comparison for this type is made.

 @param {Object} v First value to compare
 @param {Object} w Second value to compare
 @returns {Number} -1 if v < w, 0 if v = w and 1 if v > w.
*/
SC.compare = function (v, w) {
  if (v === w) { return 0; }

  var type1 = SC.typeOf(v);
  var type2 = SC.typeOf(w);

  var Comparable = SC.Comparable;
  if (Comparable) {
    if (type1==='instance' && Comparable.detect(v.constructor)) {
      return v.constructor.compare(v, w);
    }
    
    if (type2 === 'instance' && Comparable.detect(w.constructor)) {
      return 1-w.constructor.compare(w, v);
    }
  }

  // If we haven't yet generated a reverse-mapping of SC.ORDER_DEFINITION,
  // do so now.
  var mapping = SC.ORDER_DEFINITION_MAPPING;
  if (!mapping) {
    var order = SC.ORDER_DEFINITION;
    mapping = SC.ORDER_DEFINITION_MAPPING = {};
    var idx, len;
    for (idx = 0, len = order.length; idx < len;  ++idx) {
      mapping[order[idx]] = idx;
    }

    // We no longer need SC.ORDER_DEFINITION.
    delete SC.ORDER_DEFINITION;
  }

  var type1Index = mapping[type1];
  var type2Index = mapping[type2];

  if (type1Index < type2Index) { return -1; }
  if (type1Index > type2Index) { return 1; }

  // types are equal - so we have to check values now
  switch (type1) {
    case 'boolean':
    case 'number':
      if (v < w) { return -1; }
      if (v > w) { return 1; }
      return 0;

    case 'string':
      var comp = v.localeCompare(w);
      if (comp < 0) { return -1; }
      if (comp > 0) { return 1; }
      return 0;

    case 'array':
      var vLen = v.length;
      var wLen = w.length;
      var l = Math.min(vLen, wLen);
      var r = 0;
      var i = 0;
      var thisFunc = arguments.callee;
      while (r === 0 && i < l) {
        r = thisFunc(v[i],w[i]);
        i++;
      }
      if (r !== 0) { return r; }

      // all elements are equal now
      // shorter array should be ordered first
      if (vLen < wLen) { return -1; }
      if (vLen > wLen) { return 1; }
      // arrays are equal now
      return 0;

    case 'instance':
      if (SC.Comparable && SC.Comparable.detect(v)) { 
        return v.compare(v, w); 
      }
      return 0;

    default:
      return 0;
  }
};

function _copy(obj, deep, seen, copies) {
  var ret, loc, key;

  // primitive data types are immutable, just return them.
  if ('object' !== typeof obj) return obj;

  // avoid cyclical loops
  if (deep && (loc=seen.indexOf(obj))>=0) return copies[loc];
  
  sc_assert('Cannot clone an SC.Object that does not implement SC.Copyable', 
    !(obj instanceof SC.Object) || (SC.Copyable && SC.Copyable.detect(obj)));

  // IMPORTANT: this specific test will detect a native array only.  Any other
  // object will need to implement Copyable.
  if (SC.typeOf(obj) === 'array') {
    ret = obj.slice();
    if (deep) {
      loc = ret.length;
      while(--loc>=0) ret[loc] = _copy(ret[loc], deep, seen, copies);
    }
  } else if (SC.Copyable && SC.Copyable.detect(obj)) {
    ret = obj.copy(deep, seen, copies);
  } else {
    ret = {};
    for(key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      ret[key] = deep ? _copy(obj[key], deep, seen, copies) : obj[key];
    }
  }
  
  if (deep) {
    seen.push(obj);
    copies.push(ret);
  }

  return ret;
}

/**
  Creates a clone of the passed object. This function can take just about
  any type of object and create a clone of it, including primitive values
  (which are not actually cloned because they are immutable).

  If the passed object implements the clone() method, then this function
  will simply call that method and return the result.

  @param {Object} object The object to clone
  @param {Boolean} deep If true, a deep copy of the object is made
  @returns {Object} The cloned object
*/
SC.copy = function(obj, deep) {
  // fast paths
  if ('object' !== typeof obj) return obj; // can't copy primitives
  if (SC.Copyable && SC.Copyable.detect(obj)) return obj.copy(deep);
  return _copy(obj, deep, deep ? [] : null, deep ? [] : null);
};

/**
  Convenience method to inspect an object. This method will attempt to
  convert the object into a useful string description.

  @param {Object} obj The object you want to inspec.
  @returns {String} A description of the object
*/
SC.inspect = function(obj) {
  var v, ret = [];
  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      v = obj[key];
      if (v === 'toString') { continue; } // ignore useless items
      if (SC.typeOf(v) === SC.T_FUNCTION) { v = "function() { ... }"; }
      ret.push(key + ": " + v);
    }
  }
  return "{" + ret.join(" , ") + "}";
};

/**
  Compares two objects, returning true if they are logically equal.  This is 
  a deeper comparison than a simple triple equal.  For arrays and enumerables
  it will compare the internal objects.  For any other object that implements
  `isEqual()` it will respect that method.
  
  @param {Object} a first object to compare
  @param {Object} b second object to compare
  @returns {Boolean}
*/
SC.isEqual = function(a, b) {
  if (a && 'function'===typeof a.isEqual) return a.isEqual(b);
  return a === b;
};

/**
  @private
  Used by SC.compare
*/
SC.ORDER_DEFINITION = SC.ENV.ORDER_DEFINITION || [
  'undefined',
  'null',
  'boolean',
  'number',
  'string',
  'array',
  'object',
  'instance',
  'function',
  'class'
];

/**
  Returns all of the keys defined on an object or hash. This is useful
  when inspecting objects for debugging.  On browsers that support it, this
  uses the native Object.keys implementation.

  @function
  @param {Object} obj
  @returns {Array} Array containing keys of obj
*/
SC.keys = Object.keys;

//@if (legacy)
if (!SC.keys) {
  SC.keys = function(obj) {
    var ret = [];
    for(var key in obj) {
      if (obj.hasOwnProperty(key)) { ret.push(key); }
    }
    return ret;
  };
}

/**
  Empty function.  Useful for some operations.

  @returns {Object}
  @private
*/
SC.K = function() { return this; };

// ..........................................................
// ERROR
// 

/**
  @class

  A subclass of the JavaScript Error object for use in SproutCore.
*/
SC.Error = function() {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }
};

SC.Error.prototype = SC.create(Error.prototype);

// ..........................................................
// LOGGER
// 

/**
  @class

  Inside SproutCore-Runtime, simply uses the window.console object.
  Override this to provide more robust logging functionality.
*/
SC.Logger = window.console;

//if ('undefined' === typeof sc_require) sc_require = SC.K;
if ('undefined' === typeof require) require = SC.K;



})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

if (SC.EXTEND_PROTOTYPES) {

  Function.prototype.property = function() {
    var ret = SC.computed(this);
    return ret.property.apply(ret, arguments);
  };

  Function.prototype.observes = function() {
    this.__sc_observes__ = Array.prototype.slice.call(arguments);
    return this;
  };

  Function.prototype.observesBefore = function() {
    this.__sc_observesBefore__ = Array.prototype.slice.call(arguments);
    return this;
  };

}


})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var IS_BINDING = /^.+Binding$/;

SC._mixinBindings = function(obj, key, value, m) {
  if (IS_BINDING.test(key)) {
    if (!(value instanceof SC.Binding)) {
      value = new SC.Binding(key.slice(0,-7), value); // make binding
    } else {
      value.to(key.slice(0, -7));
    }
    value.connect(obj);

    // keep a set of bindings in the meta so that when we rewatch we can
    // resync them...
    var bindings = m.bindings;
    if (!bindings) {
      bindings = m.bindings = { __scproto__: obj };
    } else if (bindings.__scproto__ !== obj) {
      bindings = m.bindings = SC.create(m.bindings);
      bindings.__scproto__ = obj;
    }

    bindings[key] = true;
  }
  
  return value;
};

})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





/** @private **/
var STRING_DASHERIZE_REGEXP = (/[ _]/g);
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE_REGEXP = (/([a-z])([A-Z])/g);
  
/**
  Defines the hash of localized strings for the current language.  Used by 
  the `SC.String.loc()` helper.  To localize, add string values to this
  hash.
  
  @property {String}
*/
SC.STRINGS = {};

/**
  Defines string helper methods including string formatting and localization.
  Unless SC.EXTEND_PROTOTYPES = false these methods will also be added to the
  String.prototype as well.
  
  @namespace
*/
SC.String = {

  /**
    Apply formatting options to the string.  This will look for occurrences
    of %@ in your string and substitute them with the arguments you pass into
    this method.  If you want to control the specific order of replacement,
    you can add a number after the key as well to indicate which argument
    you want to insert.

    Ordered insertions are most useful when building loc strings where values
    you need to insert may appear in different orders.

    ## Examples

        "Hello %@ %@".fmt('John', 'Doe') => "Hello John Doe"
        "Hello %@2, %@1".fmt('John', 'Doe') => "Hello Doe, John"

    @param {Object...} [args]
    @returns {String} formatted string
  */
  fmt: function(str, formats) {
    // first, replace any ORDERED replacements.
    var idx  = 0; // the current index for non-numerical replacements
    return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
      argIndex = (argIndex) ? parseInt(argIndex,0) - 1 : idx++ ;
      s = formats[argIndex];
      return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString();
    }) ;
  },

  /**
    Formats the passed string, but first looks up the string in the localized
    strings hash.  This is a convenient way to localize text.  See 
    `SC.String.fmt()` for more information on formatting.
    
    Note that it is traditional but not required to prefix localized string
    keys with an underscore or other character so you can easily identify
    localized strings.
    
    # Example Usage
    
        @javascript@
        SC.STRINGS = {
          '_Hello World': 'Bonjour le monde',
          '_Hello %@ %@': 'Bonjour %@ %@'
        };
        
        SC.String.loc("_Hello World");
        => 'Bonjour le monde';
        
        SC.String.loc("_Hello %@ %@", ["John", "Smith"]);
        => "Bonjour John Smith";
        
        
        
    @param {String} str
      The string to format
    
    @param {Array} formats
      Optional array of parameters to interpolate into string.
      
    @returns {String} formatted string
  */
  loc: function(str, formats) {
    str = SC.STRINGS[str] || str;
    return SC.String.fmt(str, formats) ;
  },

  /**
    Splits a string into separate units separated by spaces, eliminating any
    empty strings in the process.  This is a convenience method for split that
    is mostly useful when applied to the String.prototype.
    
    # Example Usage
    
        @javascript@
        SC.String.w("alpha beta gamma").forEach(function(key) { 
          console.log(key); 
        });
        > alpha
        > beta
        > gamma

    @param {String} str
      The string to split
      
    @returns {String} split string
  */
  w: function(str) { return str.split(/\s+/); },
  
  /**
    Converts a camelized string into all lower case separated by underscores.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | my favorite items |
    | css-class-name | css-class-name |
    | action_name | action_name |
    | innerHTML | inner_html |

    @returns {String} the decamelized string.
  */
  decamelize: function(str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
  },

  /**
    Converts a camelized string or a string with spaces or underscores into
    a string with components separated by dashes.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | my-favorite-items |
    | css-class-name | css-class-name |
    | action_name | action-name |
    | innerHTML | inner-html |

    @returns {String} the dasherized string.
  */
  dasherize: function(str) {
    var cache = STRING_DASHERIZE_CACHE,
        ret   = cache[str];

    if (ret) {
      return ret;
    } else {
      ret = SC.String.decamelize(str).replace(STRING_DASHERIZE_REGEXP,'-');
      cache[str] = ret;
    }

    return ret;
  }
};




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var fmt = SC.String.fmt,
    w   = SC.String.w,
    loc = SC.String.loc,
    decamelize = SC.String.decamelize,
    dasherize = SC.String.dasherize;
  
if (SC.EXTEND_PROTOTYPES) {

  /**
    @see SC.String.fmt
  */
  String.prototype.fmt = function() {
    return fmt(this, arguments);
  };
  
  /**
    @see SC.String.w
  */
  String.prototype.w = function() {
    return w(this);
  };
  
  /**
    @see SC.String.loc
  */
  String.prototype.loc = function() {
    return loc(this, arguments);
  };
  
  /**
    @see SC.String.decamelize
  */
  String.prototype.decamelize = function() {
    return decamelize(this);
  };
  
  /**
    @see SC.String.dasherize
  */
  String.prototype.dashersize = function() {
    return dasherize(this);
  };
}




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



})();


(function() {
/**
 * @license
 * ==========================================================================
 * SproutCore
 * Copyright ©2006-2011, Strobe Inc. and contributors.
 * Portions copyright ©2008-2011 Apple Inc. All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 * For more information about SproutCore, visit http://www.sproutcore.com
 * 
 * ==========================================================================
 */

})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





// ..........................................................
// HELPERS
// 

var get = SC.get, set = SC.set;

var contexts = [];
function popCtx() {
  return contexts.length===0 ? {} : contexts.pop();
}

function pushCtx(ctx) {
  contexts.push(ctx);
  return null;
}

function iter(key, value) {
  function i(item) {
    var cur = get(item, key);
    return value===undefined ? !!cur : value===cur;
  } 
  return i ;
}

function xform(target, method, params) {
  method.call(target, params[0], params[2], params[3]);
}

/**
  @class

  This mixin defines the common interface implemented by enumerable objects
  in SproutCore.  Most of these methods follow the standard Array iteration
  API defined up to JavaScript 1.8 (excluding language-specific features that
  cannot be emulated in older versions of JavaScript).

  This mixin is applied automatically to the Array class on page load, so you
  can use any of these methods on simple arrays.  If Array already implements
  one of these methods, the mixin will not override them.

  h3. Writing Your Own Enumerable

  To make your own custom class enumerable, you need two items:

  1. You must have a length property.  This property should change whenever
     the number of items in your enumerable object changes.  If you using this
     with an SC.Object subclass, you should be sure to change the length
     property using set().

  2. If you must implement nextObject().  See documentation.

  Once you have these two methods implement, apply the SC.Enumerable mixin
  to your class and you will be able to enumerate the contents of your object
  like any other collection.

  h3. Using SproutCore Enumeration with Other Libraries

  Many other libraries provide some kind of iterator or enumeration like
  facility.  This is often where the most common API conflicts occur.
  SproutCore's API is designed to be as friendly as possible with other
  libraries by implementing only methods that mostly correspond to the
  JavaScript 1.8 API.

  @since SproutCore 1.0
*/
SC.Enumerable = SC.Mixin.create( /** @lends SC.Enumerable */ {
  
  /** @private - compatibility */
  isEnumerable: true,
  
  /**
    Implement this method to make your class enumerable.

    This method will be call repeatedly during enumeration.  The index value
    will always begin with 0 and increment monotonically.  You don't have to
    rely on the index value to determine what object to return, but you should
    always check the value and start from the beginning when you see the
    requested index is 0.

    The previousObject is the object that was returned from the last call
    to nextObject for the current iteration.  This is a useful way to
    manage iteration if you are tracing a linked list, for example.

    Finally the context paramter will always contain a hash you can use as
    a "scratchpad" to maintain any other state you need in order to iterate
    properly.  The context object is reused and is not reset between
    iterations so make sure you setup the context with a fresh state whenever
    the index parameter is 0.

    Generally iterators will continue to call nextObject until the index
    reaches the your current length-1.  If you run out of data before this
    time for some reason, you should simply return undefined.

    The default impementation of this method simply looks up the index.
    This works great on any Array-like objects.

    @param index {Number} the current index of the iteration
    @param previousObject {Object} the value returned by the last call to nextObject.
    @param context {Object} a context object you can use to maintain state.
    @returns {Object} the next object in the iteration or undefined
  */
  nextObject: SC.required(Function),

  /**
    Helper method returns the first object from a collection.  This is usually
    used by bindings and other parts of the framework to extract a single
    object if the enumerable contains only one item.

    If you override this method, you should implement it so that it will
    always return the same value each time it is called.  If your enumerable
    contains only one object, this method should always return that object.
    If your enumerable is empty, this method should return undefined.

    @returns {Object} the object or undefined
  */
  firstObject: SC.computed(function() {
    if (get(this, 'length')===0) return undefined ;
    if (SC.Array && SC.Array.detect(this)) return this.objectAt(0); 

    // handle generic enumerables
    var context = popCtx(), ret;
    ret = this.nextObject(0, null, context);
    pushCtx(context);
    return ret ;
  }).property('[]').cacheable(),

  /**
    Helper method returns the last object from a collection.

    @returns {Object} the object or undefined
  */
  lastObject: SC.computed(function() {
    var len = get(this, 'length');
    if (len===0) return undefined ;
    if (SC.Array && SC.Array.detect(this)) {
      return this.objectAt(len-1);
    } else {
      var context = popCtx(), idx=0, cur, last = null;
      do {
        last = cur;
        cur = this.nextObject(idx++, last, context);
      } while (cur !== undefined);
      pushCtx(context);
      return last;
    }
    
  }).property('[]').cacheable(),

  /**
    Returns true if the passed object can be found in the receiver.  The
    default version will iterate through the enumerable until the object 
    is found.  You may want to override this with a more efficient version.
    
    @param {Object} obj
      The object to search for.
      
    @returns {Boolean} true if object is found in enumerable.
  */
  contains: function(obj) {
    return this.find(function(item) { return item===obj; }) !== undefined; 
  },
  
  /**
    Iterates through the enumerable, calling the passed function on each
    item. This method corresponds to the forEach() method defined in
    JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Object} receiver
  */
  forEach: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = get(this, 'length'), last = null, context = popCtx();

    if (target === undefined) target = null;

    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      callback.call(target, next, idx, this);
      last = next ;
    }
    last = null ;
    context = pushCtx(context);
    return this ;
  },

  /**
    Retrieves the named value on each member object. This is more efficient
    than using one of the wrapper methods defined here. Objects that
    implement SC.Observable will use the get() method, otherwise the property
    will be accessed directly.

    @param {String} key The key to retrieve
    @returns {Array} Extracted values
  */
  getEach: function(key) {
    return this.map(function(item) {
      return get(item, key);
    });
  },

  /**
    Sets the value on the named property for each member. This is more
    efficient than using other methods defined on this helper. If the object
    implements SC.Observable, the value will be changed to set(), otherwise
    it will be set directly. null objects are skipped.

    @param {String} key The key to set
    @param {Object} value The object to set
    @returns {Object} receiver
  */
  setEach: function(key, value) {
    return this.forEach(function(item) {
      set(item, key, value);
    });
  },

  /**
    Maps all of the items in the enumeration to another value, returning
    a new array. This method corresponds to map() defined in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

        function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the mapped value.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} The mapped array.
  */
  map: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) { 
      ret[idx] = callback.call(target, x, idx,i); 
    });
    return ret ;
  },

  /**
    Similar to map, this specialized function returns the value of the named
    property on all items in the enumeration.

    @params key {String} name of the property
    @returns {Array} The mapped array.
  */
  mapProperty: function(key) {
    return this.map(function(next) {
      return get(next, key);
    });
  },

  /**
    Returns an array with all of the items in the enumeration that the passed
    function returns YES for. This method corresponds to filter() defined in
    JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES to include the item in the results, NO otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} A filtered array.
  */
  filter: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) {
      if (callback.call(target, x, idx, i)) ret.push(x);
    });
    return ret ;
  },

  /**
    Returns an array with just the items with the matched property.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  filterProperty: function(key, value) {
    return this.filter(iter(key, value));
  },

  /**
    Returns the first item in the array for which the callback returns YES.
    This method works similar to the filter() method defined in JavaScript 1.6
    except that it will stop working on the array once a match is found.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES to include the item in the results, NO otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Object} Found item or null.
  */
  find: function(callback, target) {
    var len = get(this, 'length') ;
    if (target === undefined) target = null;

    var last = null, next, found = false, ret = undefined ;
    var context = popCtx();
    for(var idx=0;idx<len && !found;idx++) {
      next = this.nextObject(idx, last, context) ;
      if (found = callback.call(target, next, idx, this)) ret = next ;
      last = next ;
    }
    next = last = null ;
    context = pushCtx(context);
    return ret ;
  },

  /**
    Returns an the first item with a property matching the passed value.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    This method works much like the more generic find() method.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Object} found item or null
  */
  findProperty: function(key, value) {
    return this.find(iter(key, value));
  },

  /**
    Returns YES if the passed function returns YES for every item in the
    enumeration. This corresponds with the every() method in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES or NO.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    Example Usage:

          if (people.every(isEngineer)) { Paychecks.addBigBonus(); }

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Boolean}
  */
  every: function(callback, target) {
    return !this.find(function(x, idx, i) {
      return !callback.call(target, x, idx, i);
    });
  },

  /**
    Returns true if the passed property resolves to true for all items in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  everyProperty: function(key, value) {
    return this.every(iter(key, value));
  },


  /**
    Returns YES if the passed function returns true for any item in the
    enumeration. This corresponds with the every() method in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES to include the item in the results, NO otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    Usage Example:

          if (people.some(isManager)) { Paychecks.addBiggerBonus(); }

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} A filtered array.
  */
  some: function(callback, target) {
    return !!this.find(function(x, idx, i) {
      return !!callback.call(target, x, idx, i);
    });
  },

  /**
    Returns true if the passed property resolves to true for any item in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Boolean} true
  */
  someProperty: function(key, value) {
    return this.some(iter(key, value));
  },

  /**
    This will combine the values of the enumerator into a single value. It
    is a useful way to collect a summary value from an enumeration. This
    corresponds to the reduce() method defined in JavaScript 1.8.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(previousValue, item, index, enumerable);

    - *previousValue* is the value returned by the last call to the iterator.
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Return the new cumulative value.

    In addition to the callback you can also pass an initialValue. An error
    will be raised if you do not pass an initial value and the enumerator is
    empty.

    Note that unlike the other methods, this method does not allow you to
    pass a target object to set as this for the callback. It's part of the
    spec. Sorry.

    @param {Function} callback The callback to execute
    @param {Object} initialValue Initial value for the reduce
    @param {String} reducerProperty internal use only.
    @returns {Object} The reduced value.
  */
  reduce: function(callback, initialValue, reducerProperty) {
    if (typeof callback !== "function") { throw new TypeError(); }

    var ret = initialValue;

    this.forEach(function(item, i) {
      ret = callback.call(null, ret, item, i, this, reducerProperty);
    }, this);

    return ret;
  },

  /**
    Invokes the named method on every object in the receiver that
    implements it.  This method corresponds to the implementation in
    Prototype 1.6.

    @param methodName {String} the name of the method
    @param args {Object...} optional arguments to pass as well.
    @returns {Array} return values from calling invoke.
  */
  invoke: function(methodName) {
    var args, ret = [];
    if (arguments.length>1) args = Array.prototype.slice.call(arguments, 1);
    
    this.forEach(function(x, idx) { 
      var method = x && x[methodName];
      if ('function' === typeof method) {
        ret[idx] = args ? method.apply(x, args) : method.call(x);
      }
    }, this);
    
    return ret;
  },

  /**
    Simply converts the enumerable into a genuine array.  The order is not 
    gauranteed.  Corresponds to the method implemented by Prototype.

    @returns {Array} the enumerable as an array.
  */
  toArray: function() {
    var ret = [];
    this.forEach(function(o, idx) { ret[idx] = o; });
    return ret ;
  },

  /**
    Generates a new array with the contents of the old array, sans any null
    values.

    @returns {Array}
  */
  compact: function() { return this.without(null); },

  /**
    Returns a new enumerable that excludes the passed value.  The default
    implementation returns an array regardless of the receiver type unless
    the receiver does not contain the value.

    @param {Object} value
    @returns {SC.Enumerable}
  */
  without: function(value) {
    if (!this.contains(value)) return this; // nothing to do
    var ret = [] ;
    this.forEach(function(k) { 
      if (k !== value) ret[ret.length] = k;
    }) ;
    return ret ;
  },

  /**
    Returns a new enumerable that contains only unique values.  The default
    implementation returns an array regardless of the receiver type.
    
    @returns {SC.Enumerable}
  */
  uniq: function() {
    var ret = [], hasDups = false;
    this.forEach(function(k){
      if (ret.indexOf(k)<0) ret[ret.length] = k;
      else hasDups = true;
    });
    
    return hasDups ? ret : this ;
  },

  /**
    This property will trigger anytime the enumerable's content changes.
    You can observe this property to be notified of changes to the enumerables
    content.

    For plain enumerables, this property is read only.  SC.Array overrides
    this method.

    @property {SC.Array}
  */
  '[]': function(key, value) { 
    return this; 
  }.property().cacheable(),

  // ..........................................................
  // ENUMERABLE OBSERVERS
  // 
  
  /**
    Registers an enumerable observer.   Must implement SC.EnumerableObserver
    mixin.
  */
  addEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (!hasObservers) SC.propertyWillChange(this, 'hasEnumerableObservers');
    SC.addListener(this, '@enumerable:before', target, willChange, xform);
    SC.addListener(this, '@enumerable:change', target, didChange, xform);
    if (!hasObservers) SC.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },

  /**
    Removes a registered enumerable observer. 
  */
  removeEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (hasObservers) SC.propertyWillChange(this, 'hasEnumerableObservers');
    SC.removeListener(this, '@enumerable:before', target, willChange);
    SC.removeListener(this, '@enumerable:change', target, didChange);
    if (hasObservers) SC.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },
  
  /**
    Becomes true whenever the array currently has observers watching changes
    on the array.
    
    @property {Boolean}
  */
  hasEnumerableObservers: function() {
    return SC.hasListeners(this, '@enumerable:change') || SC.hasListeners(this, '@enumerable:before');
  }.property().cacheable(),
  
  
  /**
    Invoke this method just before the contents of your enumerable will 
    change.  You can either omit the parameters completely or pass the objects
    to be removed or added if available or just a count.
    
    @param {SC.Enumerable|Number} removing
      An enumerable of the objects to be removed or the number of items to
      be removed.
      
    @param {SC.Enumerable|Number} adding
      An enumerable of the objects to be added or the number of items to be
      added.
    
    @returns {SC.Enumerable} receiver
  */
  enumerableContentWillChange: function(removing, adding) {
    
    var removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding,'length');
    else addCnt = adding = -1;
    
    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;
    
    SC.propertyWillChange(this, '[]');
    if (hasDelta) SC.propertyWillChange(this, 'length');
    SC.sendEvent(this, '@enumerable:before', removing, adding);

    return this;
  },
  
  /**
    Invoke this method when the contents of your enumerable has changed.
    This will notify any observers watching for content changes.  If your are
    implementing an ordered enumerable (such as an array), also pass the
    start and end values where the content changed so that it can be used to
    notify range observers.

    @param {Number} start 
      optional start offset for the content change.  For unordered 
      enumerables, you should always pass -1.
      
    @param {Enumerable} added
      optional enumerable containing items that were added to the set.  For
      ordered enumerables, this should be an ordered array of items.  If no
      items were added you can pass null.
    
    @param {Enumerable} removes
      optional enumerable containing items that were removed from the set. 
      For ordered enumerables, this hsould be an ordered array of items. If 
      no items were removed you can pass null.
      
    @returns {Object} receiver
  */
  enumerableContentDidChange: function(removing, adding) {
    var notify = this.propertyDidChange, removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding, 'length');
    else addCnt = adding = -1;
    
    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;
    
    SC.sendEvent(this, '@enumerable:change', removing, adding);
    if (hasDelta) SC.propertyDidChange(this, 'length');
    SC.propertyDidChange(this, '[]');

    return this ;
  }

}) ;




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// ..........................................................
// HELPERS
// 

var get = SC.get, set = SC.set;

function none(obj) { return obj===null || obj===undefined; }

function xform(target, method, params) {
  method.call(target, params[0], params[2], params[3], params[4]);
}

// ..........................................................
// ARRAY
// 
/**
  @namespace

  This module implements Observer-friendly Array-like behavior.  This mixin is
  picked up by the Array class as well as other controllers, etc. that want to
  appear to be arrays.

  Unlike SC.Enumerable, this mixin defines methods specifically for
  collections that provide index-ordered access to their contents.  When you
  are designing code that needs to accept any kind of Array-like object, you
  should use these methods instead of Array primitives because these will
  properly notify observers of changes to the array.

  Although these methods are efficient, they do add a layer of indirection to
  your application so it is a good idea to use them only when you need the
  flexibility of using both true JavaScript arrays and "virtual" arrays such
  as controllers and collections.

  You can use the methods defined in this module to access and modify array
  contents in a KVO-friendly way.  You can also be notified whenever the
  membership if an array changes by changing the syntax of the property to
  .observes('*myProperty.[]') .

  To support SC.Array in your own class, you must override two
  primitives to use it: replace() and objectAt().

  Note that the SC.Array mixin also incorporates the SC.Enumerable mixin.  All
  SC.Array-like objects are also enumerable.

  @extends SC.Enumerable
  @since SproutCore 0.9.0
*/
SC.Array = SC.Mixin.create(SC.Enumerable, /** @scope SC.Array.prototype */ {

  /** @private - compatibility */
  isSCArray: true,
  
  /**
    @field {Number} length

    Your array must support the length property.  Your replace methods should
    set this property whenever it changes.
  */
  length: SC.required(),

  /**
    This is one of the primitives you must implement to support SC.Array.
    Returns the object at the named index.  If your object supports retrieving
    the value of an array item using get() (i.e. myArray.get(0)), then you do
    not need to implement this method yourself.

    @param {Number} idx
      The index of the item to return.  If idx exceeds the current length,
      return null.
  */
  objectAt: function(idx) {
    if ((idx < 0) || (idx>=get(this, 'length'))) return undefined ;
    return get(this, idx);
  },

  /** @private (nodoc) - overrides SC.Enumerable version */
  nextObject: function(idx) {
    return this.objectAt(idx);
  },
  
  /**
    @field []

    This is the handler for the special array content property.  If you get
    this property, it will return this.  If you set this property it a new
    array, it will replace the current content.

    This property overrides the default property defined in SC.Enumerable.
  */
  '[]': function(key, value) {
    if (value !== undefined) this.replace(0, get(this, 'length'), value) ;
    return this ;
  }.property().cacheable(),

  /** @private (nodoc) - optimized version from Enumerable */
  contains: function(obj){
    return this.indexOf(obj) >= 0;
  },

  // Add any extra methods to SC.Array that are native to the built-in Array.
  /**
    Returns a new array that is a slice of the receiver.  This implementation
    uses the observable array methods to retrieve the objects for the new
    slice.

    @param beginIndex {Integer} (Optional) index to begin slicing from.
    @param endIndex {Integer} (Optional) index to end the slice at.
    @returns {Array} New array with specified slice
  */
  slice: function(beginIndex, endIndex) {
    var ret = [];
    var length = get(this, 'length') ;
    if (none(beginIndex)) beginIndex = 0 ;
    if (none(endIndex) || (endIndex > length)) endIndex = length ;
    while(beginIndex < endIndex) {
      ret[ret.length] = this.objectAt(beginIndex++) ;
    }
    return ret ;
  },

  /**
    Returns the index for a particular object in the index.

    @param {Object} object the item to search for
    @param {NUmber} startAt optional starting location to search, default 0
    @returns {Number} index of -1 if not found
  */
  indexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined) startAt = 0;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this.objectAt(idx, true) === object) return idx ;
    }
    return -1;
  },

  /**
    Returns the last index for a particular object in the index.

    @param {Object} object the item to search for
    @param {NUmber} startAt optional starting location to search, default 0
    @returns {Number} index of -1 if not found
  */
  lastIndexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined) startAt = len-1;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this.objectAt(idx) === object) return idx ;
    }
    return -1;
  },
  
  // ..........................................................
  // ARRAY OBSERVERS
  // 
  
  /**
    Adds an array observer to the receiving array.  The array observer object
    normally must implement two methods:
    
    * `arrayWillChange(start, removeCount, addCount)` - This method will be
      called just before the array is modified.
    * `arrayDidChange(start, removeCount, addCount)` - This method will be
      called just after the array is modified.
      
    Both callbacks will be passed the starting index of the change as well a 
    a count of the items to be removed and added.  You can use these callbacks
    to optionally inspect the array during the change, clear caches, or do 
    any other bookkeeping necessary.
    
    In addition to passing a target, you can also include an options hash 
    which you can use to override the method names that will be invoked on the
    target.
    
    @param {Object} target
      The observer object.
      
    @param {Hash} opts
      Optional hash of configuration options including willChange, didChange,
      and a context option.
      
    @returns {SC.Array} receiver
  */
  addArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (!hasObservers) SC.propertyWillChange(this, 'hasArrayObservers');
    SC.addListener(this, '@array:before', target, willChange, xform);
    SC.addListener(this, '@array:change', target, didChange, xform);
    if (!hasObservers) SC.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },
  
  /**
    Removes an array observer from the object if the observer is current 
    registered.  Calling this method multiple times with the same object will
    have no effect.
    
    @param {Object} target
      The object observing the array.
    
    @returns {SC.Array} receiver
  */
  removeArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (hasObservers) SC.propertyWillChange(this, 'hasArrayObservers');
    SC.removeListener(this, '@array:before', target, willChange, xform);
    SC.removeListener(this, '@array:change', target, didChange, xform);
    if (hasObservers) SC.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },
  
  /**
    Becomes true whenever the array currently has observers watching changes
    on the array.
    
    @property {Boolean}
  */
  hasArrayObservers: function() {
    return SC.hasListeners(this, '@array:change') || SC.hasListeners(this, '@array:before');
  }.property().cacheable(),
  
  /**
    If you are implementing an object that supports SC.Array, call this 
    method just before the array content changes to notify any observers and
    invalidate any related properties.  Pass the starting index of the change
    as well as a delta of the amounts to change.
    
    @param {Number} startIdx
      The starting index in the array that will change.
      
    @param {Number} removeAmt
      The number of items that will be removed.  If you pass null assumes 0
    
    @param {Number} addAmt
      The number of items that will be added.  If you pass null assumes 0.
      
    @returns {SC.Array} receiver
  */
  arrayContentWillChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (!removeAmt) removeAmt=0;
      if (!addAmt) addAmt=0;
    }

    SC.sendEvent(this, '@array:before', startIdx, removeAmt, addAmt);

    var removing, lim;
    if (startIdx>=0 && removeAmt>=0 && get(this, 'hasEnumerableObservers')) {
      removing = [];
      lim = startIdx+removeAmt;
      for(var idx=startIdx;idx<lim;idx++) removing.push(this.objectAt(idx));
    } else {
      removing = removeAmt;
    }
    
    this.enumerableContentWillChange(removing, addAmt);
    return this;
  },
  
  arrayContentDidChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (!removeAmt) removeAmt=0;
      if (!addAmt) addAmt=0;
    }
    
    var adding, lim;
    if (startIdx>=0 && addAmt>=0 && get(this, 'hasEnumerableObservers')) {
      adding = [];
      lim = startIdx+addAmt;
      for(var idx=startIdx;idx<lim;idx++) adding.push(this.objectAt(idx));
    } else {
      adding = addAmt;
    }

    this.enumerableContentDidChange(removeAmt, adding);
    SC.sendEvent(this, '@array:change', startIdx, removeAmt, addAmt);
    return this;
  },
  
  // ..........................................................
  // ENUMERATED PROPERTIES
  // 
  
  /**
    Returns a special object that can be used to observe individual properties
    on the array.  Just get an equivalent property on this object and it will
    return an enumerable that maps automatically to the named key on the 
    member objects.
  */
  '@each': function() {
    if (!this.__each) this.__each = new SC.EachProxy(this);
    return this.__each;
  }.property().cacheable()
  
  
  
}) ;




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace

  Implements some standard methods for comparing objects. Add this mixin to
  any class you create that can compare its instances.

  You should implement the compare() method.

  @since SproutCore 1.0
*/
SC.Comparable = SC.Mixin.create( /** @scope SC.Comparable.prototype */{

  /**
    walk like a duck. Indicates that the object can be compared.

    @type Boolean
    @default YES
    @constant
  */
  isComparable: true,

  /**
    Override to return the result of the comparison of the two parameters. The
    compare method should return:

      - -1 if a < b
      - 0 if a == b
      - 1 if a > b

    Default implementation raises an exception.

    @param a {Object} the first object to compare
    @param b {Object} the second object to compare
    @returns {Integer} the result of the comparison
  */
  compare: SC.required(Function)

});


})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;

/**
  @namespace

  Implements some standard methods for copying an object.  Add this mixin to
  any object you create that can create a copy of itself.  This mixin is
  added automatically to the built-in array.

  You should generally implement the copy() method to return a copy of the
  receiver.

  Note that frozenCopy() will only work if you also implement SC.Freezable.

  @since SproutCore 1.0
*/
SC.Copyable = SC.Mixin.create({

  /**
    Override to return a copy of the receiver.  Default implementation raises
    an exception.

    @param deep {Boolean} if true, a deep copy of the object should be made
    @returns {Object} copy of receiver
  */
  copy: SC.required(Function),

  /**
    If the object implements SC.Freezable, then this will return a new copy
    if the object is not frozen and the receiver if the object is frozen.

    Raises an exception if you try to call this method on a object that does
    not support freezing.

    You should use this method whenever you want a copy of a freezable object
    since a freezable object can simply return itself without actually
    consuming more memory.

    @returns {Object} copy of receiver or receiver
  */
  frozenCopy: function() {
    if (SC.Freezable && SC.Freezable.detect(this)) {
      return get(this, 'isFrozen') ? this : this.copy().freeze();
    } else {
      throw new Error(SC.String.fmt("%@ does not support freezing",this));
    }
  }
});




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================




  
var get = SC.get, set = SC.set;

/**
  @namespace

  The SC.Freezable mixin implements some basic methods for marking an object
  as frozen. Once an object is frozen it should be read only. No changes
  may be made the internal state of the object.

  ## Enforcement

  To fully support freezing in your subclass, you must include this mixin and
  override any method that might alter any property on the object to instead
  raise an exception. You can check the state of an object by checking the
  isFrozen property.

  Although future versions of JavaScript may support language-level freezing
  object objects, that is not the case today. Even if an object is freezable,
  it is still technically possible to modify the object, even though it could
  break other parts of your application that do not expect a frozen object to
  change. It is, therefore, very important that you always respect the
  isFrozen property on all freezable objects.

  ## Example Usage

  The example below shows a simple object that implement the SC.Freezable
  protocol.

        Contact = SC.Object.extend(SC.Freezable, {

          firstName: null,

          lastName: null,

          // swaps the names
          swapNames: function() {
            if (this.get('isFrozen')) throw SC.FROZEN_ERROR;
            var tmp = this.get('firstName');
            this.set('firstName', this.get('lastName'));
            this.set('lastName', tmp);
            return this;
          }

        });

        c = Context.create({ firstName: "John", lastName: "Doe" });
        c.swapNames();  => returns c
        c.freeze();
        c.swapNames();  => EXCEPTION

  ## Copying

  Usually the SC.Freezable protocol is implemented in cooperation with the
  SC.Copyable protocol, which defines a frozenCopy() method that will return
  a frozen object, if the object implements this method as well.

  @since SproutCore 1.0
*/
SC.Freezable = SC.Mixin.create({

  /**
    Set to YES when the object is frozen.  Use this property to detect whether
    your object is frozen or not.

    @property {Boolean}
  */
  isFrozen: false,

  /**
    Freezes the object.  Once this method has been called the object should
    no longer allow any properties to be edited.

    @returns {Object} reciever
  */
  freeze: function() {
    if (get(this, 'isFrozen')) return this;
    set(this, 'isFrozen', true);
    return this;
  }

});

SC.FROZEN_ERROR = "Frozen object cannot be modified.";




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @class

  This mixin defines the API for modifying generic enumerables.  These methods
  can be applied to an object regardless of whether it is ordered or 
  unordered.
  
  Note that an Enumerable can change even if it does not implement this mixin.
  For example, a MappedEnumerable cannot be directly modified but if its 
  underlying enumerable changes, it will change also.

  ## Adding Objects
  
  To add an object to an enumerable, use the addObject() method.  This 
  method will only add the object to the enumerable if the object is not 
  already present and the object if of a type supported by the enumerable.
  
      javascript:
      set.addObject(contact);
      
  ## Removing Objects
  
  To remove an object form an enumerable, use the removeObject() method.  This
  will only remove the object if it is already in the enumerable, otherwise
  this method has no effect.
  
      javascript:
      set.removeObject(contact);
      
  ## Implementing In Your Own Code
  
  If you are implementing an object and want to support this API, just include
  this mixin in your class and implement the required methods.  In your unit
  tests, be sure to apply the SC.MutableEnumerableTests to your object.
  
  @extends SC.Mixin
  @extends SC.Enumerable
*/
SC.MutableEnumerable = SC.Mixin.create(SC.Enumerable, 
  /** @scope SC.MutableEnumerable.prototype */ {
  
  /**
    __Required.__ You must implement this method to apply this mixin.
    
    Attempts to add the passed object to the receiver if the object is not 
    already present in the collection. If the object is present, this method
    has no effect. 
    
    If the passed object is of a type not supported by the receiver (for 
    example if you pass an object to an IndexSet) then this method should 
    raise an exception.
    
    @param {Object} object
      The object to add to the enumerable.
      
    @returns {Object} the passed object
  */
  addObject: SC.required(Function),

  /**
    Adds each object in the passed enumerable to the receiver.

    @param {SC.Enumerable} objects the objects to remove
    @returns {Object} receiver
  */
  addObjects: function(objects) {
    SC.beginPropertyChanges(this);
    objects.forEach(function(obj) { this.addObject(obj); }, this);
    SC.endPropertyChanges(this);
    return this;
  },

  /**
    __Required.__ You must implement this method to apply this mixin.
    
    Attempts to remove the passed object from the receiver collection if the
    object is in present in the collection.  If the object is not present,
    this method has no effect.
    
    If the passed object is of a type not supported by the receiver (for 
    example if you pass an object to an IndexSet) then this method should 
    raise an exception.
    
    @param {Object} object
      The object to remove from the enumerable.
      
    @returns {Object} the passed object
  */
  removeObject: SC.required(Function),
  
  
  /**
    Removes each objects in the passed enumerable from the receiver.

    @param {SC.Enumerable} objects the objects to remove
    @returns {Object} receiver
  */
  removeObjects: function(objects) {
    SC.beginPropertyChanges(this);
    objects.forEach(function(obj) { this.removeObject(obj); }, this);
    SC.endPropertyChanges(this);
    return this;
  }
    
});

})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


// ..........................................................
// CONSTANTS
// 

var OUT_OF_RANGE_EXCEPTION = "Index out of range" ;
var EMPTY = [];

// ..........................................................
// HELPERS
// 

var get = SC.get, set = SC.set;

/**
  @class

  This mixin defines the API for modifying array-like objects.  These methods
  can be applied only to a collection that keeps its items in an ordered set.
  
  Note that an Array can change even if it does not implement this mixin.
  For example, a SparyArray may not be directly modified but if its 
  underlying enumerable changes, it will change also.

  @extends SC.Mixin
  @extends SC.Array
  @extends SC.MutableEnumerable
*/
SC.MutableArray = SC.Mixin.create(SC.Array, SC.MutableEnumerable,
  /** @scope SC.MutableArray.prototype */ {

  /**
    __Required.__ You must implement this method to apply this mixin.

    This is one of the primitves you must implement to support SC.Array.  You
    should replace amt objects started at idx with the objects in the passed
    array.  You should also call this.enumerableContentDidChange() ;

    @param {Number} idx
      Starting index in the array to replace.  If idx >= length, then append 
      to the end of the array.

    @param {Number} amt
      Number of elements that should be removed from the array, starting at
      *idx*.

    @param {Array} objects
      An array of zero or more objects that should be inserted into the array 
      at *idx*
  */
  replace: SC.required(),

  /**
    This will use the primitive replace() method to insert an object at the
    specified index.

    @param {Number} idx index of insert the object at.
    @param {Object} object object to insert
  */
  insertAt: function(idx, object) {
    if (idx > get(this, 'length')) throw new Error(OUT_OF_RANGE_EXCEPTION) ;
    this.replace(idx, 0, [object]) ;
    return this ;
  },

  /**
    Remove an object at the specified index using the replace() primitive
    method.  You can pass either a single index, a start and a length or an
    index set.

    If you pass a single index or a start and length that is beyond the
    length this method will throw an SC.OUT_OF_RANGE_EXCEPTION

    @param {Number|SC.IndexSet} start index, start of range, or index set
    @param {Number} len length of passing range
    @returns {Object} receiver
  */
  removeAt: function(start, len) {

    var delta = 0;

    if ('number' === typeof start) {

      if ((start < 0) || (start >= get(this, 'length'))) {
        throw new Error(OUT_OF_RANGE_EXCEPTION);
      }

      // fast case
      if (len === undefined) len = 1;
      this.replace(start, len, EMPTY);
    }

    // TODO: Reintroduce SC.IndexSet support
    // this.beginPropertyChanges();
    // start.forEachRange(function(start, length) {
    //   start -= delta ;
    //   delta += length ;
    //   this.replace(start, length, empty); // remove!
    // }, this);
    // this.endPropertyChanges();

    return this ;
  },

  /**
    Push the object onto the end of the array.  Works just like push() but it
    is KVO-compliant.
  */
  pushObject: function(obj) {
    this.insertAt(get(this, 'length'), obj) ;
    return obj ;
  },


  /**
    Add the objects in the passed numerable to the end of the array.  Defers
    notifying observers of the change until all objects are added.

    @param {SC.Enumerable} objects the objects to add
    @returns {SC.Array} receiver
  */
  pushObjects: function(objects) {
    this.beginPropertyChanges();
    objects.forEach(function(obj) { this.pushObject(obj); }, this);
    this.endPropertyChanges();
    return this;
  },

  /**
    Pop object from array or nil if none are left.  Works just like pop() but
    it is KVO-compliant.
  */
  popObject: function() {
    var len = get(this, 'length') ;
    if (len === 0) return null ;

    var ret = this.objectAt(len-1) ;
    this.removeAt(len-1, 1) ;
    return ret ;
  },

  /**
    Shift an object from start of array or nil if none are left.  Works just
    like shift() but it is KVO-compliant.
  */
  shiftObject: function() {
    if (get(this, 'length') === 0) return null ;
    var ret = this.objectAt(0) ;
    this.removeAt(0) ;
    return ret ;
  },

  /**
    Unshift an object to start of array.  Works just like unshift() but it is
    KVO-compliant.
  */
  unshiftObject: function(obj) {
    this.insertAt(0, obj) ;
    return obj ;
  },


  /**
    Adds the named objects to the beginning of the array.  Defers notifying
    observers until all objects have been added.

    @param {SC.Enumerable} objects the objects to add
    @returns {SC.Array} receiver
  */
  unshiftObjects: function(objects) {
    this.beginPropertyChanges();
    objects.forEach(function(obj) { this.unshiftObject(obj); }, this);
    this.endPropertyChanges();
    return this;
  },
  
  // ..........................................................
  // IMPLEMENT SC.MutableEnumerable
  // 

  /** @private (nodoc) */
  removeObject: function(obj) {
    var loc = get(this, 'length') || 0;
    while(--loc >= 0) {
      var curObject = this.objectAt(loc) ;
      if (curObject === obj) this.removeAt(loc) ;
    }
    return this ;
  },
  
  /** @private (nodoc) */
  addObject: function(obj) {
    if (!this.contains(obj)) this.pushObject(obj);
    return this ;
  }
    
});


})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;
  
/**
  @class

  Restores some of the SC 1.x SC.Observable mixin API.  The new property 
  observing system does not require SC.Observable to be applied anymore.
  Instead, on most browsers you can just access properties directly.  For
  code that needs to run on IE7 or IE8 you should use SC.get() and SC.set()
  instead.
  
  If you have older code and you want to bring back the older 1.x observable
  API, you can do so by readding SC.Observable to SC.Object like so:
  
      SC.Object.reopen(SC.Observable);
    
  You will then be able to use the traditional get(), set() and other 
  observable methods on your objects.

  @extends SC.Mixin
*/
SC.Observable = SC.Mixin.create(/** @scope SC.Observable.prototype */ {

  /** @private - compatibility */
  isObserverable: true,
  
  /**
    Retrieves the value of key from the object.

    This method is generally very similar to using object[key] or object.key,
    however it supports both computed properties and the unknownProperty
    handler.

    ## Computed Properties

    Computed properties are methods defined with the property() modifier
    declared at the end, such as:

          fullName: function() {
            return this.getEach('firstName', 'lastName').compact().join(' ');
          }.property('firstName', 'lastName')

    When you call get() on a computed property, the property function will be
    called and the return value will be returned instead of the function
    itself.

    ## Unknown Properties

    Likewise, if you try to call get() on a property whose values is
    undefined, the unknownProperty() method will be called on the object.
    If this method reutrns any value other than undefined, it will be returned
    instead. This allows you to implement "virtual" properties that are
    not defined upfront.

    @param {String} key The property to retrieve
    @returns {Object} The property value or undefined.
  */
  get: function(keyName) {
    return get(this, keyName);
  },
  
  /**
    Sets the key equal to value.

    This method is generally very similar to calling object[key] = value or
    object.key = value, except that it provides support for computed
    properties, the unknownProperty() method and property observers.

    ## Computed Properties

    If you try to set a value on a key that has a computed property handler
    defined (see the get() method for an example), then set() will call
    that method, passing both the value and key instead of simply changing
    the value itself. This is useful for those times when you need to
    implement a property that is composed of one or more member
    properties.

    ## Unknown Properties

    If you try to set a value on a key that is undefined in the target
    object, then the unknownProperty() handler will be called instead. This
    gives you an opportunity to implement complex "virtual" properties that
    are not predefined on the obejct. If unknownProperty() returns
    undefined, then set() will simply set the value on the object.

    ## Property Observers

    In addition to changing the property, set() will also register a
    property change with the object. Unless you have placed this call
    inside of a beginPropertyChanges() and endPropertyChanges(), any "local"
    observers (i.e. observer methods declared on the same object), will be
    called immediately. Any "remote" observers (i.e. observer methods
    declared on another object) will be placed in a queue and called at a
    later time in a coelesced manner.

    ## Chaining

    In addition to property changes, set() returns the value of the object
    itself so you can do chaining like this:

          record.set('firstName', 'Charles').set('lastName', 'Jolley');

    @param {String} key The property to set
    @param {Object} value The value to set or null.
    @returns {SC.Observable}
  */
  set: function(keyName, value) {
    set(this, keyName, value);
    return this;
  },
  
  /**
    To set multiple properties at once, call setProperties
    with a Hash:

          record.setProperties({ firstName: 'Charles', lastName: 'Jolley' });

    @param {Hash} hash the hash of keys and values to set
    @returns {SC.Observable}
  */
  setProperties: function(hash) {
    SC.beginPropertyChanges(this);
    for(var prop in hash) {
      if (hash.hasOwnProperty(prop)) set(this, prop, hash[prop]);
    }
    SC.endPropertyChanges(this);
    return this;
  },

  /**
    Begins a grouping of property changes.

    You can use this method to group property changes so that notifications
    will not be sent until the changes are finished. If you plan to make a
    large number of changes to an object at one time, you should call this
    method at the beginning of the changes to suspend change notifications.
    When you are done making changes, call endPropertyChanges() to allow
    notification to resume.

    @returns {SC.Observable}
  */
  beginPropertyChanges: function() {
    SC.beginPropertyChanges();
    return this;
  },
  
  /**
    Ends a grouping of property changes.

    You can use this method to group property changes so that notifications
    will not be sent until the changes are finished. If you plan to make a
    large number of changes to an object at one time, you should call
    beginPropertyChanges() at the beginning of the changes to suspend change
    notifications. When you are done making changes, call this method to allow
    notification to resume.

    @returns {SC.Observable}
  */
  endPropertyChanges: function() {
    SC.endPropertyChanges();
    return this;
  },
  
  /**
    Notify the observer system that a property is about to change.

    Sometimes you need to change a value directly or indirectly without
    actually calling get() or set() on it. In this case, you can use this
    method and propertyDidChange() instead. Calling these two methods
    together will notify all observers that the property has potentially
    changed value.

    Note that you must always call propertyWillChange and propertyDidChange as
    a pair. If you do not, it may get the property change groups out of order
    and cause notifications to be delivered more often than you would like.

    @param {String} key The property key that is about to change.
    @returns {SC.Observable}
  */
  propertyWillChange: function(keyName){
    SC.propertyWillChange(this, keyName);
    return this;
  },
  
  /**
    Notify the observer system that a property has just changed.

    Sometimes you need to change a value directly or indirectly without
    actually calling get() or set() on it. In this case, you can use this
    method and propertyWillChange() instead. Calling these two methods
    together will notify all observers that the property has potentially
    changed value.

    Note that you must always call propertyWillChange and propertyDidChange as
    a pair. If you do not, it may get the property change groups out of order
    and cause notifications to be delivered more often than you would like.

    @param {String} key The property key that has just changed.
    @param {Object} value The new value of the key. May be null.
    @param {Boolean} _keepCache Private property
    @returns {SC.Observable}
  */
  propertyDidChange: function(keyName) {
    SC.propertyDidChange(this, keyName);
    return this;
  },
  
  notifyPropertyChange: function(keyName) {
    this.propertyWillChange(keyName);
    this.propertyDidChange(keyName);
    return this;
  }, 

  /**
    Adds an observer on a property.

    This is the core method used to register an observer for a property.

    Once you call this method, anytime the key's value is set, your observer
    will be notified. Note that the observers are triggered anytime the
    value is set, regardless of whether it has actually changed. Your
    observer should be prepared to handle that.

    You can also pass an optional context parameter to this method. The
    context will be passed to your observer method whenever it is triggered.
    Note that if you add the same target/method pair on a key multiple times
    with different context parameters, your observer will only be called once
    with the last context you passed.

    ## Observer Methods

    Observer methods you pass should generally have the following signature if
    you do not pass a "context" parameter:

          fooDidChange: function(sender, key, value, rev);

    The sender is the object that changed. The key is the property that
    changes. The value property is currently reserved and unused. The rev
    is the last property revision of the object when it changed, which you can
    use to detect if the key value has really changed or not.

    If you pass a "context" parameter, the context will be passed before the
    revision like so:

          fooDidChange: function(sender, key, value, context, rev);

    Usually you will not need the value, context or revision parameters at
    the end. In this case, it is common to write observer methods that take
    only a sender and key value as parameters or, if you aren't interested in
    any of these values, to write an observer that has no parameters at all.

    @param {String} key The key to observer
    @param {Object} target The target object to invoke
    @param {String|Function} method The method to invoke.
    @returns {SC.Object} self
  */
  addObserver: function(key, target, method) {
    SC.addObserver(this, key, target, method);
  },
  
  /**
    Remove an observer you have previously registered on this object. Pass
    the same key, target, and method you passed to addObserver() and your
    target will no longer receive notifications.

    @param {String} key The key to observer
    @param {Object} target The target object to invoke
    @param {String|Function} method The method to invoke.
    @returns {SC.Observable} reciever
  */
  removeObserver: function(key, target, method) {
    SC.removeObserver(this, key, target, method);
  },
  
  /**
    Returns YES if the object currently has observers registered for a
    particular key. You can use this method to potentially defer performing
    an expensive action until someone begins observing a particular property
    on the object.

    @param {String} key Key to check
    @returns {Boolean}
  */
  hasObserverFor: function(key) {
    return SC.hasListeners(this, key+':change');
  },

  unknownProperty: function(key) {
    return undefined;
  },
  
  setUnknownProperty: function(key, value) {
    this[key] = value;
  },
  
  getPath: function(path) {
    return SC.getPath(this, path);
  },
  
  setPath: function(path, value) {
    SC.setPath(this, path, value);
    return this;
  },
  
  incrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)+increment);
    return get(this, keyName);
  },
  
  decrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)-increment);
    return get(this, keyName);
  },
  
  toggleProperty: function(keyName) {
    set(this, keyName, !get(this, keyName));
    return get(this, keyName);
  },
  
  observersForKey: function(keyName) {
    return SC.observersFor(this, keyName);
  }
    
});




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================








})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



// NOTE: this object should never be included directly.  Instead use SC.
// SC.Object.  We only define this separately so that SC.Set can depend on it



var rewatch = SC.rewatch;
var classToString = SC.Mixin.prototype.toString;
var set = SC.set, get = SC.get;
var o_create = SC.platform.create,
    meta = SC.meta;

function makeCtor() {

  // Note: avoid accessing any properties on the object since it makes the
  // method a lot faster.  This is glue code so we want it to be as fast as
  // possible.
  
  var isPrepared = false, initMixins, init = false, hasChains = false;
  
  var Class = function() {
    if (!isPrepared) get(Class, 'proto'); // prepare prototype...
    if (initMixins) {
      this.reopen.apply(this, initMixins);
      initMixins = null;
      rewatch(this); // ålways rewatch just in case
      this.init.apply(this, arguments);
    } else {
      if (hasChains) rewatch(this);
      if (init===false) init = this.init; // cache for later instantiations
      init.apply(this, arguments);
    }
  };

  Class.toString = classToString;
  Class._prototypeMixinDidChange = function() { isPrepared = false; };
  Class._initMixins = function(args) { initMixins = args; };

  SC.defineProperty(Class, 'proto', SC.computed(function() {
    if (!isPrepared) {
      isPrepared = true;
      Class.PrototypeMixin.applyPartial(Class.prototype);
      hasChains = !!meta(Class.prototype, false).chains; // avoid rewatch 
    }
    return this.prototype;
  }));
  
  return Class;
  
}

var Object = makeCtor();

Object.PrototypeMixin = SC.Mixin.create({
  
  reopen: function() {
    SC.Mixin._apply(this, arguments, true);
    return this;
  },
  
  init: function() {},
  
  isDestroyed: false,
  
  destroy: function() {
    set(this, 'isDestroyed', true);
    return this;  
  },
  
  bind: function(to, from) {
    if (!(from instanceof SC.Binding)) from = SC.Binding.from(from);
    from.to(to).connect(this);
    return from;
  },

  toString: function() {
    return '<'+this.constructor.toString()+':'+SC.guidFor(this)+'>';
  }
});

Object.__super__ = null;

var ClassMixin = SC.Mixin.create({
    
  ClassMixin: SC.required(),
  
  PrototypeMixin: SC.required(),
  
  isMethod: false,
  
  extend: function() {
    var Class = makeCtor(), proto;
    Class.ClassMixin = SC.Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = SC.Mixin.create(this.PrototypeMixin);
    
    var PrototypeMixin = Class.PrototypeMixin;
    PrototypeMixin.reopen.apply(PrototypeMixin, arguments);
    
    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = o_create(this.prototype);
    proto.constructor = Class;
    SC.generateGuid(proto, 'sc');
    meta(proto).proto = proto; // this will disable observers on prototype
    SC.rewatch(proto); // setup watch chains if needed.
    

    Class.subclasses = SC.Set ? new SC.Set() : null;
    if (this.subclasses) this.subclasses.add(Class);
    
    Class.ClassMixin.apply(Class);
    return Class;
  },
  
  create: function() {
    var C = this;
    if (arguments.length>0) this._initMixins(arguments);
    return new C();
  },
  
  reopen: function() {
    var PrototypeMixin = this.PrototypeMixin;
    PrototypeMixin.reopen.apply(PrototypeMixin, arguments);
    this._prototypeMixinDidChange();
    return this;
  },
  
  reopenClass: function() {
    var ClassMixin = this.ClassMixin;
    ClassMixin.reopen.apply(ClassMixin, arguments);
    SC.Mixin._apply(this, arguments, false);
    return this;
  },
  
  detect: function(obj) {
    if ('function' !== typeof obj) return false;
    while(obj) {
      if (obj===this) return true;
      obj = obj.superclass;
    }
    return false;
  }
  
});

Object.ClassMixin = ClassMixin;
ClassMixin.apply(Object);

SC.CoreObject = Object;




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================




var get = SC.get, set = SC.set, guidFor = SC.guidFor, none = SC.none;

/**
  @class

  An unordered collection of objects.

  A Set works a bit like an array except that its items are not ordered.
  You can create a set to efficiently test for membership for an object. You
  can also iterate through a set just like an array, even accessing objects
  by index, however there is no gaurantee as to their order.

  Starting with SproutCore 2.0 all Sets are now observable since there is no
  added cost to providing this support.  Sets also do away with the more
  specialized Set Observer API in favor of the more generic Enumerable 
  Observer API - which works on any enumerable object including both Sets and
  Arrays.
  
  ## Creating a Set

  You can create a set like you would most objects using 
  `new SC.Set()`.  Most new sets you create will be empty, but you can 
  also initialize the set with some content by passing an array or other 
  enumerable of objects to the constructor.

  Finally, you can pass in an existing set and the set will be copied. You
  can also create a copy of a set by calling `SC.Set#copy()`.

      #js
      // creates a new empty set
      var foundNames = new SC.Set();

      // creates a set with four names in it.
      var names = new SC.Set(["Charles", "Tom", "Juan", "Alex"]); // :P

      // creates a copy of the names set.
      var namesCopy = new SC.Set(names);

      // same as above.
      var anotherNamesCopy = names.copy();

  ## Adding/Removing Objects

  You generally add or remove objects from a set using `add()` or 
  `remove()`. You can add any type of object including primitives such as 
  numbers, strings, and booleans.

  Unlike arrays, objects can only exist one time in a set. If you call `add()` 
  on a set with the same object multiple times, the object will only be added
  once. Likewise, calling `remove()` with the same object multiple times will
  remove the object the first time and have no effect on future calls until
  you add the object to the set again.

  NOTE: You cannot add/remove null or undefined to a set. Any attempt to do so 
  will be ignored.

  In addition to add/remove you can also call `push()`/`pop()`. Push behaves 
  just like `add()` but `pop()`, unlike `remove()` will pick an arbitrary 
  object, remove it and return it. This is a good way to use a set as a job 
  queue when you don't care which order the jobs are executed in.

  ## Testing for an Object

  To test for an object's presence in a set you simply call 
  `SC.Set#contains()`.

  ## Observing changes

  When using `SC.Set`, you can observe the `"[]"` property to be 
  alerted whenever the content changes.  You can also add an enumerable 
  observer to the set to be notified of specific objects that are added and
  removed from the set.  See `SC.Enumerable` for more information on 
  enumerables.

  This is often unhelpful. If you are filtering sets of objects, for instance,
  it is very inefficient to re-filter all of the items each time the set 
  changes. It would be better if you could just adjust the filtered set based 
  on what was changed on the original set. The same issue applies to merging 
  sets, as well.

  ## Other Methods
  
  `SC.Set` primary implements other mixin APIs.  For a complete reference
  on the methods you will use with `SC.Set`, please consult these mixins.
  The most useful ones will be `SC.Enumerable` and 
  `SC.MutableEnumerable` which implement most of the common iterator 
  methods you are used to on Array.
  
  Note that you can also use the `SC.Copyable` and `SC.Freezable`
  APIs on `SC.Set` as well.  Once a set is frozen it can no longer be 
  modified.  The benefit of this is that when you call frozenCopy() on it,
  SproutCore will avoid making copies of the set.  This allows you to write
  code that can know with certainty when the underlying set data will or 
  will not be modified.
  
  @extends SC.Enumerable
  @extends SC.MutableEnumerable
  @extends SC.Copyable
  @extends SC.Freezable

  @since SproutCore 1.0
*/
SC.Set = SC.CoreObject.extend(SC.MutableEnumerable, SC.Copyable, SC.Freezable,
  /** @scope SC.Set.prototype */ {

  // ..........................................................
  // IMPLEMENT ENUMERABLE APIS
  // 
  
  /**
    This property will change as the number of objects in the set changes.

    @property Number
    @default 0
  */
  length: 0,

  /**
    Clears the set.  This is useful if you want to reuse an existing set
    without having to recreate it.

    @returns {SC.Set}
  */
  clear: function() {
    if (this.isFrozen) { throw new Error(SC.FROZEN_ERROR); }
    var len = get(this, 'length');
    this.enumerableContentWillChange(len, 0);
    set(this, 'length', 0);
    this.enumerableContentDidChange(len, 0);
    return this;
  },

  /**
    Returns YES if the passed object is also an enumerable that contains the 
    same objects as the receiver.

    @param {SC.Set} obj the other object
    @returns {Boolean}
  */
  isEqual: function(obj) {
    // fail fast
    if (!SC.Enumerable.detect(obj)) return false;
    
    var loc = get(this, 'length');
    if (get(obj, 'length') !== loc) return false;

    while(--loc >= 0) {
      if (!obj.contains(this[loc])) return false;
    }

    return true;
  },
  
  /**
    Adds an object to the set.  Only non-null objects can be added to a set 
    and those can only be added once. If the object is already in the set or
    the passed value is null this method will have no effect.

    This is an alias for `SC.MutableEnumerable.addObject()`.

    @function
    @param {Object} obj The object to add
    @returns {SC.Set} receiver
  */
  add: SC.alias('addObject'),

  /**
    Removes the object from the set if it is found.  If you pass a null value
    or an object that is already not in the set, this method will have no
    effect. This is an alias for `SC.MutableEnumerable.removeObject()`.

    @function
    @param {Object} obj The object to remove
    @returns {SC.Set} receiver
  */
  remove: SC.alias('removeObject'),
  
  /**
    Removes an arbitrary object from the set and returns it.

    @returns {Object} An object from the set or null
  */
  pop: function() {
    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);
    var obj = this.length > 0 ? this[this.length-1] : null;
    this.remove(obj);
    return obj;
  },

  /**
    This is an alias for `SC.MutableEnumerable.addObject()`.

    @function
  */
  push: SC.alias('addObject'),
  
  /**
    This is an alias for `SC.Set.pop()`.
    @function
  */
  shift: SC.alias('pop'),

  /**
    This is an alias of `SC.Set.push()`
    @function
  */
  unshift: SC.alias('push'),

  /**
    This is an alias of `SC.MutableEnumerable.addObjects()`
    @function
  */
  addEach: SC.alias('addObjects'),

  /**
    This is an alias of `SC.MutableEnumerable.removeObjects()`
    @function
  */
  removeEach: SC.alias('removeObjects'),  
  
  // ..........................................................
  // PRIVATE ENUMERABLE SUPPORT
  // 
  
  /** @private */
  init: function(items) {
    this._super();
    if (items) this.addObjects(items);
  },
  
  /** @private (nodoc) - implement SC.Enumerable */
  nextObject: function(idx) {
    return this[idx];
  },

  /** @private - more optimized version */
  firstObject: function() {
    return this.length > 0 ? this[0] : undefined;  
  }.property('[]').cacheable(),
  
  /** @private - more optimized version */
  lastObject: function() {
    return this.length > 0 ? this[this.length-1] : undefined;
  }.property('[]').cacheable(),
  
  /** @private (nodoc) - implements SC.MutableEnumerable */
  addObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do
    
    var guid = guidFor(obj),
        idx  = this[guid],
        len  = get(this, 'length'),
        added ;
        
    if (idx>=0 && idx<len && (this[idx] === obj)) return this; // added
    
    added = [obj];
    this.enumerableContentWillChange(null, added);
    len = get(this, 'length');
    this[guid] = len;
    this[len] = obj;
    set(this, 'length', len+1);
    this.enumerableContentDidChange(null, added);

    return this;
  },
  
  /** @private (nodoc) - implements SC.MutableEnumerable */
  removeObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do
    
    var guid = guidFor(obj),
        idx  = this[guid],
        len = get(this, 'length'),
        last, removed;
        
    
    if (idx>=0 && idx<len && (this[idx] === obj)) {
      removed = [obj];

      this.enumerableContentWillChange(removed, null);
      
      // swap items - basically move the item to the end so it can be removed
      if (idx < len-1) {
        last = this[len-1];
        this[idx] = last;
        this[guidFor(last)] = idx;
      }

      delete this[guid];
      delete this[len-1];
      set(this, 'length', len-1);

      this.enumerableContentDidChange(removed, null);
    }
    
    return this;
  },

  /** @private (nodoc) - optimized version */
  contains: function(obj) {
    return this[guidFor(obj)]>=0;
  },
  
  /** @private (nodoc) */
  copy: function() {
    var C = this.constructor, ret = new C(), loc = get(this, 'length');
    set(ret, 'length', loc);
    while(--loc>=0) {
      ret[loc] = this[loc];
      ret[guidFor(this[loc])] = loc;
    }
    return ret;
  },
  
  /** @private */
  toString: function() {
    var len = this.length, idx, array = [];
    for(idx = 0; idx < len; idx++) {
      array[idx] = this[idx];
    }
    return "SC.Set<%@>".fmt(array.join(','));
  },
  
  // ..........................................................
  // DEPRECATED
  // 

  /** @deprecated

    This property is often used to determine that a given object is a set.
    Instead you should use instanceof:

        #js:
        // SproutCore 1.x:
        isSet = myobject && myobject.isSet;

        // SproutCore 2.0 and later:
        isSet = myobject instanceof SC.Set

    @type Boolean
    @default YES
  */
  isSet: YES
    
});

// Support the older API 
var o_create = SC.Set.create;
SC.Set.create = function(items) {
  if (items && SC.Enumerable.detect(items)) {
//@if (debug)
    SC.Logger.warn('Passing an enumerable to SC.Set.create() is deprecated and will be removed in a future version of SproutCore.  Use new SC.Set(items) instead');
//@endif
    return new SC.Set(items);
  } else {
    return o_create.apply(this, arguments);
  }
};



})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


SC.CoreObject.subclasses = new SC.Set();
SC.Object = SC.CoreObject.extend(SC.Observable);




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @private
  A Namespace is an object usually used to contain other objects or methods 
  such as an application or framework.  Create a namespace anytime you want
  to define one of these new containers.
  
  # Example Usage
  
      MyFramework = SC.Namespace.create({
        VERSION: '1.0.0'
      });
      
*/
SC.Namespace = SC.Object.extend();

})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @private

  Defines a namespace that will contain an executable application.  This is
  very similar to a normal namespace except that it is expected to include at
  least a 'main' function which can be run to initialize the application.
  
  Currently SC.Application is very similar to SC.Namespace.  However, this
  class may be augmented by additional frameworks so it is important to use
  this instance when building new applications.
  
  # Example Usage
  
      MyApp = SC.Application.create({
        VERSION: '1.0.0',
        store: SC.Store.create().from(SC.fixtures)
      });
      
      MyApp.main = function() { 
        //..init code goes here...
      }
      
*/
SC.Application = SC.Namespace.extend();


})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var get = SC.get, set = SC.set;

/**
  @class

  An ArrayProxy wraps any other object that implements SC.Array and/or 
  SC.MutableArray, forwarding all requests.  ArrayProxy isn't useful by itself
  but you can extend it to do specialized things like transforming values,
  etc.

  @extends SC.Object
  @extends SC.Array
  @extends SC.MutableArray
*/
SC.ArrayProxy = SC.Object.extend(SC.MutableArray, {
  
  /**
    The content array.  Must be an object that implements SC.Array and or
    SC.MutableArray.
    
    @property {SC.Array}
  */
  content: null,

  /**
    Should actually retrieve the object at the specified index from the 
    content.  You can override this method in subclasses to transform the 
    content item to something new.
    
    This method will only be called if content is non-null.
    
    @param {Number} idx
      The index to retreive.
      
    @returns {Object} the value or undefined if none found
  */
  objectAtContent: function(idx) {
    return get(this, 'content').objectAt(idx);
  },
  
  /**
    Should actually replace the specified objects on the content array.  
    You can override this method in subclasses to transform the content item
    into something new.
    
    This method will only be called if content is non-null.
    
    @param {Number} idx
      The starting index
    
    @param {Number} amt
      The number of items to remove from the content.
      
    @param {Array} objects
      Optional array of objects to insert or null if no objects.
      
    @returns {void}
  */
  replaceContent: function(idx, amt, objects) {
    get(this, 'content').replace(idx, amt, objects);
  },
  
  contentWillChange: function() {
    var content = get(this, 'content'),
        len     = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len, undefined);
    if (content) content.removeArrayObserver(this);
  }.observesBefore('content'),
  
  /**
    Invoked when the content property changes.  Notifies observers that the
    entire array content has changed.
  */
  contentDidChange: function() {
    var content = get(this, 'content'),
        len     = content ? get(content, 'length') : 0;
    if (content) content.addArrayObserver(this);
    this.arrayDidChange(content, 0, undefined, len);
  }.observes('content'),
  
  /** @private (nodoc) */
  objectAt: function(idx) {
    return get(this, 'content') && this.objectAtContent(idx);
  },
  
  /** @private (nodoc) */
  length: function() {
    var content = get(this, 'content');
    return content ? get(content, 'length') : 0;
  }.property('content.length').cacheable(),
  
  /** @private (nodoc) */
  replace: function(idx, amt, objects) {
    if (get(this, 'content')) this.replaceContent(idx, amt, objects);
    return this;
  },
  
  /** @private (nodoc) */
  arrayWillChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentWillChange(idx, removedCnt, addedCnt);
  },
  
  /** @private (nodoc) */
  arrayDidChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentDidChange(idx, removedCnt, addedCnt);
  },
  
  init: function(content) {
    this._super();
    // TODO: Why is init getting called with a parameter? --TD
    if (content) set(this, 'content', content);
    this.contentDidChange();
  }
  
});




})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */

// ..........................................................
// HELPERS
// 

var slice = Array.prototype.slice;

// invokes passed params - normalizing so you can pass target/func, 
// target/string or just func
function invoke(target, method, args, ignore) {

  if (method===undefined) {
    method = target;
    target = undefined;
  }
  
  if ('string'===typeof method) method = target[method];
  if (args && ignore>0) {
    args = args.length>ignore ? slice.call(args, ignore) : null;
  }
  return method.apply(target, args);
}


// ..........................................................
// RUNLOOP
// 

var timerMark; // used by timers...

var RunLoop = SC.Object.extend({

  _prev: null,
  
  init: function(prev) {
    this._prev = prev;
    this.onceTimers = {};
  },
  
  end: function() {
    this.flush();  
    return this._prev;
  },

  // ..........................................................
  // Delayed Actions
  // 
  
  schedule: function(queueName, target, method) {
    var queues = this._queues, queue;
    if (!queues) queues = this._queues = {};
    queue = queues[queueName];
    if (!queue) queue = queues[queueName] = [];
    
    var args = arguments.length>3 ? slice.call(arguments, 3) : null;
    queue.push({ target: target, method: method, args: args });
    return this;
  },
  
  flush: function(queueName) {
    var queues = this._queues, queueNames, idx, len, queue, log;

    if (!queues) return this; // nothing to do

    function iter(item) {
      invoke(item.target, item.method, item.args);
    }

    SC.watch.flushPending(); // make sure all chained watchers are setup
    
    if (queueName) {
      while (this._queues && (queue = this._queues[queueName])) {
        this._queues[queueName] = null;
        
        //@if (debug)
        log = SC.LOG_BINDINGS && queueName==='sync';
        if (log) SC.Logger.log('Begin: Flush Sync Queue');
        //@endif

        // the sync phase is to allow property changes to propogate.  don't
        // invoke observers until that is finished.
        if (queueName === 'sync') SC.beginPropertyChanges();
        queue.forEach(iter);
        if (queueName === 'sync') SC.endPropertyChanges();
        
        //@if (debug)
        if (log) SC.Logger.log('End: Flush Sync Queue');
        //@endif

      }

    } else {
      queueNames = SC.run.queues;
      len = queueNames.length;
      do {
        this._queues = null;
        for(idx=0;idx<len;idx++) {
          queueName = queueNames[idx];
          queue = queues[queueName];
          
          //@if (debug)
          log = SC.LOG_BINDINGS && queueName==='sync';
          if (log) SC.Logger.log('Begin: Flush Sync Queue');
          //@endif

          if (queueName === 'sync') SC.beginPropertyChanges();
          if (queue) queue.forEach(iter);
          if (queueName === 'sync') SC.endPropertyChanges();
          
          //@if (debug)
          if (log) SC.Logger.log('End: Flush Sync Queue');
          //@endif

        }

      } while (queues = this._queues); // go until queues stay clean
    }
    
    timerMark = null;
    
    return this;
  }
  
});

SC.RunLoop = RunLoop;

// ..........................................................
// SC.run - this is ideally the only public API the dev sees
// 

var run;

/**
  Runs the passed target and method inside of a runloop, ensuring any 
  deferred actions including bindings and views updates are flushed at the
  end.
  
  Normally you should not need to invoke this method yourself.  However if
  you are implementing raw event handlers when interfacing with other 
  libraries or plugins, you should probably wrap all of your code inside this
  call.

  @function
  @param {Object} target
    (Optional) target of method to call
    
  @param {Function|String} method
    Method to invoke.  May be a function or a string.  If you pass a string
    then it will be looked up on the passed target.
    
  @param {Object...} args
    Any additional arguments you wish to pass to the method.
    
  @returns {Object} return value from invoking the passed function.
*/
SC.run = run = function(target, method) {
  
  var ret, loop;
  run.begin();
  if (target || method) ret = invoke(target, method);
  run.end();
  return ret;
};

/**
  Begins a new RunLoop.  Any deferred actions invoked after the begin will
  be buffered until you invoke a matching call to SC.run.end().  This is 
  an lower-level way to use a RunLoop instead of using SC.run().
  
  @returns {void}
*/
SC.run.begin = function() {
  run.currentRunLoop = new RunLoop(run.currentRunLoop);
};

/**
  Ends a RunLoop.  This must be called sometime after you call SC.run.begin()
  to flush any deferred actions.  This is a lower-level way to use a RunLoop
  instead of using SC.run().
  
  @returns {void}
*/
SC.run.end = function() {
  sc_assert('must have a current run loop', run.currentRunLoop);
  run.currentRunLoop = run.currentRunLoop.end();
};

/**
  Array of named queues.  This array determines the order in which queues 
  are flushed at the end of the RunLoop.  You can define your own queues by
  simply adding the queue name to this array.  Normally you should not need
  to inspect or modify this property.
  
  @property {String}
*/
SC.run.queues = ['sync', 'actions', 'timers'];

/**
  Adds the passed target/method and any optional arguments to the named 
  queue to be executed at the end of the RunLoop.  If you have not already
  started a RunLoop when calling this method one will be started for you
  automatically.
  
  At the end of a RunLoop, any methods scheduled in this way will be invoked.
  Methods will be invoked in an order matching the named queues defined in
  the run.queues property.
  
  @param {String} queue
    The name of the queue to schedule against.  Default queues are 'sync' and
    'actions'
    
  @param {Object} target
    (Optional) target object to use as the context when invoking a method.
  
  @param {String|Function} method
    The method to invoke.  If you pass a string it will be resolved on the 
    target object at the time the scheduled item is invoked allowing you to
    change the target function.
    
  @param {Object} arguments...
    Optional arguments to be passed to the queued method.
    
  @returns {void}
*/
SC.run.schedule = function(queue, target, method) {
  var loop = run.autorun();
  loop.schedule.apply(loop, arguments);
};

var autorunTimer;

function autorun() {
  autorunTimer = null;
  if (run.currentRunLoop) run.end();
}

/**
  Begins a new RunLoop is necessary and schedules a timer to flush the 
  RunLoop at a later time.  This method is used by parts of SproutCore to
  ensure the RunLoop always finishes.  You normally do not need to call this
  method directly.  Instead use SC.run().
  
  @returns {SC.RunLoop} the new current RunLoop
*/
SC.run.autorun = function() {
    
  if (!run.currentRunLoop) run.begin();
  if (!autorunTimer) autorunTimer = setTimeout(autorun, 1);
  
  return run.currentRunLoop;
};

/**
  Immediately flushes any events scheduled in the 'sync' queue.  Bindings 
  use this queue so this method is a useful way to immediately force all
  bindings in the application to sync.
  
  You should call this method anytime you need any changed state to propogate
  throughout the app immediately without repainting the UI.

  @returns {void}
*/
SC.run.sync = function() {
  run.autorun();
  run.currentRunLoop.flush('sync');
};

// ..........................................................
// TIMERS
// 

var timers = {}; // active timers...

var laterScheduled = false;
function invokeLaterTimers() {
  var now = Date.now(), earliest = -1;
  for(var key in timers) {
    if (!timers.hasOwnProperty(key)) continue;
    var timer = timers[key];
    if (timer && timer.expires) {
      if (now >= timer.expires) {
        delete timers[key];
        invoke(timer.target, timer.method, timer.args, 2);
      } else {
        if (earliest<0 || (timer.expires < earliest)) earliest=timer.expires;
      }
    }
  }
  
  // schedule next timeout to fire...
  if (earliest>0) setTimeout(invokeLaterTimers, earliest-Date.now()); 
}

/**
  Invokes the passed target/method and optional arguments after a specified
  period if time.  The last parameter of this method must always be a number
  of milliseconds. 

  You should use this method whenever you need to run some action after a 
  period of time inside of using setTimeout().  This method will ensure that
  items that expire during the same script execution cycle all execute 
  together, which is often more efficient than using a real setTimeout.
  
  @param {Object} target
    (optional) target of method to invoke
    
  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.
    
  @param {Object...} args
    Optional arguments to pass to the timeout.
    
  @param {Number} wait
    Number of milliseconds to wait.
    
  @returns {Timer} an object you can use to cancel a timer at a later time.
*/
SC.run.later = function(target, method) {
  var args, expires, timer, guid, wait;

  // setTimeout compatibility...
  if (arguments.length===2 && 'function' === typeof target) {
    wait   = method;
    method = target;
    target = undefined;
    args   = [target, method];
    
  } else {
    args = slice.call(arguments);
    wait = args.pop();
  }
  
  expires = Date.now()+wait;
  timer   = { target: target, method: method, expires: expires, args: args };
  guid    = SC.guidFor(timer);
  timers[guid] = timer;
  run.once(timers, invokeLaterTimers);
  return guid;
};

function invokeOnceTimer(guid, onceTimers) {
  if (onceTimers[this.tguid]) delete onceTimers[this.tguid][this.mguid];
  if (timers[guid]) invoke(this.target, this.method, this.args, 2);
  delete timers[guid];
}

/**
  Schedules an item to run one time during the current RunLoop.  Calling 
  this method with the same target/method combination will have no effect.
  
  Note that although you can pass optional arguments these will not be 
  considered when looking for duplicates.  New arguments will replace previous
  calls.
  
  @param {Object} target
    (optional) target of method to invoke
    
  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.
    
  @param {Object...} args
    Optional arguments to pass to the timeout.
    

  @returns {Object} timer
*/
SC.run.once = function(target, method) {
  var tguid = SC.guidFor(target), mguid = SC.guidFor(method), guid, timer;

  var onceTimers = run.autorun().onceTimers;
  guid = onceTimers[tguid] && onceTimers[tguid][mguid];
  if (guid && timers[guid]) {
    timers[guid].args = slice.call(arguments); // replace args

  } else {
    timer = { 
      target: target,
      method: method,
      args:   slice.call(arguments), 
      tguid:  tguid, 
      mguid:  mguid 
    };
    
    guid  = SC.guidFor(timer);
    timers[guid] = timer;
    if (!onceTimers[tguid]) onceTimers[tguid] = {};
    onceTimers[tguid][mguid] = guid; // so it isn't scheduled more than once

    run.schedule('timers', timer, invokeOnceTimer, guid, onceTimers);
  }
  
  return guid;
};

var scheduledNext = false;
function invokeNextTimers() {
  scheduledNext = null;
  for(var key in timers) {
    if (!timers.hasOwnProperty(key)) continue;
    var timer = timers[key];
    if (timer.next) {
      delete timers[key];
      invoke(timer.target, timer.method, timer.args, 2);
    }
  }
}

/**
  Schedules an item to run after control has been returned to the system.
  This is often equivalent to calling setTimeout(function...,1).

  @param {Object} target
    (optional) target of method to invoke
  
  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.
  
  @param {Object...} args
    Optional arguments to pass to the timeout.
  
  @returns {Object} timer
*/
SC.run.next = function(target, method) {
  var timer, guid;
  
  timer = { 
    target: target, 
    method: method, 
    args: slice.call(arguments), 
    next: true 
  };
  
  guid = SC.guidFor(timer);
  timers[guid] = timer;
  
  if (!scheduledNext) scheduledNext = setTimeout(invokeNextTimers, 1);
  return guid;
};

/**
  Cancels a scheduled item.  Must be a value returned by `SC.run.later()`,
  `SC.run.once()`, or `SC.run.next()`.
  
  @param {Object} timer
    Timer object to cancel
    
  @returns {void}
*/
SC.run.cancel = function(timer) {
  delete timers[timer];
};


// ..........................................................
// DEPRECATED API
// 

/**
  @deprecated
  @method
  
  Use `#js:SC.run.begin()` instead
*/
SC.RunLoop.begin = SC.run.begin;

/**
  @deprecated
  @method
  
  Use `#js:SC.run.end()` instead
*/
SC.RunLoop.end = SC.run.end;



})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */


// ..........................................................
// CONSTANTS
// 

//@if (debug)

/**
  @static

  Debug parameter you can turn on. This will log all bindings that fire to
  the console. This should be disabled in production code. Note that you
  can also enable this from the console or temporarily.

  @type Boolean
  @default NO
*/
SC.LOG_BINDINGS = false || !!SC.ENV.LOG_BINDINGS;

/**
  @static

  Performance paramter. This will benchmark the time spent firing each
  binding.

  @type Boolean
*/
SC.BENCHMARK_BINDING_NOTIFICATIONS = !!SC.ENV.BENCHMARK_BINDING_NOTIFICATIONS;

/**
  @static

  Performance parameter. This will benchmark the time spend configuring each
  binding.

  @type Boolean
*/
SC.BENCHMARK_BINDING_SETUP = !!SC.ENV.BENCHMARK_BINDING_SETUP;

//@endif

/**
  @static

  Default placeholder for multiple values in bindings.

  @type String
  @default '@@MULT@@'
*/
SC.MULTIPLE_PLACEHOLDER = '@@MULT@@';

/**
  @static

  Default placeholder for empty values in bindings.  Used by notEmpty()
  helper unless you specify an alternative.

  @type String
  @default '@@EMPTY@@'
*/
SC.EMPTY_PLACEHOLDER = '@@EMPTY@@';

// ..........................................................
// HELPERS
// 

function MULTIPLE(val) {
  if (val instanceof Array) return val;
  if (val === undefined || val === null) return [];
  return [val];
}

function SINGLE(val, placeholder) {
  if (val instanceof Array) {
    if (val.length>1) return placeholder;
    else return val[0];
  }
  return val;
}

function BOOL(val) {
  return !!val;
}

function NOT(val) {
  return !val;
}

var get     = SC.get, 
    getPath = SC.getPath, 
    setPath = SC.setPath, 
    guidFor = SC.guidFor;

function transformedValue(b, val, obj) {
  // handle multiple/single
  var forceKind = b._forceKind;
  if (forceKind) val = forceKind(val, b._placeholder);

  // handle transforms
  var transforms = b._transforms,
      len        = transforms ? transforms.length : 0,
      idx;

  for(idx=0;idx<len;idx++) val = transforms[idx].call(this, val, obj);
  return val;
}

function empty(val) {
  return val===undefined || val===null || val==='' || (SC.isArray(val) && get(val, 'length')===0) ;
}

function fromValue(obj, b) {
  var logic = b._logic;
  return logic ? logic(obj, b._from, b._from2) : getPath(obj, b._from);
}

var AND_LOGIC = function(obj, left, right) {
  return getPath(obj, left) && getPath(obj, right);
};

var OR_LOGIC = function(obj, left, right) {
  return getPath(obj, left) || getPath(obj, right);
};

// ..........................................................
// BINDING
// 

/**
  @class

  A binding simply connects the properties of two objects so that whenever the
  value of one property changes, the other property will be changed also. You
  do not usually work with Binding objects directly but instead describe
  bindings in your class definition using something like:

        valueBinding: "MyApp.someController.title"

  This will create a binding from `MyApp.someController.title` to the `value`
  property of your object instance automatically. Now the two values will be
  kept in sync.

  ## Customizing Your Bindings

  In addition to synchronizing values, bindings can also perform some basic
  transforms on values. These transforms can help to make sure the data fed
  into one object always meets the expectations of that object regardless of
  what the other object outputs.

  To customize a binding, you can use one of the many helper methods defined
  on SC.Binding like so:

        valueBinding: SC.Binding.single("MyApp.someController.title")

  This will create a binding just like the example above, except that now the
  binding will convert the value of `MyApp.someController.title` to a single
  object (removing any arrays) before applying it to the `value` property of
  your object.

  You can also chain helper methods to build custom bindings like so:

        valueBinding: SC.Binding.single("MyApp.someController.title").notEmpty("(EMPTY)")

  This will force the value of MyApp.someController.title to be a single value
  and then check to see if the value is "empty" (null, undefined, empty array,
  or an empty string). If it is empty, the value will be set to the string
  "(EMPTY)".

  ## One Way Bindings

  One especially useful binding customization you can use is the `oneWay()`
  helper. This helper tells SproutCore that you are only interested in
  receiving changes on the object you are binding from. For example, if you
  are binding to a preference and you want to be notified if the preference
  has changed, but your object will not be changing the preference itself, you
  could do:

        bigTitlesBinding: SC.Binding.oneWay("MyApp.preferencesController.bigTitles")

  This way if the value of MyApp.preferencesController.bigTitles changes the
  "bigTitles" property of your object will change also. However, if you
  change the value of your "bigTitles" property, it will not update the
  preferencesController.

  One way bindings are almost twice as fast to setup and twice as fast to
  execute because the binding only has to worry about changes to one side.

  You should consider using one way bindings anytime you have an object that
  may be created frequently and you do not intend to change a property; only
  to monitor it for changes. (such as in the example above).

  ## Adding Custom Transforms

  In addition to using the standard helpers provided by SproutCore, you can
  also defined your own custom transform functions which will be used to
  convert the value. To do this, just define your transform function and add
  it to the binding with the transform() helper. The following example will
  not allow Integers less than ten. Note that it checks the value of the
  bindings and allows all other values to pass:

        valueBinding: SC.Binding.transform(function(value, binding) {
          return ((SC.typeOf(value) === 'number') && (value < 10)) ? 10 : value;
        }).from("MyApp.someController.value")

  If you would like to instead use this transform on a number of bindings,
  you can also optionally add your own helper method to SC.Binding. This
  method should simply return the value of `this.transform()`. The example
  below adds a new helper called `notLessThan()` which will limit the value to
  be not less than the passed minimum:

      SC.Binding.reopen({
        notLessThan: function(minValue) {
          return this.transform(function(value, binding) {
            return ((SC.typeOf(value) === 'number') && (value < minValue)) ? minValue : value;
          });
        }
      });

  You could specify this in your core.js file, for example. Then anywhere in
  your application you can use it to define bindings like so:

        valueBinding: SC.Binding.from("MyApp.someController.value").notLessThan(10)

  Also, remember that helpers are chained so you can use your helper along 
  with any other helpers. The example below will create a one way binding that
  does not allow empty values or values less than 10:

        valueBinding: SC.Binding.oneWay("MyApp.someController.value").notEmpty().notLessThan(10)

  ## How to Manually Adding Binding

  All of the examples above show you how to configure a custom binding, but
  the result of these customizations will be a binding template, not a fully
  active binding. The binding will actually become active only when you
  instantiate the object the binding belongs to. It is useful however, to
  understand what actually happens when the binding is activated.

  For a binding to function it must have at least a "from" property and a "to"
  property. The from property path points to the object/key that you want to
  bind from while the to path points to the object/key you want to bind to.

  When you define a custom binding, you are usually describing the property
  you want to bind from (such as "MyApp.someController.value" in the examples
  above). When your object is created, it will automatically assign the value
  you want to bind "to" based on the name of your binding key. In the
  examples above, during init, SproutCore objects will effectively call
  something like this on your binding:

        binding = SC.Binding.from(this.valueBinding).to("value");

  This creates a new binding instance based on the template you provide, and
  sets the to path to the "value" property of the new object. Now that the
  binding is fully configured with a "from" and a "to", it simply needs to be
  connected to become active. This is done through the connect() method:

        binding.connect(this);

  Note that when you connect a binding you pass the object you want it to be
  connected to.  This object will be used as the root for both the from and
  to side of the binding when inspecting relative paths.  This allows the 
  binding to be automatically inherited by subclassed objects as well.
  
  Now that the binding is connected, it will observe both the from and to side
  and relay changes.

  If you ever needed to do so (you almost never will, but it is useful to
  understand this anyway), you could manually create an active binding by
  using the SC.bind() helper method. (This is the same method used by 
  to setup your bindings on objects):

        SC.bind(MyApp.anotherObject, "value", "MyApp.someController.value");

  Both of these code fragments have the same effect as doing the most friendly
  form of binding creation like so:

        MyApp.anotherObject = SC.Object.create({
          valueBinding: "MyApp.someController.value",

          // OTHER CODE FOR THIS OBJECT...

        });

  SproutCore's built in binding creation method makes it easy to automatically
  create bindings for you. You should always use the highest-level APIs
  available, even if you understand how to it works underneath.

  @since SproutCore 1.0
*/
var Binding = SC.Object.extend({

  /** @private */
  _direction: 'fwd',

  /** @private */
  init: function(toPath, fromPath) {
    this._from = fromPath;
    this._to   = toPath; 
  },
  
  // ..........................................................
  // CONFIG
  // 
  
  /**
    This will set "from" property path to the specified value. It will not
    attempt to resolve this property path to an actual object until you 
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you connect() the binding.  It follows the same rules as 
    `getPath()` - see that method for more information.

    @param {String} propertyPath the property path to connect to
    @returns {SC.Binding} receiver
  */
  from: function(path) {
    this._from = path;
    return this;
  },
  
  /**
    This will set the "to" property path to the specified value. It will not
    attempt to reoslve this property path to an actual object until you 
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you connect() the binding.  It follows the same rules as 
    `getPath()` - see that method for more information.

    @param {String|Tuple} propertyPath A property path or tuple
    @param {Object} [root] Root object to use when resolving the path.
    @returns {SC.Binding} this
  */
  to: function(path) {
    this._to = path;
    return this;
  },

  
  /**
    Configures the binding as one way. A one-way binding will relay changes
    on the "from" side to the "to" side, but not the other way around. This
    means that if you change the "to" side directly, the "from" side may have
    a different value.

    @param {Boolean} flag
      (Optional) passing nothing here will make the binding oneWay.  You can
      instead pass NO to disable oneWay, making the binding two way again.
      
    @returns {SC.Binding} receiver
  */
  oneWay: function(flag) {
    this._oneWay = flag===undefined ? true : !!flag;
    return this;
  },

  /**
    Adds the specified transform function to the array of transform functions.

    The function you pass must have the following signature:

          function(value) {};

    It must return the transformed value.

    Transform functions are called in the order they were added. If you are
    extending a binding and want to reset the transforms, you can call
    `resetTransform()` first.

    @param {Function} transformFunc the transform function.
    @returns {SC.Binding} this
  */
  transform: function(func) {
    if (!this._transforms) this._transforms = [];
    this._transforms.push(func);
    return this;
  },
  
  /**
    Resets the transforms for the binding. After calling this method the
    binding will no longer transform values. You can then add new transforms
    as needed.

    @returns {SC.Binding} this
  */
  resetTransforms: function() {
    this._transforms = null;
    return this;  
  },
  
  /**
    Adds a transform to the chain that will allow only single values to pass.
    This will allow single values and nulls to pass through. If you pass an
    array, it will be mapped as so:

      - [] => null
      - [a] => a
      - [a,b,c] => Multiple Placeholder

    You can pass in an optional multiple placeholder or it will use the
    default.

    Note that this transform will only happen on forwarded valued. Reverse
    values are send unchanged.

    @param {String} fromPath from path or null
    @param {Object} [placeholder] Placeholder value.
    @returns {SC.Binding} this
  */
  single: function(placeholder) {
    if (placeholder===undefined) placeholder = SC.MULTIPLE_PLACEHOLDER; 
    this._forceKind = SINGLE;
    this._placeholder = placeholder;
    return this; 
  },

  /**
    Adds a transform that will convert the passed value to an array. If
    the value is null or undefined, it will be converted to an empty array.

    @param {String} [fromPath]
    @returns {SC.Binding} this
  */
  multiple: function() {
    this._forceKind = MULTIPLE;
    this._placeholder = null;
    return this; 
  },
  
  /**
    Adds a transform to convert the value to a bool value. If the value is
    an array it will return YES if array is not empty. If the value is a 
    string it will return YES if the string is not empty.

    @returns {SC.Binding} this
  */
  bool: function() {
    this.transform(BOOL);
    return this;
  },

  /**
    Adds a transform that will return the placeholder value if the value is
    null, undefined, an empty array or an empty string. See also notNull().

    @param {String} fromPath from path or null
    @param {Object} [placeholder] Placeholder value.
    @returns {SC.Binding} this
  */
  notEmpty: function(placeholder, extra) {
    // for compatibility...
    if (extra) {
      if (placeholder) this.from(placeholder);
      placeholder = extra;
    }
    
    if (!placeholder) placeholder = SC.EMPTY_PLACEHOLDER;
    this.transform(function(val) {
      return empty(val) ? placeholder : val;
    });
    return this;
  },

  /**
    Adds a transform that will return the placeholder value if the value is
    null or undefined. Otherwise it will passthrough untouched. See also notEmpty().

    @param {String} fromPath from path or null
    @param {Object} [placeholder] Placeholder value.
    @returns {SC.Binding} this
  */
  notNull: function(placeholder) {
    // TODO: IMPLEMENT notNull
    throw new Error('SC.Binding.notNull not yet implemented');
  },

  /**
    Adds a transform to convert the value to the inverse of a bool value. This
    uses the same transform as bool() but inverts it.

    @returns {SC.Binding} this
  */
  not: function() {
    this.transform(NOT);
    return this;
  },

  /**
    Adds a transform that will return YES if the value is null or undefined, NO otherwise.

    @param {String} [fromPath]
    @returns {SC.Binding} this
  */
  isNull: function(fromPath) {
    // TODO: IMPLEMENT isNull
    throw new Error('SC.Binding.isNull not yet implemented');
  },
  
  /** @private */
  toString: function() {
    var oneWay = this._oneWay ? '[oneWay]' : '';
    return SC.String.fmt("SC.Binding<%@>(%@ -> %@)%@", [guidFor(this), this._from, this._to, oneWay]);
  },
  
  // ..........................................................
  // CONNECT AND SYNC
  // 
  
  /**
    Attempts to connect this binding instance so that it can receive and relay
    changes. This method will raise an exception if you have not set the
    from/to properties yet.

    @param {Object} obj
      The root object for this binding.
      
    @returns {SC.Binding} this
  */
  connect: function(obj) {
    sc_assert('Must pass a valid object to SC.Binding.connect()', !!obj);
    
    var oneWay = this._oneWay, from2 = this._from2;
    SC.addObserver(obj, this._from, this, this.fromDidChange); 
    if (from2) SC.addObserver(obj, from2, this, this.fromDidChange); 
    if (!oneWay) SC.addObserver(obj, this._to, this, this.toDidChange);
    if (SC.meta(obj,false).proto !== obj) this._scheduleSync(obj, 'fwd');
    this._readyToSync = true; 
    return this;
  },

  /**
    Disconnects the binding instance. Changes will no longer be relayed. You
    will not usually need to call this method.

    @param {Object} obj
      The root object you passed when connecting the binding.
      
    @returns {SC.Binding} this
  */
  disconnect: function(obj) {
    sc_assert('Must pass a valid object to SC.Binding.disconnect()', !!obj);
    var oneWay = this._oneWay, from2 = this._from2;
    SC.removeObserver(obj, this._from, this, this.fromDidChange);
    if (from2) SC.removeObserver(obj, from2, this, this.fromDidChange);
    if (!oneWay) SC.removeObserver(obj, this._to, this, this.toDidChange);
    this._readyToSync = false; // disable scheduled syncs... 
    return this;
  },
  
  // ..........................................................
  // PRIVATE
  // 
  
  /** @private - called when the from side changes */
  fromDidChange: function(target) {
    this._scheduleSync(target, 'fwd');  
  },
  
  /** @private - called when the to side changes */
  toDidChange: function(target) {
    this._scheduleSync(target, 'back');
  },

  /** @private */
  _scheduleSync: function(obj, dir) {
    var guid = guidFor(obj);
    if (!this[guid]) SC.run.schedule('sync', this, this._sync, obj);
    this[guid] = (this[guid]==='fwd' || !dir) ? 'fwd' : dir;
  },

  /** @private */
  _sync: function(obj) {

    //@if (debug)
    var log = SC.LOG_BINDINGS;
    //@endif
    
    var guid = guidFor(obj), direction = this[guid], val, tv;
    if (!this._readyToSync) return; // not connected.

    delete this[guid];
    if (direction === 'fwd') {
      val = fromValue(obj, this);
      tv  = transformedValue(this, val, obj);

      //@if (debug)
      if (log) { SC.Logger.log(' ', this.toString(), val, '->', tv, obj); }
      //@endif
      
      // apply changes
      SC.setPath(obj, this._to, tv);

    } else if (direction === 'back' && !this._oneWay) {
      val = getPath(obj, this._to);
      tv  = transformedValue(this, fromValue(obj, this), obj);
      if (val !== tv) {

        //@if (debug)
        if (log) { SC.Logger.log(' ', this.toString(), val, '<-', tv, obj); }
        //@endif

        SC.setPath(obj, this._from, val);
      }
    }
  }
  
});

Binding.reopenClass(/** @scope SC.Binding */ {

  /**
    @see SC.Binding.prototype.from
  */
  from: function() {
    var C = this, binding = new C();
    return binding.from.apply(binding, arguments);
  },
  
  /**
    @see SC.Binding.prototype.to
  */
  to: function() {
    var C = this, binding = new C();
    return binding.to.apply(binding, arguments);
  },
  
  /**
    @see SC.Binding.prototype.oneWay
  */
  oneWay: function(from, flag) {
    var C = this, binding = new C(null, from);
    return binding.oneWay(flag);
  },
  
  /**
    @see SC.Binding.prototype.single
  */
  single: function(from) {
    var C = this, binding = new C(null, from);
    return binding.single();
  },

  /**
    @see SC.Binding.prototype.multiple
  */
  multiple: function(from) {
    var C = this, binding = new C(null, from);
    return binding.multiple();
  },

  /**
    @see SC.Binding.prototype.oneWay
  */
  oneWay: function(from, flag) {
    var C = this, binding = new C(null, from);
    return binding.oneWay(flag);
  },

  /**
    @see SC.Binding.prototype.transform
  */
  transform: function(func) {
    var C = this, binding = new C();
    return binding.transform(func);
  },

  /**
    @see SC.Binding.prototype.notEmpty
  */
  notEmpty: function(from, placeholder) {
    var C = this, binding = new C(null, from);
    return binding.notEmpty(placeholder);
  },

  /**
    @see SC.Binding.prototype.bool
  */
  bool: function(from) {
    var C = this, binding = new C(null, from);
    return binding.bool();
  },

  /**
    @see SC.Binding.prototype.not
  */
  not: function(from) {
    var C = this, binding = new C(null, from);
    return binding.not();
  },

  /**
    Adds a transform that forwards the logical 'AND' of values at 'pathA' and
    'pathB' whenever either source changes. Note that the transform acts 
    strictly as a one-way binding, working only in the direction

        'pathA' AND 'pathB' --> value  (value returned is the result of ('pathA' && 'pathB'))

    Usage example where a delete button's `isEnabled` value is determined by 
    whether something is selected in a list and whether the current user is 
    allowed to delete:

        deleteButton: SC.ButtonView.design({
          isEnabledBinding: SC.Binding.and('MyApp.itemsController.hasSelection', 'MyApp.userController.canDelete')
        })

    @param {String} pathA The first part of the conditional
    @param {String} pathB The second part of the conditional
  */
  and: function(pathA, pathB) {
    var C = this, binding = new C(null, pathA).oneWay();
    binding._from2 = pathB;
    binding._logic = AND_LOGIC;
    return binding;
  },

  /**
    Adds a transform that forwards the 'OR' of values at 'pathA' and
    'pathB' whenever either source changes. Note that the transform acts 
    strictly as a one-way binding, working only in the direction

        'pathA' AND 'pathB' --> value  (value returned is the result of ('pathA' || 'pathB'))

    @param {String} pathA The first part of the conditional
    @param {String} pathB The second part of the conditional
  */
  or: function(pathA, pathB) {
    var C = this, binding = new C(null, pathA).oneWay();
    binding._from2 = pathB;
    binding._logic = OR_LOGIC;
    return binding;
  }
    
});

SC.Binding = Binding;

/**
  Global helper method to create a new binding.  Just pass the root object
  along with a to and from path to create and connect the binding.  The new
  binding object will be returned which you can further configure with 
  transforms and other conditions.
  
  @param {Object} obj
    The root object of the transform.
    
  @param {String} to
    The path to the 'to' side of the binding.  Must be relative to obj.
    
  @param {String} from
    The path to the 'from' side of the binding.  Must be relative to obj or
    a global path.

  @returns {SC.Binding} binding instance
*/
SC.bind = function(obj, to, from) {
  return new SC.Binding(to, from).connect(obj);
};



})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var set = SC.set, get = SC.get, guidFor = SC.guidFor;
  
var EachArray = SC.Object.extend(SC.Array, {

  init: function(content, keyName, owner) {
    this._super();
    this._keyName = keyName;
    this._owner   = owner;
    this._content = content;
  },

  objectAt: function(idx) {
    var item = this._content.objectAt(idx);
    return item && get(item, this._keyName);
  },
  
  length: function() {
    var content = this._content;
    return content ? get(content, 'length') : 0;
  }.property('[]').cacheable()
  
});

var IS_OBSERVER = /^.+:(before|change)$/;

function addObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects, guid;
  if (!objects) objects = proxy._objects = {};
  
  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      SC.addBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      SC.addObserver(item, keyName, proxy, 'contentKeyDidChange');
      
      // keep track of the indicies each item was found at so we can map
      // it back when the obj changes.
      guid = guidFor(item);
      if (!objects[guid]) objects[guid] = [];
      objects[guid].push(loc);
    }
  }
}

function removeObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects;
  if (!objects) objects = proxy._objects = {};
  var indicies, guid;
  
  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      SC.removeBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      SC.removeObserver(item, keyName, proxy, 'contentKeyDidChange');
      
      guid = guidFor(item);
      indicies = objects[guid];
      indicies[indicies.indexOf(loc)] = null;
    }
  }
}

/**
  @private
  @class

  This is the object instance returned when you get the @each property on an
  array.  It uses the unknownProperty handler to automatically create 
  EachArray instances for property names.
  
  @extends SC.Object
*/
SC.EachProxy = SC.Object.extend({
  
  init: function(content) {
    this._super();
    this._content = content;
    content.addArrayObserver(this);

    // in case someone is already observing some keys make sure they are 
    // added
    SC.watchedEvents(this).forEach(function(eventName) { 
      this.didAddListener(eventName); 
    }, this);
  },

  /**
    You can directly access mapped properties by simply requesting them.
    The unknownProperty handler will generate an EachArray of each item.
  */
  unknownProperty: function(keyName) {
    var ret;
    ret = new EachArray(this._content, keyName, this);
    set(this, keyName, ret); 
    this.beginObservingContentKey(keyName);
    return ret;
  },

  // ..........................................................
  // ARRAY CHANGES
  // Invokes whenever the content array itself changes.  
  
  arrayWillChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;
    
    if (!keys) return ; // nothing to do
    
    lim = removedCnt>0 ? idx+removedCnt : -1;
    SC.beginPropertyChanges(this);
    for(key in keys) {
      if (!keys.hasOwnProperty(key)) continue;

      if (lim>0) removeObserverForContentKey(content, key, this, idx, lim);

      array = get(this, key);
      SC.propertyWillChange(this, key);
      if (array) array.arrayContentWillChange(idx, removedCnt, addedCnt);
    }
    SC.endPropertyChanges(this);
  },
  
  arrayDidChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;
    
    if (!keys) return ; // nothing to do

    lim = addedCnt>0 ? idx+addedCnt : -1;
    SC.beginPropertyChanges(this);
    for(key in keys) {
      if (!keys.hasOwnProperty(key)) continue;

      if (lim>0) addObserverForContentKey(content, key, this, idx, lim);
      
      array = get(this, key);
      if (array) array.arrayContentDidChange(idx, removedCnt, addedCnt);
      SC.propertyDidChange(this, key);
    }
    SC.endPropertyChanges(this);
  },
  
  // ..........................................................
  // LISTEN FOR NEW OBSERVERS AND OTHER EVENT LISTENERS
  // Start monitoring keys based on who is listening...
  
  didAddListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.beginObservingContentKey(eventName.slice(0, -7));
    }
  },
  
  didRemoveListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.stopObservingContentKey(eventName.slice(0, -7));
    }
  },

  // ..........................................................
  // CONTENT KEY OBSERVING
  // Actual watch keys on the source content.
  
  beginObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (!keys) keys = this._keys = {};
    if (!keys[keyName]) {
      keys[keyName] = 1;
      var content = this._content, 
          len = get(content, 'length');
      addObserverForContentKey(content, keyName, this, 0, len);
    } else {
      keys[keyName]++;
    }
  },
  
  stopObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (keys && (keys[keyName]>0) && (--keys[keyName]<=0)) {
      var content = this._content,
          len     = get(content, 'length');
      removeObserverForContentKey(content, keyName, this, 0, len);
    }
  },
  
  contentKeyWillChange: function(obj, keyName) {
    // notify array.
    var indexes = this._objects[guidFor(obj)], 
        array   = get(this, keyName),
        len = array && indexes ? indexes.length : 0, idx;
        
    for(idx=0;idx<len;idx++) {
      array.arrayContentWillChange(indexes[idx], 1, 1);
    }
  },
  
  contentKeyDidChange: function(obj, keyName) {
    // notify array.
    var indexes = this._objects[guidFor(obj)], 
        array   = get(this, keyName),
        len = array && indexes ? indexes.length : 0, idx;
        
    for(idx=0;idx<len;idx++) {
      array.arrayContentDidChange(indexes[idx], 1, 1);
    }

    SC.propertyDidChange(this, keyName);
  }
  
  
});



})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



var get = SC.get, set = SC.set;
  
// Add SC.Array to Array.prototype.  Remove methods with native 
// implementations and supply some more optimized versions of generic methods
// because they are so common.
var NativeArray = SC.Mixin.create(SC.MutableArray, SC.Observable, SC.Copyable, {

  // because length is a built-in property we need to know to just get the 
  // original property.
  get: function(key) {
    if (key==='length') return this.length;
    else if ('number' === typeof key) return this[key];
    else return this._super(key);  
  },
  
  objectAt: function(idx) {
    return this[idx];
  },
    
  // primitive for array support.
  replace: function(idx, amt, objects) {

    if (this.isFrozen) throw SC.FROZEN_ERROR ;

    // if we replaced exactly the same number of items, then pass only the
    // replaced range.  Otherwise, pass the full remaining array length
    // since everything has shifted
    var len = objects ? get(objects, 'length') : 0;
    this.arrayContentWillChange(idx, amt, len);
    
    if (!objects || objects.length === 0) {
      this.splice(idx, amt) ;
    } else {
      var args = [idx, amt].concat(objects) ;
      this.splice.apply(this,args) ;
    }

    this.arrayContentDidChange(idx, amt, len);
    return this ;
  },

  // If you ask for an unknown property, then try to collect the value
  // from member items.
  unknownProperty: function(key, value) {
    var ret;// = this.reducedProperty(key, value) ;
    if ((value !== undefined) && ret === undefined) {
      ret = this[key] = value;
    }
    return ret ;
  },

  // If browser did not implement indexOf natively, then override with
  // specialized version
  indexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = 0;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  lastIndexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = len-1;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },
  
  copy: function() {
    return this.slice();
  }
});

// Remove any methods implemented natively so we don't override them
var ignore = ['length'];
NativeArray.keys().forEach(function(methodName) {
  if (Array.prototype[methodName]) ignore.push(methodName);
});

if (ignore.length>0) {
  NativeArray = NativeArray.without.apply(NativeArray, ignore);
}

/**
  The NativeArray mixin contains the properties needed to to make the native
  Array support SC.MutableArray and all of its dependent APIs.  Unless you 
  have SC.EXTEND_PROTOTYPES set to false, this will be applied automatically.
  Otherwise you can apply the mixin at anytime by calling 
  `SC.NativeArray.activate`.
  
  @namespace
  @extends SC.MutableArray
  @extends SC.Array
  @extends SC.Enumerable
  @extends SC.MutableEnumerable
  @extends SC.Copyable
  @extends SC.Freezable
*/
SC.NativeArray = NativeArray;

/**
  Activates the mixin on the Array.prototype if not already applied.  Calling
  this method more than once is safe.
  
  @returns {void}
*/
SC.NativeArray.activate = function() {
  NativeArray.apply(Array.prototype);
};

if (SC.EXTEND_PROTOTYPES) SC.NativeArray.activate();



})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================










})();


(function() {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





})();

(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;

/*
  TODO Document SC.RenderBuffer class itself
*/

/**
  @class
  @extends SC.Object
*/
SC.RenderBuffer = function(tagName) {
  return SC._RenderBuffer.create({
    elementTag: tagName
  });
};

SC._RenderBuffer = SC.Object.extend(
/** @scope SC.RenderBuffer.prototype */ {

  /**
    @type Array
    @default []
  */
  elementClasses: null,

  /**
    @type String
    @default null
  */
  elementId: null,

  /**
    @type Hash
    @default {}
  */
  elementAttributes: null,

  /**
    @type Array
    @default []
  */
  elementContent: null,

  /**
    @type String
    @default null
  */
  elementTag: null,

  /**
    @type Hash
    @default {}
  */
  elementStyle: null,

  /**
    RenderBuffer supports plugging in escaping functionality via
    the boolean `escapeContent` property and the `escapeFunction`
    property.

    If `escapeContent` is set to true, the RenderBuffer will escape
    the value of the `elementContent` property when `string()` is
    called using `escapeFunction`, passing in the content.

    @type Boolean
  */
  escapeContent: false,

  /**
    @type Function
    @see SC.RenderBuffer.prototype.escapeContent
  */
  escapeFunction: null,

  parentBuffer: null,

  /** @private */
  init: function() {
    this._super();

    set(this ,'elementClasses', []);
    set(this, 'elementAttributes', {});
    set(this, 'elementStyle', {});
    set(this, 'elementContent', []);
  },

  /**
    Adds a string of HTML to the RenderBuffer.

    @param {String} string HTML to push into the buffer
    @returns {SC.RenderBuffer} this
  */
  push: function(string) {
    get(this, 'elementContent').pushObject(string);
    return this;
  },

  /**
    Adds a class to the buffer, which will be rendered to the class attribute.

    @param {String} className Class name to add to the buffer
    @returns {SC.RenderBuffer} this
  */
  addClass: function(className) {
    get(this, 'elementClasses').pushObject(className);
    return this;
  },

  /**
    Sets the elementID to be used for the element.

    @param {Strign} id
    @returns {SC.RenderBuffer} this
  */
  id: function(id) {
    set(this, 'elementId', id);
    return this;
  },

  /**
    Adds an attribute which will be rendered to the element.

    @param {String} name The name of the attribute
    @param {String} value The value to add to the attribute
    @returns {SC.RenderBuffer} this
  */
  attr: function(name, value) {
    get(this, 'elementAttributes')[name] = value;
    return this;
  },

  /**
    Adds a style to the style attribute which will be rendered to the element.

    @param {String} name Name of the style
    @param {String} value
    @returns {SC.RenderBuffer} this
  */
  style: function(name, value) {
    get(this, 'elementStyle')[name] = value;
    return this;
  },

  /**
    Creates a new SC.RenderBuffer object with the provided tagName as
    the element tag and with its parentBuffer property set to the current
    SC.RenderBuffer.

    @param {String} tagName Tag name to use for the child buffer's element
    @returns {SC.RenderBuffer} A new RenderBuffer object
  */
  begin: function(tagName) {
    return SC._RenderBuffer.create({
      parentBuffer: this,
      elementTag: tagName
    });
  },

  /**
    Closes the current buffer and adds its content to the parentBuffer.

    @returns {SC.RenderBuffer} The parentBuffer, if one exists. Otherwise, this
  */
  end: function() {
    var parent = get(this, 'parentBuffer');

    if (parent) {
      var string = this.string();
      parent.push(string);
      return parent;
    } else {
      return this;
    }
  },

  /**
    @returns {DOMElement} The element corresponding to the generated HTML
      of this buffer
  */
  element: function() {
    return SC.$(this.string())[0];
  },

  /**
    Generates the HTML content for this buffer.

    @returns {String} The generated HTMl
  */
  string: function() {
    var id = get(this, 'elementId'),
        classes = get(this, 'elementClasses'),
        attrs = get(this, 'elementAttributes'),
        style = get(this, 'elementStyle'),
        content = get(this, 'elementContent'),
        tag = get(this, 'elementTag'),
        styleBuffer = [], prop;

    var openTag = ["<" + tag];

    if (id) { openTag.push('id="' + id + '"'); }
    if (classes.length) { openTag.push('class="' + classes.join(" ") + '"'); }

    if (!jQuery.isEmptyObject(style)) {
      for (prop in style) {
        if (style.hasOwnProperty(prop)) {
          styleBuffer.push(prop + ':' + style[prop] + ';');
        }
      }

      openTag.push('style="' + styleBuffer.join() + '"');
    }

    for (prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        openTag.push(prop + '="' + attrs[prop] + '"');
      }
    }
    openTag.push('>');

    openTag = openTag.join(" ");

    content = content.join();

    if (get(this, 'escapeContent')) {
      content = get(this, 'escapeFunction')(content);
    }

    return openTag + content + "</" + tag + ">";
  }

});

})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;

/**
  @ignore

  SC.EventDispatcher handles delegating browser events to their corresponding
  SC.Views. For example, when you click on a view, SC.EventDispatcher ensures
  that that view's `mouseDown` method gets called.
*/
SC.EventDispatcher = SC.Object.extend(
/** @scope SC.EventDispatcher.prototype */{

  /**
    @private

    The root DOM element to which event listeners should be attached. Event
    listeners will be attached to the document unless this is overridden.

    @type DOMElement
    @default document
  */
  rootElement: document,

  /**
    @private

    Sets up event listeners for standard browser events.

    This will be called after the browser sends a DOMContentReady event. By
    default, it will set up all of the listeners on the document body. If you
    would like to register the listeners on different element, set the event
    dispatcher's `root` property.
  */
  setup: function() {
    var event, events = {
      touchstart  : 'touchStart',
      touchmove   : 'touchMove',
      touchend    : 'touchEnd',
      touchcancel : 'touchCancel',
      keydown     : 'keyDown',
      keyup       : 'keyUp',
      keypress    : 'keyPress',
      mousedown   : 'mouseDown',
      mouseup     : 'mouseUp',
      click       : 'click',
      dblclick    : 'doubleClick',
      mousemove   : 'mouseMove',
      focusin     : 'focusIn',
      focusout    : 'focusOut',
      mouseenter  : 'mouseEnter',
      mouseleave  : 'mouseLeave',
      change      : 'change'
    };

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(event, events[event]);
      }
    }
  },

  /**
    @private

    Registers an event listener on the document. If the given event is
    triggered, the provided event handler will be triggered on the target
    view.

    If the target view does not implement the event handler, or if the handler
    returns false, the parent view will be called. The event will continue to
    bubble to each successive parent view until it reaches the top.

    For example, to have the `mouseDown` method called on the target view when
    a `mousedown` event is received from the browser, do the following:

        setupHandler('mousedown', 'mouseDown');

    @param {String} event the browser-originated event to listen to
    @param {String} eventName the name of the method to call on the view
  */
  setupHandler: function(event, eventName) {
    var rootElement = get(this, 'rootElement');

    SC.$(rootElement).delegate('.sc-view', event + '.sproutcore', function(evt) {
      var view = SC.View.views[this.id],
          result = true, handler;

      SC.run(function() {
        while (result !== false && view) {
          handler = view[eventName];
          if (SC.typeOf(handler) === 'function') {
            result = handler.call(view, evt);
          }

          view = get(view, 'parentView');
        }
      });

      return result;
    });
  },

  /** @private */
  destroy: function() {
    var rootElement = get(this, 'rootElement');

    SC.$(rootElement).undelegate('.sproutcore');
  }
});

})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;

/**
  @class

  An SC.Application instance serves as the namespace in which you define your
  application's classes. You can also override the configuration of your
  application.

  By default, SC.Application will begin listening for events on the document.
  If your application is embedded inside a page, instead of controlling the
  entire document, you can specify which DOM element to attach to by setting
  the `rootElement` property:

      MyApp = SC.Application.create({
        rootElement: $('#my-app')
      });

  The root of an SC.Application must not be removed during the course of the
  page's lifetime. If you have only a single conceptual application for the
  entire page, and are not embedding any third-party SproutCore applications
  in your page, use the default document root for your application.

  You only need to specify the root if your page contains multiple instances 
  of SC.Application.

  @since SproutCore 2.0
  @extends SC.Object
*/
SC.Application = SC.Object.extend(
/** @scope SC.Application.prototype */{

  /**
    @type DOMElement
    @default document
  */
  rootElement: document,

  /**
    @type SC.EventDispatcher
    @default null
  */
  eventDispatcher: null,

  /** @private */
  init: function() {
    var eventDispatcher,
        rootElement = get(this, 'rootElement');

    eventDispatcher = SC.EventDispatcher.create({
      rootElement: rootElement
    });

    set(this, 'eventDispatcher', eventDispatcher);

    SC.$(document).ready(function() {
      eventDispatcher.setup();
    });
  },

  /** @private */
  destroy: function() {
    get(this, 'eventDispatcher').destroy();
  }
});



})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */

var get = SC.get, set = SC.set;

/**
  @static

  Global hash of shared templates. This will automatically be populated
  by the build tools so that you can store your Handlebars templates in
  separate files that get loaded into JavaScript at buildtime.

  @type Hash
*/
SC.TEMPLATES = {};

/**
  @class
  @since SproutCore 2.0
  @extends SC.Object
*/
SC.View = SC.Object.extend(
/** @scope SC.View.prototype */ {

  /** @private */
  concatenatedProperties: ['classNames', 'classNameBindings'],

  /**
    @type Boolean
    @default YES
    @constant
  */
  isView: YES,

  // ..........................................................
  // TEMPLATE SUPPORT
  //

  /**
    The name of the template to lookup if no template is provided.

    SC.View will look for a template with this name in this view's
    `templates` object. By default, this will be a global object
    shared in `SC.TEMPLATES`.

    @type String
    @default null
  */
  templateName: null,

  /**
    The hash in which to look for `templateName`.

    @type SC.Object
    @default SC.TEMPLATES
  */
  templates: SC.TEMPLATES,

  /**
    The template used to render the view. This should be a function that
    accepts an optional context parameter and returns a string of HTML that
    will be inserted into the DOM relative to its parent view.

    In general, you should set the `templateName` property instead of setting
    the template yourself.

    @field
    @type Function
  */
  template: function(key, value) {
    if (value !== undefined) { return value; }

    var templateName = get(this, 'templateName'),
        template = get(get(this, 'templates'), templateName);

    // If there is no template but a templateName has been specified,
    // alert the developer.
    if (!template && templateName) {
      throw new SC.Error('%@ - Unable to find template "%@".'.fmt(this, templateName));
    }

    // return the template, or undefined if no template was found
    return template || get(this, 'defaultTemplate');
  }.property('templateName').cacheable(),

  /**
    The object from which templates should access properties.

    This object will be passed to the template function each time the render
    method is called, but it is up to the individual function to decide what
    to do with it.

    By default, this will be the view itself.

    @type Object
  */
  templateContext: function(key, value) {
    return value !== undefined ? value : this;
  }.property().cacheable(),

  /**
    If the view is currently inserted into the DOM of a parent view, this
    property will point to the parent of the view.

    @type SC.View
    @default null
  */
  parentView: null,

  /**
    If false, the view will appear hidden in DOM.

    @type Boolean
    @default true
  */
  isVisible: true,

  /**
    Array of child views. You should never edit this array directly unless
    you are implementing createChildViews(). Most of the time, you should
    use the accessor methods such as appendChild(), insertBefore() and
    removeChild().

    @type Array
    @default []
  */
  childViews: [],

  /**
    Called on your view when it should push strings of HTML into a
    SC.RenderBuffer.

    By default, SC.View will look for a function in the `template`
    property and invoke it with the value of `templateContext`. By default,
    `templateContext` will be the view itself.

    @param {SC.RenderBuffer} buffer The render buffer
  */
  render: function(buffer) {
    var template = get(this, 'template');
    if (!template) { return; }

    var context = get(this, 'templateContext'),
        options = {
          data: {
            view: this,
            isRenderData: true
          }
        };

    // The template should take care of rendering child views.
    this._didRenderChildViews = YES;

    var output = template(context, options);
    buffer.push(output);
  },

  /**
    @private

    Iterates over the view's `classNameBindings` array, inserts the value
    of the specified property into the `classNames` array, then creates an
    observer to update the view's element if the bound property ever changes
    in the future.
  */
  _applyClassNameBindings: function() {
    var classBindings = get(this, 'classNameBindings'),
        classNames = get(this, 'classNames'),
        elem, newClass, dasherizedClass;

    if (!classBindings) { return; }

    // Loop through all of the configured bindings. These will be either
    // property names ('isUrgent') or property paths relative to the view
    // ('content.isUrgent')
    classBindings.forEach(function(property) {

      // Variable in which the old class value is saved. The observer function
      // closes over this variable, so it knows which string to remove when
      // the property changes.
      var oldClass;

      // Set up an observer on the context. If the property changes, toggle the
      // class name.
      var observer = function() {
        // Get the current value of the property
        newClass = this._classStringForProperty(property);
        elem = this.$();

        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      };

      SC.addObserver(this, property, observer);

      // Get the class name for the property at its current value
      dasherizedClass = this._classStringForProperty(property);

      if (dasherizedClass) {
        // Ensure that it gets into the classNames array
        // so it is displayed when we render.
        classNames.push(dasherizedClass);

        // Save a reference to the class name so we can remove it
        // if the observer fires. Remember that this variable has
        // been closed over by the observer.
        oldClass = dasherizedClass;
      }
    }, this);
  },

  /**
    @private

    Given a property name, returns a dasherized version of that
    property name if the property evaluates to a non-falsy value.

    For example, if the view has property `isUrgent` that evaluates to true,
    passing `isUrgent` to this method will return `"is-urgent"`.
  */
  _classStringForProperty: function(property) {
    var split = property.split(':'), className = split[1];
    property = split[0];

    var val = SC.getPath(this, property);

    // If value is a Boolean and true, return the dasherized property
    // name.
    if (val === YES) {
      if (className) { return className; }

      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      return SC.String.dasherize(get(property.split('.'), 'lastObject'));

    // If the value is not NO, undefined, or null, return the current
    // value of the property.
    } else if (val !== NO && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  },

  // ..........................................................
  // ELEMENT SUPPORT
  //

  /**
    Returns the current DOM element for the view.

    @field
    @type DOMElement
  */
  element: function(key, value) {
    // If the value of element is being set, just return it. SproutCore
    // will cache it for further `get` calls.
    if (value !== undefined) { return value; }

    var parent = get(this, 'parentView');
    if (parent) { parent = get(parent, 'element'); }
    if (parent) { return this.findElementInParentElement(parent); }
  }.property('parentView').cacheable(),

  /**
    Returns a jQuery object for this view's element. If you pass in a selector
    string, this method will return a jQuery object, using the current element
    as its buffer.

    For example, calling `view.$('li')` will return a jQuery object containing
    all of the `li` elements inside the DOM element of this view.

    @param {String} [selector] a jQuery-compatible selector string
    @returns {SC.CoreQuery} the CoreQuery object for the DOM node
  */
  $: function(sel) {
    var elem = get(this, 'element');

    if (!elem) {
      return SC.$();
    } else if (sel === undefined) {
      return SC.$(elem);
    } else {
      return SC.$(sel, elem);
    }
  },

  /** @private */
  mutateChildViews: function(callback) {
    var childViews = get(this, 'childViews'),
        idx = get(childViews, 'length'),
        view;

    while(--idx >= 0) {
      view = childViews[idx];
      callback.call(this, view);
    }

    return this;
  },

  /** @private */
  forEachChildView: function(callback) {
    var childViews = get(this, 'childViews'),
        len = get(childViews, 'length'),
        view, idx;

    for(idx = 0; idx < len; idx++) {
      view = childViews[idx];
      callback.call(this, view);
    }

    return this;
  },

  /**
    Appends the view's element to the specified parent element.

    If the view does not have an HTML representation yet, `createElement()`
    will be called automatically.

    @param {String|DOMElement|jQuery} A selector, element, HTML string, or jQuery object
    @returns {SC.View} receiver
  */
  appendTo: function(target) {
    var elem = get(this, 'element');
    if (!elem) { this.createElement(); }

    this.$().appendTo(target);
    return this;
  },

  /**
    Appends the view's element to the document body. If the view does
    not have an HTML representation yet, `createElement()` will be called
    automatically.

    @returns {SC.View} receiver
  */
  append: function() {
    return this.appendTo(document.body);
  },

  /**
    Removes the view's element from the element to which it is attached.

    @returns {SC.View} receiver
  */
  remove: function() {
    // What we should really do here is wait until the end of the run loop
    // to determine if the element has been re-appended to a different 
    // element.
    // In the interim, we will just re-render if that happens. It is more
    // important than elements get garbage collected.
    this.destroyElement();
  },

  /**
    The ID to use when trying to locate the element in the DOM. If you do not
    set the elementId explicitly, then the view's GUID will be used instead.
    This ID must be set at the time the view is created.

    @type String
    @readOnly
  */
  elementId: function(key, value) {
    return value !== undefined ? value : SC.guidFor(this);
  }.property().cacheable(),

  /**
    Attempts to discover the element in the parent element. The default
    implementation looks for an element with an ID of elementId (or the view's
    guid if elementId is null). You can override this method to provide your
    own form of lookup. For example, if you want to discover your element 
    using a CSS class name instead of an ID.

    @param {DOMElement} parentElement The parent's DOM element
    @returns {DOMElement} The discovered element
  */
  findElementInParentElement: function(parentElem) {
    var id = "#" + get(this, 'elementId');
    return jQuery(id)[0] || jQuery(id, parentElem)[0];
  },

  /**
    Creates a new renderBuffer with the passed tagName. You can override this
    method to provide further customization to the buffer if needed. Normally 
    you will not need to call or override this method.

    @returns {SC.RenderBuffer}
  */
  renderBuffer: function(tagName) {
    return SC.RenderBuffer(tagName);
  },

  /**
    Creates a DOM representation of the view and all of its
    child views by recursively calling the `render()` method.

    After the element has been created, `didCreateElement` will
    be called on this view and all of its child views.

    @returns {SC.View} receiver
  */
  createElement: function() {
    if (get(this, 'element')) { return this; }

    var buffer = this.renderBuffer(get(this, 'tagName'));

    // now prepare the content like normal.
    this.renderToBuffer(buffer);
    set(this, 'element', buffer.element());

    // now notify the view and its child views..
    this._notifyDidCreateElement();

    return this;
  },

  /**
    Called when the element of the view is created. Override this function
    to do any set up that requires an element.
  */
  didCreateElement: function() {},

  /**
    @private

    Invokes the receivers didCreateElement() method if it exists and then
    invokes the same on all child views.
  */
  _notifyDidCreateElement: function() {
    this.didCreateElement();

    this.forEachChildView(function(view) {
      view._notifyDidCreateElement();
    });
  },

  /**
    Destroys any existing element along with the element for any child views 
    as well. If the view does not currently have a element, then this method 
    will do nothing.

    If you implement willDestroyElement() on your view, then this method will 
    be invoked on your view before your element is destroyed to give you a 
    chance to clean up any event handlers, etc.

    If you write a willDestroyElement() handler, you can assume that your
    didCreateElement() handler was called earlier for the same element.

    Normally you will not call or override this method yourself, but you may
    want to implement the above callbacks when it is run.

    @returns {SC.View} receiver
  */
  destroyElement: function() {
    var elem = get(this, 'element');
    if (elem) {
      // Notify the view and its child views that the element is about to be
      // destroyed.
      this._notifyWillDestroyElement();

      // Remove this DOM element from its parent.
      SC.$(elem).remove();
      set(this, 'element', null);
    }

    return this;
  },

  /**
    Called when the element of the view is going to be destroyed. Override 
    this function to do any teardown that requires an element, like removing 
    event listeners.
  */
  willDestroyElement: function() {},

  /**
    @private

    Invokes the `willDestroyElement` callback on the view and child views.
  */
  _notifyWillDestroyElement: function() {
    this.willDestroyElement();

    this.forEachChildView(function(view) {
      view._notifyWillDestroyElement();
    });
  },

  /** @private (nodoc) */
  _sccv_elementWillChange: function() {
    this.forEachChildView(function(view) {
      SC.propertyWillChange(view, 'element');
    });
  }.observesBefore('element'),
  
  /**
    @private

    If this view's element changes, we need to invalidate the caches of our
    child views so that we do not retain references to DOM elements that are 
    no longer needed.

    @observes element
  */
  _sccv_elementDidChange: function() {
    this.forEachChildView(function(view) {
      SC.propertyDidChange(view, 'element');
    });
  }.observes('element'),

  /**
    Called when the parentView property has changed.
    
    @function
  */
  parentViewDidChange: SC.K,

  /**
    @private

    Renders to a buffer.
    Rendering only happens for the initial rendering. Further updates happen 
    in updateElement, and are not done to buffers, but to elements.
    Note: You should not generally override nor directly call this method. 
    This method is only called by createElement to set up the element 
    initially, and by renderChildViews, to write to a buffer.

    @param {SC.RenderBuffer} buffer the render buffer.
  */
  renderToBuffer: function(buffer) {
    var mixins, idx, len;

    SC.beginPropertyChanges(this);
    set(this, 'elementNeedsUpdate', NO);

    this.applyAttributesToBuffer(buffer);
    this.render(buffer);

    // If we've made it this far and renderChildViews() was never called,
    // render any child views now.
    if (!this._didRenderChildViews) { this.renderChildViews(buffer); }

    // Reset the flag so that if the element is recreated we re-render the 
    // child views
    this._didRenderChildViews = NO;

    SC.endPropertyChanges(this);
  },

  /**
    @private
  */
  applyAttributesToBuffer: function(buffer) {
    // Creates observers for all registered class name bindings,
    // then adds them to the classNames array.
    this._applyClassNameBindings();

    buffer.addClass(get(this, 'classNames').join(' '));
    buffer.id(get(this, 'elementId'));

    var role = get(this, 'ariaRole');
    if (role) {
      buffer.attr('role', role);
    }

    if (!get(this, 'isVisible')) {
      buffer.style('display', 'none');
    }
  },

  /**
    Your render method should invoke this method to render any child views,
    especially if this is the first time the view will be rendered. This will
    walk down the childView chain, rendering all of the children in a nested
    way.

    @param {SC.RenderBuffer} buffer the buffer
    @param {Boolean} firstName true if the element is being created
    @returns {SC.RenderBuffer} the render buffer
    @test in render
  */
  renderChildViews: function(buffer) {
    this.forEachChildView(function(view) {
      buffer = buffer.begin(get(view, 'tagName'));
      view.renderToBuffer(buffer);
      buffer = buffer.end();
    });

    this._didRenderChildViews = YES;

    return buffer;
  },

  // ..........................................................
  // STANDARD RENDER PROPERTIES
  //

  /**
    Tag name for the view's outer element. The tag name is only used when
    an element is first created. If you change the tagName for an element, you
    must destroy and recreate the view element.

    @type String
    @default 'div'
  */
  tagName: 'div',

  /**
    The WAI-ARIA role of the control represented by this view. For example, a
    button may have a role of type 'button', or a pane may have a role of
    type 'alertdialog'. This property is used by assistive software to help
    visually challenged users navigate rich web applications.

    The full list of valid WAI-ARIA roles is available at:
    http://www.w3.org/TR/wai-aria/roles#roles_categorization

    @type String
    @default null
  */
  ariaRole: null,

  /**
    Standard CSS class names to apply to the view's outer element. This
    property automatically inherits any class names defined by the view's
    superclasses as well.

    @type Array
    @default ['sc-view']
  */
  classNames: ['sc-view'],

  /**
    A list of properties of the view to apply as class names. If the property
    is a string value, the value of that string will be applied as a class
    name.

        // Applies the 'high' class to the view element
        SC.View.create({
          classNameBindings: ['priority']
          priority: 'high'
        });

    If the value of the property is a Boolean, the name of that property is
    added as a dasherized class name.

        // Applies the 'is-urgent' class to the view element
        SC.View.create({
          classNameBindings: ['isUrgent']
          isUrgent: true
        });

    If you would prefer to use a custom value instead of the dasherized
    property name, you can pass a binding like this:

        // Applies the 'urgent' class to the view element
        SC.View.create({
          classNameBindings: ['isUrgent:urgent']
          isUrgent: true
        });

    This list of properties is inherited from the view's superclasses as well.

    @type Array
    @default []
  */
  classNameBindings: [],

  // .......................................................
  // CORE DISPLAY METHODS
  //

  /**
    @private

    Setup a view, but do not finish waking it up.
    - configure childViews
    - Determine the view's theme
    - Fetch a render delegate from the theme, if necessary
    - register the view with the global views hash, which is used for event
      dispatch
  */
  init: function() {
    var parentView = get(this, 'parentView');

    this._super();

    // Register the view for event handling. This hash is used by
    // SC.RootResponder to dispatch incoming events.
    SC.View.views[get(this, 'elementId')] = this;

    // setup child views. be sure to clone the child views array first
    this.childViews = get(this, 'childViews').slice();
    this.classNameBindings = get(this, 'classNameBindings').slice();
    this.classNames = get(this, 'classNames').slice();

    this.createChildViews(); // setup child Views
  },

  /**
    Removes the child view from the parent view.

    @param {SC.View} view
    @returns {SC.View} receiver
  */
  removeChild: function(view) {
    // update parent node
    set(view, 'parentView', null);

    // remove view from childViews array.
    var childViews = get(this, 'childViews');
    childViews.removeObject(view);

    return this;
  },

  /**
    Removes all children from the parentView.

    @returns {SC.View} receiver
  */
  removeAllChildren: function() {
    return this.mutateChildViews(function(view) {
      this.removeChild(view);
    });
  },

  destroyAllChildren: function() {
    return this.mutateChildViews(function(view) {
      view.destroy();
    });
  },

  /**
    Removes the view from its parentView, if one is found. Otherwise
    does nothing.

    @returns {SC.View} receiver
  */
  removeFromParent: function() {
    var parent = get(this, 'parentView');

    // Remove DOM element from parent
    this.remove();

    if (parent) { parent.removeChild(this); }
    return this;
  },

  /**
    You must call this method on a view to destroy the view (and all of its
    child views). This will remove the view from any parent node, then make
    sure that the DOM element managed by the view can be released by the
    memory manager.
  */
  destroy: function() {
    if (get(this, 'isDestroyed')) { return this; }

    // destroy the element -- this will avoid each child view destroying
    // the element over and over again...
    this.destroyElement();

    // first destroy any children.
    this.mutateChildViews(function(view) {
      view.destroy();
    });

    // next remove view from global hash
    delete SC.View.views[get(this, 'elementId')];

    // remove from parent if found
    if (get(this, 'parentView')) { this.removeFromParent(); }

    //Do generic destroy. It takes care of mixins and sets isDestroyed to YES.
    this._super();
    return this; // done with cleanup
  },

  /**
    This method is called when your view is first created to setup any  child
    views that are already defined on your class. If any are found, it will
    instantiate them for you.

    The default implementation of this method simply steps through your
    childViews array, which is expects to either be empty or to contain View
    designs that can be instantiated

    Alternatively, you can implement this method yourself in your own
    subclasses to look for views defined on specific properties and then build
     a childViews array yourself.

    Note that when you implement this method yourself, you should never
    instantiate views directly. Instead, you should use
    this.createChildView() method instead. This method can be much faster in
    a production environment than creating views yourself.

    @returns {SC.View} receiver
  */
  createChildViews: function() {
    var childViews = get(this, 'childViews'),
        len        = get(childViews, 'length'),
        idx, key, views, view;

    SC.beginPropertyChanges(this);

    // swap the array
    for (idx=0; idx<len; ++idx) {
      key = view = childViews[idx];
      if (key) {

        // is this is a key name, lookup view class
        if (typeof key === 'string') {
          view = this[key];
        } else {
          key = null;
        }

        if (!view) {
          //@if (debug)
          SC.Logger.error ("No view with name " + key + " has been found in " + this.toString());
          //@endif
          // skip this one.
          continue;
        }

        // createChildView creates the view if necessary, but also sets
        // important properties, such as parentView
        view = this.createChildView(view);
        if (key) { this[key] = view; } // save on key name if passed
      }
      childViews[idx] = view;
    }

    SC.endPropertyChanges(this);
    return this;
  },

  /**
    Instantiates a view to be added to the childViews array during view
    initialization. You generally will not call this method directly unless
    you are overriding createChildViews(). Note that this method will
    automatically configure the correct settings on the new view instance to
    act as a child of the parent.

    @param {Class} viewClass
    @param {Hash} [attrs] Attributes to add
    @returns {SC.View} new instance
    @test in createChildViews
  */
  createChildView: function(view, attrs) {
    if (SC.View.detect(view)) {
      view = view.create(attrs || {}, { parentView: this });
    } else {
      sc_assert('must pass instance of View', view instanceof SC.View);
      set(view, 'parentView', this);
    }
    return view;
  },

  /**
    @private

    When the view's `isVisible` property changes, toggle the visibility 
    element of the actual DOM element.
  */
  _isVisibleDidChange: function() {
    this.$().toggle(get(this, 'isVisible'));
  }.observes('isVisible')

});

// Create a global view hash.
SC.View.views = {};


})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;

/**
  @class
  @since SproutCore 2.0
  @extends SC.View
*/
SC.CollectionView = SC.View.extend(
/** @scope SC.CollectionView.prototype */ {

  /**
    A list of items to be displayed by the SC.CollectionView.

    @type SC.Array
    @default null
  */
  content: null,

  /**
    An optional view to display if content is set to an empty array.

    @type SC.View
    @default null
  */
  emptyView: null,

  /**
    @type SC.View
    @default SC.View
  */
  itemViewClass: SC.View,

  /**
    @private

    When the view is initialized, set up array observers on the content array.

    @returns {SC.TemplateCollectionView}
  */
  init: function() {
    var collectionView = this._super();
    this._sctcv_contentDidChange();
    return collectionView;
  },

  /**
    @private

    In case a default content was set, trigger the child view creation
    as soon as the empty layer was created
  */
  didCreateElement: function() {
    var content = get(this, 'content');
    if (content) {
      var len = get(content, 'length');
      this.arrayWillChange(content, 0, 0, len);
      this.arrayDidChange(content, 0, 0, len);
    }
  },

  /**
    @private

    When the content property of the collection changes, remove any existing
    child views and observers, then set up an observer on the new content, if
    needed.
  */
  _sctcv_contentDidChange: function() {
    this.$().empty();

    var oldContent = this._sccv_content,
        content = get(this, 'content'),
        oldLen = 0, newLen = 0;

    if (oldContent) {
      oldContent.removeArrayObserver(this);
      oldLen = get(oldContent, 'length');
    }

    if (content) {
      content.addArrayObserver(this);
      newLen = get(content, 'length');
    }

    this.arrayWillChange(oldContent, 0, oldLen, newLen);
    this._sccv_content = content;
    this.arrayDidChange(content, 0, oldLen, newLen);
  }.observes('content'),

  destroy: function() {
    set(this, 'content', null);
    return this._super();
  },

  arrayWillChange: function(content, start, removedCount, addedCount) {
    if (!get(this, 'element')) { return; }

    // If the contents were empty before and this template collection has an 
    // empty view remove it now.
    var emptyView = get(this, 'emptyView');
    if (emptyView && !SC.Object.detect(emptyView)) {
      emptyView.removeFromParent();
    }

    // Loop through child views that correspond with the removed items.
    // Note that we loop from the end of the array to the beginning because
    // we are mutating it as we go.
    var childViews = get(this, 'childViews'), childView, idx, len;

    len = get(childViews, 'length');
    for (idx = start + removedCount - 1; idx >= start; idx--) {
      childViews[idx].destroy();
    }
  },

  /**
    Called when a mutation to the underlying content array occurs.

    This method will replay that mutation against the views that compose the
    SC.CollectionView, ensuring that the view reflects the model.

    This array observer is added in contentDidChange.

    @param {Array} addedObjects 
      the objects that were added to the content

    @param {Array} removedObjects 
      the objects that were removed from the content
    
    @param {Number} changeIndex 
      the index at which the changes occurred
  */
  arrayDidChange: function(content, start, removedCount, addedCount) {
    if (!get(this, 'element')) { return; }

    var itemViewClass = get(this, 'itemViewClass'),
        childViews = get(this, 'childViews'),
        addedViews = [],
        renderFunc, view, childView, itemOptions, elem,
        insertAtElement, item, itemElem, idx, len;

    elem = this.$();

    if (content) {
      var addedObjects = content.slice(start, start+addedCount);

      childView = childViews.objectAt(start - 1);
      insertAtElement = childView ? childView.$() : null;

      len = get(addedObjects, 'length');

      for (idx = 0; idx < len; idx++) {
        item = addedObjects.objectAt(idx);
        view = this.createChildView(itemViewClass, {
          content: item
        });

        itemElem = view.createElement().$();
        if (!insertAtElement) {
          elem.append(itemElem);
        } else {
          itemElem.insertAfter(insertAtElement);
        }
        insertAtElement = itemElem;

        addedViews.push(view);
      }

      childViews.replace(start, 0, addedViews);
    }

    var emptyView = get(this, 'emptyView');
    if (get(childViews, 'length') === 0 && emptyView) {
      if (SC.Object.detect(emptyView)) {
        emptyView = this.createChildView(emptyView);
      }

      set(this, 'emptyView', emptyView);
      emptyView.createElement().$().appendTo(elem);
      set(this, 'childViews', [emptyView]);
    }
  }
});

})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


})();


(function() {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

if ('undefined' === typeof jQuery) require('jquery');

SC.$ = jQuery;


})();

(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set;

SC.Button = SC.View.extend({
  classNames: ['sc-button'],
  classNameBindings: ['isActive'],

  tagName: 'button',
  
  targetObject: function() {
    var target = get(this, 'target');

    if (SC.typeOf(target) === "string") {
      return SC.getPath(target);
    } else {
      return target;
    }
  }.property('target').cacheable(),

  mouseDown: function() {
    set(this, 'isActive', true);
    this._mouseDown = true;
    this._mouseEntered = true;
  },

  mouseLeave: function() {
    if (this._mouseDown) {
      set(this, 'isActive', false);
      this._mouseEntered = false;
    }
  },

  mouseEnter: function() {
    if (this._mouseDown) {
      set(this, 'isActive', true);
      this._mouseEntered = true;
    }
  },

  mouseUp: function(event) {
    if (get(this, 'isActive')) {
      var action = get(this, 'action'),
          target = get(this, 'targetObject');

      if (target && action) {
        if (typeof action === 'string') {
          action = target[action];
        }
        action.call(target, this);
      }

      set(this, 'isActive', false);
    }

    this._mouseDown = false;
    this._mouseEntered = false;
  },

  // TODO: Handle proper touch behavior.  Including should make inactive when
  // finger moves more than 20x outside of the edge of the button (vs mouse
  // which goes inactive as soon as mouse goes out of edges.)

  touchStart: function(touch) {
    this.mouseDown(touch);
  },

  touchEnd: function(touch) {
    this.mouseUp(touch);
  }
});

})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

/**
  @class

  Prepares the Handlebars templating library for use inside SproutCore's view
  system.

  The SC.Handlebars object is the standard Handlebars library, extended to use
  SproutCore's get() method instead of direct property access, which allows
  computed properties to be used inside templates.

  To use SC.Handlebars, call SC.Handlebars.compile().  This will return a
  function that you can call multiple times, with a context object as the first
  parameter:

      var template = SC.Handlebars.compile("my {{cool}} template");
      var result = template({
        cool: "awesome"
      });

      console.log(result); // prints "my awesome template"

  Note that you won't usually need to use SC.Handlebars yourself. Instead, use
  SC.View, which takes care of integration into the view layer for you.
*/


SC.Handlebars = {};

SC.Handlebars.Compiler = function() {};
SC.Handlebars.Compiler.prototype = SC.create(Handlebars.Compiler.prototype);
SC.Handlebars.Compiler.prototype.compiler = SC.Handlebars.Compiler;

SC.Handlebars.JavaScriptCompiler = function() {};
SC.Handlebars.JavaScriptCompiler.prototype = SC.create(Handlebars.JavaScriptCompiler.prototype);
SC.Handlebars.JavaScriptCompiler.prototype.compiler = SC.Handlebars.JavaScriptCompiler;

SC.Handlebars.JavaScriptCompiler.prototype.nameLookup = function(parent, name, type) {
  if (type === 'context') {
    return "SC.get(" + parent + ", " + this.quotedString(name) + ");";
  } else {
    return Handlebars.JavaScriptCompiler.prototype.nameLookup.call(this, parent, name, type);
  }
};

SC.Handlebars.Compiler.prototype.mustache = function(mustache) {
  if (mustache.params.length || mustache.hash) {
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  } else {
    var id = new Handlebars.AST.IdNode(['bind']);

    // Update the mustache node to include a hash value indicating whether the original node
    // was escaped. This will allow us to properly escape values when the underlying value
    // changes and we need to re-render the value.
    if(mustache.escaped) {
      mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
      mustache.hash.pairs.push(["escaped", new Handlebars.AST.StringNode("true")]);
    }
    mustache = new Handlebars.AST.MustacheNode([id].concat([mustache.id]), mustache.hash, !mustache.escaped);
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  }
};

SC.Handlebars.compile = function(string) {
  var ast = Handlebars.parse(string);
  var environment = new SC.Handlebars.Compiler().compile(ast, {data: true, stringParams: true});
  var ret = new SC.Handlebars.JavaScriptCompiler().compile(environment, {data: true, stringParams: true});
  ret.rawTemplate = string;
  return ret;
};

/**
  Registers a helper in Handlebars that will be called if no property with the
  given name can be found on the current context object, and no helper with
  that name is registered.

  This throws an exception with a more helpful error message so the user can
  track down where the problem is happening.

  @name Handlebars.helpers.helperMissing
  @param {String} path
  @param {Hash} options
*/
Handlebars.registerHelper('helperMissing', function(path, options) {
  var error;

  error = "%@ Handlebars error: Could not find property '%@' on object %@.";
  throw new SC.Error(SC.String.fmt(error, options.data.view, path, this));
});

SC._RenderBuffer.reopen({
  escapeFunction: Handlebars.Utils.escapeExpression
});

})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var set = SC.set, get = SC.get;

// TODO: Be explicit in the class documentation that you
// *MUST* set the value of a checkbox through SproutCore.
// Updating the value of a checkbox directly via jQuery objects
// will not work.

SC.Checkbox = SC.View.extend({
  title: null,
  value: false,

  classNames: ['sc-checkbox'],

  defaultTemplate: SC.Handlebars.compile('<label><input type="checkbox" {{bindAttr checked="value"}}>{{title}}</label>'),

  change: function() {
    SC.run.once(this, this._updateElementValue);
    return false;
  },

  _updateElementValue: function() {
    var input = this.$('input:checkbox');
    set(this, 'value', input.prop('checked'));
  }
});


})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/** @class */

var get = SC.get, set = SC.set;

SC.TextField = SC.View.extend(
  /** @scope SC.TextField.prototype */ {

  classNames: ['sc-text-field'],

  insertNewline: SC.K,
  cancel: SC.K,

  type: "text",
  value: "",
  placeholder: null,

  defaultTemplate: function() {
    var type = get(this, 'type');
    return SC.Handlebars.compile('<input type="%@" {{bindAttr value="value" placeholder="placeholder"}}>'.fmt(type));
  }.property(),

  focusOut: function(event) {
    this._elementValueDidChange();
    return false;
  },

  change: function(event) {
    this._elementValueDidChange();
    return false;
  },

  keyUp: function(event) {
    this.interpretKeyEvents(event);
    return false;
  },

  /**
    @private
  */
  interpretKeyEvents: function(event) {
    var map = SC.TextField.KEY_EVENTS;
    var method = map[event.keyCode];

    if (method) { return this[method](event); }
    else { this._elementValueDidChange(); }
  },

  _elementValueDidChange: function() {
    var input = this.$('input');

    set(this, 'value', input.val());
  },

  _valueDidChange: function() {
    SC.run.once(this, this._updateElementValue);
  },

  _updateElementValue: function() {
    var input = this.$('input');
    input.val(get(this, 'value'));
  }
});

SC.TextField.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel'
};


})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

var get = SC.get, set = SC.set, getPath = SC.getPath;

/**
  @ignore
  @private
  @class

  SC._BindableSpanView is a private view created by the Handlebars `{{bind}}` 
  helpers that is used to keep track of bound properties.

  Every time a property is bound using a `{{mustache}}`, an anonymous subclass 
  of SC._BindableSpanView is created with the appropriate sub-template and 
  context set up. When the associated property changes, just the template for 
  this view will re-render.
*/
SC._BindableSpanView = SC.View.extend(
/** @scope SC._BindableSpanView.prototype */{

  /**
   The type of HTML tag to use. To ensure compatibility with
   Internet Explorer 7, a `<span>` tag is used to ensure that inline elements are
   not rendered with display: block.

   @type String
   @default 'span'
  */
  tagName: 'span',

  /**
    The function used to determine if the `displayTemplate` or
    `inverseTemplate` should be rendered. This should be a function that takes
    a value and returns a Boolean.

    @type Function
    @default null
  */
  shouldDisplayFunc: null,

  /**
    Whether the template rendered by this view gets passed the context object
    of its parent template, or gets passed the value of retrieving `property`
    from the previous context.

    For example, this is true when using the `{{#if}}` helper, because the 
    template inside the helper should look up properties relative to the same 
    object as outside the block. This would be NO when used with `{{#with 
    foo}}` because the template should receive the object found by evaluating 
    `foo`.

    @type Boolean
    @default false
  */
  preserveContext: false,

  /**
    The template to render when `shouldDisplayFunc` evaluates to true.

    @type Function
    @default null
  */
  displayTemplate: null,

  /**
    The template to render when `shouldDisplayFunc` evaluates to false.

    @type Function
    @default null
  */
  inverseTemplate: null,

  /**
    The key to look up on `previousContext` that is passed to
    `shouldDisplayFunc` to determine which template to render.

    In addition, if `preserveContext` is false, this object will be passed to 
    the template when rendering.

    @type String
    @default null
  */
  property: null,

  /**
    Determines which template to invoke, sets up the correct state based on
    that logic, then invokes the default SC.View `render` implementation.

    This method will first look up the `property` key on `previousContext`,
    then pass that value to the `shouldDisplayFunc` function. If that returns
    true, the `displayTemplate` function will be rendered to DOM. Otherwise,
    `inverseTemplate`, if specified, will be rendered.

    For example, if this SC._BindableSpan represented the {{#with foo}} 
    helper, it would look up the `foo` property of its context, and 
    `shouldDisplayFunc` would always return true. The object found by looking 
    up `foo` would be passed to `displayTemplate`.

    @param {SC.RenderBuffer} buffer
  */
  render: function(buffer) {
    // If not invoked via a triple-mustache ({{{foo}}}), escape
    // the content of the template.
    if(get(this, 'isEscaped')) { set(buffer, 'escapeContent', true); }

    var shouldDisplay = get(this, 'shouldDisplayFunc'),
        property = get(this, 'property'),
        preserveContext = get(this, 'preserveContext'),
        context = get(this, 'previousContext');

    var inverseTemplate = get(this, 'inverseTemplate'),
        displayTemplate = get(this, 'displayTemplate');

    var result = getPath(context, property);

    // First, test the conditional to see if we should
    // render the template or not.
    if (shouldDisplay(result)) {
      set(this, 'template', displayTemplate);

      // If we are preserving the context (for example, if this
      // is an #if block, call the template with the same object.
      if (preserveContext) {
        set(this, 'templateContext', context);
      } else {
      // Otherwise, determine if this is a block bind or not.
      // If so, pass the specified object to the template
        if (displayTemplate) {
          set(this, 'templateContext', result);
        } else {
        // This is not a bind block, just push the result of the
        // expression to the render context and return.
          buffer.push(result);
          return;
        }
      }
    } else if (inverseTemplate) {
      set(this, 'template', inverseTemplate);

      if (preserveContext) {
        set(this, 'templateContext', context);
      } else {
        set(this, 'templateContext', result);
      }
    } else {
      set(this, 'template', function() { return ''; });
    }

    return this._super(buffer);
  },

  /**
    Called when the property associated with this `<span>` changes.

    We destroy all registered children, then render the view again and insert
    it into DOM.
  */
  rerender: function() {
    var elem;

    this.destroyAllChildren();

    // Destroy the existing element and replace it with
    // a new element by re-running the render method.
    // This is used instead of calling destroyElement()/createElement()
    // to maintain position in the DOM.
    var buffer = this.renderBuffer(get(this, 'tagName'));
    if(get(this, 'isEscaped')) { set(buffer, 'escapeContent', true); }
    this.renderToBuffer(buffer);

    elem = buffer.element();
    this.$().replaceWith(elem);
    set(this, 'element', elem);

    this._notifyDidCreateElement();
  }
});

})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */


var get = SC.get, getPath = SC.getPath;

(function() {
  // Binds a property into the DOM. This will create a hook in DOM that the
  // KVO system will look for and upate if the property changes.
  var bind = function(property, options, preserveContext, shouldDisplay) {
    var data = options.data,
        fn = options.fn,
        inverse = options.inverse,
        view = data.view,
        ctx  = this;

    // Set up observers for observable objects
    if ('object' === typeof this) {
      // Create the view that will wrap the output of this template/property 
      // and add it to the nearest view's childViews array.
      // See the documentation of SC._BindableSpanView for more.
      var bindView = view.createChildView(SC._BindableSpanView, {
        preserveContext: preserveContext,
        shouldDisplayFunc: shouldDisplay,
        displayTemplate: fn,
        inverseTemplate: inverse,
        property: property,
        previousContext: ctx,
        isEscaped: options.hash.escaped
      });

      var observer, invoker;

      get(view, 'childViews').pushObject(bindView);

      observer = function() {
        if (get(bindView, 'element')) {
          bindView.rerender();
        } else {
          // If no layer can be found, we can assume somewhere
          // above it has been re-rendered, so remove the
          // observer.
          SC.removeObserver(ctx, property, invoker);
        }
      };

      invoker = function() {
        SC.run.once(observer);
      };

      // Observes the given property on the context and
      // tells the SC._BindableSpan to re-render.
      SC.addObserver(ctx, property, invoker);

      var buffer = bindView.renderBuffer(get(bindView, 'tagName'));
      bindView.renderToBuffer(buffer);
      return new Handlebars.SafeString(buffer.string());
    } else {
      // The object is not observable, so just render it out and
      // be done with it.
      return getPath(this, property);
    }
  };

  /**
    `bind` can be used to display a value, then update that value if it 
    changes. For example, if you wanted to print the `title` property of 
    `content`:

        {{bind "content.title"}}

    This will return the `title` property as a string, then create a new 
    observer at the specified path. If it changes, it will update the value in 
    DOM. Note that if you need to support IE7 and IE8 you must modify the 
    model objects properties using SC.get() and SC.set() for this to work as 
    it relies on SC's KVO system.  For all other browsers this will be handled
    for you automatically.  

    @name Handlebars.helpers.bind
    @param {String} property Property to bind
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Handlebars.registerHelper('bind', function(property, fn) {
    return bind.call(this, property, fn, false, function(result) {
      return !SC.none(result);
    });
  });

  /**
    Use the `boundIf` helper to create a conditional that re-evaluates 
    whenever the bound value changes.

        {{#boundIf "content.shouldDisplayTitle"}}
          {{content.title}}
        {{/boundIf}}

    @name Handlebars.helpers.boundIf
    @param {String} property Property to bind
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Handlebars.registerHelper('boundIf', function(property, fn) {
    if(fn) {
      return bind.call(this, property, fn, true, function(result) {
        if (SC.typeOf(result) === 'array') {
          return get(result, 'length') !== 0;
        } else {
          return !!result;
        }
      } );
    } else {
      throw new SC.Error("Cannot use boundIf helper without a block.");
    }
  });
})();

/**
  @name Handlebars.helpers.with
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('with', function(context, options) {
  return Handlebars.helpers.bind.call(options.contexts[0], context, options);
});


/**
  @name Handlebars.helpers.if
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('if', function(context, options) {
  return Handlebars.helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  @name Handlebars.helpers.unless
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;

  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  `bindAttr` allows you to create a binding between DOM element attributes and
  SproutCore objects. For example:

      <img {{bindAttr src="imageUrl" alt="imageTitle"}}>

  @name Handlebars.helpers.bindAttr
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('bindAttr', function(options) {
  
  var attrs = options.hash;
  var view = options.data.view;
  var ret = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = jQuery.uuid++;

  // Handle classes differently, as we can bind multiple classes
  var classBindings = attrs['class'];
  if (classBindings !== null && classBindings !== undefined) {
    var classResults = SC.Handlebars.bindClasses(this, classBindings, view, dataId);
    ret.push('class="' + classResults.join(' ') + '"');
    delete attrs['class'];
  }

  var attrKeys = SC.keys(attrs);

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  attrKeys.forEach(function(attr) {
    var property = attrs[attr];
    var value = getPath(ctx, property);

    var observer, invoker;

    observer = function observer() {
      var result = getPath(ctx, property);
      var elem = view.$("[data-handlebars-id='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (elem.length === 0) {
        SC.removeObserver(ctx, property, invoker);
        return;
      }

      // A false result will remove the attribute from the element. This is
      // to support attributes such as disabled, whose presence is meaningful.
      if (result === NO) {
        elem.removeAttr(attr);

      // Likewise, a true result will set the attribute's name as the value.
      } else if (result === YES) {
        elem.attr(attr, attr);

      } else {
        elem.attr(attr, result);
      }
    };

    invoker = function() {
      SC.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    SC.addObserver(ctx, property, invoker);

    // Use the attribute's name as the value when it is YES
    if (value === YES) {
      value = attr;
    }

    // Do not add the attribute when the value is false
    if (value !== NO) {
      // Return the current value, in the form src="foo.jpg"
      ret.push(attr + '="' + value + '"');
    }
  }, this);

  // Add the unique identifier
  ret.push('data-handlebars-id="' + dataId + '"');
  return ret.join(' ');
});

/**
  Helper that, given a space-separated string of property paths and a context,
  returns an array of class names. Calling this method also has the side 
  effect of setting up observers at those property paths, such that if they 
  change, the correct class name will be reapplied to the DOM element.

  For example, if you pass the string "fooBar", it will first look up the 
  "fooBar" value of the context. If that value is YES, it will add the 
  "foo-bar" class to the current element (i.e., the dasherized form of 
  "fooBar"). If the value is a string, it will add that string as the class. 
  Otherwise, it will not add any new class name.

  @param {SC.Object} context 
    The context from which to lookup properties

  @param {String} classBindings 
    A string, space-separated, of class bindings to use

  @param {SC.View} view
    The view in which observers should look for the element to update

  @param {String} id 
    Optional id use to lookup elements

  @returns {Array} An array of class names to add
*/
SC.Handlebars.bindClasses = function(context, classBindings, view, id) {
  var ret = [], newClass, value, elem;

  // Helper method to retrieve the property from the context and
  // determine which class string to return, based on whether it is
  // a Boolean or not.
  var classStringForProperty = function(property) {
    var val = getPath(context, property);

    // If value is a Boolean and true, return the dasherized property
    // name.
    if (val === YES) {
      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      return SC.String.dasherize(get(property.split('.'), 'lastObject'));

    // If the value is not NO, undefined, or null, return the current
    // value of the property.
    } else if (val !== NO && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  };

  // For each property passed, loop through and setup
  // an observer.
  classBindings.split(' ').forEach(function(property) {

    // Variable in which the old class value is saved. The observer function
    // closes over this variable, so it knows which string to remove when
    // the property changes.
    var oldClass;

    var observer, invoker;

    // Set up an observer on the context. If the property changes, toggle the
    // class name.
    observer = function() {
      // Get the current value of the property
      newClass = classStringForProperty(property);
      elem = id ? view.$("[data-handlebars-id='" + id + "']") : view.$();

      // If we can't find the element anymore, a parent template has been
      // re-rendered and we've been nuked. Remove the observer.
      if (elem.length === 0) {
        SC.removeObserver(context, property, invoker);
      } else {
        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      }
    };

    invoker = function() {
      SC.run.once(observer);
    };

    SC.addObserver(context, property, invoker);

    // We've already setup the observer; now we just need to figure out the 
    // correct behavior right now on the first pass through.
    value = classStringForProperty(property);

    if (value) {
      ret.push(value);

      // Make sure we save the current value so that it can be removed if the 
      // observer fires.
      oldClass = value;
    }
  });

  return ret;
};


})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars sc_assert */

// TODO: Don't require the entire module

var get = SC.get, set = SC.set;

/** @private */
SC.Handlebars.ViewHelper = SC.Object.create({
  
  viewClassFromHTMLOptions: function(viewClass, options) {
    var extensions = {},
        classes = options['class'],
        dup = false;

    if (options.id) {
      extensions.elementId = options.id;
      dup = true;
    }

    if (classes) {
      classes = classes.split(' ');
      extensions.classNames = classes;
      dup = true;
    }

    if (options.classBinding) {
      extensions.classNameBindings = options.classBinding.split(' ');
      dup = true;
    }

    if (dup) {
      options = jQuery.extend({}, options);
      delete options.id;
      delete options['class'];
      delete options.classBinding;
    }

    return viewClass.extend(options, extensions);
  },

  helper: function(thisContext, path, options) {
    var inverse = options.inverse,
        data = options.data,
        view = data.view,
        fn = options.fn,
        hash = options.hash,
        newView;

    if ('string' === typeof path) {
      newView = SC.getPath(thisContext, path);
      if (!newView) { 
        throw new SC.Error("Unable to find view at path '" + path + "'"); 
      }
    } else {
      sc_assert('You must pass a string or a view class to the #view helper', SC.View.detect(path));
      newView = path;
    }

    sc_assert("Null or undefined object was passed to the #view helper. Did you mean to pass a property path string?", !!newView);

    newView = this.viewClassFromHTMLOptions(newView, hash);
    var currentView = data.view;

    var childViews = get(currentView, 'childViews');
    var childView = currentView.createChildView(newView);

    // Set the template of the view to the passed block if we got one
    if (fn) { set(childView, 'template', fn); }

    childViews.pushObject(childView);

    var buffer = SC.RenderBuffer(get(childView, 'tagName'));
    childView.renderToBuffer(buffer);

    return new Handlebars.SafeString(buffer.string());
  }
});

/**
  @name Handlebars.helpers.view
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('view', function(path, options) {
  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = "SC.View";
  }

  return SC.Handlebars.ViewHelper.helper(this, path, options);
});


})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars sc_assert */

// TODO: Don't require all of this module


var get = SC.get;

/**
  @static

  A map of parent tags to their default child tags. You can add
  additional parent tags if you want collection views that use
  a particular parent tag to default to a child tag.

  @type Hash
  @constant
*/
SC.Handlebars.CONTAINER_MAP = {
  ul: 'li',
  ol: 'li',
  table: 'tr',
  thead: 'tr',
  tbody: 'tr',
  tfoot: 'tr',
  tr: 'td'
};

/**
  @name Handlebars.helpers.collection
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('collection', function(path, options) {
  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = undefined;
  }

  var fn = options.fn;
  var data = options.data;
  var inverse = options.inverse;

  // If passed a path string, convert that into an object.
  // Otherwise, just default to the standard class.
  var collectionClass;
  collectionClass = path ? SC.getPath(path) : SC.CollectionView;
  sc_assert("%@ #collection: Could not find %@".fmt(data.view, path), !!collectionClass);

  var hash = options.hash, itemHash = {}, match;

  // Go through options passed to the {{collection}} helper and extract options
  // that configure item views instead of the collection itself.
  for (var prop in hash) {
    if (hash.hasOwnProperty(prop)) {
      match = prop.match(/^item(.)(.*)$/);

      if(match) {
        // Convert itemShouldFoo -> shouldFoo
        itemHash[match[1].toLowerCase() + match[2]] = hash[prop];
        // Delete from hash as this will end up getting passed to the
        // {{view}} helper method.
        delete hash[prop];
      }
    }
  }

  var tagName = hash.tagName || get(collectionClass, 'proto').tagName;
  var childTag = SC.Handlebars.CONTAINER_MAP[tagName];

  if (childTag) {
    itemHash.tagName = itemHash.tagName || childTag;
  }

  if (fn) {
    itemHash.template = fn;
    delete options.fn;
  }

  if (inverse) {
    hash.emptyView = SC.View.extend({
      template: inverse
    });
  }

  if (hash.preserveContext) {
    itemHash.templateContext = function() {
      return get(this, 'content');
    }.property('content');
    delete hash.preserveContext;
  }

  var itemViewClass = get(collectionClass, 'proto').itemViewClass;
  hash.itemViewClass = SC.Handlebars.ViewHelper.viewClassFromHTMLOptions(itemViewClass, itemHash);

  return Handlebars.helpers.view.call(this, collectionClass, options);
});

/**
  @name Handlebars.helpers.each
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
Handlebars.registerHelper('each', function(path, options) {
  options.hash.contentBinding = SC.Binding.from('parentView.'+path).oneWay();
  options.hash.preserveContext = true;
  return Handlebars.helpers.collection.call(this, null, options);
});



})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

// Find templates stored in the head tag as script tags and make them available
// to SC.CoreView in the global SC.TEMPLATES object.

SC.$(document).ready(function() {
  SC.$('head script[type="text/html"]').each(function() {
    // Get a reference to the script tag
    var script = SC.$(this);

    // Get the name of the script, used by SC.View's templateName property.
    // First look for data-template-name attribute, then fall back to its
    // id if no name is found.
    var templateName = script.attr('data-template-name') || script.attr('id');

    if (!templateName) {
      throw new SC.Error("Template found without a name specified." +
                         "Please provide a data-template-name attribute.\n" +
                         script.html());
    }

    SC.TEMPLATES[templateName] = SC.Handlebars.compile(script.html());

    // Remove script tag from DOM
    script.remove();
  });

  // Finds templates stored inline in the HTML document, instantiates a new
  // view, and replaces the script tag holding the template with the new
  // view's DOM representation.
  //
  // Users can optionally specify a custom view subclass to use by setting the
  // data-view attribute of the script tag.

  SC.$('body script[type="text/html"]').each(function() {
    var script = SC.$(this),
        template = SC.Handlebars.compile(script.html()),
        viewPath = script.attr('data-view');

    var view = viewPath ? SC.getPath(viewPath) : SC.View;

    view = view.create({
      template: template
    });

    view.createElement();
    script.replaceWith(view.$());
  });
});

})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})();


(function() {
// ==========================================================================
// Project:   SproutCore Handlebar Views
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================








})();
