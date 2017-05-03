(ns script.docs
  "Provides a `-main` function which will generate the documentation for
  the website, the documentation that you are viewing at this very
  moment."
  (:require [net.cgrand.enlive-html :as html]
            [clojure.java.io :as io]))

(defn- uberdoc-content
  "Accepts a relative path for an HTML file and returns the body
  content from that file."
  [file]
  (-> (io/file file)
      html/html-resource
      (html/select [:body])
      first
      :content))

(defn- docs
  "Accepts the relative path for the documentation template file
  and the margenalia content and returns the documentation page for
  the website."
  [template marg]
  (-> (io/file template)
      html/html-resource
      (html/transform [:div#marginalia-documentation]
                      (html/substitute marg))))

(defn -main
  "Create the documentation.html page for the website. Outputs this
  file as `docs/documentation.html`."
  []
  (let [marg (uberdoc-content "docs/uberdoc.html")
        docs (docs "script/documentation.html" marg)]
    (spit "docs/documentation.html"
          (apply str (html/emit* docs)))))
