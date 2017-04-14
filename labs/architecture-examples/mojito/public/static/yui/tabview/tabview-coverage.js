/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/tabview/tabview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tabview/tabview.js",
    code: []
};
_yuitest_coverage["build/tabview/tabview.js"].code=["YUI.add('tabview', function (Y, NAME) {","","/**"," * The TabView module "," *"," * @module tabview"," */","","var _queries = Y.TabviewBase._queries,","    _classNames = Y.TabviewBase._classNames,","    DOT = '.',","    getClassName = Y.ClassNameManager.getClassName,","","    /**","     * Provides a tabbed widget interface ","     * @param config {Object} Object literal specifying tabview configuration properties.","     *","     * @class TabView","     * @constructor","     * @extends Widget","     * @uses WidgetParent","     */","    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {","    _afterChildAdded: function(e) {","        this.get('contentBox').focusManager.refresh();","    },","","    _defListNodeValueFn: function() {","        return Y.Node.create(TabView.LIST_TEMPLATE);","    },","","    _defPanelNodeValueFn: function() {","        return Y.Node.create(TabView.PANEL_TEMPLATE);","    },","","    _afterChildRemoved: function(e) { // update the selected tab when removed","        var i = e.index,","            selection = this.get('selection');","","        if (!selection) { // select previous item if selection removed","            selection = this.item(i - 1) || this.item(0);","            if (selection) {","                selection.set('selected', 1);","            }","        }","","        this.get('contentBox').focusManager.refresh();","    },","","    _initAria: function() {","        var contentBox = this.get('contentBox'),","            tablist = contentBox.one(_queries.tabviewList);","","        if (tablist) {","            tablist.setAttrs({","                //'aria-labelledby': ","                role: 'tablist'","            });","        }","    },","","    bindUI: function() {","        //  Use the Node Focus Manager to add keyboard support:","        //  Pressing the left and right arrow keys will move focus","        //  among each of the tabs.","","        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {","                        descendants: DOT + _classNames.tabLabel,","                        keys: { next: 'down:39', // Right arrow","                                previous: 'down:37' },  // Left arrow","                        circular: true","                    });","","        this.after('render', this._setDefSelection);","        this.after('addChild', this._afterChildAdded);","        this.after('removeChild', this._afterChildRemoved);","    },","    ","    renderUI: function() {","        var contentBox = this.get('contentBox'); ","        this._renderListBox(contentBox);","        this._renderPanelBox(contentBox);","        this._childrenContainer = this.get('listNode');","        this._renderTabs(contentBox);","    },","","    _setDefSelection: function(contentBox) {","        //  If no tab is selected, select the first tab.","        var selection = this.get('selection') || this.item(0);","","        this.some(function(tab) {","            if (tab.get('selected')) {","                selection = tab;","                return true;","            }","        });","        if (selection) {","            // TODO: why both needed? (via widgetParent/Child)?","            this.set('selection', selection);","            selection.set('selected', 1);","        }","    },","","    _renderListBox: function(contentBox) {","        var node = this.get('listNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderPanelBox: function(contentBox) {","        var node = this.get('panelNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderTabs: function(contentBox) {","        var tabs = contentBox.all(_queries.tab),","            panelNode = this.get('panelNode'),","            panels = (panelNode) ? this.get('panelNode').get('children') : null,","            tabview = this;","","        if (tabs) { // add classNames and fill in Tab fields from markup when possible","            tabs.addClass(_classNames.tab);","            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);","            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);","","            tabs.each(function(node, i) {","                var panelNode = (panels) ? panels.item(i) : null;","                tabview.add({","                    boundingBox: node,","                    contentBox: node.one(DOT + _classNames.tabLabel),","                    label: node.one(DOT + _classNames.tabLabel).get('text'),","                    panelNode: panelNode","                });","            });","        }","    }","}, {","","    LIST_TEMPLATE: '<ul class=\"' + _classNames.tabviewList + '\"></ul>',","    PANEL_TEMPLATE: '<div class=\"' + _classNames.tabviewPanel + '\"></div>',","","    ATTRS: {","        defaultChildType: {  ","            value: 'Tab'","        },","","        listNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(_classNames.tabviewList);","                }","                return node;","            },","","            valueFn: '_defListNodeValueFn'","        },","","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(_classNames.tabviewPanel);","                }","                return node;","            },","","            valueFn: '_defPanelNodeValueFn'","        },","","        tabIndex: {","            value: null","            //validator: '_validTabIndex'","        }","    },","","    HTML_PARSER: {","        listNode: _queries.tabviewList,","        panelNode: _queries.tabviewPanel","    }","});","","Y.TabView = TabView;","var Lang = Y.Lang,","    _queries = Y.TabviewBase._queries,","    _classNames = Y.TabviewBase._classNames,","    getClassName = Y.ClassNameManager.getClassName;","","/**"," * Provides Tab instances for use with TabView"," * @param config {Object} Object literal specifying tabview configuration properties."," *"," * @class Tab"," * @constructor"," * @extends Widget"," * @uses WidgetChild"," */","Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {","    BOUNDING_TEMPLATE: '<li class=\"' + _classNames.tab + '\"></li>',","    CONTENT_TEMPLATE: '<a class=\"' + _classNames.tabLabel + '\"></a>',","    PANEL_TEMPLATE: '<div class=\"' + _classNames.tabPanel + '\"></div>',","","    _uiSetSelectedPanel: function(selected) {","        this.get('panelNode').toggleClass(_classNames.selectedPanel, selected);","    },","","    _afterTabSelectedChange: function(event) {","       this._uiSetSelectedPanel(event.newVal);","    },","","    _afterParentChange: function(e) {","        if (!e.newVal) {","            this._remove();","        } else {","            this._add();","        }","    },","","    _initAria: function() {","        var anchor = this.get('contentBox'),","            id = anchor.get('id'),","            panel = this.get('panelNode');"," ","        if (!id) {","            id = Y.guid();","            anchor.set('id', id);","        }","        //  Apply the ARIA roles, states and properties to each tab","        anchor.set('role', 'tab');","        anchor.get('parentNode').set('role', 'presentation');"," "," ","        //  Apply the ARIA roles, states and properties to each panel","        panel.setAttrs({","            role: 'tabpanel',","            'aria-labelledby': id","        });","    },","","    syncUI: function() {","        this.set('label', this.get('label'));","        this.set('content', this.get('content'));","        this._uiSetSelectedPanel(this.get('selected'));","    },","","    bindUI: function() {","       this.after('selectedChange', this._afterTabSelectedChange);","       this.after('parentChange', this._afterParentChange);","    },","","    renderUI: function() {","        this._renderPanel();","        this._initAria();","    },","","    _renderPanel: function() {","        this.get('parent').get('panelNode')","            .appendChild(this.get('panelNode'));","    },","","    _add: function() {","        var parent = this.get('parent').get('contentBox'),","            list = parent.get('listNode'),","            panel = parent.get('panelNode');","","        if (list) {","            list.appendChild(this.get('boundingBox'));","        }","","        if (panel) {","            panel.appendChild(this.get('panelNode'));","        }","    },","    ","    _remove: function() {","        this.get('boundingBox').remove();","        this.get('panelNode').remove();","    },","","    _onActivate: function(e) {","         if (e.target === this) {","             //  Prevent the browser from navigating to the URL specified by the ","             //  anchor's href attribute.","             e.domEvent.preventDefault();","             e.target.set('selected', 1);","         }","    },","    ","    initializer: function() {","       this.publish(this.get('triggerEvent'), { ","           defaultFn: this._onActivate","       });","    },","","    _defLabelSetter: function(label) {","        this.get('contentBox').setContent(label);","        return label;","    },","","    _defContentSetter: function(content) {","        this.get('panelNode').setContent(content);","        return content;","    },","","    _defContentGetter: function(content) {","        return this.get('panelNode').getContent();","    },","","    // find panel by ID mapping from label href","    _defPanelNodeValueFn: function() {","        var href = this.get('contentBox').get('href') || '',","            parent = this.get('parent'),","            hashIndex = href.indexOf('#'),","            panel;","","        href = href.substr(hashIndex);","","        if (href.charAt(0) === '#') { // in-page nav, find by ID","            panel = Y.one(href);","            if (panel) {","                panel.addClass(_classNames.tabPanel);","            }","        }","","        // use the one found by id, or else try matching indices","        if (!panel && parent) {","            panel = parent.get('panelNode')","                    .get('children').item(this.get('index'));","        }","","        if (!panel) { // create if none found","            panel = Y.Node.create(this.PANEL_TEMPLATE);","        }","        return panel;","    }","}, {","    ATTRS: {","        /**","         * @attribute triggerEvent","         * @default \"click\" ","         * @type String","         */","        triggerEvent: {","            value: 'click'","        },","","        /**","         * @attribute label","         * @type HTML","         */","        label: { ","            setter: '_defLabelSetter',","            validator: Lang.isString","        },","","        /**","         * @attribute content","         * @type HTML","         */","        content: {","            setter: '_defContentSetter',","            getter: '_defContentGetter'","        },","","        /**","         * @attribute panelNode","         * @type Y.Node","         */","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(_classNames.tabPanel);","                }","                return node;","            },","            valueFn: '_defPanelNodeValueFn'","        },","        ","        tabIndex: {","            value: null,","            validator: '_validTabIndex'","        }        ","","    },","","    HTML_PARSER: {","        selected: function(contentBox) {","            var ret = (this.get('boundingBox').hasClass(_classNames.selectedTab)) ?","                        1 : 0;","            return ret;","        }","    }","","});","","","}, '3.7.3', {\"requires\": [\"widget\", \"widget-parent\", \"widget-child\", \"tabview-base\", \"node-pluginhost\", \"node-focusmanager\"], \"skinnable\": true});"];
_yuitest_coverage["build/tabview/tabview.js"].lines = {"1":0,"9":0,"25":0,"29":0,"33":0,"37":0,"40":0,"41":0,"42":0,"43":0,"47":0,"51":0,"54":0,"55":0,"67":0,"74":0,"75":0,"76":0,"80":0,"81":0,"82":0,"83":0,"84":0,"89":0,"91":0,"92":0,"93":0,"94":0,"97":0,"99":0,"100":0,"105":0,"106":0,"107":0,"112":0,"113":0,"114":0,"119":0,"124":0,"125":0,"126":0,"127":0,"129":0,"130":0,"131":0,"152":0,"153":0,"154":0,"156":0,"164":0,"165":0,"166":0,"168":0,"186":0,"187":0,"201":0,"207":0,"211":0,"215":0,"216":0,"218":0,"223":0,"227":0,"228":0,"229":0,"232":0,"233":0,"237":0,"244":0,"245":0,"246":0,"250":0,"251":0,"255":0,"256":0,"260":0,"265":0,"269":0,"270":0,"273":0,"274":0,"279":0,"280":0,"284":0,"287":0,"288":0,"293":0,"299":0,"300":0,"304":0,"305":0,"309":0,"314":0,"319":0,"321":0,"322":0,"323":0,"324":0,"329":0,"330":0,"334":0,"335":0,"337":0,"374":0,"375":0,"376":0,"378":0,"392":0,"394":0};
_yuitest_coverage["build/tabview/tabview.js"].functions = {"_afterChildAdded:24":0,"_defListNodeValueFn:28":0,"_defPanelNodeValueFn:32":0,"_afterChildRemoved:36":0,"_initAria:50":0,"bindUI:62":0,"renderUI:79":0,"(anonymous 2):91":0,"_setDefSelection:87":0,"_renderListBox:104":0,"_renderPanelBox:111":0,"(anonymous 3):129":0,"_renderTabs:118":0,"setter:151":0,"setter:163":0,"_uiSetSelectedPanel:206":0,"_afterTabSelectedChange:210":0,"_afterParentChange:214":0,"_initAria:222":0,"syncUI:243":0,"bindUI:249":0,"renderUI:254":0,"_renderPanel:259":0,"_add:264":0,"_remove:278":0,"_onActivate:283":0,"initializer:292":0,"_defLabelSetter:298":0,"_defContentSetter:303":0,"_defContentGetter:308":0,"_defPanelNodeValueFn:313":0,"setter:373":0,"selected:391":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tabview/tabview.js"].coveredLines = 109;
_yuitest_coverage["build/tabview/tabview.js"].coveredFunctions = 34;
_yuitest_coverline("build/tabview/tabview.js", 1);
YUI.add('tabview', function (Y, NAME) {

/**
 * The TabView module 
 *
 * @module tabview
 */

_yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tabview/tabview.js", 9);
var _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    DOT = '.',
    getClassName = Y.ClassNameManager.getClassName,

    /**
     * Provides a tabbed widget interface 
     * @param config {Object} Object literal specifying tabview configuration properties.
     *
     * @class TabView
     * @constructor
     * @extends Widget
     * @uses WidgetParent
     */
    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {
    _afterChildAdded: function(e) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterChildAdded", 24);
_yuitest_coverline("build/tabview/tabview.js", 25);
this.get('contentBox').focusManager.refresh();
    },

    _defListNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defListNodeValueFn", 28);
_yuitest_coverline("build/tabview/tabview.js", 29);
return Y.Node.create(TabView.LIST_TEMPLATE);
    },

    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defPanelNodeValueFn", 32);
_yuitest_coverline("build/tabview/tabview.js", 33);
return Y.Node.create(TabView.PANEL_TEMPLATE);
    },

    _afterChildRemoved: function(e) { // update the selected tab when removed
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterChildRemoved", 36);
_yuitest_coverline("build/tabview/tabview.js", 37);
var i = e.index,
            selection = this.get('selection');

        _yuitest_coverline("build/tabview/tabview.js", 40);
if (!selection) { // select previous item if selection removed
            _yuitest_coverline("build/tabview/tabview.js", 41);
selection = this.item(i - 1) || this.item(0);
            _yuitest_coverline("build/tabview/tabview.js", 42);
if (selection) {
                _yuitest_coverline("build/tabview/tabview.js", 43);
selection.set('selected', 1);
            }
        }

        _yuitest_coverline("build/tabview/tabview.js", 47);
this.get('contentBox').focusManager.refresh();
    },

    _initAria: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_initAria", 50);
_yuitest_coverline("build/tabview/tabview.js", 51);
var contentBox = this.get('contentBox'),
            tablist = contentBox.one(_queries.tabviewList);

        _yuitest_coverline("build/tabview/tabview.js", 54);
if (tablist) {
            _yuitest_coverline("build/tabview/tabview.js", 55);
tablist.setAttrs({
                //'aria-labelledby': 
                role: 'tablist'
            });
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        _yuitest_coverfunc("build/tabview/tabview.js", "bindUI", 62);
_yuitest_coverline("build/tabview/tabview.js", 67);
this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + _classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        _yuitest_coverline("build/tabview/tabview.js", 74);
this.after('render', this._setDefSelection);
        _yuitest_coverline("build/tabview/tabview.js", 75);
this.after('addChild', this._afterChildAdded);
        _yuitest_coverline("build/tabview/tabview.js", 76);
this.after('removeChild', this._afterChildRemoved);
    },
    
    renderUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "renderUI", 79);
