"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

const Asset = require('../Asset');

const postcss = require('postcss');

const valueParser = require('postcss-value-parser');

const postcssTransform = require('../transforms/postcss');

const CssSyntaxError = require('postcss/lib/css-syntax-error');

const SourceMap = require('../SourceMap');

const loadSourceMap = require('../utils/loadSourceMap');

const path = require('path');

const urlJoin = require('../utils/urlJoin');

const isURL = require('../utils/is-url');

const URL_RE = /url\s*\("?(?![a-z]+:)/;
const IMPORT_RE = /@import/;
const COMPOSES_RE = /composes:.+from\s*("|').*("|')\s*;?/;
const FROM_IMPORT_RE = /.+from\s*(?:"|')(.*)(?:"|')\s*;?/;
const PROTOCOL_RE = /^[a-z]+:/;

class CSSAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
    this.previousSourceMap = this.options.rendition ? this.options.rendition.map : null;
  }

  mightHaveDependencies() {
    return !/\.css$/.test(this.name) || IMPORT_RE.test(this.contents) || COMPOSES_RE.test(this.contents) || URL_RE.test(this.contents);
  }

  parse(code) {
    let root = postcss.parse(code, {
      from: this.name
    });
    return new CSSAst(code, root);
  }

  collectDependencies() {
    this.ast.root.walkAtRules('import', rule => {
      let params = valueParser(rule.params);

      let _params$nodes = (0, _toArray2.default)(params.nodes),
          name = _params$nodes[0],
          media = _params$nodes.slice(1);

      let dep;

      if (name.type === 'function' && name.value === 'url' && name.nodes.length) {
        name = name.nodes[0];
      }

      dep = name.value;

      if (!dep) {
        throw new Error('Could not find import name for ' + rule);
      }

      if (PROTOCOL_RE.test(dep)) {
        return;
      } // If this came from an inline <style> tag, don't inline the imported file. Replace with the correct URL instead.
      // TODO: run CSSPackager on inline style tags.


      let inlineHTML = this.options.rendition && this.options.rendition.inlineHTML;

      if (inlineHTML) {
        name.value = this.addURLDependency(dep, {
          loc: rule.source.start
        });
        rule.params = params.toString();
      } else {
        media = valueParser.stringify(media).trim();
        this.addDependency(dep, {
          media,
          loc: rule.source.start
        });
        rule.remove();
      }

      this.ast.dirty = true;
    });
    this.ast.root.walkDecls(decl => {
      if (URL_RE.test(decl.value)) {
        let parsed = valueParser(decl.value);
        let dirty = false;
        parsed.walk(node => {
          if (node.type === 'function' && node.value === 'url' && node.nodes.length) {
            let url = this.addURLDependency(node.nodes[0].value, {
              loc: decl.source.start
            });

            if (!isURL(url)) {
              url = urlJoin(this.options.publicURL, url);
            }

            dirty = node.nodes[0].value !== url;
            node.nodes[0].value = url;
          }
        });

        if (dirty) {
          decl.value = parsed.toString();
          this.ast.dirty = true;
        }
      }

      if (decl.prop === 'composes' && FROM_IMPORT_RE.test(decl.value)) {
        let parsed = valueParser(decl.value);
        parsed.walk(node => {
          if (node.type === 'string') {
            const _FROM_IMPORT_RE$exec = FROM_IMPORT_RE.exec(decl.value),
                  _FROM_IMPORT_RE$exec2 = (0, _slicedToArray2.default)(_FROM_IMPORT_RE$exec, 2),
                  importPath = _FROM_IMPORT_RE$exec2[1];

            this.addURLDependency(importPath, {
              dynamic: false,
              loc: decl.source.start
            });
          }
        });
      }
    });
  }

  pretransform() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this.options.sourceMaps && !_this.previousSourceMap) {
        _this.previousSourceMap = yield loadSourceMap(_this);
      }
    })();
  }

  transform() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield postcssTransform(_this2);
    })();
  }

  getCSSAst() {
    // Converts the ast to a CSS ast if needed, so we can apply postcss transforms.
    if (!(this.ast instanceof CSSAst)) {
      this.ast = CSSAsset.prototype.parse.call(this, this.ast.render(this.name));
    }

    return this.ast.root;
  }

  generate() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let css;

      if (_this3.ast) {
        let result = _this3.ast.render(_this3.name);

        css = result.css;
        if (result.map) _this3.sourceMap = result.map;
      } else {
        css = _this3.contents;
      }

      let js = '';

      if (_this3.options.hmr) {
        _this3.addDependency('_css_loader');

        js = `
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      `;
      }

      if (_this3.cssModules) {
        js += 'module.exports = ' + JSON.stringify(_this3.cssModules, null, 2) + ';';
      }

      if (_this3.options.sourceMaps) {
        if (_this3.sourceMap) {
          _this3.sourceMap = yield new SourceMap().addMap(_this3.sourceMap);
        }

        if (_this3.previousSourceMap) {
          _this3.previousSourceMap.sources = _this3.previousSourceMap.sources.map(v => path.join(path.dirname(_this3.relativeName), _this3.previousSourceMap.sourceRoot || '', v));

          if (_this3.sourceMap) {
            _this3.sourceMap = yield new SourceMap().extendSourceMap(_this3.previousSourceMap, _this3.sourceMap);
          } else {
            _this3.sourceMap = yield new SourceMap().addMap(_this3.previousSourceMap);
          }
        } else if (!_this3.sourceMap) {
          _this3.sourceMap = new SourceMap().generateEmptyMap(_this3.relativeName, css);
        }
      }

      return [{
        type: 'css',
        value: css,
        cssModules: _this3.cssModules,
        map: _this3.sourceMap
      }, {
        type: 'js',
        value: js,
        hasDependencies: false
      }];
    })();
  }

  generateErrorMessage(err) {
    // Wrap the error in a CssSyntaxError if needed so we can generate a code frame
    if (err.loc && !err.showSourceCode) {
      err = new CssSyntaxError(err.message, err.loc.line, err.loc.column, this.contents);
    }

    err.message = err.reason || err.message;
    err.loc = {
      line: err.line,
      column: err.column
    };

    if (err.showSourceCode) {
      err.codeFrame = err.showSourceCode();
      err.highlightedCodeFrame = err.showSourceCode(true);
    }

    return err;
  }

}

class CSSAst {
  constructor(css, root) {
    this.css = css;
    this.root = root;
    this.dirty = false;
  }

  render(name) {
    if (this.dirty) {
      let _this$root$toResult = this.root.toResult({
        to: name,
        map: {
          inline: false,
          annotation: false,
          sourcesContent: true
        }
      }),
          css = _this$root$toResult.css,
          map = _this$root$toResult.map;

      this.css = css;
      return {
        css: this.css,
        map: map ? map.toJSON() : null
      };
    }

    return {
      css: this.css
    };
  }

}

module.exports = CSSAsset;