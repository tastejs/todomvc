System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "todomvc-aurelia/*": "lib/*.js"
  },
  "bundles": {
    "dist\\bundled": [
      "npm:process@0.10.0/browser",
      "github:aurelia/metadata@0.3.1/system/origin",
      "github:aurelia/metadata@0.3.1/system/resource-type",
      "github:aurelia/metadata@0.3.1/system/metadata",
      "github:aurelia/loader@0.3.3/system/index",
      "github:aurelia/path@0.4.3/system/index",
      "github:aurelia/logging@0.2.2/system/index",
      "github:aurelia/dependency-injection@0.4.2/system/metadata",
      "github:aurelia/dependency-injection@0.4.2/system/util",
      "github:aurelia/templating@0.8.10/system/util",
      "github:aurelia/binding@0.3.4/system/value-converter",
      "github:aurelia/binding@0.3.4/system/event-manager",
      "github:aurelia/task-queue@0.2.3/system/index",
      "github:aurelia/binding@0.3.4/system/array-change-records",
      "github:aurelia/binding@0.3.4/system/dirty-checking",
      "github:aurelia/binding@0.3.4/system/property-observation",
      "github:aurelia/binding@0.3.4/system/binding-modes",
      "github:aurelia/binding@0.3.4/system/lexer",
      "github:aurelia/binding@0.3.4/system/path-observer",
      "github:aurelia/binding@0.3.4/system/composite-observer",
      "github:aurelia/binding@0.3.4/system/binding-expression",
      "github:aurelia/binding@0.3.4/system/listener-expression",
      "github:aurelia/binding@0.3.4/system/name-expression",
      "github:aurelia/binding@0.3.4/system/call-expression",
      "github:aurelia/templating@0.8.10/system/behavior-instance",
      "github:aurelia/templating@0.8.10/system/children",
      "github:aurelia/templating@0.8.10/system/content-selector",
      "github:aurelia/templating@0.8.10/system/resource-registry",
      "github:aurelia/templating@0.8.10/system/view",
      "github:aurelia/templating@0.8.10/system/view-slot",
      "github:aurelia/templating@0.8.10/system/binding-language",
      "github:aurelia/templating@0.8.10/system/view-strategy",
      "github:aurelia/templating@0.8.10/system/element-config",
      "github:aurelia/templating@0.8.10/system/template-controller",
      "github:aurelia/templating@0.8.10/system/resource-coordinator",
      "github:aurelia/templating@0.8.10/system/composition-engine",
      "github:aurelia/framework@0.8.6/system/plugins",
      "github:aurelia/logging-console@0.2.2/system/index",
      "github:aurelia/templating-binding@0.8.4/system/syntax-interpreter",
      "github:aurelia/route-recognizer@0.2.2/system/dsl",
      "github:aurelia/router@0.5.5/system/navigation-plan",
      "github:aurelia/router@0.5.5/system/navigation-instruction",
      "github:aurelia/router@0.5.5/system/router-configuration",
      "github:aurelia/router@0.5.5/system/util",
      "github:aurelia/history@0.2.2/system/index",
      "github:aurelia/router@0.5.5/system/pipeline",
      "github:aurelia/router@0.5.5/system/model-binding",
      "github:aurelia/router@0.5.5/system/route-loading",
      "github:aurelia/router@0.5.5/system/navigation-commands",
      "github:aurelia/templating-router@0.9.2/system/route-loader",
      "github:aurelia/templating-router@0.9.2/system/router-view",
      "github:aurelia/templating-resources@0.8.7/system/compose",
      "github:aurelia/templating-resources@0.8.7/system/if",
      "github:aurelia/templating-resources@0.8.7/system/repeat",
      "github:aurelia/templating-resources@0.8.7/system/show",
      "github:aurelia/templating-resources@0.8.7/system/selected-item",
      "github:aurelia/templating-resources@0.8.7/system/global-behavior",
      "github:aurelia/event-aggregator@0.2.2/system/index",
      "github:aurelia/history-browser@0.2.3/system/index",
      "dist/behaviors/focus",
      "dist/todo-item",
      "npm:underscore@1.7.0/underscore",
      "dist/app",
      "npm:process@0.10.0",
      "github:aurelia/metadata@0.3.1/system/index",
      "github:aurelia/loader@0.3.3",
      "github:aurelia/path@0.4.3",
      "github:aurelia/logging@0.2.2",
      "github:aurelia/dependency-injection@0.4.2/system/container",
      "github:aurelia/task-queue@0.2.3",
      "github:aurelia/binding@0.3.4/system/array-observation",
      "github:aurelia/binding@0.3.4/system/ast",
      "github:aurelia/templating@0.8.10/system/behaviors",
      "github:aurelia/templating@0.8.10/system/view-factory",
      "github:aurelia/logging-console@0.2.2",
      "github:aurelia/templating-binding@0.8.4/system/binding-language",
      "github:aurelia/route-recognizer@0.2.2/system/index",
      "github:aurelia/router@0.5.5/system/navigation-context",
      "github:aurelia/history@0.2.2",
      "github:aurelia/router@0.5.5/system/activation",
      "github:aurelia/templating-resources@0.8.7/system/index",
      "github:aurelia/event-aggregator@0.2.2",
      "github:aurelia/history-browser@0.2.3",
      "npm:underscore@1.7.0",
      "github:jspm/nodelibs-process@0.1.1/index",
      "github:aurelia/metadata@0.3.1",
      "github:aurelia/dependency-injection@0.4.2/system/index",
      "github:aurelia/binding@0.3.4/system/observer-locator",
      "github:aurelia/binding@0.3.4/system/parser",
      "github:aurelia/templating@0.8.10/system/attached-behavior",
      "github:aurelia/templating@0.8.10/system/view-compiler",
      "github:aurelia/templating-binding@0.8.4/system/index",
      "github:aurelia/route-recognizer@0.2.2",
      "github:aurelia/router@0.5.5/system/pipeline-provider",
      "github:aurelia/templating-resources@0.8.7",
      "dist/todos",
      "github:jspm/nodelibs-process@0.1.1",
      "github:aurelia/loader-default@0.4.1/system/index",
      "github:aurelia/dependency-injection@0.4.2",
      "github:aurelia/binding@0.3.4/system/index",
      "github:aurelia/templating@0.8.10/system/view-engine",
      "github:aurelia/templating-binding@0.8.4",
      "github:aurelia/router@0.5.5/system/router",
      "github:aurelia/router@0.5.5/system/app-router",
      "npm:core-js@0.4.10/index",
      "github:aurelia/loader-default@0.4.1",
      "github:aurelia/binding@0.3.4",
      "github:aurelia/templating@0.8.10/system/custom-element",
      "github:aurelia/router@0.5.5/system/index",
      "npm:core-js@0.4.10",
      "github:aurelia/templating@0.8.10/system/property",
      "github:aurelia/router@0.5.5",
      "github:aurelia/templating@0.8.10/system/index",
      "github:aurelia/templating-router@0.9.2/system/index",
      "github:aurelia/templating@0.8.10",
      "github:aurelia/templating-router@0.9.2",
      "github:aurelia/framework@0.8.6/system/aurelia",
      "github:aurelia/framework@0.8.6/system/index",
      "github:aurelia/framework@0.8.6",
      "github:aurelia/bootstrapper@0.9.3/system/index",
      "github:aurelia/bootstrapper@0.9.3",
      "dist/bundle",
      "dist/main"
    ]
  }
});

