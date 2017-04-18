/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.File = File;
/*istanbul ignore next*/exports.Program = Program;
/*istanbul ignore next*/exports.BlockStatement = BlockStatement;
/*istanbul ignore next*/exports.Noop = Noop;
/*istanbul ignore next*/exports.Directive = Directive;
/*istanbul ignore next*/exports.DirectiveLiteral = DirectiveLiteral;
function File(node) {
  this.print(node.program, node);
}

function Program(node) {
  this.printInnerComments(node, false);

  this.printSequence(node.directives, node);
  if (node.directives && node.directives.length) this.newline();

  this.printSequence(node.body, node);
}

function BlockStatement(node) {
  this.push("{");
  this.printInnerComments(node);
  if (node.body.length) {
    this.newline();

    this.printSequence(node.directives, node, { indent: true });
    if (node.directives && node.directives.length) this.newline();

    this.printSequence(node.body, node, { indent: true });
    if (!this.format.retainLines && !this.format.concise) this.removeLast("\n");

    this.source("end", node.loc);
    this.rightBrace();
  } else {
    this.source("end", node.loc);
    this.push("}");
  }
}

function Noop() {}

function Directive(node) {
  this.print(node.value, node);
  this.semicolon();
}

function DirectiveLiteral(node) {
  this.push(this._stringLiteral(node.value));
}