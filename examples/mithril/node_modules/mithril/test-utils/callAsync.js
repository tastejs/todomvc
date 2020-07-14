"use strict"

module.exports = typeof setImmediate === "function" ? setImmediate : setTimeout
