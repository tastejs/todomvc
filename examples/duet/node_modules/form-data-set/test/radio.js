var test = require("tape")
var h = require("hyperscript")

var FormData = require("../index")

test("FormData works with <input type='radio' />", function (assert) {
    var elements = {
        foo: {
            foo: radio("foo", "foo", true)
            , bar: radio("foo", "bar")
            , baz: radio("foo", "baz")
        }
        , bar: [
            radio("bar", "foo")
            , radio("bar", "bar", true)
            , radio("bar", "baz")
        ]
    }

    var data = FormData(elements)

    assert.deepEqual(data, {
        foo: "foo"
        , bar: "bar"
    })

    assert.end()
})

function radio(name, value, checked) {
    return h("input", {
        type: "radio"
        , name: name
        , value: value
        , checked: checked || false
    })
}
