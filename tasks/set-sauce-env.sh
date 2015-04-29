#!/bin/bash
set -o pipefail

export SAUCE_USERNAME=$(echo "$u" | tr '[A-Za-z]' '[N-ZA-Mn-za-m]')
export SAUCE_ACCESS_KEY=$(echo "$pp" | tr '[A-Za-z]' '[N-ZA-Mn-za-m]')

