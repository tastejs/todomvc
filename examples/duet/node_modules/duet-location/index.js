var hashMatch     = require('hash-match');
var pathnameMatch = require('pathname-match');
var channel       = require('./channel');

var subscribers = [];

function subscribe(callback, isHashSubscriber) {
    if (typeof callback !== 'function') {
        return;
    }

    subscribers.push({
        callback: callback,
        isHashSubscriber: !!isHashSubscriber
    })

    channel.postMessageToMain({
        type: 'SUBSCRIBER',
        data: subscribers.length - 1
    });
}

function parseLocation(href) {
    var path, hash, splitHREF;

    path = pathnameMatch(href);

    if (!path.length) {
        path = '/';
    }

    hash = '';
    splitHREF = href.split('#');

    if (splitHREF.length > 1) {
        hash = hashMatch('#'.concat(splitHREF.slice(1).join('#')));
    }

    return {
        path: path,
        hash: hash
    }
}

function notify(subscriber, location) {
    if (!subscriber.isHashSubscriber) {
        subscribers.callback(location.path);
    } else if (location.hash) {
        subscriber.callback(location.hash);
    }
}

function notifyAll(location) {
    subscribers.forEach(function (subscriber) {
        notify(subscriber, location);
    });
}

function onSubscriber(data) {
    channel.postMessageToWorker({
        type: 'INITIAL',
        data: {
            subscriberKey: data,
            href: document.location.href
        }
    });
}

function onInitial(data) {
    notify(subscribers[data.subscriberKey], parseLocation(data.href));
}

function onChange(data) {
    if (subscribers.length > 0) {
        notifyAll(parseLocation(data));
    }
}

channel.on('SUBSCRIBER', onSubscriber);
channel.on('INITIAL', onInitial);
channel.on('CHANGE', onChange);

module.exports = subscribe;
