var test = require("tape")
var h = require("hyperscript")

var FormData = require("../index")

test("FormData works with functions", function (assert) {
    var elements = {
        foo: h("input")
        , bar: function () {
            return elements.foo.value + "~42"
        }
    }

    elements.foo.value = "hi!"

    var data = FormData(elements)

    assert.deepEqual(data, {
        foo: "hi!"
        , bar: "hi!~42"
    })

    assert.end()
})