System.config({
  "map": {
    "aurelia-bootstrapper": "github:aurelia/bootstrapper@0.9.3",
    "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.2.2",
    "aurelia-framework": "github:aurelia/framework@0.8.6",
    "aurelia-history-browser": "github:aurelia/history-browser@0.2.3",
    "aurelia-http-client": "github:aurelia/http-client@0.4.4",
    "aurelia-logging-console": "github:aurelia/logging-console@0.2.2",
    "aurelia-router": "github:aurelia/router@0.5.5",
    "aurelia-templating": "github:aurelia/templating@0.8.10",
    "aurelia-templating-binding": "github:aurelia/templating-binding@0.8.4",
    "aurelia-templating-resources": "github:aurelia/templating-resources@0.8.7",
    "aurelia-templating-router": "github:aurelia/templating-router@0.9.2",
    "bootstrap": "github:twbs/bootstrap@3.3.2",
    "core-js": "npm:core-js@0.4.10",
    "font-awesome": "npm:font-awesome@4.3.0",
    "nodelibs-process": "github:jspm/nodelibs-process@0.1.1",
    "todomvc-app-css": "npm:todomvc-app-css@1.0.1",
    "todomvc-common": "npm:todomvc-common@1.0.1",
    "underscore": "npm:underscore@1.7.0",
    "github:aurelia/binding@0.3.4": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.2",
      "aurelia-metadata": "github:aurelia/metadata@0.3.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.3"
    },
    "github:aurelia/bootstrapper@0.9.3": {
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.2.2",
      "aurelia-framework": "github:aurelia/framework@0.8.6",
      "aurelia-history": "github:aurelia/history@0.2.2",
      "aurelia-history-browser": "github:aurelia/history-browser@0.2.3",
      "aurelia-loader-default": "github:aurelia/loader-default@0.4.1",
      "aurelia-logging-console": "github:aurelia/logging-console@0.2.2",
      "aurelia-router": "github:aurelia/router@0.5.5",
      "aurelia-templating": "github:aurelia/templating@0.8.10",
      "aurelia-templating-binding": "github:aurelia/templating-binding@0.8.4",
      "aurelia-templating-resources": "github:aurelia/templating-resources@0.8.7",
      "aurelia-templating-router": "github:aurelia/templating-router@0.9.2"
    },
    "github:aurelia/dependency-injection@0.4.2": {
      "aurelia-metadata": "github:aurelia/metadata@0.3.1",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/framework@0.8.6": {
      "aurelia-binding": "github:aurelia/binding@0.3.4",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.2",
      "aurelia-loader": "github:aurelia/loader@0.3.3",
      "aurelia-logging": "github:aurelia/logging@0.2.2",
      "aurelia-metadata": "github:aurelia/metadata@0.3.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.3",
      "aurelia-templating": "github:aurelia/templating@0.8.10"
    },
    "github:aurelia/history-browser@0.2.3": {
      "aurelia-history": "github:aurelia/history@0.2.2",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/http-client@0.4.4": {
      "aurelia-path": "github:aurelia/path@0.4.3",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/loader-default@0.4.1": {
      "aurelia-loader": "github:aurelia/loader@0.3.3",
      "aurelia-metadata": "github:aurelia/metadata@0.3.1",
      "aurelia-path": "github:aurelia/path@0.4.3"
    },
    "github:aurelia/loader@0.3.3": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.2",
      "core-js": "npm:core-js@0.4.10",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.5.4"
    },
    "github:aurelia/router@0.5.5": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.2",
      "aurelia-history": "github:aurelia/history@0.2.2",
      "aurelia-path": "github:aurelia/path@0.4.3",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.2.2",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/templating-binding@0.8.4": {
      "aurelia-binding": "github:aurelia/binding@0.3.4",
      "aurelia-templating": "github:aurelia/templating@0.8.10"
    },
    "github:aurelia/templating-resources@0.8.7": {
      "aurelia-binding": "github:aurelia/binding@0.3.4",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.2",
      "aurelia-templating": "github:aurelia/templating@0.8.10",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/templating-router@0.9.2": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.2",
      "aurelia-metadata": "github:aurelia/metadata@0.3.1",
      "aurelia-path": "github:aurelia/path@0.4.3",
      "aurelia-router": "github:aurelia/router@0.5.5",
      "aurelia-templating": "github:aurelia/templating@0.8.10"
    },
    "github:aurelia/templating@0.8.10": {
      "aurelia-binding": "github:aurelia/binding@0.3.4",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.2",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.2",
      "aurelia-loader": "github:aurelia/loader@0.3.3",
      "aurelia-logging": "github:aurelia/logging@0.2.2",
      "aurelia-metadata": "github:aurelia/metadata@0.3.1",
      "aurelia-path": "github:aurelia/path@0.4.3",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.3",
      "core-js": "npm:core-js@0.4.10"
    },
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
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
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
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.0"
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
    "github:systemjs/plugin-css@0.1.5": {
      "clean-css": "npm:clean-css@3.0.10",
      "fs": "github:jspm/nodelibs-fs@0.1.1"
    },
    "github:twbs/bootstrap@3.3.2": {
      "css": "github:systemjs/plugin-css@0.1.5",
      "jquery": "github:components/jquery@2.1.3"
    },
    "npm:amdefine@0.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.0.2": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.4",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:clean-css@3.0.10": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.5.1",
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.0",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.1.43",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.5.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.4.10": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:events-browserify@0.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
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
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:source-map@0.1.43": {
      "amdefine": "npm:amdefine@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
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
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

