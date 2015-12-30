/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', '../Device', './Core', 'sap/ui/thirdparty/URI'],
	function(jQuery, Device, core, URI) {
	"use strict";

		var aIconNames = ["accidental-leave","account","wrench","windows-doors","washing-machine","visits","video","travel-expense","temperature","task","synchronize","survey","settings","search","sales-document","retail-store","refresh","product","present","ppt-attachment","pool","pie-chart","picture","photo-voltaic","phone","pending","pdf-attachment","past","outgoing-call","opportunity","opportunities","notes","money-bills","map","log","line-charts","lightbulb","leads","lead","laptop","kpi-managing-my-area","kpi-corporate-performance","incoming-call","inbox","horizontal-bar-chart","history","heating-cooling","gantt-bars","future","fridge","fallback","expense-report","excel-attachment","energy-saving-lightbulb","employee","email","edit","duplicate","download","doc-attachment","dishwasher","delete","decline","complete","competitor","collections-management","chalkboard","cart","card","camera","calendar","begin","basket","bar-chart","attachment","arrow-top","arrow-right","arrow-left","arrow-bottom","approvals","appointment","alphabetical-order","along-stacked-chart","alert","addresses","address-book","add-filter","add-favorite","add","activities","action","accept","hint","group","check-availability","weather-proofing","payment-approval","batch-payments","bed","arobase","family-care","favorite","navigation-right-arrow","navigation-left-arrow","e-care","less","lateness","lab","internet-browser","instance","inspection","image-viewer","home","grid","goalseek","general-leave-request","create-leave-request","flight","filter","favorite-list","factory","endoscopy","employee-pane","employee-approvals","email-read","electrocardiogram","documents","decision","database","customer-history","customer","credit-card","create-entry-time","contacts","compare","clinical-order","chain-link","pull-down","cargo-train","car-rental","business-card","bar-code","folder-blank","passenger-train","question-mark","world","iphone","ipad","warning","sort","course-book","course-program","add-coursebook","print","save","play","pause","record","response","pushpin-on","pushpin-off","unfavorite","learning-assistant","timesheet","time-entry-request","list","action-settings","share","feed","role","flag","post","inspect","inspect-down","appointment-2","target-group","marketing-campaign","notification","message-error","comment","shipping-status","collaborate","shortcut","lead-outdated","tools-opportunity","permission","supplier","table-view","table-chart","switch-views","e-learning","manager","switch-classes","simple-payment","signature","sales-order-item","sales-order","request","receipt","puzzle","process","private","popup-window","person-placeholder","per-diem","paper-plane","paid-leave","pdf-reader","overview-chart","overlay","org-chart","number-sign","notification-2","my-sales-order","meal","loan","order-status","customer-order-entry","performance","menu","employee-lookup","education","customer-briefing","customer-and-contacts","my-view","accelerated","to-be-reviewed","warning2","feeder-arrow","quality-issue","workflow-tasks","create","home-share","globe","tags","work-history","x-ray","wounds-doc","web-cam","waiver","vertical-bar-chart","upstacked-chart","trip-report","microphone","unpaid-leave","tree","toaster-up","toaster-top","toaster-down","time-account","theater","taxi","subway-train","study-leave","stethoscope","step","sonography","soccor","physical-activity","pharmacy","official-service","offsite-work","nutrition-activity","newspaper","monitor-payments","map-2","machine","mri-scan","end-user-experience-monitoring","unwired","customer-financial-fact-sheet","retail-store-manager","Netweaver-business-client","electronic-medical-record","eam-work-order","customer-view","crm-service-manager","crm-sales","widgets","commission-check","collections-insight","clinical-tast-tracker","citizen-connect","cart-approval","capital-projects","bo-strategy-management","business-objects-mobile","business-objects-explorer","business-objects-experience","bbyd-dashboard","bbyd-active-sales","business-by-design","business-one","sap-box","manager-insight","accounting-document-verification","hr-approval","idea-wall","Chart-Tree-Map","cart-5","cart-4","wallet","vehicle-repair","upload","unlocked","umbrella","travel-request","travel-expense-report","travel-itinerary","time-overtime","thing-type","technical-object","tag","syringe","syntax","suitcase","simulate","shield","share-2","sales-quote","repost","provision","projector","add-product","pipeline-analysis","add-photo","palette","nurse","sales-notification","mileage","meeting-room","media-forward","media-play","media-pause","media-reverse","media-rewind","measurement-document","measuring-point","measure","map-3","locked","letter","journey-arrive","journey-change","journey-depart","it-system","it-instance","it-host","iphone-2","ipad-2","inventory","insurance-house","insurance-life","insurance-car","initiative","incident","group-2","goal","functional-location","full-screen","form","fob-watch","blank-tag","family-protection","folder","fax-machine","example","eraser","employee-rejections","drop-down-list","draw-rectangle","document","doctor","discussion-2","discussion","dimension","customer-and-supplier","crop","add-contact","compare-2","color-fill","collision","curriculum","chart-axis","full-stacked-chart","full-stacked-column-chart","vertical-bar-chart-2","horizontal-bar-chart-2","horizontal-stacked-chart","vertical-stacked-chart","choropleth-chart","geographic-bubble-chart","multiple-radar-chart","radar-chart","crossed-line-chart","multiple-line-chart","multiple-bar-chart","line-chart","line-chart-dual-axis","bubble-chart","scatter-chart","multiple-pie-chart","column-chart-dual-axis","tag-cloud-chart","area-chart","cause","cart-3","cart-2","bus-public-transport","burglary","building","border","bookmark","badge","attachment-audio","attachment-video","attachment-html","attachment-photo","attachment-e-pub","attachment-zip-file","attachment-text-file","add-equipment","add-activity","activity-individual","activity-2","add-activity-2","activity-items","activity-assigned-to-goal","status-completed","status-positive","status-error","status-negative","status-inactive","status-in-process","status-critical","blank-tag-2","cart-full","locate-me","paging","company-view","document-text","explorer","personnel-view","sorting-ranking","drill-down","drill-up","vds-file","sap-logo-shape","folder-full","system-exit","system-exit-2","close-command-field","open-command-field","sys-enter-2","sys-enter","sys-help-2","sys-help","sys-back","sys-back-2","sys-cancel","sys-cancel-2","open-folder","sys-find-next","sys-find","sys-monitor","sys-prev-page","sys-first-page","sys-next-page","sys-last-page","generate-shortcut","create-session","display-more","enter-more","zoom-in","zoom-out","header","detail-view","collapse","expand","positive","negative","display","menu2","redo","undo","navigation-up-arrow","navigation-down-arrow","down","up","shelf","background","resize","move","show","hide","nav-back","error","slim-arrow-right","slim-arrow-left","slim-arrow-down","slim-arrow-up","forward","overflow","value-help","multi-select","exit-full-screen","sys-add","sys-minus","dropdown","expand-group","collapse-group","vertical-grip","horizontal-grip","sort-descending","sort-ascending","arrow-down","legend","message-warning","message-information","message-success","restart","stop","add-process","cancel-maintenance","activate","resize-horizontal","resize-vertical","connected","disconnected","edit-outside","key","minimize","back-to-top","hello-world","outbox","donut-chart","heatmap-chart","horizontal-bullet-chart","vertical-bullet-chart","call","download-from-cloud","upload-to-cloud","jam","sap-ui5","message-popup","cloud"];
		var aIconCodes = ["e000","e001","e002","e003","e004","e005","e006","e007","e008","e009","e00a","e00b","e00c","e00d","e00e","e00f","e010","e011","e012","e013","e014","e015","e016","e017","e018","e019","e01a","e01b","e01c","e01d","e01e","e01f","e020","e021","e022","e023","e024","e025","e026","e027","e028","e029","e02a","e02b","e02c","e02d","e02e","e02f","e030","e031","e032","e033","e034","e035","e036","e037","e038","e039","e03a","e03b","e03c","e03d","e03e","e03f","e040","e041","e042","e043","e044","e045","e046","e047","e048","e049","e04a","e04b","e04c","e04d","e04e","e04f","e050","e051","e052","e053","e054","e055","e056","e057","e058","e059","e05a","e05b","e05c","e05d","e05e","e05f","e060","e061","e062","e063","e064","e065","e066","e067","e068","e069","e06a","e06b","e06c","e06d","e06e","e06f","e070","e071","e072","e073","e074","e075","e076","e077","e078","e079","e07a","e07b","e07c","e07d","e07e","e07f","e080","e081","e082","e083","e084","e085","e086","e087","e088","e089","e08a","e08b","e08c","e08d","e08e","e08f","e090","e091","e092","e093","e094","e095","e096","e097","e098","e099","e09a","e09b","e09c","e09d","e09e","e09f","e0a0","e0a1","e0a2","e0a3","e0a4","e0a5","e0a6","e0a7","e0a8","e0a9","e0aa","e0ab","e0ac","e0ad","e0ae","e0af","e0b0","e0b1","e0b1","e0b2","e0b3","e0b4","e0b5","e0b6","e0b7","e0b8","e0b9","e0ba","e0bb","e0bc","e0bd","e0be","e0bf","e0c0","e0c1","e0c2","e0c3","e0c4","e0c5","e0c6","e0c7","e0c8","e0c9","e0ca","e0cb","e0cc","e0cd","e0ce","e0cf","e0d0","e0d1","e0d2","e0d3","e0d4","e0d5","e0d6","e0d7","e0d8","e0d9","e0da","e0db","e0dc","e0dd","e0de","e0df","e0e0","e0e1","e0e2","e0e3","e0e4","e0e5","e0e6","e0e7","e0e8","e0e9","e0ea","e0eb","e0ec","e0ed","e0ee","e0ef","e0f0","e0f1","e0f2","e0f3","e0f4","e0f5","e0f6","e0f7","e0f8","e0f9","e0fa","e0fb","e0fc","e0fd","e0fe","e0ff","e100","e101","e102","e103","e104","e105","e106","e107","e108","e109","e10a","e10b","e10c","e10d","e10e","e10f","e110","e111","e112","e113","e114","e115","e116","e117","e118","e119","e11a","e11b","e11c","e11d","e11e","e11f","e120","e121","e122","e123","e124","e125","e126","e127","e128","e129","e12a","e12b","e12c","e12d","e12e","e12f","e130","e131","e132","e133","e134","e135","e136","e137","e138","e139","e13a","e13b","e13c","e13d","e13e","e13f","e140","e141","e142","e143","e144","e145","e146","e147","e148","e149","e14a","e14b","e14c","e14d","e14e","e14f","e150","e151","e152","e153","e154","e155","e156","e157","e158","e159","e15a","e15b","e15c","e15d","e15e","e15f","e160","e161","e162","e163","e164","e165","e166","e167","e168","e169","e16a","e16b","e16c","e16d","e16e","e16f","e170","e171","e172","e173","e174","e175","e176","e177","e178","e179","e17a","e17b","e17c","e17d","e17e","e17f","e180","e181","e182","e183","e184","e185","e186","e187","e188","e189","e18a","e18b","e18c","e18d","e18e","e18f","e190","e191","e192","e193","e194","e195","e196","e197","e198","e199","e19a","e19b","e19c","e19d","e19e","e19f","e1a0","e1a1","e1a2","e1a3","e1a4","e1a5","e1a6","e1a7","e1a8","e1a9","e1aa","e1ab","e1ab","e1ac","e1ac","e1ad","e1ae","e1ae","e1af","e1b0","e1b1","e1b2","e1b3","e1b4","e1b5","e1b6","e1b7","e1b8","e1b9","e1ba","e1bb","e1bc","e1bd","e1be","e1bf","e1c0","e1c1","e1c2","e1c3","e1c4","e1c5","e1c6","e1c7","e1c8","e1c9","e1ca","e1cb","e1cc","e1cd","e1ce","e1cf","e1d0","e1d1","e1d2","e1d3","e1d4","e1d5","e1d6","e1d7","e1d8","e1d9","e1da","e1db","e1dc","e1dd","e1de","e1df","e1e0","e1e1","e1e2","e1e3","e1e4","e1e5","e1e6","e1e7","e1e8","e1e9","e1ea","e1eb","e1ec","e1ed","e1ee","e1ef","e1f0","e1f1","e1f2","e1f3","e1f4","e1f5","e1f6","e1f7","e1f8","e1f9","e200","e1fa","e1fb","e1fc","e1fd","e1fe","e1ff","e201","e202","e203","e204","e205","e206","e207","e208","e209","e20a","e20b","e20c","e20d","e20e","e20f","e210","e211","e212","e213","e214","e215","e216","e217","e218","e219","e21a","e21b","e21c","e21d"];
		var mIconSuppressMirroring = {"chalkboard": true, "calendar": true, "alphabetical-order": true, "address-book": true, "hint": true, "payment-approval": true, "batch-payments": true, "arobase": true, "question-mark": true, "lead": true, "lead-outdated": true, "simple-payment": true, "sales-order-item": true, "sales-order": true, "per-diem": true, "paid-leave": true, "pdf-reader": true, "my-sales-order": true, "loan": true, "globe": true, "waiver": true, "unpaid-leave": true, "customer-financial-fact-sheet": true, "crm-sales": true, "commission-check": true, "collections-insight": true, "capital-projects": true, "business-one": true, "travel-expense": true, "travel-expense-report": true, "travel-request": true, "time-overtime": true, "sales-quote": true, "sales-notification": true, "incident": true, "money-bills": true, "sales-document": true, "opportunities": true, "expense-report": true, "monitor-payments": true, "widgets": true, "sys-help-2": true, "sys-help": true, "accept": true, "accounting-document-verification": true, "activities": true, "activity-2": true, "add-activity": true, "add-activity-2": true, "approvals": true, "bbyd-active-sales": true, "business-by-design": true, "cart-approval": true, "complete": true, "customer-order-entry": true, "employee-approvals": true, "hr-approval": true, "kpi-corporate-performance": true, "kpi-managing-my-area": true, "survey": true, "sys-enter": true, "sys-enter-2": true, "task": true, "message-information": true, "past": true, "future": true, "check-availability": true, "order-status": true, "eam-work-order": true, "message-success": true, "choropleth-chart": true, "geographic-bubble-chart": true, "sap-logo-shape": true, "play": true, "media-play": true, "media-reverse": true, "media-rewind": true, "media-forward": true};

		// Keep this in sync with "sap/ui/core/messagebundle.properties". Only icons with a translation should be listed
		var mIconI18nKey = {"activate": true, "add": true, "add-contact": true, "add-filter": true, "add-photo": true, "back-to-top": true, "collapse": true, "collapse-group": true, "crop": true, "decline": true, "delete": true, "display": true, "download": true, "drill-down": true, "drill-up": true, "error": true, "exit-full-screen": true, "expand": true, "expand-group": true, "filter": true, "flag": true, "forward": true, "full-screen": true, "generate-shortcut": true, "hide": true, "ipad": true, "ipad-2": true, "iphone": true, "iphone-2": true, "laptop": true, "message-error": true, "message-information": true, "message-success": true, "message-warning": true, "move": true, "multi-select": true, "nav-back": true, "overflow": true, "redo": true, "refresh": true, "resize": true, "resize-horizontal": true, "resize-vertical": true, "response": true, "save": true, "search": true, "settings": true, "show": true, "sort": true, "sort-ascending": true, "sort-descending": true, "synchronize": true, "undo": true, "upload": true, "zoom-in": true, "zoom-out": true, "group-2": true};

		var sapIconFamily = "SAP-icons";
		var sProtocolName = "sap-icon";
		
		var mRegistry = {};
		
		var bFontFaceInserted = false;
		
		var oCoreResourceBundle = core.getLibraryResourceBundle("sap.ui.core");
		
		/**
		 * Constructor for IconPool - must not be used: all of the methods that are under 
		 * IconPool are static methods.
		 *
		 * @class
		 * The IconPool is a static class for retrieving or registering icons.
		 * It also provides helping methods for easier consumption of icons.
		 * There are already icons registered in IconPool, please use the Demo App named 
		 * "Icon Explorer" to find the name of the icon.
		 * 
		 * In order to use the icon inside an existing control, please call 
		 * sap.ui.core.IconPool.getIconURI and assign the URI to the control's property
		 * which supports icons.
		 * If you want to support icons and standard images in your own control, please use
		 * the static method sap.ui.core.IconPool.createControlByURI to create an Icon in
		 * case the first argument is an icon-URL or another control which you define by 
		 * providing it as the second argument.
		 * 
		 * @public
		 * @alias sap.ui.core.IconPool
		 */
		var IconPool = function(){
			// Do not use the constructor
			throw new Error();
		};
		
		/**
		 * Creates an instance of sap.ui.core.Icon if the given URI is an icon URI, otherwise the given constructor is called.
		 * The given URI is set to the src property of the control.
		 *
		 * @param {string|object} setting contains the properties which will be used to instantiate the returned control. It should contain at least a property named src. If it's given with a string type, it will be taken as the value of src property.
		 * @param {function} constructor the constructor function which is called when the given URI isn't an icon URI
		 * @return {sap.ui.core.Control} either an instance of sap.ui.core.Icon or instance created by calling the given constructor
		 * @static
		 * @public
		 */
		IconPool.createControlByURI = function(setting, constructor){
			if (typeof setting === "string") {
				setting = {src: setting};
			}
			
			if (setting && setting.src) {
				var sSrc = setting.src,
					fnConstructor = constructor;
				if (IconPool.isIconURI(sSrc)) {
					if (!sap.ui.core.Icon) {
						jQuery.sap.require("sap.ui.core.Icon");
					}
					fnConstructor = sap.ui.core.Icon;
					//converting to press event in case tap is specified
					if (setting.tap) {
						setting.press = setting.tap;
						delete setting.tap;
					}
				}
				if (typeof fnConstructor === "function") {
					// remove unsupported settings (e.g. some for Image/Icon)
					setting = fnConstructor.getMetadata().removeUnknownSettings(setting);
					return new fnConstructor(setting);
				}
			}
		};
		
		/**
		 * Register an additional icon to the sap.ui.core.IconPool.
		 *
		 * @param {string} iconName the name of the icon.
		 * @param {string} collectionName the name of icon collection. The built in icons are with empty collectionName, so if additional icons need to be registered in IconPool, the collectionName can't be empty.  
		 * @param {object} iconInfo the icon info which contains the following properties:
		 * @param {string} iconInfo.fontFamily is the name of the font when importing the font using @font-face in CSS
		 * @param {string|string[]} iconInfo.content is the special hexadecimal code without the prefix, for example "e000" or several of them
		 * @param {boolean} [iconInfo.overWrite=false] indicates if already registered icons should be overwritten when the same name and collection are given. The built in icons can never be overwritten.
		 * @param {boolean} [iconInfo.suppressMirroring=false] indicates whether this icon should NOT be mirrored in RTL (right to left) mode.
		 * @param {jQuery.sap.util.ResourceBundle} [iconInfo.resourceBundle] ResourceBundle to be used for translation. Key format: "Icon.<iconName>".
		 *
		 * @return {object} the info object of the registered icon which has the name, collection, uri, fontFamily, content and suppressMirroring properties.
		 * @static
		 * @public
		 */
		IconPool.addIcon = function(iconName, collectionName, iconInfo){
			// OLD API Compatibility fontFamily, content, overWrite, suppressMirroring
			if (typeof iconInfo === "string") {
				iconInfo = {
					fontFamily: arguments[2],
					content: arguments[3],
					overWrite: !!arguments[4],
					suppressMirroring: !!arguments[5]
				};
			}
			
			if (!mRegistry[collectionName]) {
				mRegistry[collectionName] = {};
			}
			
			var collection = mRegistry[collectionName],
				icon, oldIcon = collection[iconName],
				parts;
			
			if (oldIcon && (collectionName === undefined || !iconInfo.overWrite)) {
				jQuery.sap.log.warning("icon with the same iconName in the collection already exists, specify the last parameter to true in order to overwrite");
				return;
			}
			
			parts = {
				protocol: sProtocolName,
				hostname: collectionName || iconName,
				path: collectionName ? iconName : undefined
			};
			
			if (!Array.isArray(iconInfo.content)) {
				iconInfo.content = [ iconInfo.content ];
			}
			var sContent = "";
			for (var i = 0; i < iconInfo.content.length; ++i) {
				sContent += String.fromCharCode(parseInt(iconInfo.content[i], 16));
			}

			var sText;
			if (jQuery.sap.resources.isBundle(iconInfo.resourceBundle)) {
				var sKey = "Icon." + iconName;
				sText = iconInfo.resourceBundle.getText(sKey);
			} else {
				sText = "";
			}

			icon = {
				name: iconName,
				collection: collectionName,
				uri: window.URI.build(parts),
				fontFamily: iconInfo.fontFamily,
				content: sContent,
				text: sText,
				suppressMirroring: iconInfo.suppressMirroring,
				//keep compatibility with old name
				skipMirroring: iconInfo.suppressMirroring
			};
			
			collection[iconName] = icon;
			return icon;
		};


		/**
		 * Returns the URI of the icon which has the same given iconName and collectionName.
		 *
		 * @param {string} iconName the name of the icon.
		 * @param {string} collectionName the name of icon collection. The built in icons are with undefined collectionName, so if the built in icons need to be used, just ignore this parameter.
		 * @return {string} the URI of the icon. if the icon can't be found in IconPool, undefined is returned. 
		 * @static
		 * @public
		 */
		IconPool.getIconURI = function(iconName, collectionName){
			var collection = mRegistry[collectionName];
			
			if (collection && collection[iconName]) {
				return collection[iconName].uri;
			}
		};
		
		/**
		 * Returns the info object of the icon which has the same given iconName and collectionName.
		 *
		 * @param {string} iconName the name of the icon.
		 * @param {string} collectionName the name of icon collection. The built in icons are with undefined collectionName, so if the built in icons need to be used, just ignore this parameter.
		 * @return {object} the info object of the registered icon which has the uri, fontFamily and content properties. 
		 * @static
		 * @public
		 */
		IconPool.getIconInfo = function(iconName, collectionName){
			IconPool.insertFontFaceStyle();
			
			var sParsedIconName = iconName,
				sParsedCollectionName = collectionName,
				parts,
				collection;
			
			if (this.isIconURI(iconName)) {
				parts = window.URI.parse(iconName);
				
				if (parts.path.length === 1) {
					sParsedIconName = parts.hostname;
					sParsedCollectionName = undefined;
				} else {
					sParsedCollectionName = parts.hostname;
					sParsedIconName = parts.path.substr(1, parts.path.length);
				}
			}
			
			collection = mRegistry[sParsedCollectionName];
			
			return collection && collection[sParsedIconName];
		};
		
		/**
		 * Returns If the given uri is an icon URI.
		 *
		 * @param {string} uri the icon uri which is in the format "sap-icon://collectionName/iconName"
		 * @return {boolean} if the uri follows the icon uri format. 
		 * @static
		 * @public
		 */
		IconPool.isIconURI = function(uri){
			if (!uri) {
				return false;
			}
			var parts = window.URI.parse(uri);
			
			return (parts.protocol === sProtocolName) && !!parts.hostname;
		};
		
		/**
		 * Returns all names of registered collections in IconPool
		 *
		 * @return {array} An array contains all of the registered collections' names. 
		 * @static
		 * @public
		 */
		IconPool.getIconCollectionNames = function(){
			var aNames = [];
			jQuery.map(mRegistry, function(value, key){
				aNames.push(key);
			});
			return aNames;
		};
		
		/**
		 * Returns all name of icons that are registerd under the given collection.
		 * @param {string} collectionName the name of collection where icon names are retrieved.
		 * @return {array} An array contains all of the registered icon names under the given collection. 
		 * @static
		 * @public
		 */
		IconPool.getIconNames = function(collectionName){
			var collection = mRegistry[collectionName],
				aNames = [];
			jQuery.map(collection, function(value, key){
				aNames.push(key);
			});
			
			return aNames;
		};
		
		
		IconPool.insertFontFaceStyle = function(){
			if (bFontFaceInserted) {
				return;
			}
			
			var sFontPath = jQuery.sap.getModulePath("sap.ui.core", '/') + "themes/base/fonts/", sFontFace;
			
			//In IE9 the relative paths in dynamically inserted styles in iframe are relative to the html page 
			//which contains the iframe, not the iframe itself.
			//http://support.microsoft.com/kb/937266
			//A conversion from relative path to absolute path is needed.
			if (!!Device.browser.internet_explorer && Device.browser.version < 10 && /*check if it's in a iFrame*/window.self !== window.top) {
				sFontPath = IconPool._calcAbsPath(sFontPath, window.location.href);
			}
			
			/* This is the font used in sap.ui.core.Icon */
			sFontFace = "@font-face {" +
							"font-family: 'SAP-icons';" +
							"src: url('" + sFontPath + "SAP-icons.eot');" +
							"src: url('" + sFontPath + "SAP-icons.eot?#iefix') format('embedded-opentype')," +
							"url('" + sFontPath + "SAP-icons.ttf') format('truetype');" +
							"font-weight: normal;" +
							"font-style: normal;" +
						"}";
			
			jQuery('head').append('<style type="text/css">' + sFontFace + '</style>');
			
			bFontFaceInserted = true;
		};
		
		IconPool._calcAbsPath = function(sRelative, sBase){
			// remove the URL parameters for base URL
			sBase = sBase && sBase.replace(/\?.*|#.*/g, "");
			
			// make the URL absolute
			var oUri = new window.URI(sRelative),
				oAbsUri = oUri.absoluteTo(sBase);
			
			// return the absolute URL (without URL parameters!!!)
			return oAbsUri.href();
		};
		
		IconPool._isMirroringSkipped = function(iconName){
			return !!mIconSuppressMirroring[iconName];
		};

		// register the built in icons
		for (var i = 0; i < aIconNames.length; i++) {
			var name = aIconNames[i];
			IconPool.addIcon(name, undefined, {
				fontFamily: sapIconFamily,
				content: aIconCodes[i],
				suppressMirroring: IconPool._isMirroringSkipped(name),
				resourceBundle: mIconI18nKey[name] ? oCoreResourceBundle : undefined
			});
		}

		var mIconForMimeType = {
			"application/msword": "sap-icon://doc-attachment",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "sap-icon://doc-attachment",
			"application/rtf": "sap-icon://doc-attachment",
			"application/pdf": "sap-icon://pdf-attachment",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "sap-icon://excel-attachment",
			"application/msexcel": "sap-icon://excel-attachment",
			"application/vnd.ms-powerpoint": "sap-icon://ppt-attachment",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation": "sap-icon://ppt-attachment",
			"application/vnd.openxmlformats-officedocument.presentationml.slideshow": "sap-icon://ppt-attachment",
			"application/mspowerpoint": "sap-icon://ppt-attachment",
			"application/xml": "sap-icon://attachment-html",
			"application/xhtml+xml": "sap-icon://attachment-html",
			"application/x-httpd-php": "sap-icon://attachment-html",
			"application/x-javascript": "sap-icon://attachment-html",
			"application/gzip": "sap-icon://attachment-zip-file",
			"application/x-rar-compressed": "sap-icon://attachment-zip-file",
			"application/x-tar": "sap-icon://attachment-zip-file",
			"application/zip": "sap-icon://attachment-zip-file",
			"audio/voxware": "sap-icon://attachment-audio",
			"audio/x-aiff": "sap-icon://attachment-audio",
			"audio/x-midi": "sap-icon://attachment-audio",
			"audio/x-mpeg": "sap-icon://attachment-audio",
			"audio/x-pn-realaudio": "sap-icon://attachment-audio",
			"audio/x-pn-realaudio-plugin": "sap-icon://attachment-audio",
			"audio/x-qt-stream": "sap-icon://attachment-audio",
			"audio/x-wav": "sap-icon://attachment-audio",
			"image/png": "sap-icon://attachment-photo",
			"image/tiff": "sap-icon://attachment-photo",
			"image/bmp": "sap-icon://attachment-photo",
			"image/jpeg": "sap-icon://attachment-photo",
			"image/gif": "sap-icon://attachment-photo",
			"text/plain": "sap-icon://attachment-text-file",
			"text/comma-separated-values": "sap-icon://attachment-text-file",
			"text/css": "sap-icon://attachment-text-file",
			"text/html": "sap-icon://attachment-text-file",
			"text/javascript": "sap-icon://attachment-text-file",
			"text/richtext": "sap-icon://attachment-text-file",
			"text/rtf": "sap-icon://attachment-text-file",
			"text/tab-separated-values": "sap-icon://attachment-text-file",
			"text/xml": "sap-icon://attachment-text-file",
			"video/mpeg": "sap-icon://attachment-video",
			"video/quicktime": "sap-icon://attachment-video",
			"video/x-msvideo": "sap-icon://attachment-video",
			"application/x-shockwave-flash": "sap-icon://attachment-video"
		};
		
		/**
		 * Returns the icon url based on the given mime type
		 *
		 * @param {string} sMimeType the mime type of a file (e.g. "application/zip")
		 * @return {string} the icon url (e.g. "sap-icon://attachment-zip-file")
		 * @static
		 * @public
		 * @since 1.25.0
		 */
		IconPool.getIconForMimeType = function(sMimeType) {
			return mIconForMimeType[sMimeType] || "sap-icon://document";
		};
	

	return IconPool;

}, /* bExport= */ true);
