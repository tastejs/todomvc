(ns leiningen.git-deps
  "How this works: It clones projects into .lein-git-deps/<whatever>.
  If the directory already exists, it does a git pull and git checkout."
  (:require [clojure.java.shell :as sh]
            [clojure.java.io :as io]
            [clojure.string :as string]))

(def ^{:private true
       :doc "The directory into which dependencies will be cloned."}
  git-deps-dir ".lein-git-deps")

(defn- directory-exists?
  "Return true if the specified directory exists."
  [dir]
  (.isDirectory (io/file dir)))

(defn- default-clone-dir
  "Given a git URL, return the directory it would clone into by default."
  [uri]
  (string/join "." (-> uri
                       (string/split #"/")
                       (last)
                       (string/split #"\.")
                       butlast)))

(defn- exec
  "Run a command, throwing an exception if it fails, returning the
  result as with clojure.java.shell/sh."
  [& args]
  (let [{:keys [exit out err] :as result} (apply sh/sh args)]
    (if (zero? exit)
      result
      (throw
       (Exception.
        (format "Command %s failed with exit code %s\n%s\n%s"
                (apply str (interpose " " args))
                exit
                out
                err))))))

(defn- git-clone
  "Clone the git repository at url into dir-name while working in
  directory working-dir."
  [url dir-name working-dir]
  (apply exec (remove nil? ["git" "clone" url (str dir-name) :dir working-dir])))

(defn- git-checkout
  "Check out the specified commit in dir."
  [commit dir]
  (println "Running git checkout " commit " in " (str dir))
  (exec "git" "checkout" commit :dir dir))

(defn- detached-head?
  "Return true if the git repository in dir has HEAD detached."
  [dir]
  (let [{out :out} (exec "git" "branch" "--no-color" :dir dir)
        lines (string/split-lines out)
        current-branch (first (filter #(.startsWith % "*") lines))]
    (when-not current-branch
      (throw (Exception. "Unable to determine current branch")))
    (= current-branch "* (no branch)")))

(defn- git-pull
  "Run 'git-pull' in directory dir, but only if we're on a branch. If
  HEAD is detached, we only do a fetch, not a full pull."
  [dir]
  (println "Running git pull on " (str dir))
  (if (detached-head? dir)
    (do
      (println "Not on a branch, so fetching instead of pulling.")
      (exec "git" "fetch" :dir dir))
    (exec "git" "pull" :dir dir)))

(defn git-deps
  "A leiningen task that will pull dependencies in via git.

  Dependencies should be listed in project.clj under the
  :git-dependencies key in one of these three forms:

    :git-dependencies [;; First form: just a URL.
                       [\"https://github.com/foo/bar.git\"]

                       ;; Second form: A URL and a ref, which can be anything
                       ;; you can specify for 'git checkout', like a commit id
                       ;; or a branch name.
                       [\"https://github.com/foo/baz.git\"
                        \"329708b\"]

                       ;; Third form: A URL, a commit, and a map
                       [\"https://github.com/foo/quux.git\"
                        \"some-branch\"
                        {:dir \"alternate-directory\"}]]
"
  [project]
  (when-not (directory-exists? git-deps-dir)
    (.mkdir (io/file git-deps-dir)))
  (doseq [dep (:git-dependencies project)]
    (println "Setting up dependency for " dep)
    (let [[dep-url commit {clone-dir-name :dir}] dep
          commit (or commit "master")
          clone-dir-name (or clone-dir-name (default-clone-dir dep-url))
          clone-dir (io/file git-deps-dir clone-dir-name)]
      (if (directory-exists? clone-dir)
        (git-pull clone-dir)
        (git-clone dep-url clone-dir-name git-deps-dir))
      (git-checkout commit clone-dir))))
