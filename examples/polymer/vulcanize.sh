#!/bin/sh

# vulcanize elements.html \
#     --inline-script --inline-css --strip-comments | \
#     crisper -h elements.build.html -j elements.build.js

polybuild --maximum-crush elements/elements.html
