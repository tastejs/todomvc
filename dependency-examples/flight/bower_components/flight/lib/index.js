// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define(

  [
    './advice',
    './component',
    './compose',
    './logger',
    './registry',
    './utils'
  ],

  function(advice, component, compose, logger, registry, utils) {
    'use strict';

    return {
      advice: advice,
      component: component,
      compose: compose,
      logger: logger,
      registry: registry,
      utils: utils
    };

  }
);
