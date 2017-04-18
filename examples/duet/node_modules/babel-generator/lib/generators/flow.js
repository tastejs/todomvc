/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.TypeParameterDeclaration = exports.NumericLiteralTypeAnnotation = exports.GenericTypeAnnotation = exports.ClassImplements = undefined;
exports.AnyTypeAnnotation = AnyTypeAnnotation;
/*istanbul ignore next*/exports.ArrayTypeAnnotation = ArrayTypeAnnotation;
/*istanbul ignore next*/exports.BooleanTypeAnnotation = BooleanTypeAnnotation;
/*istanbul ignore next*/exports.BooleanLiteralTypeAnnotation = BooleanLiteralTypeAnnotation;
/*istanbul ignore next*/exports.NullLiteralTypeAnnotation = NullLiteralTypeAnnotation;
/*istanbul ignore next*/exports.DeclareClass = DeclareClass;
/*istanbul ignore next*/exports.DeclareFunction = DeclareFunction;
/*istanbul ignore next*/exports.DeclareInterface = DeclareInterface;
/*istanbul ignore next*/exports.DeclareModule = DeclareModule;
/*istanbul ignore next*/exports.DeclareTypeAlias = DeclareTypeAlias;
/*istanbul ignore next*/exports.DeclareVariable = DeclareVariable;
/*istanbul ignore next*/exports.ExistentialTypeParam = ExistentialTypeParam;
/*istanbul ignore next*/exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
/*istanbul ignore next*/exports.FunctionTypeParam = FunctionTypeParam;
/*istanbul ignore next*/exports.InterfaceExtends = InterfaceExtends;
/*istanbul ignore next*/exports._interfaceish = _interfaceish;
/*istanbul ignore next*/exports.InterfaceDeclaration = InterfaceDeclaration;
/*istanbul ignore next*/exports.IntersectionTypeAnnotation = IntersectionTypeAnnotation;
/*istanbul ignore next*/exports.MixedTypeAnnotation = MixedTypeAnnotation;
/*istanbul ignore next*/exports.NullableTypeAnnotation = NullableTypeAnnotation;
/*istanbul ignore next*/
var _types = require("./types");

Object.defineProperty(exports, "NumericLiteralTypeAnnotation", {
  enumerable: true,
  get: function get() {
    return _types.NumericLiteral;
  }
});
/*istanbul ignore next*/exports.NumberTypeAnnotation = NumberTypeAnnotation;
/*istanbul ignore next*/exports.StringLiteralTypeAnnotation = StringLiteralTypeAnnotation;
/*istanbul ignore next*/exports.StringTypeAnnotation = StringTypeAnnotation;
/*istanbul ignore next*/exports.ThisTypeAnnotation = ThisTypeAnnotation;
/*istanbul ignore next*/exports.TupleTypeAnnotation = TupleTypeAnnotation;
/*istanbul ignore next*/exports.TypeofTypeAnnotation = TypeofTypeAnnotation;
/*istanbul ignore next*/exports.TypeAlias = TypeAlias;
/*istanbul ignore next*/exports.TypeAnnotation = TypeAnnotation;
/*istanbul ignore next*/exports.TypeParameterInstantiation = TypeParameterInstantiation;
/*istanbul ignore next*/exports.ObjectTypeAnnotation = ObjectTypeAnnotation;
/*istanbul ignore next*/exports.ObjectTypeCallProperty = ObjectTypeCallProperty;
/*istanbul ignore next*/exports.ObjectTypeIndexer = ObjectTypeIndexer;
/*istanbul ignore next*/exports.ObjectTypeProperty = ObjectTypeProperty;
/*istanbul ignore next*/exports.QualifiedTypeIdentifier = QualifiedTypeIdentifier;
/*istanbul ignore next*/exports.UnionTypeAnnotation = UnionTypeAnnotation;
/*istanbul ignore next*/exports.TypeCastExpression = TypeCastExpression;
/*istanbul ignore next*/exports.VoidTypeAnnotation = VoidTypeAnnotation;

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function AnyTypeAnnotation() {
  this.push("any");
} /* eslint max-len: 0 */

function ArrayTypeAnnotation(node) {
  this.print(node.elementType, node);
  this.push("[");
  this.push("]");
}

function BooleanTypeAnnotation() {
  this.push("bool");
}

function BooleanLiteralTypeAnnotation(node) {
  this.push(node.value ? "true" : "false");
}

function NullLiteralTypeAnnotation() {
  this.push("null");
}

function DeclareClass(node) {
  this.push("declare class ");
  this._interfaceish(node);
}

function DeclareFunction(node) {
  this.push("declare function ");
  this.print(node.id, node);
  this.print(node.id.typeAnnotation.typeAnnotation, node);
  this.semicolon();
}

function DeclareInterface(node) {
  this.push("declare ");
  this.InterfaceDeclaration(node);
}

function DeclareModule(node) {
  this.push("declare module ");
  this.print(node.id, node);
  this.space();
  this.print(node.body, node);
}

function DeclareTypeAlias(node) {
  this.push("declare ");
  this.TypeAlias(node);
}

