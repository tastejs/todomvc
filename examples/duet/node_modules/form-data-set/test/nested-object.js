var test = require("tape")
var h = require("hyperscript")

var FormData = require("../index")

test("formData works with nested objects", function (assert) {
    var elements = {
        foo: {
            bar: h("input", { value: "bar" })
            , baz: h("input", { value: "baz" })
        }
    }

    var data = FormData(elements)

    assert.deepEqual(data, {
        foo: {
            bar: "bar"
            , baz: "baz"
        }
    })

    assert.end()
})
