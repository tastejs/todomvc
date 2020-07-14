"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const api = require('posthtml/lib/api');

const urlJoin = require('../utils/urlJoin');

const render = require('posthtml-render');

const posthtmlTransform = require('../transforms/posthtml');

const htmlnanoTransform = require('../transforms/htmlnano');

const isURL = require('../utils/is-url'); // A list of all attributes that may produce a dependency
// Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes


const ATTRS = {
  src: ['script', 'img', 'audio', 'video', 'source', 'track', 'iframe', 'embed'],
  href: ['link', 'a', 'use'],
  srcset: ['img', 'source'],
  poster: ['video'],
  'xlink:href': ['use', 'image'],
  content: ['meta'],
  data: ['object']
}; // A list of metadata that should produce a dependency
// Based on:
// - http://schema.org/
// - http://ogp.me
// - https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
// - https://msdn.microsoft.com/en-us/library/dn255024.aspx

const META = {
  property: ['og:image', 'og:image:url', 'og:image:secure_url', 'og:audio', 'og:audio:secure_url', 'og:video', 'og:video:secure_url'],
  name: ['twitter:image', 'msapplication-square150x150logo', 'msapplication-square310x310logo', 'msapplication-square70x70logo', 'msapplication-wide310x150logo', 'msapplication-TileImage', 'msapplication-config'],
  itemprop: ['image', 'logo', 'screenshot', 'thumbnailUrl', 'contentUrl', 'downloadUrl']
};
const SCRIPT_TYPES = {
  'application/javascript': 'js',
  'text/javascript': 'js',
  'application/json': false,
  'application/ld+json': 'jsonld',
  'text/html': false
}; // Options to be passed to `addURLDependency` for certain tags + attributes

const OPTIONS = {
  a: {
    href: {
      entry: true
    }
  },
  iframe: {
    src: {
      entry: true
    }
  }
};

class HTMLAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'html';
    this.isAstDirty = false;
    this.hmrPageReload = true;
  }

  parse(code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let res = yield posthtmlTransform.parse(code, _this);
      res.walk = api.walk;
      res.match = api.match;
      return res;
    })();
  }

  processSingleDependency(path, opts) {
    let assetPath = this.addURLDependency(path, opts);

    if (!isURL(assetPath)) {
      assetPath = urlJoin(this.options.publicURL, assetPath);
    }

    return assetPath;
  }

  collectSrcSetDependencies(srcset, opts) {
    const newSources = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = srcset.split(',')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const source = _step.value;
        const pair = source.trim().split(' ');
        if (pair.length === 0) continue;
        pair[0] = this.processSingleDependency(pair[0], opts);
        newSources.push(pair.join(' '));
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

    return newSources.join(',');
  }

  getAttrDepHandler(attr) {
    if (attr === 'srcset') {
      return this.collectSrcSetDependencies;
    }

    return this.processSingleDependency;
  }

  collectDependencies() {
    let ast = this.ast; // Add bundled dependencies from plugins like posthtml-extend or posthtml-include, if any

    if (ast.messages) {
      ast.messages.forEach(message => {
        if (message.type === 'dependency') {
          this.addDependency(message.file, {
            includedInParent: true
          });
        }
      });
    }

    ast.walk(node => {
      if (node.attrs) {
        if (node.tag === 'meta') {
          if (!Object.keys(node.attrs).some(attr => {
            let values = META[attr];
            return values && values.includes(node.attrs[attr]) && node.attrs.content !== '';
          })) {
            return node;
          }
        }

        if (node.tag === 'link' && node.attrs.rel === 'manifest' && node.attrs.href) {
          node.attrs.href = this.getAttrDepHandler('href').call(this, node.attrs.href, {
            entry: true
          });
          this.isAstDirty = true;
          return node;
        }

        for (let attr in node.attrs) {
          const attrVal = node.attrs[attr];

          if (!attrVal) {
            continue;
          } // Check for virtual paths


          if (node.tag === 'a' && attrVal.lastIndexOf('.') < 1) {
            continue;
          }

          let elements = ATTRS[attr];

          if (elements && elements.includes(node.tag)) {
            let depHandler = this.getAttrDepHandler(attr);
            let options = OPTIONS[node.tag];
            node.attrs[attr] = depHandler.call(this, attrVal, options && options[attr]);
            this.isAstDirty = true;
          }
        }
      }

      return node;
    });
  }

  pretransform() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield posthtmlTransform.transform(_this2);
    })();
  }

  transform() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this3.options.minify) {
        yield htmlnanoTransform(_this3);
      }
    })();
  }

  generate() {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Extract inline <script> and <style> tags for processing.
      let parts = [];

      if (_this4.ast) {
        _this4.ast.walk(node => {
          if (node.tag === 'script' || node.tag === 'style') {
            let value = node.content && node.content.join('').trim();

            if (value) {
              let type;

              if (node.tag === 'style') {
                if (node.attrs && node.attrs.type) {
                  type = node.attrs.type.split('/')[1];
                } else {
                  type = 'css';
                }
              } else if (node.attrs && node.attrs.type) {
                // Skip JSON
                if (SCRIPT_TYPES[node.attrs.type] === false) {
                  return node;
                }

                if (SCRIPT_TYPES[node.attrs.type]) {
                  type = SCRIPT_TYPES[node.attrs.type];
                } else {
                  type = node.attrs.type.split('/')[1];
                }
              } else {
                type = 'js';
              }

              parts.push({
                type,
                value,
                inlineHTML: true,
                meta: {
                  type: 'tag',
                  node
                }
              });
            }
          } // Process inline style attributes.


          if (node.attrs && node.attrs.style) {
            parts.push({
              type: 'css',
              value: node.attrs.style,
              meta: {
                type: 'attr',
                node
              }
            });
          }

          return node;
        });
      }

      return parts;
    })();
  }

  postProcess(generated) {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Replace inline scripts and styles with processed results.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = generated[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let rendition = _step2.value;
          let _rendition$meta = rendition.meta,
              type = _rendition$meta.type,
              node = _rendition$meta.node;

          if (type === 'attr' && rendition.type === 'css') {
            node.attrs.style = rendition.value;
          } else if (type === 'tag') {
            if (rendition.isMain) {
              node.content = rendition.value;
            } // Delete "type" attribute, since CSS and JS are the defaults.
            // Unless it's application/ld+json


            if (node.attrs && (node.tag === 'style' || node.attrs.type && SCRIPT_TYPES[node.attrs.type] === 'js')) {
              delete node.attrs.type;
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return [{
        type: 'html',
        value: render(_this5.ast)
      }];
    })();
  }

}

module.exports = HTMLAsset;