function DeclareVariable(node) {
  this.push("declare var ");
  this.print(node.id, node);
  this.print(node.id.typeAnnotation, node);
  this.semicolon();
}

function ExistentialTypeParam() {
  this.push("*");
}

function FunctionTypeAnnotation(node, parent) {
  this.print(node.typeParameters, node);
  this.push("(");
  this.printList(node.params, node);

  if (node.rest) {
    if (node.params.length) {
      this.push(",");
      this.space();
    }
    this.push("...");
    this.print(node.rest, node);
  }

  this.push(")");

  // this node type is overloaded, not sure why but it makes it EXTREMELY annoying
  if (parent.type === "ObjectTypeProperty" || parent.type === "ObjectTypeCallProperty" || parent.type === "DeclareFunction") {
    this.push(":");
  } else {
    this.space();
    this.push("=>");
  }

  this.space();
  this.print(node.returnType, node);
}

function FunctionTypeParam(node) {
  this.print(node.name, node);
  if (node.optional) this.push("?");
  this.push(":");
  this.space();
  this.print(node.typeAnnotation, node);
}

function InterfaceExtends(node) {
  this.print(node.id, node);
  this.print(node.typeParameters, node);
}

/*istanbul ignore next*/exports.ClassImplements = InterfaceExtends;
/*istanbul ignore next*/exports.GenericTypeAnnotation = InterfaceExtends;
function _interfaceish(node) {
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  if (node.extends.length) {
    this.push(" extends ");
    this.printJoin(node.extends, node, { separator: ", " });
  }
  if (node.mixins && node.mixins.length) {
    this.push(" mixins ");
    this.printJoin(node.mixins, node, { separator: ", " });
  }
  this.space();
  this.print(node.body, node);
}

function InterfaceDeclaration(node) {
  this.push("interface ");
  this._interfaceish(node);
}

function IntersectionTypeAnnotation(node) {
  this.printJoin(node.types, node, { separator: " & " });
}

function MixedTypeAnnotation() {
  this.push("mixed");
}

function NullableTypeAnnotation(node) {
  this.push("?");
  this.print(node.typeAnnotation, node);
}

function NumberTypeAnnotation() {
  this.push("number");
}

function StringLiteralTypeAnnotation(node) {
  this.push(this._stringLiteral(node.value));
}

function StringTypeAnnotation() {
  this.push("string");
}

function ThisTypeAnnotation() {
  this.push("this");
}

function TupleTypeAnnotation(node) {
  this.push("[");
  this.printJoin(node.types, node, { separator: ", " });
  this.push("]");
}

function TypeofTypeAnnotation(node) {
  this.push("typeof ");
  this.print(node.argument, node);
}

function TypeAlias(node) {
  this.push("type ");
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  this.space();
  this.push("=");
  this.space();
  this.print(node.right, node);
  this.semicolon();
}

function TypeAnnotation(node) {
  this.push(":");
  this.space();
  if (node.optional) this.push("?");
  this.print(node.typeAnnotation, node);
}

function TypeParameterInstantiation(node) {
  /*istanbul ignore next*/
  var _this = this;

  this.push("<");
  this.printJoin(node.params, node, {
    separator: ", ",
    iterator: function /*istanbul ignore next*/iterator(node) {
      /*istanbul ignore next*/_this.print(node.typeAnnotation, node);
    }
  });
  this.push(">");
}

/*istanbul ignore next*/exports.TypeParameterDeclaration = TypeParameterInstantiation;
function ObjectTypeAnnotation(node) {
  /*istanbul ignore next*/
  var _this2 = this;

  this.push("{");
  var props = node.properties.concat(node.callProperties, node.indexers);

  if (props.length) {
    this.space();

    this.printJoin(props, node, {
      separator: false,
      indent: true,
      iterator: function /*istanbul ignore next*/iterator() {
        if (props.length !== 1) {
          /*istanbul ignore next*/_this2.semicolon();
          /*istanbul ignore next*/_this2.space();
        }
      }
    });

    this.space();
  }

  this.push("}");
}

function ObjectTypeCallProperty(node) {
  if (node.static) this.push("static ");
  this.print(node.value, node);
}

function ObjectTypeIndexer(node) {
  if (node.static) this.push("static ");
  this.push("[");
  this.print(node.id, node);
  this.push(":");
  this.space();
  this.print(node.key, node);
  this.push("]");
  this.push(":");
  this.space();
  this.print(node.value, node);
}

function ObjectTypeProperty(node) {
  if (node.static) this.push("static ");
  this.print(node.key, node);
  if (node.optional) this.push("?");
  if (!t.isFunctionTypeAnnotation(node.value)) {
    this.push(":");
    this.space();
  }
  this.print(node.value, node);
}

function QualifiedTypeIdentifier(node) {
  this.print(node.qualification, node);
  this.push(".");
  this.print(node.id, node);
}

function UnionTypeAnnotation(node) {
  this.printJoin(node.types, node, { separator: " | " });
}

function TypeCastExpression(node) {
  this.push("(");
  this.print(node.expression, node);
  this.print(node.typeAnnotation, node);
  this.push(")");
}

function VoidTypeAnnotation() {
  this.push("void");
}