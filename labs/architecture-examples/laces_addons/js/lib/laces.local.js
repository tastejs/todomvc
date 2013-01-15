(function(window) {

"use strict";

var localStorage = window.localStorage;

function init(Laces) {

// Laces Local Model constructor.
//
// A Laces Local Model is a Model that automatically syncs itself to LocalStorage.
//
// key - The key to use for storing the LocalStorage data.
function LacesLocalModel(key) {

    var data = localStorage.getItem(key);
    var object = data && JSON.parse(data) || {};

    Laces.Model.call(this, object);

    this.bind("change", function() { localStorage.setItem(key, JSON.stringify(this)); });
}

LacesLocalModel.prototype = new Laces.Model();
LacesLocalModel.prototype.constructor = LacesLocalModel;

Laces.LocalModel = LacesLocalModel;


// Laces Local Array constructor.
//
// A Laces Local Array is a Laces Array that automatically syncs itself to LocalStorage.
//
// key - The key to use for storing the LocalStorage data.
function LacesLocalArray(key) {

    var data = localStorage.getItem(key);
    var elements = data && JSON.parse(data) || [];

    var array = Laces.Array.call(this);
    for (var i = 0, length = elements.length; i < length; i++) {
        array.push(elements[i]);
    }

    array.bind("change", function() { localStorage.setItem(key, JSON.stringify(this)); });

    return array;
}

Laces.LocalArray = LacesLocalArray;

}

if (typeof define === "function" && define.amd) {
    define(function(require) {
        var Laces = require("laces");
        init(Laces);
        return Laces;
    });
} else {
    var Laces = { Model: window.LacesModel, Map: window.LacesMap, Array: window.LacesArray };
    init(Laces);
    window.LacesLocalModel = Laces.LocalModel;
    window.LacesLocalArray = Laces.LocalArray;
}

})(this);
