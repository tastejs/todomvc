/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('scrollview', function (Y, NAME) {

/**
 * <p>
 * The scrollview module does not add any new classes. It simply plugs the ScrollViewScrollbars plugin into the 
 * base ScrollView class implementation provided by the scrollview-base module, so that all scrollview instances 
 * have scrollbars enabled.
 * </p>
 *
 * <ul>
 *     <li><a href="../classes/ScrollView.html">ScrollView API documentation</a></li>
 *     <li><a href="scrollview-base.html">scrollview-base Module documentation</a></li>
 * </ul>
 *
 * @module scrollview
 */

Y.Base.plug(Y.ScrollView, Y.Plugin.ScrollViewScrollbars);


}, '3.7.3', {"requires": ["scrollview-base", "scrollview-scrollbars"]});
