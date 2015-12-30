/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/routing/Target'],
	function(Target) {
		"use strict";

		/**
		 * The mobile extension for targets that target the controls {@link sap.m.SplitContainer} or a {@link sap.m.NavContainer} and all controls extending these.
		 * Other controls are also allowed, but the extra parameters listed below will just be ignored.
		 *
		 * Don't call this constructor directly, use {@link sap.m.Targets} instead, it will create instances of a Target
		 * The parameters you may pass into {@link sap.m.Targets#constructor} are described here.
		 * Please have a look at {@link sap.ui.core.Target#constructor} all values allowed in this constructor will be allowed here, plus the additional parameters listed below:
		 *
		 * @class
		 * @extends sap.ui.core.routing.Target
		 * @private
		 * @alias sap.m.routing.Target
		 */
		var MobileTarget = Target.extend("sap.m.routing.Target", /** @lends sap.m.routing.Target.prototype */ {
			constructor : function (oOptions, oViews, oParent, oTargetHandler) {
				this._oTargetHandler = oTargetHandler;

				Target.prototype.constructor.apply(this, arguments);
			},

			_place : function (oParentInfo, vData) {
				var oReturnValue = Target.prototype._place.apply(this, arguments);

				this._oTargetHandler.addNavigation({

					navigationIdentifier : this._oOptions.name,
					transition: this._oOptions.transition,
					transitionParameters: this._oOptions.transitionParameters,
					eventData: vData,
					targetControl: oReturnValue.oTargetControl,
					view: oReturnValue.oTargetParent,
					preservePageInSplitContainer: this._oOptions.preservePageInSplitContainer
				});

				return oReturnValue;

			}
		});

		return MobileTarget;

	}, /* bExport= */ true);
