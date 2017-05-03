(ns leiningen.bootstrap
  "Bootstrap the project by running lein deps and lein git-deps."
  (:use [leiningen.git-deps :only [git-deps]]
        [leiningen.core :only [default-repos]]
        [leiningen.deps :only [deps]]
        [leiningen.util.maven :only [container make-remote-artifact
                                     make-remote-repo make-local-repo]])
  (:import (org.apache.maven.artifact.resolver ArtifactResolver)))

;; There is a bug in Leiningen 1.6.2 which requires that you have
;; Clojure 1.2.1 in the local maven repository when you are working on a
;; Clojure 1.3 project. If the first project that someone works on
;; with Leiningen is a Clojure 1.3 based project then they will
;; encounter this problem.

;; A lot of people have run into this with ClojureScript One so we
;; have added a workaround.

;; Leiningen includes an `install` task which, for some unknown reason,
;; takes a long time to run. Below, we have extracted just the part
;; of that task that we need to get a dependency from a maven repository.

(defn- standalone-download
  "Download a dependency from a maven repository."
  [name group version]
  (.resolveAlways (.lookup container ArtifactResolver/ROLE)
                  (make-remote-artifact name group version)
                  (map make-remote-repo default-repos)
                  (make-local-repo)))

(defn bootstrap
  "Bootstrap the project by running lein deps and lein git-deps."
  [project]
  ;; Workarond for Leiningen 1.6.2 bug. Ensure that we have Clojure 1.2.1 in
  ;; the local maven repository.
  (standalone-download "clojure" "org.clojure" "1.2.1")
  (git-deps project)
  (deps project))
