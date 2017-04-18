module.exports = function duetChannel(namespace, callback) {
    var _postMessageToMain = null;
    var _postMessageToWorker = null;
    var mainQueue = [];
    var workerQueue = [];
    var messageHandlers = {};

    function connectMain(postMessage) {
        _postMessageToWorker = postMessage;

        if (typeof callback === 'function') {
            callback('main');
        }

        while (workerQueue.length) {
            _postMessageToWorker(workerQueue.shift());
        }

        workerQueue = null;
    }

    function connectWorker(postMessage) {
        _postMessageToMain = postMessage;

        if (typeof callback === 'function') {
            callback('worker');
        }

        while (mainQueue.length) {
            _postMessageToMain(mainQueue.shift());
        }

        mainQueue = null;
    }

    function postMessageToMain(message) {
        if (typeof _postMessageToMain === 'function') {
            return _postMessageToMain(message);
        }

        mainQueue.push(message);
    }

    function postMessageToWorker(message) {
        if (typeof _postMessageToWorker === 'function') {
            return _postMessageToWorker(message);
        }

        workerQueue.push(message);
    }

    function handleMessage(type, data) {
        var messageHandler = messageHandlers[type];

        if (messageHandler != null) {
            messageHandler(data);
        }
    }

    function on(type, messageHandler) {
        messageHandlers[type] = messageHandler;
    }

    return {
        // Used by duet
        namespace: namespace,
        connectMain: connectMain,
        connectWorker: connectWorker,
        handleMessage: handleMessage,

        // Used by plugin
        postMessageToMain: postMessageToMain,
        postMessageToWorker: postMessageToWorker,
        on: on
    };
};