_yuitest_coverline("build/tabview/tabview.js", 80);
var contentBox = this.get('contentBox'); 
        _yuitest_coverline("build/tabview/tabview.js", 81);
this._renderListBox(contentBox);
        _yuitest_coverline("build/tabview/tabview.js", 82);
this._renderPanelBox(contentBox);
        _yuitest_coverline("build/tabview/tabview.js", 83);
this._childrenContainer = this.get('listNode');
        _yuitest_coverline("build/tabview/tabview.js", 84);
this._renderTabs(contentBox);
    },

    _setDefSelection: function(contentBox) {
        //  If no tab is selected, select the first tab.
        _yuitest_coverfunc("build/tabview/tabview.js", "_setDefSelection", 87);
_yuitest_coverline("build/tabview/tabview.js", 89);
var selection = this.get('selection') || this.item(0);

        _yuitest_coverline("build/tabview/tabview.js", 91);
this.some(function(tab) {
            _yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 2)", 91);
_yuitest_coverline("build/tabview/tabview.js", 92);
if (tab.get('selected')) {
                _yuitest_coverline("build/tabview/tabview.js", 93);
selection = tab;
                _yuitest_coverline("build/tabview/tabview.js", 94);
return true;
            }
        });
        _yuitest_coverline("build/tabview/tabview.js", 97);
