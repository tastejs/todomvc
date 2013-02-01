(function() {
  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  function nonEmpty(x) { return x && x.length > 0 }

  Bacon.UI = {}
  Bacon.UI.textFieldValue = function(textfield, initValue) {
    function getValue() { return textfield.val() }
    function autofillPoller() {
      if (textfield.attr("type") == "password")
        return Bacon.interval(100)
      else if (isChrome)
        return Bacon.interval(100).take(20).map(getValue).filter(nonEmpty).take(1)
      else
        return Bacon.never()
    }
    if (initValue !== null) {
      textfield.val(initValue)
    }
    return textfield.asEventStream("keyup input").
      merge(textfield.asEventStream("cut paste").delay(1)).
      merge(autofillPoller()).
      map(getValue).toProperty(getValue()).skipDuplicates()
  }
  Bacon.UI.optionValue = function(option) {
    function getValue() { return option.val() }
    return option.asEventStream("change").map(getValue).toProperty(getValue())
  }
  Bacon.UI.checkBoxGroupValue = function(checkboxes, initValue) {
    function selectedValues() {
      return checkboxes.filter(":checked").map(function(i, elem) { return $(elem).val()}).toArray()
    }
    if (initValue) {
      checkboxes.each(function(i, elem) {
        $(elem).attr("checked", initValue.indexOf($(elem).val()) >= 0)
      })
    }
    return checkboxes.asEventStream("click").map(selectedValues).toProperty(selectedValues())
  }
  Bacon.UI.ajax = function(params) {
    return Bacon.fromPromise($.ajax(params))
  }
  Bacon.Observable.prototype.awaiting = function(response) {
    return this.map(true).merge(response.map(false)).toProperty(false).skipDuplicates()
  }
  Bacon.EventStream.prototype.ajax = function() {
    return this["switch"](Bacon.UI.ajax)
  }
  Bacon.UI.radioGroupValue = function(options, initValue) {
    var initialValue = options.filter(':checked').val()
    if (initValue) {
      options.filter("[value=" + initValue + "]").attr("checked", true)
    }
    return options.asEventStream("change").map('.target.value').toProperty(initialValue)
  }
  Bacon.UI.checkBoxValue = function(checkbox, initValue) {
    if (initValue !== null) {
      checkbox.attr("checked", initValue)
    }
    function isChecked() { return !!checkbox.attr("checked") }
    return checkbox.asEventStream("change").map(isChecked).toProperty(isChecked()).skipDuplicates()
  }
  Bacon.UI.hash = function(defaultValue) {
    if (defaultValue === undefined) defaultValue = ""
    function getHash() { return !!document.location.hash ? document.location.hash : defaultValue }
    return $(window).asEventStream("hashchange").map(getHash).toProperty(getHash()).skipDuplicates()
  }
})();
