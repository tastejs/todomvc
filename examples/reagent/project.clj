(defproject todomvc "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-3058" :scope "provided"]
                 [reagent "0.5.0"]
                 [secretary "1.2.2"]
                 [alandipert/storage-atom "1.2.4"]]

  :jvm-opts ["--add-modules" "java.xml.bind"]

  :min-lein-version "2.5.0"

  :plugins [[lein-cljsbuild "1.0.4"]]

  :profiles {:dev {:cljsbuild {:builds [{:source-paths ["src/cljs"]
                                         :compiler {:output-to "js/app.js"}}]}}

             :prod {:cljsbuild {:builds [{:source-paths ["src/cljs"]
                                          :compiler {:output-to "js/app.js"
                                                     :optimizations :advanced
                                                     :elide-asserts true
                                                     :pretty-print false}}]}}})
