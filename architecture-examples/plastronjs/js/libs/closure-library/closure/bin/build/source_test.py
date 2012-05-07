#!/usr/bin/env python
#
# Copyright 2010 The Closure Library Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


"""Unit test for source."""




import unittest

import source


class SourceTestCase(unittest.TestCase):
  """Unit test for source.  Tests the parser on a known source input."""

  def testSourceScan(self):
    test_source = source.Source(_TEST_SOURCE)

    self.assertEqual(set(['foo', 'foo.test']),
                     test_source.provides)
    self.assertEqual(set(['goog.dom', 'goog.events.EventType']),
                     test_source.requires)

  def testSourceScanBase(self):
    test_source = source.Source(_TEST_BASE_SOURCE)

    self.assertEqual(set(['goog']),
                     test_source.provides)
    self.assertEqual(test_source.requires, set())

  def testSourceScanBadBase(self):

    def MakeSource():
      source.Source(_TEST_BAD_BASE_SOURCE)

    self.assertRaises(Exception, MakeSource)


_TEST_SOURCE = """// Fake copyright notice

/** Very important comment. */

goog.provide('foo');
goog.provide('foo.test');

goog.require('goog.dom');
goog.require('goog.events.EventType');

function foo() {
  // Set bar to seventeen to increase performance.
  this.bar = 17;
}
"""

_TEST_BASE_SOURCE = """
var goog = goog || {}; // Identifies this file as the Closure base.
"""

_TEST_BAD_BASE_SOURCE = """
goog.provide('goog');

var goog = goog || {}; // Identifies this file as the Closure base.
"""


if __name__ == '__main__':
  unittest.main()