if (selection) {
            // TODO: why both needed? (via widgetParent/Child)?
            _yuitest_coverline("build/tabview/tabview.js", 99);
this.set('selection', selection);
            _yuitest_coverline("build/tabview/tabview.js", 100);
selection.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderListBox", 104);
_yuitest_coverline("build/tabview/tabview.js", 105);
var node = this.get('listNode');
        _yuitest_coverline("build/tabview/tabview.js", 106);
if (!node.inDoc()) {
            _yuitest_coverline("build/tabview/tabview.js", 107);
contentBox.append(node);
        }
    },

    _renderPanelBox: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderPanelBox", 111);
_yuitest_coverline("build/tabview/tabview.js", 112);
var node = this.get('panelNode');
        _yuitest_coverline("build/tabview/tabview.js", 113);
if (!node.inDoc()) {
            _yuitest_coverline("build/tabview/tabview.js", 114);
contentBox.append(node);
        }
    },

    _renderTabs: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderTabs", 118);
_yuitest_coverline("build/tabview/tabview.js", 119);
var tabs = contentBox.all(_queries.tab),
            panelNode = this.get('panelNode'),
            panels = (panelNode) ? this.get('panelNode').get('children') : null,
            tabview = this;

        _yuitest_coverline("build/tabview/tabview.js", 124);
