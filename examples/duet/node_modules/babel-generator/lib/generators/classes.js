/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.ClassDeclaration = ClassDeclaration;
/*istanbul ignore next*/exports.ClassBody = ClassBody;
/*istanbul ignore next*/exports.ClassProperty = ClassProperty;
/*istanbul ignore next*/exports.ClassMethod = ClassMethod;
function ClassDeclaration(node) {
  this.printJoin(node.decorators, node, { separator: "" });
  this.push("class");

  if (node.id) {
    this.push(" ");
    this.print(node.id, node);
  }

  this.print(node.typeParameters, node);

  if (node.superClass) {
    this.push(" extends ");
    this.print(node.superClass, node);
    this.print(node.superTypeParameters, node);
  }

  if (node.implements) {
    this.push(" implements ");
    this.printJoin(node.implements, node, { separator: ", " });
  }

  this.space();
  this.print(node.body, node);
}

/*istanbul ignore next*/exports.ClassExpression = ClassDeclaration;
function ClassBody(node) {
  this.push("{");
  this.printInnerComments(node);
  if (node.body.length === 0) {
    this.push("}");
  } else {
    this.newline();

    this.indent();
    this.printSequence(node.body, node);
    this.dedent();

    this.rightBrace();
  }
}

function ClassProperty(node) {
  this.printJoin(node.decorators, node, { separator: "" });

  if (node.static) this.push("static ");
  this.print(node.key, node);
  this.print(node.typeAnnotation, node);
  if (node.value) {
    this.space();
    this.push("=");
    this.space();
    this.print(node.value, node);
  }
  this.semicolon();
}

function ClassMethod(node) {
  this.printJoin(node.decorators, node, { separator: "" });

  if (node.static) {
    this.push("static ");
  }

  if (node.kind === "constructorCall") {
    this.push("call ");
  }

  this._method(node);
}