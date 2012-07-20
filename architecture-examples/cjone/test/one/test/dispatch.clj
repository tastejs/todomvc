(ns one.test.dispatch
  
  "Event dispatching tests. All of the tests in the namespace are testing
  ClojureScript code which is being evaluated in the browser.

  If these tests do not run, the most likely reason is that you have not visited
  the page http://localhost:8080/frash. Currently the client code for this page
  does not get compiled until you visit the page."
  
  (:use [clojure.test]
        [one.test :only (in-javascript js)]))

(in-javascript

 (ns one.test.dispatch
   (:use [one.dispatch :only [fire react-to delete-reaction]]))
 
 (defn with-reaction [f]
   (let [recorded-reactions (atom [])
         reaction (react-to #{:do-something}
                            (fn [t d] (swap! recorded-reactions conj [t d])))]
     (f reaction)
     (delete-reaction reaction)
     (deref recorded-reactions)))
 )

(deftest create-reaction
  (is (= #{:max-count :event-pred :reactor}
         (js (let [reaction (react-to #{:do-something} (constantly true))]
               (set (keys reaction)))))))

(deftest reaction-catches-event
  (is (= [[:do-something nil]]
         (js (with-reaction (fn [_] (fire :do-something)))))))

(deftest reaction-catches-two-events
  (is (= [[:do-something nil] [:do-something nil]]
         (js (with-reaction (fn [_]
                              (fire :do-something)
                              (fire :do-something)))))))

(deftest reaction-catches-only-its-events
  (is (= []
         (js (with-reaction (fn [_] (fire :something-else)))))))

(deftest reaction-catches-event-with-data
  (is (= [[:do-something 1]]
         (js (with-reaction (fn [_] (fire :do-something 1)))))))

(deftest deleted-reaction-does-nothing
  (is (= [[:do-something 1]]
         (js (with-reaction (fn [reaction]
                              (fire :do-something 1)
                              (delete-reaction reaction)
                              (fire :do-something 2)))))))

(deftest reactions-are-deleted-when-max-count-becomes-zero
  (is (= #{[1 :do-something 1] [2 :do-something 1] [2 :do-something 2]}
         (js (let [recorded-reactions (atom #{})
                   reaction-once (react-to 1 #{:do-something}
                                           #(swap! recorded-reactions conj [1 %1 %2]))
                   reaction-twice (react-to 2 #{:do-something}
                                            #(swap! recorded-reactions conj [2 %1 %2]))]
               (fire :do-something 1)
               (fire :do-something 2)
               (fire :do-something 3)
               @recorded-reactions)))))

(comment

  ;; Try running these tests from a Clojure REPL.
  
  (dev-server)
  (require 'one.test)
  (require 'clojure.test)
  (require 'one.test.dispatch :reload)

  (def ee (one.test/browser-eval-env))

  ;; go to the development or fresh page

  (binding [one.test/*eval-env* ee]
    (clojure.test/run-tests 'one.test.dispatch))

  ;; From a ClojureScript REPL, you may run these tests with:

  (clojure.test/run-tests 'one.test.dispatch)
  )
