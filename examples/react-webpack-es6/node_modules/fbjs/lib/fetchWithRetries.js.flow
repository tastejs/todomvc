/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule fetchWithRetries
 * @typechecks
 * @flow
 */

'use strict';

var ExecutionEnvironment = require('ExecutionEnvironment');
var Promise = require('Promise');

var sprintf = require('sprintf');
var fetch = require('fetch');
var warning = require('warning');

export type InitWithRetries = {
  body?: mixed;
  cache?: ?string;
  credentials?: ?string;
  fetchTimeout?: ?number;
  headers?: mixed;
  method?: ?string;
  mode?: ?string;
  retryDelays?: ?Array<number>;
};

var DEFAULT_TIMEOUT = 15000;
var DEFAULT_RETRIES = [1000, 3000];

/**
 * Makes a POST request to the server with the given data as the payload.
 * Automatic retries are done based on the values in `retryDelays`.
 */
function fetchWithRetries(
  uri: string,
  initWithRetries?: ?InitWithRetries
): Promise {
  var {fetchTimeout, retryDelays, ...init} = initWithRetries || {};
  var _fetchTimeout = fetchTimeout != null ? fetchTimeout : DEFAULT_TIMEOUT;
  var _retryDelays = retryDelays != null ? retryDelays : DEFAULT_RETRIES;

  var requestsAttempted = 0;
  var requestStartTime = 0;
  return new Promise((resolve, reject) => {
    /**
     * Sends a request to the server that will timeout after `fetchTimeout`.
     * If the request fails or times out a new request might be scheduled.
     */
    function sendTimedRequest(): void {
      requestsAttempted++;
      requestStartTime = Date.now();
      var isRequestAlive = true;
      var request = fetch(uri, init);
      var requestTimeout = setTimeout(() => {
        isRequestAlive = false;
        if (shouldRetry(requestsAttempted)) {
          warning(false, 'fetchWithRetries: HTTP timeout, retrying.');
          retryRequest();
        } else {
          reject(new Error(sprintf(
            'fetchWithRetries(): Failed to get response from server, ' +
            'tried %s times.',
            requestsAttempted
          )));
        }
      }, _fetchTimeout);

      request.then(response => {
        clearTimeout(requestTimeout);
        if (isRequestAlive) {
          // We got a response, we can clear the timeout.
          if (response.status >= 200 && response.status < 300) {
            // Got a response code that indicates success, resolve the promise.
            resolve(response);
          } else if (shouldRetry(requestsAttempted)) {
            // Fetch was not successful, retrying.
            // TODO(#7595849): Only retry on transient HTTP errors.
            warning(false, 'fetchWithRetries: HTTP error, retrying.'),
            retryRequest();
          } else {
            // Request was not successful, giving up.
            var error: any = new Error(sprintf(
              'fetchWithRetries(): Still no successful response after ' +
              '%s retries, giving up.',
              requestsAttempted
            ));
            error.response = response;
            reject(error);
          }
        }
      }).catch(error => {
        clearTimeout(requestTimeout);
        if (shouldRetry(requestsAttempted)) {
          retryRequest();
        } else {
          reject(error);
        }
      });
    }

    /**
     * Schedules another run of sendTimedRequest based on how much time has
     * passed between the time the last request was sent and now.
     */
    function retryRequest(): void {
      var retryDelay = _retryDelays[requestsAttempted - 1];
      var retryStartTime = requestStartTime + retryDelay;
      // Schedule retry for a configured duration after last request started.
      setTimeout(sendTimedRequest, retryStartTime - Date.now());
    }

    /**
     * Checks if another attempt should be done to send a request to the server.
     */
    function shouldRetry(attempt: number): boolean {
      return (
        ExecutionEnvironment.canUseDOM &&
        attempt <= _retryDelays.length
      );
    }

    sendTimedRequest();
  });
}

module.exports = fetchWithRetries;
