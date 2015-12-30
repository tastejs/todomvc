(function(jQuery){
	
	var MESSAGE = "The file sap/ui/thirdparty/jqueryui/jquery-effects-fade.js has been renamed to sap/ui/thirdparty/jqueryui/jquery-ui-effect-fade.js! Please update the dependencies accordingly.";

	if ( jQuery && jQuery.sap && jQuery.sap.require ) {
		// if jQuery.sap is available, require the new module and log a warning
		jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-effect-fade");
		jQuery.sap.log.warning(MESSAGE);
	} else {
		throw new Error(MESSAGE);
	}

})(window.jQuery);