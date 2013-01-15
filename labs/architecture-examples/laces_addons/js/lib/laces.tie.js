(function(window, document, undefined) {

"use strict";

function init(Laces) {

// Laces Tie constructor.
//
// model - The Laces Model to which we want to tie the template. May be a Laces
//         Map too.
// template - The template object used for rendering. May be a compiled
//            Handlebars.js, Hogan.js or Underscore.js template, or a plain HTML
//            string.
// options - Optional options object.
function LacesTie(model, template, options) {

    options = options || {};
    var editEvent = options.editEvent || "dblclick";
    var saveEvent = options.saveEvent || "change";
    var saveOnEnter = (options.saveOnEnter !== false);
    var saveOnBlur = (options.saveOnBlur !== false);

    var bindings = [];

    function clearBindings() {

        for (var i = 0, length = bindings.length; i < length; i++) {
            var binding = bindings[i];
            binding.parent.unbind(binding);
        }
        bindings = [];
    }

    function reference(lacesProperty) {
        var inversed = false;
        if (lacesProperty.substr(0, 1) === "!") {
            inversed = true;
            lacesProperty = lacesProperty.substr(1);
        }

        var parts = lacesProperty.split(".");
        var part, value, parent;
        for (var i = 0, length = parts.length; i < length; i++) {
            parent = value || model;

            part = parts[i];
            var bracketOpen = part.indexOf("[");
            if (bracketOpen > -1 && part.indexOf("]") === part.length - 1) {
                var subscript = part.substring(bracketOpen + 1, part.length - 1);
                parent = parent[part.substr(0, bracketOpen)];
                part = subscript;
            }

            value = parent[part];
            if (value === undefined || value === null) {
                break;
            }
        }

        if (inversed) {
            value = !value;
        }
        return { propertyName: part, value: value, parent: parent };
    }

    function getLaces(node) {
        var laces = node.getAttribute("data-laces");
        if (laces && laces.substr(0, 1) === "{" && laces.substr(laces.length - 1) === "}") {
            var parts = laces.substr(1, laces.length - 2).split(",");
            var object = {}, r = /^\s+|\s+$/g;
            for (var i = 0, length = parts.length; i < length; i++) {
                var keyValue = parts[i].split(":");
                object[keyValue[0].replace(r, "")] = keyValue[1].replace(r, "");
            }
            return object;
        }
        return undefined;
    }

    function update(element, lacesProperty, defaultValue) {
        var value = reference(lacesProperty).value;
        if (element.tagName === "INPUT") {
            element.value = value || defaultValue;
        } else {
            element.textContent = value || defaultValue;
        }
    }

    function updateVisibility(element, lacesProperty) {
        var value = !!reference(lacesProperty).value;
        element.style.display = (value ? "" : "none");
    }

    function updateChecked(element, lacesProperty) {
        element.checked = !!reference(lacesProperty).value;
    }

    function process(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        var laces = getLaces(node), binding, ref;

        var lacesProperty = (laces ? laces.property : node.getAttribute("data-laces-property"));
        if (lacesProperty) {
            var lacesDefault = (laces ? laces["default"] : node.getAttribute("data-laces-default"));
            if (lacesDefault === undefined) {
                lacesDefault = (node.getAttribute("type") === "number") ? 0 : "";
            }

            binding = function() {
                update(node, lacesProperty, lacesDefault);
            }
            bindings.push(binding);

            ref = reference(lacesProperty);
            binding.parent = ref.parent;
            if (ref.parent instanceof Laces.Model) {
                ref.parent.bind("change:" + ref.propertyName, binding);
            } else {
                ref.parent.bind("change", binding);
            }

            if (node.tagName === "INPUT") {
                node.addEventListener(saveEvent, function() {
                    var newRef = reference(lacesProperty);
                    newRef.parent[newRef.propertyName] = node.value;
                });
            }

            update(node, lacesProperty, lacesDefault);

            var lacesEditable = (laces ? laces.editable : node.getAttribute("data-laces-editable"));
            if (lacesEditable === "true") {
                node.addEventListener(editEvent, function() {
                    var parent = node.parentNode;
                    var input = document.createElement("input");
                    input.setAttribute("type", "text");
                    input.setAttribute("value", node.textContent);
                    input.setAttribute("class", node.getAttribute("class"))

                    function saveHandler() {
                        var newRef = reference(lacesProperty);
                        newRef.parent[newRef.propertyName] = input.value;
                        parent.insertBefore(node, input.nextSibling);
                        if (saveOnBlur) {
                            input.removeEventListener("blur", blurHandler);
                        }
                        parent.removeChild(input);
                    }
                    function blurHandler() {
                        input.removeEventListener(saveEvent, saveHandler);
                        saveHandler();
                    }

                    input.addEventListener(saveEvent, saveHandler);
                    if (saveOnEnter) {
                        input.addEventListener("keypress", function(event) {
                            if (event.keyCode === 13) {
                                input.removeEventListener(saveEvent, saveHandler);
                                saveHandler();
                                event.preventDefault();
                            }
                        });
                    }
                    if (saveOnBlur) {
                        input.addEventListener("blur", blurHandler);
                    }

                    parent.insertBefore(input, node.nextSibling);
                    parent.removeChild(node);
                    input.focus();
                });
            }
        }

        var lacesVisible = (laces ? laces.visible : node.getAttribute("data-laces-visible"));
        if (lacesVisible) {
            binding = function() {
                updateVisibility(node, lacesVisible);
            }
            bindings.push(binding);

            ref = reference(lacesVisible);
            binding.parent = ref.parent;
            if (ref.parent instanceof Laces.Model) {
                ref.parent.bind("change:" + ref.propertyName, binding);
            } else {
                ref.parent.bind("change", binding);
            }

            updateVisibility(node, lacesVisible);
        }

        var lacesChecked = (laces ? laces.checked : node.getAttribute("data-laces-checked"));
        if (lacesChecked) {
            binding = function() {
                updateChecked(node, lacesChecked);
            }
            bindings.push(binding);

            ref = reference(lacesChecked);
            binding.parent = ref.parent;
            if (ref.parent instanceof Laces.Model) {
                ref.parent.bind("change:" + ref.propertyName, binding);
            } else {
                ref.parent.bind("change", binding);
            }

            updateChecked(node, lacesChecked);
        }

        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            process(node.childNodes[i]);
        }
    }

    function parse(html) {
        var fragment = document.createDocumentFragment();
        var div = document.createElement("div");
        div.innerHTML = html;
        while (div.firstChild) {
            var child = div.firstChild;
            process(child);
            fragment.appendChild(child);
        }
        return fragment;
    }

    if (template.render) {
        this.render = function() { clearBindings(); return parse(template.render(model)); };
    } else if (typeof template === "function") {
        this.render = function() { clearBindings(); return parse(template(model)); };
    } else if (typeof template === "string") {
        this.render = function() { clearBindings(); return parse(template); };
    } else {
        model.log("Unknown template type: " + template);
    }
}

Laces.Tie = LacesTie;

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
    window.LacesTie = Laces.Tie;
}

})(this, document);
