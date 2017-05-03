(ns ^{:doc "Make network requests."}
  one.browser.remote
  (:require [goog.net.XhrManager   :as manager]))

(def ^:private
  *xhr-manager*
  (goog.net.XhrManager. nil
                        nil
                        nil
                        0
                        5000))

(defn success?
  [{status :status}]
  (and (>= status 200)
       (<  status 300)))

(defn redirect?
  [{status :status}]
  (boolean (#{301 302 303 307} status)))

(defn error?
  [{status :status}]
  (>= status 400))

(defn- handle-response
  [on-success on-error id e]
  (let [response {:id     id
                  :body   (. e/currentTarget (getResponseText))
                  :status (. e/currentTarget (getStatus))
                  :event  e}
        handler  (if (success? response)
                   on-success
                   on-error)]
    (handler response)))

(defn request
  "Asynchronously make a network request for the resource at url. If
  provided via the `:on-success` and `:on-error` keyword arguments, the
  appropriate one of `on-success` or `on-error` will be called on
  completion. They will be passed a map containing the keys `:id`,
  `:body`, `:status`, and `:event`. The entry for `:event` contains an
  instance of the `goog.net.XhrManager.Event`.

  Other allowable keyword arguments are `:method`, `:content`, `:headers`,
  `:priority`, and `:retries`. `:method` defaults to \"GET\" and `:retries`
  defaults to `0`.

  `priority` defaults to 100. The lower the number the higher the priority."
  [id url & {:keys [method content headers priority retries
                    on-success on-error]
             :or   {method   "GET"
                    retries  0}}]
  (try
    (.send *xhr-manager*
           id
           url
           method
           content
           (when headers (.-strobj headers))
           priority
           (partial handle-response on-success on-error id)
           retries)
    (catch js/Error e
      nil)))

(defn url
  [path]
  (str (.-origin (.-location js/document)) path))