if (tabs) { // add classNames and fill in Tab fields from markup when possible
            _yuitest_coverline("build/tabview/tabview.js", 125);
tabs.addClass(_classNames.tab);
            _yuitest_coverline("build/tabview/tabview.js", 126);
contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            _yuitest_coverline("build/tabview/tabview.js", 127);
contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            _yuitest_coverline("build/tabview/tabview.js", 129);
tabs.each(function(node, i) {
                _yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 3)", 129);
_yuitest_coverline("build/tabview/tabview.js", 130);
var panelNode = (panels) ? panels.item(i) : null;
                _yuitest_coverline("build/tabview/tabview.js", 131);
tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    label: node.one(DOT + _classNames.tabLabel).get('text'),
                    panelNode: panelNode
                });
            });
        }
    }
}, {

    LIST_TEMPLATE: '<ul class="' + _classNames.tabviewList + '"></ul>',
    PANEL_TEMPLATE: '<div class="' + _classNames.tabviewPanel + '"></div>',

    ATTRS: {
        defaultChildType: {  
            value: 'Tab'
        },

        listNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 151);
_yuitest_coverline("build/tabview/tabview.js", 152);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 153);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 154);
node.addClass(_classNames.tabviewList);
                }
                _yuitest_coverline("build/tabview/tabview.js", 156);
