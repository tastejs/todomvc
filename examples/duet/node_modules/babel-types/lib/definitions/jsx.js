/*istanbul ignore next*/"use strict";

var /*istanbul ignore next*/_index = require("./index");

/*istanbul ignore next*/
var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore next*/(0, _index2.default)("JSXAttribute", {
  visitor: ["name", "value"],
  aliases: ["JSX", "Immutable"],
  fields: {
    name: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXIdentifier", "JSXNamespacedName")
    },
    value: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXElement", "StringLiteral", "JSXExpressionContainer")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXClosingElement", {
  visitor: ["name"],
  aliases: ["JSX", "Immutable"],
  fields: {
    name: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXIdentifier", "JSXMemberExpression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXElement", {
  builder: ["openingElement", "closingElement", "children", "selfClosing"],
  visitor: ["openingElement", "children", "closingElement"],
  aliases: ["JSX", "Immutable", "Expression"],
  fields: {
    openingElement: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXOpeningElement")
    },
    closingElement: {
      optional: true,
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXClosingElement")
    },
    children: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("JSXText", "JSXExpressionContainer", "JSXElement")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXEmptyExpression", {
  aliases: ["JSX", "Expression"]
});

/*istanbul ignore next*/(0, _index2.default)("JSXExpressionContainer", {
  visitor: ["expression"],
  aliases: ["JSX", "Immutable"],
  fields: {
    expression: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXIdentifier", {
  builder: ["name"],
  aliases: ["JSX", "Expression"],
  fields: {
    name: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("string")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXMemberExpression", {
  visitor: ["object", "property"],
  aliases: ["JSX", "Expression"],
  fields: {
    object: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXMemberExpression", "JSXIdentifier")
    },
    property: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXIdentifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXNamespacedName", {
  visitor: ["namespace", "name"],
  aliases: ["JSX"],
  fields: {
    namespace: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXIdentifier")
    },
    name: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXIdentifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXOpeningElement", {
  builder: ["name", "attributes", "selfClosing"],
  visitor: ["name", "attributes"],
  aliases: ["JSX", "Immutable"],
  fields: {
    name: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("JSXIdentifier", "JSXMemberExpression")
    },
    selfClosing: {
      default: false,
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("boolean")
    },
    attributes: {
      validate: /*istanbul ignore next*/(0, _index.chain)( /*istanbul ignore next*/(0, _index.assertValueType)("array"), /*istanbul ignore next*/(0, _index.assertEach)( /*istanbul ignore next*/(0, _index.assertNodeType)("JSXAttribute", "JSXSpreadAttribute")))
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXSpreadAttribute", {
  visitor: ["argument"],
  aliases: ["JSX"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("JSXText", {
  aliases: ["JSX"],
  builder: ["value"],
  fields: {
    value: {
      validate: /*istanbul ignore next*/(0, _index.assertValueType)("string")
    }
  }
});