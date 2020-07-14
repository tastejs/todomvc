"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actionTypes = {
    equals: "",
    element: "~",
    start: "^",
    end: "$",
    any: "*",
    not: "!",
    hyphen: "|",
};
function stringify(token) {
    return token.map(stringifySubselector).join(", ");
}
exports.default = stringify;
function stringifySubselector(token) {
    return token.map(stringifyToken).join("");
}
function stringifyToken(token) {
    switch (token.type) {
        // Simple types
        case "child":
            return " > ";
        case "parent":
            return " < ";
        case "sibling":
            return " ~ ";
        case "adjacent":
            return " + ";
        case "descendant":
            return " ";
        case "universal":
            return "*";
        case "tag":
            return escapeName(token.name);
        case "pseudo-element":
            return "::" + escapeName(token.name);
        case "pseudo":
            if (token.data === null)
                return ":" + escapeName(token.name);
            if (typeof token.data === "string") {
                return ":" + escapeName(token.name) + "(" + token.data + ")";
            }
            return ":" + escapeName(token.name) + "(" + stringify(token.data) + ")";
        case "attribute":
            if (token.action === "exists") {
                return "[" + escapeName(token.name) + "]";
            }
            if (token.name === "id" &&
                token.action === "equals" &&
                !token.ignoreCase) {
                return "#" + escapeName(token.value);
            }
            if (token.name === "class" &&
                token.action === "element" &&
                !token.ignoreCase) {
                return "." + escapeName(token.value);
            }
            return "[" + escapeName(token.name) + actionTypes[token.action] + "='" + escapeName(token.value) + "'" + (token.ignoreCase ? "i" : "") + "]";
        default:
            throw new Error("Unknown type");
    }
}
function escapeName(str) {
    //TODO
    return str;
}