return node;
            },

            valueFn: '_defListNodeValueFn'
        },

        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 163);
_yuitest_coverline("build/tabview/tabview.js", 164);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 165);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 166);
node.addClass(_classNames.tabviewPanel);
                }
                _yuitest_coverline("build/tabview/tabview.js", 168);
return node;
            },

            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null
            //validator: '_validTabIndex'
        }
    },

    HTML_PARSER: {
        listNode: _queries.tabviewList,
        panelNode: _queries.tabviewPanel
    }
});

_yuitest_coverline("build/tabview/tabview.js", 186);
Y.TabView = TabView;
_yuitest_coverline("build/tabview/tabview.js", 187);
var Lang = Y.Lang,
    _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    getClassName = Y.ClassNameManager.getClassName;

/**
 * Provides Tab instances for use with TabView
 * @param config {Object} Object literal specifying tabview configuration properties.
 *
 * @class Tab
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 */
_yuitest_coverline("build/tabview/tabview.js", 201);
Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE: '<li class="' + _classNames.tab + '"></li>',
    CONTENT_TEMPLATE: '<a class="' + _classNames.tabLabel + '"></a>',
    PANEL_TEMPLATE: '<div class="' + _classNames.tabPanel + '"></div>',

    _uiSetSelectedPanel: function(selected) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_uiSetSelectedPanel", 206);
