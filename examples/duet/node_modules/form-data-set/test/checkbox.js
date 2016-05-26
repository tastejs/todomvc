var test = require("tape")
var h = require("hyperscript")

var FormData = require("../index")

test("FormData works with <input type='checkbox' value='val' />",
function (assert) {
    var elements = {
        foo: [
            checkbox("bar", "foo"),
            checkbox("bar", "bar", true),
            checkbox("bar", "baz", true)
        ]
    }

    var data = FormData(elements)

    assert.deepEqual(data, {
        foo: ["bar", "baz"]
    })

    assert.end()
})

function checkbox(name, value, checked) {
    return h("input", {
        type: "checkbox",
        name: name,
        value: value,
        checked: !!checked
    })
}