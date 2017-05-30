# CHANGELOG

## 0.3.0
* View now binds subviews gracefully on "component-did-update" event. When parent DOM changes already bound subviews stay untouched while new one get created for newly appeared matching nodes.
* View gets boolean property `didComponentMount`
* Upgrated up to ngTemplate 0.1.8

## 0.2.2
* View triggers component-will-update/component-did-update/component-will-mount/component-did-mount events, so one can subscribe like this.listenToOnce( this, "..", ...);
* Now collections may have getters available in template
* Now template can be asynchronously loaded. See parameter `templateUrl` into view/component options

## 0.2.1
* Upgrated up to ngTemplate 0.1.7

## 0.2.0
* FormView now fully delegates control validation to Form API ValidityState
* Custom types in FormView get deprecated. FormView treats instead `data-ng-validate` attribute, which accepts multiple validators per control

## 0.1.3
* Introducing React lifecycle methods componentWillMount, componentDidMount, shouldComponentUpdate, componentWillUpdate, componentDidUpdate.
* Two-way view communication: parent view to child one and child to parent

