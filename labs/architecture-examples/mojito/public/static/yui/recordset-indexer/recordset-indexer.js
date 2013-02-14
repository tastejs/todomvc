/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
function RecordsetIndexer(config) {
    RecordsetIndexer.superclass.constructor.apply(this, arguments);
}

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


Y.extend(RecordsetIndexer, Y.Plugin.Base, {

    initializer: function(config) {
        var host = this.get('host');

        //setup listeners on recordset events
        this.onHostEvent('add', Y.bind("_defAddHash", this), host);
        this.onHostEvent('remove', Y.bind('_defRemoveHash', this), host);
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
        var host = this.get('host'),
        obj = {},
        i = 0,
        len = host.getLength();

        for (; i < len; i++) {
            obj[host._items[i].getValue(key)] = host._items[i];
        }
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
        var tbl = this.get('hashTables');


        //Go through every hashtable that is stored.
        //in each hashtable, look to see if the key is represented in the object being added.
        Y.each(tbl,
        function(v, key) {
            Y.each(e.added || e.updated,
            function(o) {
                //if the object being added has a key which is being stored by hashtable v, add it into the table.
                if (o.getValue(key)) {
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
        var tbl = this.get('hashTables'),
        reckey;

        //Go through every hashtable that is stored.
        //in each hashtable, look to see if the key is represented in the object being deleted.
        Y.each(tbl,
        function(v, key) {
            Y.each(e.removed || e.overwritten,
            function(o) {
                reckey = o.getValue(key);

                //if the hashtable has a key storing a record, and the key and the record both match the record being deleted, delete that row from the hashtable
                if (reckey && v[reckey] === o) {
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
        e.added = e.updated;
        e.removed = e.overwritten;
        this._defAddHash(e);
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
        var tbls = this.get('hashTables');
        tbls[key] = this._setHashTable(key);
        this.set('hashTables', tbls);

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
        return this.get('hashTables')[key];
    }





});
Y.namespace("Plugin").RecordsetIndexer = RecordsetIndexer;



}, '3.7.3', {"requires": ["recordset-base", "plugin"]});
