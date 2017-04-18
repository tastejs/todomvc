var document = require("global/document")
var console = require("console")

var FormData = require("../index")

var elements = createElements()

document.body.appendChild(elements.root)

elements.root.addEventListener("change", function (ev) {
    console.log("formdata", FormData(elements))
})

// DOM Verbosity
function createElements() {
    var template = "\
        <div>\
            <div><label> Text field \
                <input class='input' />\
            </label></div>\
            <div><label> Text area \
                <textarea class='textarea'></textarea>\
            </label></div>\
            <div><label> Check box \
                <input type='checkbox' class='checkbox'></input>\
            </label></div>\
        </div>"

    var container = document.createElement("div")
    container.innerHTML = template.trim()
    var root = container.firstChild

    return {
        root: root
        , input: root.getElementsByClassName("input")[0]
        , textarea: root.getElementsByClassName("textarea")[0]
        , checkbox: root.getElementsByClassName("checkbox")[0]
    }
}
