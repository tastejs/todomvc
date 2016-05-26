/*istanbul ignore next*/"use strict";

var /*istanbul ignore next*/_index = require("./index");

/*istanbul ignore next*/
var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore next*/(0, _index2.default)("AwaitExpression", {
  builder: ["argument"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("BindExpression", {
  visitor: ["object", "callee"],
  aliases: ["Expression"],
  fields: {
    // todo
  }
});

/*istanbul ignore next*/(0, _index2.default)("Decorator", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("DoExpression", {
  visitor: ["body"],
  aliases: ["Expression"],
  fields: {
    body: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("BlockStatement")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ExportDefaultSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("ExportNamespaceSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Identifier")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("RestProperty", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("LVal")
    }
  }
});

/*istanbul ignore next*/(0, _index2.default)("SpreadProperty", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  fields: {
    argument: {
      validate: /*istanbul ignore next*/(0, _index.assertNodeType)("Expression")
    }
  }
});