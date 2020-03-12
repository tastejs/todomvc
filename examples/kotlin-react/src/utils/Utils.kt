package utils

import org.w3c.dom.events.Event
import kotlin.js.Date

val Event.value: String
    get() = this.currentTarget.asDynamic().value as String

fun Date.toLocalString(): String {
    return this.toLocaleDateString(kotlin.browser.window.navigator.language)
}

enum class Keys {
    Enter,
    Escape;

    companion object {
        fun fromString(keyName: String): Keys? {
            return if(Keys.values().map { key -> key.toString() }.contains(keyName)) {
                Keys.valueOf(keyName)
            } else {
                null
            }
        }
    }
}