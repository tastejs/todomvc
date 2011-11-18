/*
  knockback-todos.js
  (c) 2011 Kevin Malakoff.
  Knockback-Todos is freely distributable under the MIT license.
  See the following for full license details:
    https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
*/
var LocaleManager, LongDateLocalizer, kb;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
LocaleManager = (function() {
  function LocaleManager(locale_identifier, translations_by_locale) {
    this.translations_by_locale = translations_by_locale;
    if (locale_identifier) {
      this.setLocale(locale_identifier);
    }
  }
  LocaleManager.prototype.get = function(string_id, parameters) {
    var arg, culture_map, index, string, _len, _ref;
    if (this.locale_identifier) {
      culture_map = this.translations_by_locale[this.locale_identifier];
    }
    if (!culture_map) {
      return '';
    }
    string = culture_map.hasOwnProperty(string_id) ? culture_map[string_id] : '';
    if (arguments === 1) {
      return string;
    }
    _ref = Array.prototype.slice.call(arguments, 1);
    for (index = 0, _len = _ref.length; index < _len; index++) {
      arg = _ref[index];
      string = string.replace("{" + index + "}", arg);
    }
    return string;
  };
  LocaleManager.prototype.getLocale = function() {
    return this.locale_identifier;
  };
  LocaleManager.prototype.setLocale = function(locale_identifier) {
    var culture_map, key, value, _results;
    this.locale_identifier = locale_identifier;
    Globalize.culture = Globalize.findClosestCulture(locale_identifier);
    if (!window.Backbone) {
      return;
    }
    this.trigger('change', this);
    culture_map = this.translations_by_locale[this.locale_identifier];
    if (!culture_map) {
      return;
    }
    _results = [];
    for (key in culture_map) {
      value = culture_map[key];
      _results.push(this.trigger("change:" + key, value));
    }
    return _results;
  };
  LocaleManager.prototype.getLocales = function() {
    var locales, string_id, value, _ref;
    locales = [];
    _ref = this.translations_by_locale;
    for (string_id in _ref) {
      value = _ref[string_id];
      locales.push(string_id);
    }
    return locales;
  };
  LocaleManager.prototype.localeToLabel = function(locale) {
    var locale_parts;
    locale_parts = locale.split('-');
    return locale_parts[locale_parts.length - 1].toUpperCase();
  };
  LocaleManager.prototype.localizeDate = function(date) {
    return Globalize.format(date, Globalize.cultures[this.locale_identifier].calendars.standard.patterns.f, this.locale_identifier);
  };
  return LocaleManager;
})();
if (!!window.Backbone) {
  __extends(LocaleManager.prototype, Backbone.Events);
}
kb || (kb = {});
kb.locale_manager = new LocaleManager(null, {
  'en': {
    placeholder_create: 'What needs to be done?',
    tooltip_create: 'Press Enter to save this task',
    label_text: 'Name',
    label_created: 'Created',
    label_priority: 'Priority',
    label_completed: 'Completed',
    instructions: 'Double-click to edit a todo.',
    high: 'high',
    medium: 'medium',
    low: 'low',
    remaining_template_s: '{0} item remaining',
    remaining_template_pl: '{0} items remaining',
    clear_template_s: 'Clear {0} completed item',
    clear_template_pl: 'Clear {0} completed items'
  },
  'fr-FR': {
    placeholder_create: 'Que faire?',
    tooltip_create: 'Appuyez sur Enter pour enregistrer cette tâche',
    label_text: 'Nom',
    label_created: 'Création',
    label_priority: 'Priorité',
    label_completed: 'Complété',
    instructions: 'Double-cliquez pour modifier un todo.',
    high: 'haute',
    medium: 'moyen',
    low: 'bas',
    remaining_template_s: '{0} point restant',
    remaining_template_pl: '{0} éléments restants',
    clear_template_s: 'Retirer {0} point terminée',
    clear_template_pl: 'Retirer les {0} éléments terminés'
  },
  'it-IT': {
    placeholder_create: 'Cosa fare?',
    tooltip_create: 'Premere Enter per salvare questo compito',
    label_text: 'Nome',
    label_created: 'Creato',
    label_priority: 'Priorità',
    label_completed: 'Completato',
    instructions: 'Fare doppio clic per modificare una delle cose da fare.',
    high: 'alto',
    medium: 'medio',
    low: 'basso',
    remaining_template_s: '{0} elemento restante',
    remaining_template_pl: '{0} elementi rimanenti',
    clear_template_s: 'Rimuovere {0} elemento completato',
    clear_template_pl: 'Rimuovere {0} elementi completato'
  }
});
if (!!window.Backbone) {
  LongDateLocalizer = (function() {
    __extends(LongDateLocalizer, kb.LocalizedObservable);
    function LongDateLocalizer() {
      return LongDateLocalizer.__super__.constructor.apply(this, arguments);
    }
    LongDateLocalizer.prototype.read = function(value) {
      return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.f, kb.locale_manager.getLocale());
    };
    LongDateLocalizer.prototype.write = function(localized_string, value, observable) {
      var new_value;
      new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
      return value.setTime(new_value.valueOf());
    };
    return LongDateLocalizer;
  })();
}