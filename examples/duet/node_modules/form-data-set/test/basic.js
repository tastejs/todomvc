var test = require("tape")
var document = require("global/document")

var FormData = require("../index")

test("formData returns stuff", function (assert) {
    var elements = stubElements()

    var data = FormData(elements)

    assert.deepEqual(data, {
        checkbox: false
        , fields: {
            textfield: ""
            , textarea: ""
        }
    })
    assert.end()
})

test("formData with actual values", function (assert) {
    var elements = stubElements({
        checkbox: true
        , textfield: "some text"
        , textarea: "a ton of text"
    })

    var data = FormData(elements)

    assert.deepEqual(data, {
        checkbox: true
        , fields: {
            textfield: "some text"
            , textarea: "a ton of text"
        }
    })
    assert.end()
})

function stubElements(data) {
    var elements = {
        checkbox: elem("input")
        , fields: {
            textfield: elem("input")
            , textarea: elem("textarea")
        }
    }
    data = data || {}

    if (data.textfield) {
        elements.fields.textfield.value = data.textfield
    }

    if (data.checkbox) {
        elements.checkbox.checked = true
    }

    if (data.textarea) {
        elements.fields.textarea.value = data.textarea
    }

    elements.checkbox.type = "checkbox"

    return elements
}

function elem(tagName) {
    return document.createElement(tagName || "div")
}
