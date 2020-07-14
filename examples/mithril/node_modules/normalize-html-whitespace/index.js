"use strict";
const pattern = /[\f\n\r\t\v ]{2,}/g;
const replacement = " ";

const normalize = str => str.replace(pattern, replacement);

module.exports = normalize;
