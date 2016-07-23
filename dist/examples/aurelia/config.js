System.config({
  "defaultJSExtensions": true,
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  "map": {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0-beta.1.0.3",
    "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.5",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-beta.1.0.2",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.0.0-beta.1.0.2",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.0.8",
    "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.0.1",
    "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.0.1",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.0.2",
    "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
    "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.1.0.3",
    "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
    "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.1",
    "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.0.1",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
    "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.0.2",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.0.4",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.0.5",
    "babel": "npm:babel-core@5.8.34",
    "babel-runtime": "npm:babel-runtime@5.8.34",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.10",
    "fetch": "github:github/fetch@0.9.0",
    "nodelibs-process": "github:jspm/nodelibs-process@0.1.2",
    "text": "github:systemjs/plugin-text@0.0.2",
    "todomvc-app-css": "npm:todomvc-app-css@2.0.4",
    "todomvc-common": "npm:todomvc-common@1.0.2",
    "underscore": "npm:underscore@1.8.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.0.2"
    },
    "github:jspm/nodelibs-events@0.1.0": {
      "events-browserify": "npm:events-browserify@0.0.1"
    },
    "github:jspm/nodelibs-http@1.7.0": {
      "Base64": "npm:Base64@0.2.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:systemjs/plugin-css@0.1.10": {
      "clean-css": "npm:clean-css@3.1.9",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:amdefine@0.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.0-beta.1.0.3": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3"
    },
    "npm:aurelia-binding@1.0.0-beta.1.0.5": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-bootstrapper@1.0.0-beta.1.0.2": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.0.8",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.0.1",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.0.2",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.1.0.3",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.0.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.0.4",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.0.5",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-event-aggregator@1.0.0-beta.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1"
    },
    "npm:aurelia-fetch-client@1.0.0-beta.1.0.2": {
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-framework@1.0.0-beta.1.0.8": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.5",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-history-browser@1.0.0-beta.1.0.1": {
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-loader-default@1.0.0-beta.1.0.2": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2"
    },
    "npm:aurelia-loader@1.0.0-beta.1.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1"
    },
    "npm:aurelia-logging-console@1.0.0-beta.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2"
    },
    "npm:aurelia-metadata@1.0.0-beta.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-pal-browser@1.0.0-beta.1.0.3": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-route-recognizer@1.0.0-beta.1": {
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-router@1.0.0-beta.1.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-task-queue@1.0.0-beta.1.0.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2"
    },
    "npm:aurelia-templating-binding@1.0.0-beta.1.0.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.5",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3"
    },
    "npm:aurelia-templating-resources@1.0.0-beta.1.0.4": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.5",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:aurelia-templating-router@1.0.0-beta.1.0.5": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.0.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.0.3"
    },
    "npm:aurelia-templating@1.0.0-beta.1.0.3": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.0.5",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "npm:babel-runtime@5.8.34": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.0.2": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.4",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:clean-css@3.1.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.6.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.0",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.1.43",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.6.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:events-browserify@0.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "npm:stream-browserify@1.0.0",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:source-map@0.1.43": {
      "amdefine": "npm:amdefine@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:url@0.10.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  },
  "bundles": {
    "aurelia": [
      "github:jspm/nodelibs-process@0.1.2",
      "github:jspm/nodelibs-process@0.1.2/index",
      "github:systemjs/plugin-text@0.0.2",
      "github:systemjs/plugin-text@0.0.2/text",
      "npm:aurelia-binding@1.0.0-beta.1.0.5",
      "npm:aurelia-binding@1.0.0-beta.1.0.5/aurelia-binding",
      "npm:aurelia-bootstrapper@1.0.0-beta.1.0.2",
      "npm:aurelia-bootstrapper@1.0.0-beta.1.0.2/aurelia-bootstrapper",
      "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1",
      "npm:aurelia-dependency-injection@1.0.0-beta.1.0.1/aurelia-dependency-injection",
      "npm:aurelia-event-aggregator@1.0.0-beta.1",
      "npm:aurelia-event-aggregator@1.0.0-beta.1/aurelia-event-aggregator",
      "npm:aurelia-framework@1.0.0-beta.1.0.8",
      "npm:aurelia-framework@1.0.0-beta.1.0.8/aurelia-framework",
      "npm:aurelia-history-browser@1.0.0-beta.1.0.1",
      "npm:aurelia-history-browser@1.0.0-beta.1.0.1/aurelia-history-browser",
      "npm:aurelia-history@1.0.0-beta.1",
      "npm:aurelia-history@1.0.0-beta.1/aurelia-history",
      "npm:aurelia-loader-default@1.0.0-beta.1.0.2",
      "npm:aurelia-loader-default@1.0.0-beta.1.0.2/aurelia-loader-default",
      "npm:aurelia-loader@1.0.0-beta.1.0.1",
      "npm:aurelia-loader@1.0.0-beta.1.0.1/aurelia-loader",
      "npm:aurelia-logging-console@1.0.0-beta.1",
      "npm:aurelia-logging-console@1.0.0-beta.1/aurelia-logging-console",
      "npm:aurelia-logging@1.0.0-beta.1",
      "npm:aurelia-logging@1.0.0-beta.1/aurelia-logging",
      "npm:aurelia-metadata@1.0.0-beta.1",
      "npm:aurelia-metadata@1.0.0-beta.1/aurelia-metadata",
      "npm:aurelia-pal-browser@1.0.0-beta.1.0.3",
      "npm:aurelia-pal-browser@1.0.0-beta.1.0.3/aurelia-pal-browser",
      "npm:aurelia-pal@1.0.0-beta.1.0.2",
      "npm:aurelia-pal@1.0.0-beta.1.0.2/aurelia-pal",
      "npm:aurelia-path@1.0.0-beta.1",
      "npm:aurelia-path@1.0.0-beta.1/aurelia-path",
      "npm:aurelia-route-recognizer@1.0.0-beta.1",
      "npm:aurelia-route-recognizer@1.0.0-beta.1/aurelia-route-recognizer",
      "npm:aurelia-router@1.0.0-beta.1.0.1",
      "npm:aurelia-router@1.0.0-beta.1.0.1/aurelia-router",
      "npm:aurelia-task-queue@1.0.0-beta.1.0.1",
      "npm:aurelia-task-queue@1.0.0-beta.1.0.1/aurelia-task-queue",
      "npm:aurelia-templating-binding@1.0.0-beta.1.0.2",
      "npm:aurelia-templating-binding@1.0.0-beta.1.0.2/aurelia-templating-binding",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/analyze-view-factory",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/array-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/aurelia-templating-resources",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/binding-mode-behaviors",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/binding-signaler",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/compile-spy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/compose",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/css-resource",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/debounce-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/dynamic-element",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/focus",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/html-sanitizer",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/if",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/map-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/null-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/number-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/repeat",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/repeat-strategy-locator",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/repeat-utilities",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/replaceable",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/sanitize-html",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/set-repeat-strategy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/show",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/signal-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/throttle-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/update-trigger-binding-behavior",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/view-spy",
      "npm:aurelia-templating-resources@1.0.0-beta.1.0.4/with",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.5",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.5/aurelia-templating-router",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.5/route-href",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.5/route-loader",
      "npm:aurelia-templating-router@1.0.0-beta.1.0.5/router-view",
      "npm:aurelia-templating@1.0.0-beta.1.0.3",
      "npm:aurelia-templating@1.0.0-beta.1.0.3/aurelia-templating",
      "npm:core-js@1.2.6",
      "npm:core-js@1.2.6/index",
      "npm:core-js@1.2.6/modules/$",
      "npm:core-js@1.2.6/modules/$.a-function",
      "npm:core-js@1.2.6/modules/$.add-to-unscopables",
      "npm:core-js@1.2.6/modules/$.an-object",
      "npm:core-js@1.2.6/modules/$.array-copy-within",
      "npm:core-js@1.2.6/modules/$.array-fill",
      "npm:core-js@1.2.6/modules/$.array-includes",
      "npm:core-js@1.2.6/modules/$.array-methods",
      "npm:core-js@1.2.6/modules/$.array-species-create",
      "npm:core-js@1.2.6/modules/$.classof",
      "npm:core-js@1.2.6/modules/$.cof",
      "npm:core-js@1.2.6/modules/$.collection",
      "npm:core-js@1.2.6/modules/$.collection-strong",
      "npm:core-js@1.2.6/modules/$.collection-to-json",
      "npm:core-js@1.2.6/modules/$.collection-weak",
      "npm:core-js@1.2.6/modules/$.core",
      "npm:core-js@1.2.6/modules/$.ctx",
      "npm:core-js@1.2.6/modules/$.defined",
      "npm:core-js@1.2.6/modules/$.descriptors",
      "npm:core-js@1.2.6/modules/$.dom-create",
      "npm:core-js@1.2.6/modules/$.enum-keys",
      "npm:core-js@1.2.6/modules/$.export",
      "npm:core-js@1.2.6/modules/$.fails",
      "npm:core-js@1.2.6/modules/$.fails-is-regexp",
      "npm:core-js@1.2.6/modules/$.fix-re-wks",
      "npm:core-js@1.2.6/modules/$.flags",
      "npm:core-js@1.2.6/modules/$.for-of",
      "npm:core-js@1.2.6/modules/$.get-names",
      "npm:core-js@1.2.6/modules/$.global",
      "npm:core-js@1.2.6/modules/$.has",
      "npm:core-js@1.2.6/modules/$.hide",
      "npm:core-js@1.2.6/modules/$.html",
      "npm:core-js@1.2.6/modules/$.invoke",
      "npm:core-js@1.2.6/modules/$.iobject",
      "npm:core-js@1.2.6/modules/$.is-array",
      "npm:core-js@1.2.6/modules/$.is-array-iter",
      "npm:core-js@1.2.6/modules/$.is-integer",
      "npm:core-js@1.2.6/modules/$.is-object",
      "npm:core-js@1.2.6/modules/$.is-regexp",
      "npm:core-js@1.2.6/modules/$.iter-call",
      "npm:core-js@1.2.6/modules/$.iter-create",
      "npm:core-js@1.2.6/modules/$.iter-define",
      "npm:core-js@1.2.6/modules/$.iter-detect",
      "npm:core-js@1.2.6/modules/$.iter-step",
      "npm:core-js@1.2.6/modules/$.iterators",
      "npm:core-js@1.2.6/modules/$.keyof",
      "npm:core-js@1.2.6/modules/$.library",
      "npm:core-js@1.2.6/modules/$.math-expm1",
      "npm:core-js@1.2.6/modules/$.math-log1p",
      "npm:core-js@1.2.6/modules/$.math-sign",
      "npm:core-js@1.2.6/modules/$.microtask",
      "npm:core-js@1.2.6/modules/$.object-assign",
      "npm:core-js@1.2.6/modules/$.object-define",
      "npm:core-js@1.2.6/modules/$.object-sap",
      "npm:core-js@1.2.6/modules/$.object-to-array",
      "npm:core-js@1.2.6/modules/$.own-keys",
      "npm:core-js@1.2.6/modules/$.partial",
      "npm:core-js@1.2.6/modules/$.path",
      "npm:core-js@1.2.6/modules/$.property-desc",
      "npm:core-js@1.2.6/modules/$.redefine",
      "npm:core-js@1.2.6/modules/$.redefine-all",
      "npm:core-js@1.2.6/modules/$.replacer",
      "npm:core-js@1.2.6/modules/$.same-value",
      "npm:core-js@1.2.6/modules/$.set-proto",
      "npm:core-js@1.2.6/modules/$.set-species",
      "npm:core-js@1.2.6/modules/$.set-to-string-tag",
      "npm:core-js@1.2.6/modules/$.shared",
      "npm:core-js@1.2.6/modules/$.species-constructor",
      "npm:core-js@1.2.6/modules/$.strict-new",
      "npm:core-js@1.2.6/modules/$.string-at",
      "npm:core-js@1.2.6/modules/$.string-context",
      "npm:core-js@1.2.6/modules/$.string-pad",
      "npm:core-js@1.2.6/modules/$.string-repeat",
      "npm:core-js@1.2.6/modules/$.string-trim",
      "npm:core-js@1.2.6/modules/$.task",
      "npm:core-js@1.2.6/modules/$.to-index",
      "npm:core-js@1.2.6/modules/$.to-integer",
      "npm:core-js@1.2.6/modules/$.to-iobject",
      "npm:core-js@1.2.6/modules/$.to-length",
      "npm:core-js@1.2.6/modules/$.to-object",
      "npm:core-js@1.2.6/modules/$.to-primitive",
      "npm:core-js@1.2.6/modules/$.uid",
      "npm:core-js@1.2.6/modules/$.wks",
      "npm:core-js@1.2.6/modules/core.delay",
      "npm:core-js@1.2.6/modules/core.dict",
      "npm:core-js@1.2.6/modules/core.function.part",
      "npm:core-js@1.2.6/modules/core.get-iterator",
      "npm:core-js@1.2.6/modules/core.get-iterator-method",
      "npm:core-js@1.2.6/modules/core.is-iterable",
      "npm:core-js@1.2.6/modules/core.log",
      "npm:core-js@1.2.6/modules/core.number.iterator",
      "npm:core-js@1.2.6/modules/core.object.classof",
      "npm:core-js@1.2.6/modules/core.object.define",
      "npm:core-js@1.2.6/modules/core.object.is-object",
      "npm:core-js@1.2.6/modules/core.object.make",
      "npm:core-js@1.2.6/modules/core.string.escape-html",
      "npm:core-js@1.2.6/modules/core.string.unescape-html",
      "npm:core-js@1.2.6/modules/es5",
      "npm:core-js@1.2.6/modules/es6.array.copy-within",
      "npm:core-js@1.2.6/modules/es6.array.fill",
      "npm:core-js@1.2.6/modules/es6.array.find",
      "npm:core-js@1.2.6/modules/es6.array.find-index",
      "npm:core-js@1.2.6/modules/es6.array.from",
      "npm:core-js@1.2.6/modules/es6.array.iterator",
      "npm:core-js@1.2.6/modules/es6.array.of",
      "npm:core-js@1.2.6/modules/es6.array.species",
      "npm:core-js@1.2.6/modules/es6.function.has-instance",
      "npm:core-js@1.2.6/modules/es6.function.name",
      "npm:core-js@1.2.6/modules/es6.map",
      "npm:core-js@1.2.6/modules/es6.math.acosh",
      "npm:core-js@1.2.6/modules/es6.math.asinh",
      "npm:core-js@1.2.6/modules/es6.math.atanh",
      "npm:core-js@1.2.6/modules/es6.math.cbrt",
      "npm:core-js@1.2.6/modules/es6.math.clz32",
      "npm:core-js@1.2.6/modules/es6.math.cosh",
      "npm:core-js@1.2.6/modules/es6.math.expm1",
      "npm:core-js@1.2.6/modules/es6.math.fround",
      "npm:core-js@1.2.6/modules/es6.math.hypot",
      "npm:core-js@1.2.6/modules/es6.math.imul",
      "npm:core-js@1.2.6/modules/es6.math.log10",
      "npm:core-js@1.2.6/modules/es6.math.log1p",
      "npm:core-js@1.2.6/modules/es6.math.log2",
      "npm:core-js@1.2.6/modules/es6.math.sign",
      "npm:core-js@1.2.6/modules/es6.math.sinh",
      "npm:core-js@1.2.6/modules/es6.math.tanh",
      "npm:core-js@1.2.6/modules/es6.math.trunc",
      "npm:core-js@1.2.6/modules/es6.number.constructor",
      "npm:core-js@1.2.6/modules/es6.number.epsilon",
      "npm:core-js@1.2.6/modules/es6.number.is-finite",
      "npm:core-js@1.2.6/modules/es6.number.is-integer",
      "npm:core-js@1.2.6/modules/es6.number.is-nan",
      "npm:core-js@1.2.6/modules/es6.number.is-safe-integer",
      "npm:core-js@1.2.6/modules/es6.number.max-safe-integer",
      "npm:core-js@1.2.6/modules/es6.number.min-safe-integer",
      "npm:core-js@1.2.6/modules/es6.number.parse-float",
      "npm:core-js@1.2.6/modules/es6.number.parse-int",
      "npm:core-js@1.2.6/modules/es6.object.assign",
      "npm:core-js@1.2.6/modules/es6.object.freeze",
      "npm:core-js@1.2.6/modules/es6.object.get-own-property-descriptor",
      "npm:core-js@1.2.6/modules/es6.object.get-own-property-names",
      "npm:core-js@1.2.6/modules/es6.object.get-prototype-of",
      "npm:core-js@1.2.6/modules/es6.object.is",
      "npm:core-js@1.2.6/modules/es6.object.is-extensible",
      "npm:core-js@1.2.6/modules/es6.object.is-frozen",
      "npm:core-js@1.2.6/modules/es6.object.is-sealed",
      "npm:core-js@1.2.6/modules/es6.object.keys",
      "npm:core-js@1.2.6/modules/es6.object.prevent-extensions",
      "npm:core-js@1.2.6/modules/es6.object.seal",
      "npm:core-js@1.2.6/modules/es6.object.set-prototype-of",
      "npm:core-js@1.2.6/modules/es6.object.to-string",
      "npm:core-js@1.2.6/modules/es6.promise",
      "npm:core-js@1.2.6/modules/es6.reflect.apply",
      "npm:core-js@1.2.6/modules/es6.reflect.construct",
      "npm:core-js@1.2.6/modules/es6.reflect.define-property",
      "npm:core-js@1.2.6/modules/es6.reflect.delete-property",
      "npm:core-js@1.2.6/modules/es6.reflect.enumerate",
      "npm:core-js@1.2.6/modules/es6.reflect.get",
      "npm:core-js@1.2.6/modules/es6.reflect.get-own-property-descriptor",
      "npm:core-js@1.2.6/modules/es6.reflect.get-prototype-of",
      "npm:core-js@1.2.6/modules/es6.reflect.has",
      "npm:core-js@1.2.6/modules/es6.reflect.is-extensible",
      "npm:core-js@1.2.6/modules/es6.reflect.own-keys",
      "npm:core-js@1.2.6/modules/es6.reflect.prevent-extensions",
      "npm:core-js@1.2.6/modules/es6.reflect.set",
      "npm:core-js@1.2.6/modules/es6.reflect.set-prototype-of",
      "npm:core-js@1.2.6/modules/es6.regexp.constructor",
      "npm:core-js@1.2.6/modules/es6.regexp.flags",
      "npm:core-js@1.2.6/modules/es6.regexp.match",
      "npm:core-js@1.2.6/modules/es6.regexp.replace",
      "npm:core-js@1.2.6/modules/es6.regexp.search",
      "npm:core-js@1.2.6/modules/es6.regexp.split",
      "npm:core-js@1.2.6/modules/es6.set",
      "npm:core-js@1.2.6/modules/es6.string.code-point-at",
      "npm:core-js@1.2.6/modules/es6.string.ends-with",
      "npm:core-js@1.2.6/modules/es6.string.from-code-point",
      "npm:core-js@1.2.6/modules/es6.string.includes",
      "npm:core-js@1.2.6/modules/es6.string.iterator",
      "npm:core-js@1.2.6/modules/es6.string.raw",
      "npm:core-js@1.2.6/modules/es6.string.repeat",
      "npm:core-js@1.2.6/modules/es6.string.starts-with",
      "npm:core-js@1.2.6/modules/es6.string.trim",
      "npm:core-js@1.2.6/modules/es6.symbol",
      "npm:core-js@1.2.6/modules/es6.weak-map",
      "npm:core-js@1.2.6/modules/es6.weak-set",
      "npm:core-js@1.2.6/modules/es7.array.includes",
      "npm:core-js@1.2.6/modules/es7.map.to-json",
      "npm:core-js@1.2.6/modules/es7.object.entries",
      "npm:core-js@1.2.6/modules/es7.object.get-own-property-descriptors",
      "npm:core-js@1.2.6/modules/es7.object.values",
      "npm:core-js@1.2.6/modules/es7.regexp.escape",
      "npm:core-js@1.2.6/modules/es7.set.to-json",
      "npm:core-js@1.2.6/modules/es7.string.at",
      "npm:core-js@1.2.6/modules/es7.string.pad-left",
      "npm:core-js@1.2.6/modules/es7.string.pad-right",
      "npm:core-js@1.2.6/modules/es7.string.trim-left",
      "npm:core-js@1.2.6/modules/es7.string.trim-right",
      "npm:core-js@1.2.6/modules/js.array.statics",
      "npm:core-js@1.2.6/modules/web.dom.iterable",
      "npm:core-js@1.2.6/modules/web.immediate",
      "npm:core-js@1.2.6/modules/web.timers",
      "npm:core-js@1.2.6/shim",
      "npm:process@0.11.2",
      "npm:process@0.11.2/browser",
      "npm:underscore@1.8.3",
      "npm:underscore@1.8.3/underscore"
    ]
  }
})