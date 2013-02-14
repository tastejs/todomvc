/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("autocomplete-list-keys",function(e,t){function u(){e.before(this._bindKeys,this,"bindUI"),this._initKeys()}var n=40,r=13,i=27,s=9,o=38;u.prototype={_initKeys:function(){var e={},t={};e[n]=this._keyDown,t[r]=this._keyEnter,t[i]=this._keyEsc,t[s]=this._keyTab,t[o]=this._keyUp,this._keys=e,this._keysVisible=t},destructor:function(){this._unbindKeys()},_bindKeys:function(){this._keyEvents=this._inputNode.on("keydown",this._onInputKey,this)},_unbindKeys:function(){this._keyEvents&&this._keyEvents.detach(),this._keyEvents=null},_keyDown:function(){this.get("visible")?this._activateNextItem():this.show()},_keyEnter:function(e){var t=this.get("activeItem");if(!t)return!1;this.selectItem(t,e)},_keyEsc:function(){this.hide()},_keyTab:function(e){var t;if(this.get("tabSelect")){t=this.get("activeItem");if(t)return this.selectItem(t,e),!0}return!1},_keyUp:function(){this._activatePrevItem()},_onInputKey:function(e){var t,n=e.keyCode;this._lastInputKey=n,this.get("results").length&&(t=this._keys[n],!t&&this.get("visible")&&(t=this._keysVisible[n]),t&&t.call(this,e)!==!1&&e.preventDefault())}},e.Base.mix(e.AutoCompleteList,[u])},"3.7.3",{requires:["autocomplete-list","base-build"]});
