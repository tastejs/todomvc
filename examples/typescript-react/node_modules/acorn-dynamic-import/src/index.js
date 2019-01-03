/* eslint-disable no-underscore-dangle */
import { tokTypes as tt } from 'acorn';

export const DynamicImportKey = 'Import';

// NOTE: This allows `yield import()` to parse correctly.
tt._import.startsExpr = true;

function parseDynamicImport() {
  const node = this.startNode();
  this.next();
  if (this.type !== tt.parenL) {
    this.unexpected();
  }
  return this.finishNode(node, DynamicImportKey);
}

function parenAfter() {
  return /^(\s|\/\/.*|\/\*[^]*?\*\/)*\(/.test(this.input.slice(this.pos));
}

export default function dynamicImport(Parser) {
  return class extends Parser {
    parseStatement(context, topLevel, exports) {
      if (this.type === tt._import && parenAfter.call(this)) {
        return this.parseExpressionStatement(this.startNode(), this.parseExpression());
      }
      return super.parseStatement(context, topLevel, exports);
    }

    parseExprAtom(refDestructuringErrors) {
      if (this.type === tt._import) {
        return parseDynamicImport.call(this);
      }
      return super.parseExprAtom(refDestructuringErrors);
    }
  };
}
