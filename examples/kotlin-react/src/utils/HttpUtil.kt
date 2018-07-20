package utils

import org.w3c.fetch.RequestInit
import org.w3c.xhr.XMLHttpRequest
import kotlin.browser.window
import kotlin.js.Json
import kotlin.js.Promise
import kotlin.js.json

fun <T> makeRequest(method: String, url: String, body: Any? = null, parse: (dynamic) -> T): Promise<T?> {


    return Promise { resolve, reject ->


        window.fetch(url, object: RequestInit {
            override var method: String? = method
            override var headers: dynamic = json("Content-Type" to "application/json")

            override var body: dynamic = if (body != null) {
                JSON.stringify(body)
            } else {
                null
            }
        }).then { r ->
            if (method != "DELETE") {
                r.json().then { obj ->
                    resolve(parse(obj))
                }
            } else {
                resolve(null)
            }
        }
    }
}

fun makeSyncRequest(method: String, url: String, body: Any? = null): dynamic? {

    val xhr = XMLHttpRequest()
    xhr.open(method, url, false)
    xhr.setRequestHeader("Content-Type", "application/json")
    if (body != null) {
        xhr.send(JSON.stringify(body))
    } else {
        xhr.send()
    }

    return JSON.parse(xhr.responseText) as dynamic
}