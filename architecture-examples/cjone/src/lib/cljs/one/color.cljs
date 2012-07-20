(ns ^{:doc "Provide support for working with colors. Wraps Google
  Closure's color support.  The `goog.color` namespace provides support for
  additional color formats."}
  one.color
  (:require [one.core :as core]
            [goog.string :as gstring]
            [goog.style :as style]
            [goog.color :as gcolor]
            [goog.color.alpha :as alpha]))

(defprotocol IColor
  (rgb [this] "Returns a vector `[r g b]`.")
  (rgba [this] "Returns a vector `[r g b a]`.")
  (hex [this] "Returns a hex string for this color.")
  (hex-rgba [this] "Returns a hex rgba string for this color.")
  (alpha [this] "Returns the alpha for this color, a number in the range `[0 1]`."))

(defrecord Color [r g b a]
  IColor
  (rgb [_] [r g b])
  (rgba [_] [r g b a])
  (hex [_]
    (gcolor/rgbArrayToHex (array r g b)))
  (hex-rgba [_]
    (alpha/rgbaArrayToHex (array r g b a)))
  (alpha [_] a))

(defn- make-color
  ([r g b]
     (make-color r g b 1))
  ([r g b a]
     (Color. r g b a)))

(comment ;; Color examples

  (def red (make-color 200 0 0))
  (rgb red)
  (rgba red)
  (hex red)
  (hex-rgba red)
  (alpha red)
  )

(defprotocol IColorSource
  (color [this] "Get the color from the passed object. Return a `Color` object.")
  (bg-color [this] "Get the background color from the passed
  object. Returns a `Color` object."))

(extend-protocol IColorSource

  nil
  (color [this] (make-color 0 0 0))
  (bg-color [this] (make-color 0 0 0))

  Color
  (color [this] this)
  (bg-color [this] this)

  cljs.core.PersistentVector
  (color [this] (apply make-color this))
  (bg-color [this] (apply make-color this))

  js/Array
  (color [this] (apply make-color (js->clj this)))
  (bg-color [this] (apply make-color (js->clj this)))

  js/String
  (color [this]
    (color (js->clj (cond (gstring/startsWith this "#")
                          (cond (= (count this) 7) (gcolor/hexToRgb this)
                                (= (count this) 9) (alpha/hexToRgba this))
                          
                          (gstring/startsWith this "rgba(")
                          (alpha/parse this)

                          (gstring/startsWith this "rgb(") (gcolor/parseRgb this))
                    :keywordize-keys true)))
  (bg-color [this] (color this))

  cljs.core.PersistentHashMap
  (color [this] (color (:hex this)))
  (bg-color [this] (color this))
  
  js/Element
  (color [this]
    (color (js->clj (gcolor/parse (core/get-style this "color"))
                    :keywordize-keys true)))
  (bg-color [this]
    (color (js->clj (let [c (style/getBackgroundColor this)]
                      (try
                        (gcolor/parse c)
                        (catch js/Error e (alpha/parse c))))
                    :keywordize-keys true))))

