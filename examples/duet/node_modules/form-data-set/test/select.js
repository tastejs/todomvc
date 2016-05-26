var test = require("tape")
var h = require("hyperscript")

var FormData = require("../index")
var getFormData = require("../element")

test("FormData works with <select> elements", function (assert) {
    var elements = {
        foo: h("select", [
            h("option", { value: "one" })
            , h("option", { value: "two", selected: true })
            , h("option", { value: "three" })
        ])
    }

    var data = FormData(elements)

    assert.deepEqual(data, {
        foo: "two"
    })

    assert.end()
})

test("getFormData works when root element has a name", function(assert) {
    var element = h("select", {
        name: "foo"
    }, [
        h("option", { value: "one" })
        , h("option", { value: "two", selected: true })
    ])

    var data = getFormData(element)

    assert.deepEqual(data, {
        foo: "two"
    })

    assert.end()
})