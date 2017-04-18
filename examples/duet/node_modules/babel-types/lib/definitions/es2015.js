/*istanbul ignore next*/"use strict";

var /*istanbul ignore next*/_index = require("./index");

/*istanbul ignore next*/
var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore next*/(0, _index2.default)("AssignmentPattern", {
  visitor: ["left", "right"],
  aliases: ["Pattern", "LVal"],
  fields: {
    left: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    },
    right: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Decorator")))
    }
  }
}); /* eslint max-len: 0 */

/*istanbul ignore next*/(0, _index2.default)("ArrayPattern", {
  visitor: ["elements", "typeAnnotation"],
  aliases: ["Pattern", "LVal"],
  fields: {
    elements: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")))
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Decorator")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ArrowFunctionExpression", {
  builder: ["params", "body", "async"],
  visitor: ["params", "body", "returnType"],
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: {
    params: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("LVal")))
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("BlockStatement", "Expression")
    },
    async: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean"),
      default: false
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ClassBody", {
  visitor: ["body"],
  fields: {
    body: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("ClassMethod", "ClassProperty")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ClassDeclaration", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: ["id", "body", "superClass", "mixins", "typeParameters", "superTypeParameters", "implements", "decorators"],
  aliases: ["Scopable", "Class", "Statement", "Declaration", "Pureish"],
  fields: {
    id: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Decorator")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ClassExpression", {
  inherits: "ClassDeclaration",
  aliases: ["Scopable", "Class", "Expression", "Pureish"],
  fields: {
    id: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Decorator")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    source: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("StringLiteral")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ExportDefaultDeclaration", {
  visitor: ["declaration"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("FunctionDeclaration", "ClassDeclaration", "Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ExportNamedDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Declaration"),
      optional: true
    },
    specifiers: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("ExportSpecifier")))
    },
    source: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("StringLiteral"),
      optional: true
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ExportSpecifier", {
  visitor: ["local", "exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    },
    exported: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ForOfStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("VariableDeclaration", "LVal")
    },
    right: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Statement")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ImportDeclaration", {
  visitor: ["specifiers", "source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration"],
  fields: {
    specifiers: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier")))
    },
    source: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("StringLiteral")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ImportDefaultSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ImportNamespaceSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ImportSpecifier", {
  visitor: ["local", "imported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    },
    imported: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    // todo: limit to new.target
    meta: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("string")
    },
    property: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("string")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: ["kind", "key", "params", "body", "computed", "static"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  fields: {
    kind: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("string"), /*istanbul ignore next*/(0, _index.assertOneOf)("get", "set", "method", "constructor")),
      default: "method"
    },
    computed: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean")
    },
    static: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean")
    },
    key: { /*istanbul ignore next*/
      validate: function validate(node, key, val) {
        var expectedTypes = node.computed ? ["Expression"] : ["Identifier", "StringLiteral", "NumericLiteral"];
        /*istanbul ignore next*/_index.assertNodeType.apply( /*istanbul ignore next*/undefined, expectedTypes)(node, key, val);
      }
    },
    params: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("LVal")))
    },
    body: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("BlockStatement")
    },
    generator: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean")
    },
    async: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ObjectPattern", {
  visitor: ["properties", "typeAnnotation"],
  aliases: ["Pattern", "LVal"],
  fields: {
    properties: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("RestProperty", "Property")))
    },
    decorators: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Decorator")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("SpreadElement", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("Super", {
  aliases: ["Expression"]
});

/*istanbul ignore next*/(0, _index2.default)("TaggedTemplateExpression", {
  visitor: ["tag", "quasi"],
  aliases: ["Expression"],
  fields: {
    tag: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    },
    quasi: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("TemplateLiteral")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("TemplateElement", {
  builder: ["value", "tail"],
  fields: {
    value: {
      // todo: flatten `raw` into main node
    },
    tail: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean"),
      default: false
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("TemplateLiteral", {
  visitor: ["quasis", "expressions"],
  aliases: ["Expression", "Literal"],
  fields: {
    quasis: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("TemplateElement")))
    },
    expressions: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("YieldExpression", {
  builder: ["argument", "delegate"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    delegate: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean"),
      default: false
    },
    argument: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});