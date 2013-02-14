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
_yuitest_coverage["build/recordset-indexer/recordset-indexer.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/recordset-indexer/recordset-indexer.js",
    code: []
};
_yuitest_coverage["build/recordset-indexer/recordset-indexer.js"].code=["YUI.add('recordset-indexer', function (Y, NAME) {","","/**"," * Provides the ability to store multiple custom hash tables referencing records in the recordset."," * @module recordset"," * @submodule recordset-indexer"," */","/**"," * Plugin that provides the ability to store multiple custom hash tables referencing records in the recordset."," * This utility does not support any collision handling. New hash table entries with a used key overwrite older ones."," * @class RecordsetIndexer"," */","function RecordsetIndexer(config) {","    RecordsetIndexer.superclass.constructor.apply(this, arguments);","}","","Y.mix(RecordsetIndexer, {","    NS: \"indexer\",","","    NAME: \"recordsetIndexer\",","","    ATTRS: {","        /**","        * @description Collection of all the hashTables created by the plugin. ","        * The individual tables can be accessed by the key they are hashing against. ","        *","        * @attribute hashTables","        * @public","        * @type object","        */","        hashTables: {","            value: {","","            }","        },","","","        keys: {","            value: {","","            }","        }","    }","});","","","Y.extend(RecordsetIndexer, Y.Plugin.Base, {","","    initializer: function(config) {","        var host = this.get('host');","","        //setup listeners on recordset events","        this.onHostEvent('add', Y.bind(\"_defAddHash\", this), host);","        this.onHostEvent('remove', Y.bind('_defRemoveHash', this), host);","        this.onHostEvent('update', Y.bind('_defUpdateHash', this), host);","","    },","","    destructor: function(config) {","    ","    },","","","    /**","     * @description Setup the hash table for a given key with all existing records in the recordset","     *","     * @method _setHashTable","     * @param key {string} A key to hash by.","     * @return obj {object} The created hash table","     * @private","     */","    _setHashTable: function(key) {","        var host = this.get('host'),","        obj = {},","        i = 0,","        len = host.getLength();","","        for (; i < len; i++) {","            obj[host._items[i].getValue(key)] = host._items[i];","        }","        return obj;","    },","","    //---------------------------------------------","    // Syncing Methods","    //---------------------------------------------","","    /**","     * @description Updates all hash tables when a record is added to the recordset","     *","     * @method _defAddHash","     * @private","     */","    _defAddHash: function(e) {","        var tbl = this.get('hashTables');","","","        //Go through every hashtable that is stored.","        //in each hashtable, look to see if the key is represented in the object being added.","        Y.each(tbl,","        function(v, key) {","            Y.each(e.added || e.updated,","            function(o) {","                //if the object being added has a key which is being stored by hashtable v, add it into the table.","                if (o.getValue(key)) {","                    v[o.getValue(key)] = o;","                }","            });","        });","","    },","","    /**","     * @description Updates all hash tables when a record is removed from the recordset","     *","     * @method _defRemoveHash","     * @private","     */","    _defRemoveHash: function(e) {","        var tbl = this.get('hashTables'),","        reckey;","","        //Go through every hashtable that is stored.","        //in each hashtable, look to see if the key is represented in the object being deleted.","        Y.each(tbl,","        function(v, key) {","            Y.each(e.removed || e.overwritten,","            function(o) {","                reckey = o.getValue(key);","","                //if the hashtable has a key storing a record, and the key and the record both match the record being deleted, delete that row from the hashtable","                if (reckey && v[reckey] === o) {","                    delete v[reckey];","                }","            });","        });","    },","","    /**","     * @description Updates all hash tables when the recordset is updated (a combination of add and remove)","     *","     * @method _defUpdateHash","     * @private","     */","    _defUpdateHash: function(e) {","","        //TODO: It will be more performant to create a new method rather than using _defAddHash, _defRemoveHash, due to the number of loops. See commented code.","        e.added = e.updated;","        e.removed = e.overwritten;","        this._defAddHash(e);","        this._defRemoveHash(e);","","        /*","                    var tbl = this.get('hashTables'), reckey;","                    ","                    Y.each(tbl, function(v, key) {","                        Y.each(e.updated, function(o, i) {","                            ","                            //delete record from hashtable if it has been overwritten","                            reckey = o.getValue(key);","                            ","                            if (reckey) {","                                v[reckey] = o;","                            }","                            ","                            //the undefined case is if more records are updated than currently exist in the recordset. ","                            if (e.overwritten[i] && (v[e.overwritten[i].getValue(key)] === e.overwritten[i])) {","                                delete v[e.overwritten[i].getValue(key)];","                            }","                            ","                            // if (v[reckey] === o) {","                            //  delete v[reckey];","                            // }","                            //              ","                            // //add the new updated record if it has a key that corresponds to a hash table","                            // if (o.getValue(key)) {","                            //  v[o.getValue(key)] = o;","                            // }","                                                            ","                        });","                    });","            */","    },","","    //---------------------------------------------","    // Public Methods","    //---------------------------------------------","","    /**","     * @description Creates a new hash table.","     *","     * @method createTable","     * @param key {string} A key to hash by.","     * @return tbls[key] {object} The created hash table","     * @public","     */","    createTable: function(key) {","        var tbls = this.get('hashTables');","        tbls[key] = this._setHashTable(key);","        this.set('hashTables', tbls);","","        return tbls[key];","    },","","","    /**","     * @description Get a hash table that hashes records by a given key.","     *","     * @method getTable","     * @param key {string} A key to hash by.","     * @return table {object} The created hash table","     * @public","     */","    getTable: function(key) {","        return this.get('hashTables')[key];","    }","","","","","","});","Y.namespace(\"Plugin\").RecordsetIndexer = RecordsetIndexer;","","","","}, '3.7.3', {\"requires\": [\"recordset-base\", \"plugin\"]});"];
_yuitest_coverage["build/recordset-indexer/recordset-indexer.js"].lines = {"1":0,"13":0,"14":0,"17":0,"47":0,"50":0,"53":0,"54":0,"55":0,"73":0,"78":0,"79":0,"81":0,"95":0,"100":0,"102":0,"105":0,"106":0,"120":0,"125":0,"127":0,"129":0,"132":0,"133":0,"148":0,"149":0,"150":0,"151":0,"198":0,"199":0,"200":0,"202":0,"215":0,"223":0};
_yuitest_coverage["build/recordset-indexer/recordset-indexer.js"].functions = {"RecordsetIndexer:13":0,"initializer:49":0,"_setHashTable:72":0,"(anonymous 3):103":0,"(anonymous 2):101":0,"_defAddHash:94":0,"(anonymous 5):128":0,"(anonymous 4):126":0,"_defRemoveHash:119":0,"_defUpdateHash:145":0,"createTable:197":0,"getTable:214":0,"(anonymous 1):1":0};
_yuitest_coverage["build/recordset-indexer/recordset-indexer.js"].coveredLines = 34;
_yuitest_coverage["build/recordset-indexer/recordset-indexer.js"].coveredFunctions = 13;
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 1);
YUI.add('recordset-indexer', function (Y, NAME) {

/**
 * Provides the ability to store multiple custom hash tables referencing records in the recordset.
 * @module recordset
 * @submodule recordset-indexer
 */
/**
 * Plugin that provides the ability to store multiple custom hash tables referencing records in the recordset.
 * This utility does not support any collision handling. New hash table entries with a used key overwrite older ones.
 * @class RecordsetIndexer
 */
_yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "(anonymous 1)", 1);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 13);
function RecordsetIndexer(config) {
    _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "RecordsetIndexer", 13);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 14);
