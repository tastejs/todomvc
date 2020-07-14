"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const http = require('http');

const https = require('https');

const WebSocket = require('ws');

const generateCertificate = require('./utils/generateCertificate');

const getCertificate = require('./utils/getCertificate');

const logger = require('@parcel/logger');

class HMRServer {
  start(options = {}) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield new Promise(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(function* (resolve) {
          if (!options.https) {
            _this.server = http.createServer();
          } else if (typeof options.https === 'boolean') {
            _this.server = https.createServer(generateCertificate(options));
          } else {
            _this.server = https.createServer((yield getCertificate(options.https)));
          }

          let websocketOptions = {
            server: _this.server
          };

          if (options.hmrHostname) {
            websocketOptions.origin = `${options.https ? 'https' : 'http'}://${options.hmrHostname}`;
          }

          _this.wss = new WebSocket.Server(websocketOptions);

          _this.server.listen(options.hmrPort, resolve);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());

      _this.wss.on('connection', ws => {
        ws.onerror = _this.handleSocketError;

        if (_this.unresolvedError) {
          ws.send(JSON.stringify(_this.unresolvedError));
        }
      });

      _this.wss.on('error', _this.handleSocketError);

      return _this.wss._server.address().port;
    })();
  }

  stop() {
    this.wss.close();
    this.server.close();
  }

  emitError(err) {
    let _logger$formatError = logger.formatError(err),
        message = _logger$formatError.message,
        stack = _logger$formatError.stack; // store the most recent error so we can notify new connections
    // and so we can broadcast when the error is resolved


    this.unresolvedError = {
      type: 'error',
      error: {
        message,
        stack
      }
    };
    this.broadcast(this.unresolvedError);
  }

  emitUpdate(assets, reload = false) {
    if (this.unresolvedError) {
      this.unresolvedError = null;
      this.broadcast({
        type: 'error-resolved'
      });
    }

    const shouldReload = reload || assets.some(asset => asset.hmrPageReload);

    if (shouldReload) {
      this.broadcast({
        type: 'reload'
      });
    } else {
      this.broadcast({
        type: 'update',
        assets: assets.map(asset => {
          let deps = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = asset.depAssets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              let _step$value = (0, _slicedToArray2.default)(_step.value, 2),
                  dep = _step$value[0],
                  depAsset = _step$value[1];

              deps[dep.name] = depAsset.id;
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

          return {
            id: asset.id,
            type: asset.type,
            generated: asset.generated,
            deps: deps
          };
        })
      });
    }
  }

  handleSocketError(err) {
    if (err.error.code === 'ECONNRESET') {
      // This gets triggered on page refresh, ignore this
      return;
    }

    logger.warn(err);
  }

  broadcast(msg) {
    const json = JSON.stringify(msg);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.wss.clients[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let ws = _step2.value;
        ws.send(json);
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
  }

}

module.exports = HMRServer;