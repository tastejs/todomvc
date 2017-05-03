(ns one.middleware
  (:use [one.templates :only (render)])
  (:require [net.cgrand.enlive-html :as html])
  (:import java.io.File))

(defn js-encoding [handler]
  (fn [request]
    (let [{:keys [headers body] :as response} (handler request)]
      (if (and (= (get headers "Content-Type") "text/javascript")
               (= (type body) File))
        (assoc-in response [:headers "Content-Type"]
                  "text/javascript; charset=utf-8")
        response))))

(defn rewrite-design-uris [handler]
  (fn [{:keys [uri] :as request}]
    (if (some true? (map #(.startsWith uri (str "/design/" %))
                         ["css" "javascripts" "images" "js" "favicon.ico"]))
      (handler (assoc request :uri (.substring uri 7)))
      (handler request))))

;; We need to use this instead of Enlive's html-snippet, because
;; html-snippet throws away the doctype
(defn- html-parse
  "Parse a string into a seq of Enlive nodes."
  [s]
  (html/html-resource (java.io.StringReader. s)))

(defn active-menu-transform
  "Accepts the selected menu (a keyword) and the response and returns
  an updated response body with the correct menu activated."
  [menu response]
  (assoc response
    :body (render (html/transform (html-parse (:body response))
                                  [:ul#navigation (keyword (str "li." (name menu)))]
                                  (html/add-class "active")))))

(defn set-active-menu
  "Middleware which will highlight the current active menu item."
  [handler]
  (fn [request]
    (let [response (handler request)
          uri (:uri request)]
      (cond (= uri "/") (active-menu-transform :home response)
            (and (.startsWith uri "/design") (.endsWith uri ".html")) (active-menu-transform :design response)
            (= uri "/development") (active-menu-transform :development response)
            (= uri "/production") (active-menu-transform :production response)
            :else response))))
