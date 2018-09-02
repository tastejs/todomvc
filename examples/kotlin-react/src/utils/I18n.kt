package utils

import app.AppOptions
import kotlin.js.Json
import kotlin.math.absoluteValue

object I18n {

    private val enUSLanguage = mapOf(
        "todos" to "todos",
        "What needs to be done?" to "What needs to be done?",
        "Mark all as complete" to "Mark all as complete",
        "Double-click to edit a todo" to "Double-click to edit a todo",
        "Created by" to "Created by",
        "Part of" to "Part of",
        "item left" to "item left",
        "PLURALS" to mapOf(
            "item left" to "items left"
        )
    )

    private val languageMap = mapOf("en_US" to enUSLanguage)


    private val currentLanguage: Map<String, *> by lazy {
        languageMap[AppOptions.language]!!
    }


    fun translate(key: String): String {
        return (currentLanguage[key] as String?) ?: "***$key"
    }

    fun pluralize(key: String): String {
        return ((currentLanguage["PLURALS"] as Map<*, *>)[key] as String?) ?: "***$key***"
    }
}

fun String.translate(): String {
    return I18n.translate(this)
}

fun String.pluralize(count: Int): String {
    return if (count.absoluteValue == 1) {
        this
    } else {
        I18n.pluralize(this)
    }
}