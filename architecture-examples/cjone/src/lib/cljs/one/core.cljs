(ns ^{:doc "Core ClojureScript One library."}
  one.core
  (:require [goog.style :as style]))

(defprotocol Startable
  (start [this]))

(defprotocol Disposable
  (dispose [this]))

(defn get-style
  "Use alternate strategies to get around the fact that
  `goog.style.getComputedStyle` returns an empty string for IE8 and
  below."
  [element style]
  (some #(let [v (%)] (when (not= "" v) v))
        [#(style/getComputedStyle element style)
         #(style/getStyle element style)
         #(aget (.-currentStyle element) style)
         #(throw (js/Error. (str "Could not retrieve value for style " style)))]))

