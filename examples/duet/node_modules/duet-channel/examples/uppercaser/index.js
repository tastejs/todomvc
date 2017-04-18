var channel = require('./channel');

function uppercaser(text) {
    channel.postMessageToMain({
        type: 'TEXT',
        data: text
    });
}

channel.on('TEXT', function (text) {
    channel.postMessageToWorker({
        type: 'UPPER_TEXT',
        data: text.toUpperCase()
    });
});

channel.on('UPPER_TEXT', function (upperText) {
    console.log(upperText);
});

module.exports = uppercaser;