RecordsetIndexer.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 17);
Y.mix(RecordsetIndexer, {
    NS: "indexer",

    NAME: "recordsetIndexer",

    ATTRS: {
        /**
        * @description Collection of all the hashTables created by the plugin. 
        * The individual tables can be accessed by the key they are hashing against. 
        *
        * @attribute hashTables
        * @public
        * @type object
        */
        hashTables: {
            value: {

            }
        },


        keys: {
            value: {

            }
        }
    }
});


_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 47);
Y.extend(RecordsetIndexer, Y.Plugin.Base, {

    initializer: function(config) {
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "initializer", 49);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 50);
var host = this.get('host');

        //setup listeners on recordset events
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 53);
this.onHostEvent('add', Y.bind("_defAddHash", this), host);
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 54);
this.onHostEvent('remove', Y.bind('_defRemoveHash', this), host);
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 55);
this.onHostEvent('update', Y.bind('_defUpdateHash', this), host);

    },

    destructor: function(config) {
    
    },


    /**
     * @description Setup the hash table for a given key with all existing records in the recordset
     *
     * @method _setHashTable
     * @param key {string} A key to hash by.
     * @return obj {object} The created hash table
     * @private
     */
    _setHashTable: function(key) {
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "_setHashTable", 72);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 73);
var host = this.get('host'),
        obj = {},
        i = 0,
        len = host.getLength();

        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 78);
