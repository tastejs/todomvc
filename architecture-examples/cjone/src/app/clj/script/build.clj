(ns script.build
  "Contains a -main function which builds the production artifacts for
  the project."
  (:require [clojure.java.io :as io]
            [one.tools :as tools]
            [one.todomvc.config :as config]))

(defn -main
  "Compile ClojureScript sources and output them as well as all static
  resources to the out/public directory."
  []
  (println "Creating out/public...")
  (.mkdir (io/file "out"))
  (tools/copy-recursive-into "public" "out")
  (tools/delete "out/public/index.html"
                "out/public/design.html"
                "out/public/javascripts")
  (.mkdir (io/file "out/public/javascripts"))
  (println "Create advanced compiled JavaScript...")
  (tools/build-project config/config))
