(ns ^{:doc "Basic wrapper around [Google Closure's logging API][gcl].

  This library can be improved to support more of the features
  provided by Google Closure's logging.

  [gcl]: http://closure-library.googlecode.com/svn/docs/class_goog_debug_Logger.html"}
  one.logging
  (:require [goog.debug.Console :as console]
            [goog.debug.FancyWindow :as fancy]
            [goog.debug.Logger :as logger]))

(defprotocol ILogViewer
  (start-display [this] "Start displaying log messages in this viewer.")
  (stop-display [this] "Stop displaying log messages in this viewer."))

(def ^{:doc "Maps log level keywords to `goog.debug.Logger.Levels`."}
  levels {:severe goog.debug.Logger.Level.SEVERE
          :warning goog.debug.Logger.Level.WARNING
          :info goog.debug.Logger.Level.INFO
          :config goog.debug.Logger.Level.CONFIG
          :fine goog.debug.Logger.Level.FINE
          :finer goog.debug.Logger.Level.FINER
          :finest goog.debug.Logger.Level.FINEST})

(defn get-logger
  "Given a name, return an existing logger if one exists or create a
  new logger."
  [name]
  (goog.debug.Logger/getLogger name))

(defn severe
  "Given a logger and a message, write the message to the log with a
  logging level of `severe`."
  [logger s] (.severe logger s))

(defn warning
  "Given a logger and a message, write the message to the log with a
  logging level of `warning`."
  [logger s] (.warning logger s))

(defn info
  "Given a logger and a message, write the message to the log with a
  logging level of `info`."
  [logger s] (.info logger s))

(defn config
  "Given a logger and a message, write the message to the log with a
  logging level of `config`."
  [logger s] (.config logger s))

(defn fine
  "Given a logger and a message, write the message to the log with a
  logging level of `fine`."
  [logger s] (.fine logger s))

(defn finer
  "Given a logger and a message, write the message to the log with a
  logging level of `finer`."
  [logger s] (.finer logger s))

(defn finest
  "Given a logger and a message, write the message to the log with a
  logging level of `finest`."
  [logger s] (.finest logger s))

(defn set-level
  "Set the logging level of `logger` to `level`.

  The `level` argument must be a keyword."
  [logger level]
  (.setLevel logger (get levels level goog.debug.Logger.Level.INFO)))

(extend-protocol ILogViewer
  
  goog.debug.Console
  (start-display [this]
    (.setCapturing this true))
  (stop-display [this]
    (.setCapturing this false))
  
  goog.debug.FancyWindow
  (start-display [this]
    (doto this
      (.setEnabled true)
      (.init ())))
  (stop-display [this]
    (.setCapturing this false)))

(defn console-output
  "Returns a log viewer which will direct log messages to the
  browser's `console` window. Use the `start-display` and
  `stop-display` functions to start and stop printing log messages to
  the console."
  []
  (goog.debug.Console.))

(defn fancy-output
  "Returns a log viewer which will open a fancy logging window and
  direct log messages to it. Use the `start-display` and
  `stop-display` functions to start and stop printing log messages in
  this window."
  [name]
  (goog.debug.FancyWindow. name))