_yuitest_coverline("build/tabview/tabview.js", 207);
this.get('panelNode').toggleClass(_classNames.selectedPanel, selected);
    },

    _afterTabSelectedChange: function(event) {
       _yuitest_coverfunc("build/tabview/tabview.js", "_afterTabSelectedChange", 210);
_yuitest_coverline("build/tabview/tabview.js", 211);
this._uiSetSelectedPanel(event.newVal);
    },

    _afterParentChange: function(e) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterParentChange", 214);
_yuitest_coverline("build/tabview/tabview.js", 215);
if (!e.newVal) {
            _yuitest_coverline("build/tabview/tabview.js", 216);
this._remove();
        } else {
            _yuitest_coverline("build/tabview/tabview.js", 218);
this._add();
        }
    },

    _initAria: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_initAria", 222);
_yuitest_coverline("build/tabview/tabview.js", 223);
var anchor = this.get('contentBox'),
            id = anchor.get('id'),
            panel = this.get('panelNode');
 
        _yuitest_coverline("build/tabview/tabview.js", 227);
if (!id) {
            _yuitest_coverline("build/tabview/tabview.js", 228);
id = Y.guid();
            _yuitest_coverline("build/tabview/tabview.js", 229);
anchor.set('id', id);
        }
        //  Apply the ARIA roles, states and properties to each tab
        _yuitest_coverline("build/tabview/tabview.js", 232);
anchor.set('role', 'tab');
        _yuitest_coverline("build/tabview/tabview.js", 233);
anchor.get('parentNode').set('role', 'presentation');
 
 
        //  Apply the ARIA roles, states and properties to each panel
        _yuitest_coverline("build/tabview/tabview.js", 237);
panel.setAttrs({
            role: 'tabpanel',
            'aria-labelledby': id
        });
    },

    syncUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "syncUI", 243);
_yuitest_coverline("build/tabview/tabview.js", 244);
this.set('label', this.get('label'));
        _yuitest_coverline("build/tabview/tabview.js", 245);
this.set('content', this.get('content'));
        _yuitest_coverline("build/tabview/tabview.js", 246);
this._uiSetSelectedPanel(this.get('selected'));
    },

    bindUI: function() {
       _yuitest_coverfunc("build/tabview/tabview.js", "bindUI", 249);
_yuitest_coverline("build/tabview/tabview.js", 250);
this.after('selectedChange', this._afterTabSelectedChange);
       _yuitest_coverline("build/tabview/tabview.js", 251);
this.after('parentChange', this._afterParentChange);
    },

    renderUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "renderUI", 254);
_yuitest_coverline("build/tabview/tabview.js", 255);
this._renderPanel();
        _yuitest_coverline("build/tabview/tabview.js", 256);
this._initAria();
    },

    _renderPanel: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderPanel", 259);
_yuitest_coverline("build/tabview/tabview.js", 260);
this.get('parent').get('panelNode')
            .appendChild(this.get('panelNode'));
    },

    _add: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_add", 264);
_yuitest_coverline("build/tabview/tabview.js", 265);
var parent = this.get('parent').get('contentBox'),
            list = parent.get('listNode'),
            panel = parent.get('panelNode');

        _yuitest_coverline("build/tabview/tabview.js", 269);
if (list) {
            _yuitest_coverline("build/tabview/tabview.js", 270);
list.appendChild(this.get('boundingBox'));
        }

        _yuitest_coverline("build/tabview/tabview.js", 273);
if (panel) {
            _yuitest_coverline("build/tabview/tabview.js", 274);
panel.appendChild(this.get('panelNode'));
        }
    },
    
    _remove: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_remove", 278);
_yuitest_coverline("build/tabview/tabview.js", 279);
this.get('boundingBox').remove();
        _yuitest_coverline("build/tabview/tabview.js", 280);