for (; i < len; i++) {
            _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 79);
obj[host._items[i].getValue(key)] = host._items[i];
        }
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 81);
return obj;
    },

    //---------------------------------------------
    // Syncing Methods
    //---------------------------------------------

    /**
     * @description Updates all hash tables when a record is added to the recordset
     *
     * @method _defAddHash
     * @private
     */
    _defAddHash: function(e) {
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "_defAddHash", 94);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 95);
var tbl = this.get('hashTables');


        //Go through every hashtable that is stored.
        //in each hashtable, look to see if the key is represented in the object being added.
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 100);
Y.each(tbl,
        function(v, key) {
            _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "(anonymous 2)", 101);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 102);
Y.each(e.added || e.updated,
            function(o) {
                //if the object being added has a key which is being stored by hashtable v, add it into the table.
                _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "(anonymous 3)", 103);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 105);
if (o.getValue(key)) {
                    _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 106);
v[o.getValue(key)] = o;
                }
            });
        });

    },

    /**
     * @description Updates all hash tables when a record is removed from the recordset
     *
     * @method _defRemoveHash
     * @private
     */
    _defRemoveHash: function(e) {
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "_defRemoveHash", 119);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 120);
var tbl = this.get('hashTables'),
        reckey;

        //Go through every hashtable that is stored.
        //in each hashtable, look to see if the key is represented in the object being deleted.
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 125);
Y.each(tbl,
        function(v, key) {
            _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "(anonymous 4)", 126);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 127);
Y.each(e.removed || e.overwritten,
            function(o) {
                _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "(anonymous 5)", 128);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 129);
reckey = o.getValue(key);

                //if the hashtable has a key storing a record, and the key and the record both match the record being deleted, delete that row from the hashtable
                _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 132);
if (reckey && v[reckey] === o) {
                    _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 133);
delete v[reckey];
                }
            });
        });
    },

    /**
     * @description Updates all hash tables when the recordset is updated (a combination of add and remove)
     *
     * @method _defUpdateHash
     * @private
     */
    _defUpdateHash: function(e) {

        //TODO: It will be more performant to create a new method rather than using _defAddHash, _defRemoveHash, due to the number of loops. See commented code.
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "_defUpdateHash", 145);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 148);
e.added = e.updated;
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 149);
e.removed = e.overwritten;
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 150);
this._defAddHash(e);
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 151);
this._defRemoveHash(e);

        /*
                    var tbl = this.get('hashTables'), reckey;
                    
                    Y.each(tbl, function(v, key) {
                        Y.each(e.updated, function(o, i) {
                            
                            //delete record from hashtable if it has been overwritten
                            reckey = o.getValue(key);
                            
                            if (reckey) {
                                v[reckey] = o;
                            }
                            
                            //the undefined case is if more records are updated than currently exist in the recordset. 
                            if (e.overwritten[i] && (v[e.overwritten[i].getValue(key)] === e.overwritten[i])) {
                                delete v[e.overwritten[i].getValue(key)];
                            }
                            
                            // if (v[reckey] === o) {
                            //  delete v[reckey];
                            // }
                            //              
                            // //add the new updated record if it has a key that corresponds to a hash table
                            // if (o.getValue(key)) {
                            //  v[o.getValue(key)] = o;
                            // }
                                                            
                        });
                    });
            */
    },

    //---------------------------------------------
    // Public Methods
    //---------------------------------------------

    /**
     * @description Creates a new hash table.
     *
     * @method createTable
     * @param key {string} A key to hash by.
     * @return tbls[key] {object} The created hash table
     * @public
     */
    createTable: function(key) {
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "createTable", 197);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 198);
var tbls = this.get('hashTables');
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 199);
tbls[key] = this._setHashTable(key);
        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 200);
this.set('hashTables', tbls);

        _yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 202);
return tbls[key];
    },


    /**
     * @description Get a hash table that hashes records by a given key.
     *
     * @method getTable
     * @param key {string} A key to hash by.
     * @return table {object} The created hash table
     * @public
     */
    getTable: function(key) {
        _yuitest_coverfunc("build/recordset-indexer/recordset-indexer.js", "getTable", 214);
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 215);
return this.get('hashTables')[key];
    }





});
_yuitest_coverline("build/recordset-indexer/recordset-indexer.js", 223);
Y.namespace("Plugin").RecordsetIndexer = RecordsetIndexer;



}, '3.7.3', {"requires": ["recordset-base", "plugin"]});
