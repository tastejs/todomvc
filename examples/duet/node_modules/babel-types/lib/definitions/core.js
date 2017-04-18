/*istanbul ignore next*/"use strict";

var /*istanbul ignore next*/_index = require("../index");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_index);

var /*istanbul ignore next*/_constants = require("../constants");

var /*istanbul ignore next*/_index2 = require("./index");

/*istanbul ignore next*/
var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*istanbul ignore next*/(0, _index3.default)("ArrayExpression", {
  fields: {
    elements: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeOrValueType)("null", "Expression", "SpreadElement"))),
      default: []
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
}); /* eslint max-len: 0 */

/*istanbul ignore next*/(0, _index3.default)("AssignmentExpression", {
  fields: {
    operator: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("string")
    },
    left: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("LVal")
    },
    right: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  },
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: /*istanbul ignore next*/_index2.assertOneOf.apply( /*istanbul ignore next*/undefined, /*istanbul ignore next*/_constants.BINARY_OPERATORS)
    },
    left: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    right: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("Directive", {
  visitor: ["value"],
  fields: {
    value: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("DirectiveLiteral")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("DirectiveLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("string")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("BlockStatement", {
  builder: ["body", "directives"],
  visitor: ["directives", "body"],
  fields: {
    directives: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Directive"))),
      default: []
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block", "Statement"]
});

/*istanbul ignore next*/(0, _index3.default)("BreakStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});

/*istanbul ignore next*/(0, _index3.default)("CallExpression", {
  visitor: ["callee", "arguments"],
  fields: {
    callee: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    arguments: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression", "SpreadElement")))
    }
  },
  aliases: ["Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("CatchClause", {
  visitor: ["param", "body"],
  fields: {
    param: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Identifier")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    }
  },
  aliases: ["Scopable"]
});

/*istanbul ignore next*/(0, _index3.default)("ConditionalExpression", {
  visitor: ["test", "consequent", "alternate"],
  fields: {
    test: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    consequent: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    alternate: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression", "Conditional"]
});

/*istanbul ignore next*/(0, _index3.default)("ContinueStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});

/*istanbul ignore next*/(0, _index3.default)("DebuggerStatement", {
  aliases: ["Statement"]
});

/*istanbul ignore next*/(0, _index3.default)("DoWhileStatement", {
  visitor: ["test", "body"],
  fields: {
    test: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")
    }
  },
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"]
});

/*istanbul ignore next*/(0, _index3.default)("EmptyStatement", {
  aliases: ["Statement"]
});

/*istanbul ignore next*/(0, _index3.default)("ExpressionStatement", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  },
  aliases: ["Statement", "ExpressionWrapper"]
});

/*istanbul ignore next*/(0, _index3.default)("File", {
  builder: ["program", "comments", "tokens"],
  visitor: ["program"],
  fields: {
    program: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Program")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("ForInStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("VariableDeclaration", "LVal")
    },
    right: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("ForStatement", {
  visitor: ["init", "test", "update", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
  fields: {
    init: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("VariableDeclaration", "Expression"),
      optional: true
    },
    test: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression"),
      optional: true
    },
    update: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression"),
      optional: true
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("FunctionDeclaration", {
  builder: ["id", "params", "body", "generator", "async"],
  visitor: ["id", "params", "body", "returnType", "typeParameters"],
  fields: {
    id: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Identifier")
    },
    params: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("LVal")))
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    },
    generator: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    },
    async: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    }
  },
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Statement", "Pureish", "Declaration"]
});

/*istanbul ignore next*/(0, _index3.default)("FunctionExpression", {
  inherits: "FunctionDeclaration",
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: {
    id: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Identifier"),
      optional: true
    },
    params: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("LVal")))
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    },
    generator: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    },
    async: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("Identifier", {
  builder: ["name"],
  visitor: ["typeAnnotation"],
  aliases: ["Expression", "LVal"],
  fields: {
    name: { /*istanbul ignore next*/
      validate: function validate(node, key, val) {
        if (!t.isValidIdentifier(val)) {
          // todo
        }
      }
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Decorator")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("IfStatement", {
  visitor: ["test", "consequent", "alternate"],
  aliases: ["Statement", "Conditional"],
  fields: {
    test: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    consequent: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")
    },
    alternate: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("LabeledStatement", {
  visitor: ["label", "body"],
  aliases: ["Statement"],
  fields: {
    label: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Identifier")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("StringLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

/*istanbul ignore next*/(0, _index3.default)("NumericLiteral", {
  builder: ["value"],
  deprecatedAlias: "NumberLiteral",
  fields: {
    value: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("number")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

/*istanbul ignore next*/(0, _index3.default)("NullLiteral", {
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

/*istanbul ignore next*/(0, _index3.default)("BooleanLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

/*istanbul ignore next*/(0, _index3.default)("RegExpLiteral", {
  builder: ["pattern", "flags"],
  deprecatedAlias: "RegexLiteral",
  aliases: ["Expression", "Literal"],
  fields: {
    pattern: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("string")
    },
    flags: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("string"),
      default: ""
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("LogicalExpression", {
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
  fields: {
    operator: {
      validate: /*istanbul ignore next*/_index2.assertOneOf.apply( /*istanbul ignore next*/undefined, /*istanbul ignore next*/_constants.LOGICAL_OPERATORS)
    },
    left: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    right: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("MemberExpression", {
  builder: ["object", "property", "computed"],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    property: { /*istanbul ignore next*/
      validate: function validate(node, key, val) {
        var expectedType = node.computed ? "Expression" : "Identifier";
        /*istanbul ignore next*/(0, _index2.assertNodeType)(expectedType)(node, key, val);
      }
    },
    computed: {
      default: false
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("NewExpression", {
  visitor: ["callee", "arguments"],
  aliases: ["Expression"],
  fields: {
    callee: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    arguments: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression", "SpreadElement")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("Program", {
  visitor: ["directives", "body"],
  builder: ["body", "directives"],
  fields: {
    directives: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Directive"))),
      default: []
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block", "FunctionParent"]
});

/*istanbul ignore next*/(0, _index3.default)("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("ObjectMethod", "ObjectProperty", "SpreadProperty")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed"],
  fields: {
    kind: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("string"), /*istanbul ignore next*/(0, _index2.assertOneOf)("method", "get", "set")),
      default: "method"
    },
    computed: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean"),
      default: false
    },
    key: { /*istanbul ignore next*/
      validate: function validate(node, key, val) {
        var expectedTypes = node.computed ? ["Expression"] : ["Identifier", "StringLiteral", "NumericLiteral"];
        /*istanbul ignore next*/_index2.assertNodeType.apply( /*istanbul ignore next*/undefined, expectedTypes)(node, key, val);
      }
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Decorator")))
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    },
    generator: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    },
    async: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean")
    }
  },
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["UserWhitespacable", "Function", "Scopable", "BlockParent", "FunctionParent", "Method", "ObjectMember"]
});

/*istanbul ignore next*/(0, _index3.default)("ObjectProperty", {
  builder: ["key", "value", "computed", "shorthand", "decorators"],
  fields: {
    computed: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean"),
      default: false
    },
    key: { /*istanbul ignore next*/
      validate: function validate(node, key, val) {
        var expectedTypes = node.computed ? ["Expression"] : ["Identifier", "StringLiteral", "NumericLiteral"];
        /*istanbul ignore next*/_index2.assertNodeType.apply( /*istanbul ignore next*/undefined, expectedTypes)(node, key, val);
      }
    },
    value: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    shorthand: {
      validate: /*istanbul ignore next*/(0, _index2.assertValueType)("boolean"),
      default: false
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Decorator"))),
      optional: true
    }
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property", "ObjectMember"]
});

/*istanbul ignore next*/(0, _index3.default)("RestElement", {
  visitor: ["argument", "typeAnnotation"],
  aliases: ["LVal"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("LVal")
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Decorator")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("ReturnStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression"),
      optional: true
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("SequenceExpression", {
  visitor: ["expressions"],
  fields: {
    expressions: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")))
    }
  },
  aliases: ["Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("SwitchCase", {
  visitor: ["test", "consequent"],
  fields: {
    test: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression"),
      optional: true
    },
    consequent: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("Statement")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    cases: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("SwitchCase")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("ThisExpression", {
  aliases: ["Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("ThrowStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  }
});

// todo: at least handler or finalizer should be set to be valid
/*istanbul ignore next*/(0, _index3.default)("TryStatement", {
  visitor: ["block", "handler", "finalizer"],
  aliases: ["Statement"],
  fields: {
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    },
    handler: {
      optional: true,
      handler: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    },
    finalizer: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("UnaryExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: true
    },
    argument: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    operator: {
      validate: /*istanbul ignore next*/_index2.assertOneOf.apply( /*istanbul ignore next*/undefined, /*istanbul ignore next*/_constants.UNARY_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["UnaryLike", "Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("UpdateExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: false
    },
    argument: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    operator: {
      validate: /*istanbul ignore next*/_index2.assertOneOf.apply( /*istanbul ignore next*/undefined, /*istanbul ignore next*/_constants.UPDATE_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["Expression"]
});

/*istanbul ignore next*/(0, _index3.default)("VariableDeclaration", {
  builder: ["kind", "declarations"],
  visitor: ["declarations"],
  aliases: ["Statement", "Declaration"],
  fields: {
    kind: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("string"), /*istanbul ignore next*/(0, _index2.assertOneOf)("var", "let", "const"))
    },
    declarations: {
      validate: /*istanbul ignore next*/(0, _index2.chain)( /*istanbul ignore next*/(0, _index2.assertValueType)("array"), /*istanbul ignore next*/(0, _index2.assertEach)( /*istanbul ignore next*/(0, _index2.assertNodeType)("VariableDeclarator")))
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("LVal")
    },
    init: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("WhileStatement", {
  visitor: ["test", "body"],
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
  fields: {
    test: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement", "Statement")
    }
  }
});

/*istanbul ignore next*/(0, _index3.default)("WithStatement", {
  visitor: ["object", "body"],
  aliases: ["Statement"],
  fields: {
    object: {
      object: /*istanbul ignore next*/(0, _index2.assertNodeType)("Expression")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index2.assertNodeType)("BlockStatement", "Statement")
    }
  }
});