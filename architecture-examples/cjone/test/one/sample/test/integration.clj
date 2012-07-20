(ns one.sample.test.integration
  "Tests which cross the client server boundary."
  (:use [clojure.test]
        [one.sample.api :only (*database*)]
        [one.test :only (cljs-eval cljs-wait-for within-browser-env)]
        [one.sample.dev-server :only (run-server)]))

(use-fixtures :once (fn [f] (within-browser-env f
                                               :url "http://localhost:8080/development"
                                               :start-server run-server)))

(deftest test-enter-new-name
  (reset! *database* #{})
  (cljs-eval one.sample.view
             (dispatch/fire :init)
             (set-value! (by-id "name-input") "Ted")
             (fx/enable-button "greet-button")
             (clojure.browser.dom/click-element :greet-button))
  (cljs-wait-for #(= % :greeting) one.sample.model (:state @state))
  (is (= (cljs-eval one.sample.view (.-innerHTML (first (nodes (by-class "name")))))
         "Ted"))
  (is (= (cljs-eval one.sample.view (.-innerHTML (first (nodes (by-class "again")))))
         ""))
  (is (= (cljs-eval one.sample.model @state)
         {:state :greeting, :name "Ted", :exists false}))
  (is (true? (contains? @*database* "Ted"))))

(deftest test-enter-existing-name
  (reset! *database* #{"Ted"})
  (cljs-eval one.sample.view
             (dispatch/fire :init)
             (set-value! (by-id "name-input") "Ted")
             (fx/enable-button "greet-button")
             (clojure.browser.dom/click-element :greet-button))
  (cljs-wait-for #(= % :greeting) one.sample.model (:state @state))
  (is (= (cljs-eval one.sample.view (.-innerHTML (first (nodes (by-class "name")))))
         "Ted"))
  (is (= (cljs-eval one.sample.view (.-innerHTML (first (nodes (by-class "again")))))
         "again"))
  (is (= (cljs-eval one.sample.model @state)
         {:state :greeting, :name "Ted", :exists true}))
  (is (true? (contains? @*database* "Ted"))))
