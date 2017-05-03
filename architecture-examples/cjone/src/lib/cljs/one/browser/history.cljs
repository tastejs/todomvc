(ns ^{:doc "Supports working with [Google Closure's history management object][gch].
   [gch]: http://closure-library.googlecode.com/svn/docs/namespace_goog_history.html"}

  one.browser.history
  (:require [clojure.browser.event :as event]
            [goog.History :as history]
            [goog.history.Html5History :as history5]))

(extend-type goog.History
  
  event/EventType
  (event-types [this]
    (into {}
          (map
           (fn [[k v]]
             [(keyword (. k (toLowerCase)))
              v])
           (js->clj goog.history.EventType)))))

(defn history
  "Create a new history object in user visible mode. This allows users
  to, for example, hit the browser's back button without leaving the
  current page. The current history state is shown in the browser
  address bar as a document location fragment (the portion of the URL
  after the '#'). These addresses can be bookmarked, copied and pasted
  into another browser, and modified directly by the user like any
  other URL.

  Any changes to the location hash will call the passed callback
  function."
  [callback]
  (let [h (if (history5/isSupported)
            (goog.history.Html5History.)
            (goog.History.))]
    (do (event/listen h "navigate"
                      (fn [e]
                        (callback {:token (keyword (.-token e))
                                   :type (.-type e)
                                   :navigation? (.-isNavigation e)})))
        (.setEnabled h true)
        h)))

(defn set-token
  "Sets the `history` state. The URL fragment will be set to the
  provided token."
  [history token]
  (.setToken history (name token)))

