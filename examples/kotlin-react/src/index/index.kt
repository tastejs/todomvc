package index

import app.*
import kotlinext.js.*
import org.w3c.dom.events.EventListener
import react.dom.*
import kotlin.browser.*

fun main(args: Array<String>) {
    requireAll(require.context("src", true, js("/\\.css$/")))

    AppOptions.language = "en_US"

    fun render(route: String = "list", parameters: Map<String, String>) {
        render(document.getElementById("root")) {
            app(route)
        }
    }

    fun renderByUrl() {
        val href = window.location.href

        if (!href.contains("?")) {
            render(parameters = emptyMap())
            return
        }

        val parametersString = href.split("?")[1]
        val parameters = parametersString.split("&")

        val map = mutableMapOf<String, String>()
        parameters.forEach { parameterString ->
            if (parameterString.contains("=")) {
                val params = parameterString.split("=")
                map[params[0]] = params[1]
            }
        }

        val route = map["route"]
        if (route != null) {
            render(route = route, parameters = map)
        } else {
            render(parameters = map)
        }
    }

    window.addEventListener("hashchange", EventListener {
        renderByUrl()
    })

    renderByUrl()

}
