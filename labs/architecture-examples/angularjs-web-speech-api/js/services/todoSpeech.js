/*global todomvc */
'use strict';

/**
 * Service to provide access to Web Speech API
 */
todomvc.factory('todoSpeech', function ($rootScope) {
    var final_transcript = '',
        recognizing = false,
        ignore_onend,
        recognition;

    var startRecognition = function () {
        if (recognizing) {
            recognition.stop();
            return;
        }
        final_transcript = '';
        recognition.start();
        ignore_onend = false;
    };

    var stopRecognition = function (event) {
        recognition.stop();
    };

    var fireTranscriptResult = function (transcript, isFinal) {
        $rootScope.$broadcast('todoSpeech:transcriptResult', {
            transcript: transcript.trim(),
            isFinal: isFinal
        });
    };

    if (!('webkitSpeechRecognition' in window)) {
        window.alert('Please uprade your browser to one with\nWeb Speech API support.');
    } else {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
            recognizing = true;
        };

        recognition.onerror = function (event) {
            if (event.error === 'no-speech') {
                ignore_onend = true;
            }
            if (event.error === 'audio-capture') {
                ignore_onend = true;
            }
            if (event.error === 'not-allowed') {
                ignore_onend = true;
            }
        };

        recognition.onend = function () {
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            if (!final_transcript) {
                return;
            }
            $rootScope.$broadcast('todoSpeech:stopRecognition', {
                transcript: final_transcript
            });
        };

        recognition.onresult = function (event) {
            var transcript_event = event,
                transcript = '',
                i;

            for (i = transcript_event.resultIndex; i < transcript_event.results.length; ++i) {
                // Broadcast transcript & reset final_transcript
                if (transcript_event.results[i].isFinal) {
                    final_transcript += transcript_event.results[i][0].transcript;
                    fireTranscriptResult(final_transcript, true);
                    final_transcript = '';
                } else {
                    transcript += transcript_event.results[i][0].transcript;
                    fireTranscriptResult(transcript, false);
                }
            }
        };
    }

    recognition.onstart = function (event) {
        $rootScope.$broadcast('todoSpeech:startListening');
    };

    recognition.onend = function (event) {
        $rootScope.$broadcast('todoSpeech:stopListening');
    };

    // Public methods
    return {
        'startRecognition': startRecognition,
        'stopRecognition': stopRecognition
    };
});