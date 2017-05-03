(ns ^{:doc "Contains the repl function which may be used to start a
  repl client in the browser."}
  one.browser.repl-client
  (:require [goog.uri.utils :as uri]
            [clojure.browser.repl :as repl]))

(defn- server
  "Return a string which is the scheme and domain portion of the URL
  for the server from which this code was served."
  []
  (let [location (.toString window.location ())]
    (str (uri/getScheme location) "://" (uri/getDomain location))))

(defn ^:export repl
  "Connects to a ClojureScript REPL running on localhost port 9000.

  This allows a browser-connected REPL to send JavaScript to the
  browser for evaluation. This function should be called from a script
  in the host HTML page."
  []
  (repl/connect (str (server) ":9000/repl")))
