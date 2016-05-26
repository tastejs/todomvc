var duetChannel = require('duet-channel');

function onclick(event) {
    if (event.target.localName !== 'a' ||
        event.target.href === undefined ||
        window.location.host !== event.target.host) {
        return;
    }

    event.preventDefault();

    channel.postMessageToWorker({
        type: 'CHANGE',
        data: event.target.href
    });

    window.history.pushState({}, null, event.target.href)
}

function onpopstate() {
    channel.postMessageToWorker({
        type: 'CHANGE',
        data: document.location.href
    });
}

function connected(counterpartName) {
    if (counterpartName !== 'main') {
        return;
    }

    window.onclick = onclick;
    window.onpopstate = onpopstate;
}

var channel = duetChannel('LOCATION', connected);

module.exports = channel;
