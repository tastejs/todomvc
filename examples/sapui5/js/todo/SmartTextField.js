/*global jQuery, sap */
/*jshint unused:false */

/*
 * A text field that supports placeholder values and autofocus
 */
(function () {
	'use strict';

	jQuery.sap.declare('todo.SmartTextField');

	jQuery.sap.require('sap.ui.core.Core', 'sap.ui.commons.TextField');

	sap.ui.commons.TextField.extend('todo.SmartTextField', {
		metadata: {
			properties: {
				placeholder: 'string',
				autofocus: 'boolean',
				strongediting: 'boolean'
			}
		},
		renderer: {
			renderInnerAttributes: function (oRm, oTextField) {
				if (oTextField.getProperty('placeholder')) {
					oRm.writeAttributeEscaped('placeholder', oTextField
						.getPlaceholder());
				}
			}
		},
		onAfterRendering: function (e) {
			var $domRef = this.$();
			if (this.getProperty('autofocus')) {
				$domRef.focus();
			}

			if (this.getProperty('strongediting')) {
				this.setEditable(false);

				this.attachBrowserEvent('dblclick', function (e) {
					var $domRef = this.$();
					this.setEditable(true);
					$domRef.get(0).selectionStart = $domRef.get(0).selectionEnd = $domRef.val().length;
				});

				this.attachChange(function () {
					this.setEditable(false);
				});
			}
		},
		onfocusout: function (e) {
			this.stopEditing(e);
		},
		onsapenter: function (e) {
			this.stopEditing(e);
		},
		stopEditing: function (e) {
			this._checkChange(e);
			if (this.getProperty('strongediting')) {
				if (!this.getEditable()) {
					return;
				}

				this.setEditable(false);
				this.getModel().updateBindings(true);
			}
		}
	});
})();
