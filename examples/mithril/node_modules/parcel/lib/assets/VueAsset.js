"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const md5 = require('../utils/md5');

const _require = require('terser'),
      minify = _require.minify;

const t = require('@babel/types');

class VueAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  parse(code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Is being used in component-compiler-utils, errors if not installed...
      _this.vueTemplateCompiler = yield localRequire('vue-template-compiler', _this.name);
      _this.vue = yield localRequire('@vue/component-compiler-utils', _this.name);
      return _this.vue.parse({
        source: code,
        needMap: _this.options.sourceMaps,
        filename: _this.relativeName,
        // Used for sourcemaps
        sourceRoot: '',
        // Used for sourcemaps. Override so it doesn't use cwd
        compiler: _this.vueTemplateCompiler
      });
    })();
  }

  generate() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let descriptor = _this2.ast;
      let parts = [];

      if (descriptor.script) {
        parts.push({
          type: descriptor.script.lang || 'js',
          value: descriptor.script.content,
          map: descriptor.script.map
        });
      }

      if (descriptor.template) {
        parts.push({
          type: descriptor.template.lang || 'html',
          value: descriptor.template.content.trim()
        });
      }

      if (descriptor.styles) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = descriptor.styles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let style = _step.value;
            parts.push({
              type: style.lang || 'css',
              value: style.content.trim(),
              modules: !!style.module
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return parts;
    })();
  }

  postProcess(generated) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let result = [];

      let hasScoped = _this3.ast.styles.some(s => s.scoped);

      let id = md5(_this3.name).slice(-6);
      let scopeId = hasScoped ? `data-v-${id}` : null;
      let optsVar = '$' + id; // Generate JS output.

      let js = _this3.ast.script ? generated[0].value : '';
      let supplemental = ''; // TODO: make it possible to process this code with the normal scope hoister

      if (_this3.options.scopeHoist) {
        optsVar = `$${t.toIdentifier(_this3.id)}$export$default`;

        if (!js.includes(optsVar)) {
          optsVar = `$${t.toIdentifier(_this3.id)}$exports`;

          if (!js.includes(optsVar)) {
            supplemental += `
            var ${optsVar} = {};
          `;
            _this3.cacheData.isCommonJS = true;
          }
        }
      } else {
        supplemental += `
        var ${optsVar} = exports.default || module.exports;
      `;
      }

      supplemental += `
      if (typeof ${optsVar} === 'function') {
        ${optsVar} = ${optsVar}.options;
      }
    `;
      supplemental += _this3.compileTemplate(generated, scopeId, optsVar);
      supplemental += _this3.compileCSSModules(generated, optsVar);
      supplemental += _this3.compileHMR(generated, optsVar);

      if (_this3.options.minify && !_this3.options.scopeHoist) {
        let _minify = minify(supplemental, {
          toplevel: true
        }),
            code = _minify.code,
            error = _minify.error;

        if (error) {
          throw error;
        }

        supplemental = code;

        if (supplemental) {
          supplemental = `\n(function(){${supplemental}})();`;
        }
      }

      js += supplemental;

      if (js) {
        result.push({
          type: 'js',
          value: js,
          map: _this3.options.sourceMaps && _this3.ast.script && generated[0].map
        });
      }

      let css = _this3.compileStyle(generated, scopeId);

      if (css) {
        result.push({
          type: 'css',
          value: css
        });
      }

      return result;
    })();
  }

  compileTemplate(generated, scopeId, optsVar) {
    let html = generated.find(r => r.type === 'html');

    if (html) {
      let isFunctional = this.ast.template.attrs.functional;
      let template = this.vue.compileTemplate({
        source: html.value,
        filename: this.relativeName,
        compiler: this.vueTemplateCompiler,
        isProduction: this.options.production,
        isFunctional,
        compilerOptions: {
          scopeId
        }
      });

      if (Array.isArray(template.errors) && template.errors.length >= 1) {
        throw new Error(template.errors[0]);
      }

      return `
        /* template */
        Object.assign(${optsVar}, (function () {
          ${template.code}
          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: ${JSON.stringify(scopeId)},
            functional: ${JSON.stringify(isFunctional)}
          };
        })());
      `;
    }

    return '';
  }

  compileCSSModules(generated, optsVar) {
    let cssRenditions = generated.filter(r => r.type === 'css');
    let cssModulesCode = '';
    this.ast.styles.forEach((style, index) => {
      if (style.module) {
        let cssModules = JSON.stringify(cssRenditions[index].cssModules);
        let name = style.module === true ? '$style' : style.module;
        cssModulesCode += `\nthis[${JSON.stringify(name)}] = ${cssModules};`;
      }
    });

    if (cssModulesCode) {
      cssModulesCode = `function hook(){${cssModulesCode}\n}`;
      let isFunctional = this.ast.template && this.ast.template.attrs.functional;

      if (isFunctional) {
        return `
          /* css modules */
          (function () {
            ${cssModulesCode}
            ${optsVar}._injectStyles = hook;
            var originalRender = ${optsVar}.render;
            ${optsVar}.render = function (h, context) {
              hook.call(context);
              return originalRender(h, context);
            };
          })();
        `;
      } else {
        return `
          /* css modules */
          (function () {
            ${cssModulesCode}
            ${optsVar}.beforeCreate = ${optsVar}.beforeCreate ? ${optsVar}.beforeCreate.concat(hook) : [hook];
          })();
        `;
      }
    }

    return '';
  }

  compileStyle(generated, scopeId) {
    return generated.filter(r => r.type === 'css').reduce((p, r, i) => {
      let css = r.value;
      let scoped = this.ast.styles[i].scoped; // Process scoped styles if needed.

      if (scoped) {
        let _this$vue$compileStyl = this.vue.compileStyle({
          source: css,
          filename: this.relativeName,
          id: scopeId,
          scoped
        }),
            code = _this$vue$compileStyl.code,
            errors = _this$vue$compileStyl.errors;

        if (errors.length) {
          throw errors[0];
        }

        css = code;
      }

      return p + css;
    }, '');
  }

  compileHMR(generated, optsVar) {
    if (!this.options.hmr) {
      return '';
    }

    this.addDependency('vue-hot-reload-api');
    this.addDependency('vue');
    let cssHMR = '';

    if (this.ast.styles.length) {
      cssHMR = `
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      `;
    }

    let isFunctional = this.ast.template && this.ast.template.attrs.functional;
    return `
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('${optsVar}', ${optsVar});
          } else {
            api.${isFunctional ? 'rerender' : 'reload'}('${optsVar}', ${optsVar});
          }
        }

        ${cssHMR}
      }
    })();`;
  }

}

module.exports = VueAsset;