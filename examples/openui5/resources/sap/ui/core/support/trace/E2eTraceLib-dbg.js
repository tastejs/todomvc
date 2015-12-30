/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'jquery.sap.trace'],
	function(jQuery) {
	"use strict";

	/*global alert, confirm */

	//initializing module (single global variable pattern)
	var E2eTraceLib1 =
		(function() {

		  var traceLevelRegEx = /sap-ui-xx-e2e-trace-level=(low|medium|high)/.exec(location.search);

		  var defaultTraceLevel;

		  if (traceLevelRegEx && traceLevelRegEx.length >= 2) {
				  defaultTraceLevel = traceLevelRegEx[1];
		  } else {
				  defaultTraceLevel = "medium";
		  }

		  var sDefaultUploadUrl = "/sap/bc/sdf/E2E_Trace_upl";

		  var busTrx;
		  var busTrxRecording = false;

		  var Message = function(xmlHttpReq) {

			//public members
			this.idx = xmlHttpReq.xidx;
			this.dsrGuid = xmlHttpReq.xDsrGuid;
			this.method = xmlHttpReq.xmethod;
			this.url = xmlHttpReq.xurl;
			this.reqHeader = xmlHttpReq.xRequestHeaders;
			this.respHeader = xmlHttpReq.getAllResponseHeaders();
			this.statusCode = xmlHttpReq.status;
			this.status = xmlHttpReq.statusText;
			this.startTimestamp = xmlHttpReq.xstartTimestamp;
			this.firstByteSent = xmlHttpReq.xfirstByteSent ? xmlHttpReq.xfirstByteSent : xmlHttpReq.xstartTimestamp; //not available on IE9
			this.lastByteSent = this.firstByteSent; //last Byte sent cannot be captured
			this.firstByteReceived = xmlHttpReq.xfirstByteReceived ? xmlHttpReq.xfirstByteReceived : xmlHttpReq.xlastByteReceived;
			this.lastByteReceived = xmlHttpReq.xlastByteReceived;
			this.sentBytes = 0; //cannot be captured
			this.receivedBytes = xmlHttpReq.responseText.length; //uncompressed

			//public methods
			this.getDuration = function() {
			  return this.lastByteReceived - this.startTimestamp;
			};

			this.getRequestLine = function() {
			  return this.method + " " + this.url + " HTTP/?.?";
			};

			this.getRequestHeader = function() {
			  var reqHeader = this.getRequestLine() + "\r\n";
			  for ( var i = 0, len = this.reqHeader ? this.reqHeader.length : 0; i < len; i += 1) {
				reqHeader += this.reqHeader[i][0] + ": " + this.reqHeader[i][1] + "\r\n";
			  }
			  reqHeader += "\r\n";
			  return reqHeader;
			};

			this.getResponseHeader = function() {
			  var respHeader = "HTTP?/? " + this.statusCode + " " + this.status + "\r\n";
			  respHeader += this.respHeader;
			  respHeader += "\r\n";
			  return respHeader;
			};

		  };

		  var TransactionStep = function(busTrx, trxStepIdx, date, trcLvl) {

			this.busTrx = busTrx;
			this.trxStepIdx = trxStepIdx;
			this.name = "Step-" + (trxStepIdx + 1);
			this.date = date;
			this.trcLvl = trcLvl;

			this.messages = [];
			this.msgIdx = -1;
			this.pendingMessages = 0;
			this.transactionStepTimeoutId = null;

			this.messageStarted = function() {
			  this.msgIdx += 1;
			  this.pendingMessages += 1;
			  return this.msgIdx;
			};

			//E2ETrace events handler
			this.onMessageFinished = function(xmlHttpReq, timestamp) {
			  if (xmlHttpReq.xurl === sDefaultUploadUrl) {
				return; // ignore requests to upload-url
			  }
			  xmlHttpReq.xlastByteReceived = timestamp;
			  this.messages.push(new Message(xmlHttpReq));
			  this.pendingMessages -= 1;
			  if (this.pendingMessages === 0) {
						if (this.transactionStepTimeoutId) {
							clearTimeout(this.transactionStepTimeoutId);
						}
						this.transactionStepTimeoutId = setTimeout(onTransactionStepTimeout, 3000);
			  }
			};

			this.getId = function() {
			  return this.busTrx.id + "-" + this.trxStepIdx;
			};

			this.getTraceFlagsAsString = function() {
			  return this.trcLvl[1].toString(16) + this.trcLvl[0].toString(16);
			};

		  };

		  var BusinessTransaction =
			  function(id, date, trcLvl, fnCallback) {

				this.id = id;
				this.date = date;
				this.trcLvl = trcLvl;
				this.trxSteps = [];
				this.fnCallback = fnCallback;

				this.createTransactionStep = function() {
				  var trxStep = new TransactionStep(this, this.trxSteps.length, new Date(), this.trcLvl);
				  this.trxSteps.push(trxStep);
				};

				this.getCurrentTransactionStep = function() {
				  return this.trxSteps[this.trxSteps.length - 1];
				};

				this.getBusinessTransactionXml =
					function() {
					  var xml =
						  "<?xml version=\"1.0\" encoding=\"UTF-8\"?><BusinessTransaction id=\"" + this.id + "\" time=\"" + convertToUTCString(this.date)
							  + "\" name=\"" + (window.document.title || "SAPUI5 Business Transaction") + "\">";
					  //transaction steps
					  for ( var trxStepIdx = 0, noOfSteps = this.trxSteps.length; trxStepIdx < noOfSteps; trxStepIdx += 1) {
						var trxStep = this.trxSteps[trxStepIdx];
						xml +=
							"<TransactionStep id=\"" + trxStep.getId() + "\" time=\"" + convertToUTCString(trxStep.date) + "\" name=\"" + trxStep.name
								+ "\" traceflags=\"" + trxStep.getTraceFlagsAsString() + "\">";
						//messages
						var messages = trxStep.messages;
						for ( var msgIdx = 0, noOfMessages = messages.length; msgIdx < noOfMessages; msgIdx += 1) {
						  var msg = messages[msgIdx];
						  xml += "<Message id=\"" + msg.idx + "\" dsrGuid=\"" + msg.dsrGuid + "\">";
						  xml += "<x-timestamp>" + convertToUTCString(new Date(msg.startTimestamp)) + "</x-timestamp>";
						  xml += "<duration>" + msg.getDuration() + "</duration>";
						  xml += "<returnCode>" + msg.statusCode + "</returnCode>";
						  xml += "<sent>" + msg.sentBytes + "</sent>";
						  xml += "<rcvd>" + msg.receivedBytes + "</rcvd>";
						  if (msg.firstByteSent && msg.lastByteReceived) {
							xml += "<firstByteSent>" + convertToUTCString(new Date(msg.firstByteSent)) + "</firstByteSent>";
							xml += "<lastByteSent>" + convertToUTCString(new Date(msg.lastByteSent)) + "</lastByteSent>";
							xml += "<firstByteReceived>" + convertToUTCString(new Date(msg.firstByteReceived)) + "</firstByteReceived>";
							xml += "<lastByteReceived>" + convertToUTCString(new Date(msg.lastByteReceived)) + "</lastByteReceived>";
						  }
						  xml += "<requestLine><![CDATA[" + msg.getRequestLine() + "]]></requestLine>";
						  xml += "<requestHeader><![CDATA[" + msg.getRequestHeader() + "]]></requestHeader>";
						  xml += "<responseHeader><![CDATA[" + msg.getResponseHeader() + "]]></responseHeader>";
						  xml += "</Message>";
						}
						xml += "</TransactionStep>";
					  }
					  xml += "</BusinessTransaction>";
					  return xml;
					};

			  };

		  var onTransactionStepTimeout =
			  function() {
				if (busTrx.getCurrentTransactionStep().pendingMessages === 0 && busTrx.getCurrentTransactionStep().messages.length > 0) {
				  /*eslint-disable no-alert */
				  var r =
					  confirm("End of transaction step detected.\nNumber of new message(s): " + busTrx.getCurrentTransactionStep().messages.length
						  + "\n\nDo you like to record another transaction step?");
				  /*eslint-enable no-alert */
				  if (r) {
					busTrx.createTransactionStep();
				  } else {
					(function() {

					  var busTrxXml = busTrx.getBusinessTransactionXml();

								  if (busTrx.fnCallback && typeof (busTrx.fnCallback) === 'function') {
									  busTrx.fnCallback(busTrxXml);
					  }

					  var boundary = "----------ieoau._._+2_8_GoodLuck8.3-ds0d0J0S0Kl234324jfLdsjfdAuaoei-----";
					  var postBody = boundary + "\r\nContent-Disposition: form-data\r\nContent-Type: application/xml\r\n" + busTrxXml + "\r\n" + boundary;

					  // check if Intermediary ICF Service is available
					  var xmlHttpHeadCheck = new window.XMLHttpRequest();
					  xmlHttpHeadCheck.open("HEAD", sDefaultUploadUrl, false);
					  xmlHttpHeadCheck.send();
					  if (xmlHttpHeadCheck.status == 200) {
										  // local upload to Intermediary ICF Service
						  var xmlHttpPost = new window.XMLHttpRequest();
						  xmlHttpPost.open("POST", sDefaultUploadUrl, false);
						  xmlHttpPost.setRequestHeader('Content-type', 'multipart/form-data; boundary="' + boundary + '"');
						  xmlHttpPost.send(postBody);

						  /*eslint-disable no-alert */
						  alert(xmlHttpPost.responseText);
						  /*eslint-enable no-alert */
					  } else {
						  // alternatively allow upload via form
						try {
							var bDone = true;
							while (bDone){

								/*eslint-disable no-alert */
								var sUrl = window.prompt('Please enter a valid URL for the store server', 'http://<host>:<port>');
								/*eslint-enable no-alert */

								if (sUrl === '' || sUrl === null) {
									break;
								}

								var sPatt = new RegExp("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})");
								var bRes = sPatt.test(sUrl);

								if (bRes){
									var xmlHttpPost = new window.XMLHttpRequest();
									xmlHttpPost.open("POST", sUrl + '/E2EClientTraceUploadW/UploadForm.jsp', false);
									xmlHttpPost.setRequestHeader('Content-type', 'multipart/form-data; boundary="' + boundary + '"');
									xmlHttpPost.send(postBody);
									break;
								}
							}
						} catch (ex) {
							// exception caused by popup blocker
							jQuery.sap.log.error(ex.name + ": " + ex.message, "", "sap.ui.core.support.trace.E2eTraceLib");
						}
					}

					})();
					//allow clean-up of resources by initializing a new BusinessTransaction
					//busTrx = new BusinessTransaction(EppLib.createGUID(), new Date());
					//busTrx.createTransactionStep();
					busTrx = null;
					busTrxRecording = false;
				  }
				}
			  };

		  var convertToUTCString =
			  function(date) {
				var utcString = "";
				utcString += date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
				utcString += "." + (date.getUTCMonth() < 9 ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1);
				utcString += "." + date.getUTCFullYear();
				utcString += " " + (date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours());
				utcString += ":" + (date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes());
				utcString += ":" + (date.getUTCSeconds() < 10 ? "0" + date.getUTCSeconds() : date.getUTCSeconds());
				/*eslint-disable no-nested-ternary */
				utcString += "." + (date.getUTCMilliseconds() < 100 ? date.getUTCMilliseconds() < 10 ? "00" + date.getUTCMilliseconds() : "0" + date.getUTCMilliseconds() : date.getUTCMilliseconds());
				/*eslint-enable no-nested-ternary */
				utcString += " UTC";
				return utcString;
			  };

		  //immediate function
		  (function() {

			//variables
			var fopen, fsetRequestHeader;

			//event listeners
			function onLoadstart(event) {
			  //console.log(event.timeStamp + ", " + this.xidx + ": loadstart");
			  this.xfirstByteSent = event.timeStamp;
			}

			function onProgress(event) {
			  //console.log(event.timeStamp + ", " + this.xidx + ": progress");
			  if (event.loaded > 0) {
				if (!this.xfirstByteReceived) {
				  this.xfirstByteReceived = event.timeStamp;
				}
				//always update lastByteReceived
				this.xlastByteReceived = event.timeStamp;
			  }

			}

			function onError(event) {
			  busTrx.getCurrentTransactionStep().onMessageFinished(this, event.timeStamp);
			}

			function onAbort(event) {
			  busTrx.getCurrentTransactionStep().onMessageFinished(this, event.timeStamp);
			}

			function onLoad(event) {
			  //console.log(event.timeStamp + ", " + this.xidx + ": load");
			  busTrx.getCurrentTransactionStep().onMessageFinished(this, event.timeStamp);
			}

			//not working on IE 9
			//  function onLoadend(event) {
			//    console.log(event.timeStamp + ", " + this.xidx + ": loadend");
			//  }

			// start jQuery.sap.trace and override xhr
			jQuery.sap.passport.startTracing();

			fopen = window.XMLHttpRequest.prototype.open;
			fsetRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;

			//inject call-back function for window.XMLHttpRequest.setRequestHeader
			window.XMLHttpRequest.prototype.setRequestHeader = function() {
			  fsetRequestHeader.apply(this, arguments);
			  if (busTrxRecording) {
					if (!this.xRequestHeaders) {
						this.xRequestHeaders = [];
					}
					this.xRequestHeaders.push(arguments);
				}
			};

			//inject call-back function for window.XMLHttpRequest.open
			window.XMLHttpRequest.prototype.open = function() {
			  fopen.apply(this, arguments);

			  if (busTrxRecording) {

				  var idx = busTrx.getCurrentTransactionStep().messageStarted();

				  //add tracing attributes
				  this.xidx = idx;
				  this.xstartTimestamp = Date.now();
				  //    console.log(this.xstartTimestamp + ", " + idx + " " + arguments[0] + " " + arguments[1]);
				  this.xmethod = arguments[0];
				  this.xurl = arguments[1];
				  this.xDsrGuid = jQuery.sap.fesr.getCurrentTransactionId(); //see jquery.sap.trace, former EbbLib.js

				  //do not set passport as this is done already in jquery.sap.trace
				  //this.setRequestHeader("SAP-PASSPORT", EppLib.passportHeader(busTrx.getCurrentTransactionStep().trcLvl, busTrx.id, this.xDsrGuid));
				  this.setRequestHeader("X-CorrelationID", busTrx.getCurrentTransactionStep().getId() + "-" + idx);

				  //attach event listeners
				  this.addEventListener("loadstart", onLoadstart, false);
				  this.addEventListener("progress", onProgress, false);
				  this.addEventListener("error", onError, false);
				  this.addEventListener("abort", onAbort, false);
				  this.addEventListener("load", onLoad, false);
				  //this.addEventListener("loadend", onLoadend, false);
				  idx += 1;
			  }
			};

		  })(); //immediate function inside module

		  var E2eTraceLib = {
			start: function(sTraceLevel, fnCallback) {

				  if (!busTrxRecording) {

					if (!sTraceLevel) {
					  sTraceLevel = defaultTraceLevel;
					}

					busTrx = new BusinessTransaction(jQuery.sap.fesr.getRootId(), new Date(), jQuery.sap.passport.traceFlags(sTraceLevel), fnCallback);
				busTrx.createTransactionStep();
						busTrxRecording = true;
				  }
				},
				isStarted: function() {
					return busTrxRecording;
				}
		  };

		  if (/sap-ui-xx-e2e-trace=(true|x|X)/.test(location.search)) {
			E2eTraceLib.start();
			  }

		  return E2eTraceLib;

		}()); //module

	return E2eTraceLib1;

}, /* bExport= */ true);