this.get('panelNode').remove();
    },

    _onActivate: function(e) {
         _yuitest_coverfunc("build/tabview/tabview.js", "_onActivate", 283);
_yuitest_coverline("build/tabview/tabview.js", 284);
if (e.target === this) {
             //  Prevent the browser from navigating to the URL specified by the 
             //  anchor's href attribute.
             _yuitest_coverline("build/tabview/tabview.js", 287);
e.domEvent.preventDefault();
             _yuitest_coverline("build/tabview/tabview.js", 288);
e.target.set('selected', 1);
         }
    },
    
    initializer: function() {
       _yuitest_coverfunc("build/tabview/tabview.js", "initializer", 292);
_yuitest_coverline("build/tabview/tabview.js", 293);
this.publish(this.get('triggerEvent'), { 
           defaultFn: this._onActivate
       });
    },

    _defLabelSetter: function(label) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defLabelSetter", 298);
_yuitest_coverline("build/tabview/tabview.js", 299);
this.get('contentBox').setContent(label);
        _yuitest_coverline("build/tabview/tabview.js", 300);
return label;
    },

    _defContentSetter: function(content) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defContentSetter", 303);
_yuitest_coverline("build/tabview/tabview.js", 304);
this.get('panelNode').setContent(content);
        _yuitest_coverline("build/tabview/tabview.js", 305);
return content;
    },

    _defContentGetter: function(content) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defContentGetter", 308);
_yuitest_coverline("build/tabview/tabview.js", 309);
return this.get('panelNode').getContent();
    },

    // find panel by ID mapping from label href
    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defPanelNodeValueFn", 313);
_yuitest_coverline("build/tabview/tabview.js", 314);
var href = this.get('contentBox').get('href') || '',
            parent = this.get('parent'),
            hashIndex = href.indexOf('#'),
            panel;

        _yuitest_coverline("build/tabview/tabview.js", 319);
href = href.substr(hashIndex);

        _yuitest_coverline("build/tabview/tabview.js", 321);
if (href.charAt(0) === '#') { // in-page nav, find by ID
            _yuitest_coverline("build/tabview/tabview.js", 322);
panel = Y.one(href);
            _yuitest_coverline("build/tabview/tabview.js", 323);
if (panel) {
                _yuitest_coverline("build/tabview/tabview.js", 324);
panel.addClass(_classNames.tabPanel);
            }
        }

        // use the one found by id, or else try matching indices
        _yuitest_coverline("build/tabview/tabview.js", 329);
if (!panel && parent) {
            _yuitest_coverline("build/tabview/tabview.js", 330);
panel = parent.get('panelNode')
                    .get('children').item(this.get('index'));
        }

        _yuitest_coverline("build/tabview/tabview.js", 334);
if (!panel) { // create if none found
            _yuitest_coverline("build/tabview/tabview.js", 335);
panel = Y.Node.create(this.PANEL_TEMPLATE);
        }
        _yuitest_coverline("build/tabview/tabview.js", 337);
return panel;
    }
}, {
    ATTRS: {
        /**
         * @attribute triggerEvent
         * @default "click" 
         * @type String
         */
        triggerEvent: {
            value: 'click'
        },

        /**
         * @attribute label
         * @type HTML
         */
        label: { 
            setter: '_defLabelSetter',
            validator: Lang.isString
        },

        /**
         * @attribute content
         * @type HTML
         */
        content: {
            setter: '_defContentSetter',
            getter: '_defContentGetter'
        },

        /**
         * @attribute panelNode
         * @type Y.Node
         */
        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 373);
_yuitest_coverline("build/tabview/tabview.js", 374);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 375);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 376);
node.addClass(_classNames.tabPanel);
                }
                _yuitest_coverline("build/tabview/tabview.js", 378);
return node;
            },
            valueFn: '_defPanelNodeValueFn'
        },
        
        tabIndex: {
            value: null,
            validator: '_validTabIndex'
        }        

    },

    HTML_PARSER: {
        selected: function(contentBox) {
            _yuitest_coverfunc("build/tabview/tabview.js", "selected", 391);
_yuitest_coverline("build/tabview/tabview.js", 392);
var ret = (this.get('boundingBox').hasClass(_classNames.selectedTab)) ?
                        1 : 0;
            _yuitest_coverline("build/tabview/tabview.js", 394);
return ret;
        }
    }

});


}, '3.7.3', {"requires": ["widget", "widget-parent", "widget-child", "tabview-base", "node-pluginhost", "node-focusmanager"], "skinnable": true});
