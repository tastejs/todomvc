var channel = require('./channel');

var nextHandlerKey = 0;
var handlers = {};

function request(method, argA, argB) {
    var data = {method: method};

    if (typeof argA !== 'undefined') {

        data.argA = argA;

    }

    if (typeof argB === 'function') {

        data.handlerKey = nextHandlerKey++;

        handlers[data.handlerKey] = function (data) {
            argB(data.result);
        };

    } else {

        data.argB = String(argB);

    }

    channel.postMessageToMain({
        type: 'REQUEST',
        data: data
    });
}

function getOrSetItem(argA, argB) {
    request(typeof argB === 'function' ? 'getItem' : 'setItem', argA, argB);
}

function onRequest(data) {
    var result;

    if (typeof global.localStorage[data.method] === 'function') {
        result = global.localStorage[data.method](data.argA, data.argB);
    } else {
        result = global.localStorage[data.method];
    }

    if (data.handlerKey == null) {
        return;
    }

    return channel.postMessageToWorker({
        type: 'RESPONSE',
        data: {
            handlerKey: data.handlerKey,
            result: result
        }
    });
}

function onResponse(data) {
    var handler = handlers[data.handlerKey];

    if (handler != null) {
        handler(data);
    }

    delete handlers[data.handlerKey];
}

channel.on('REQUEST', onRequest);
channel.on('RESPONSE', onResponse);

module.exports = getOrSetItem;
module.exports.clear = request.bind(null, 'clear');
module.exports.getItem = request.bind(null, 'getItem');
module.exports.key = request.bind(null, 'key');
module.exports.removeItem = request.bind(null, 'removeItem');
module.exports.setItem = request.bind(null, 'setItem');

Object.defineProperty(module.exports, 'length', {
    enumerable: true,
    value: request.bind(null, 'length', undefined)
});
