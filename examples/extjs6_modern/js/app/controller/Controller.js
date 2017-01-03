Ext.define('TodoMVC.controller.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.todomvc',
    
    routes: {
        active: 'showActiveItems',
        completed: 'showCompletedItems',
        '/': 'showAllItems'
    },
    
    init: function() {
        
        /* load record localstorage */
        this.getViewModel().getStore('todomvc').load();
        
    },
    
    onLoadStore: function(store) {
        
        console.log('onLoadStore', arguments);
        this.updateLabels(store);
        
    },
    
    onKeyupText: function(field, event) {
        
        var me = this,
            store = me.getStore(),
            value = field.getValue();
        
        if(event.getKey() !== Ext.event.Event.ENTER || Ext.isEmpty(value)) {
            
            return;
            
        }
        
        store.add({
            text: value.trim(),
            active: true,
            completed: false
        });
        
        store.sync();
        
        field.reset();
        field.focus();
        
    },
    
    onRenderColumnText: function(value, record, dataIndex, cell) {
        
        console.log('onRenderColumnText', arguments);
        
        if( record.data.completed) {
            
            cell.el.addCls('completed');

        } else {
            
            cell.el.removeCls('completed');
            
        }

        return value;
        
    },
    
    /**
     * Need to add class to be able to delete
     */
    onRendererDelete: function(value, record, dataIndex, cell) {
        
        cell.setCls('delete');
        
    },
    
    onItemTapGrid: function(dataView, index, row, record, target) {
        
        /* Only if it is the class column delete */
        if(target.target.className === 'x-gridcell delete') {
            
            var store = this.getStore();
            record.erase();
            store.sync();
            this.updateLabels(store);
            
        }
        
    },
    
    onRemoveRecord: function(store) {
        
        console.log('onRemoveRecord', store);
        store.sync();
        
    },
    
    onAddRecord: function(store) {
        
        console.log('onAddRecord', store);
        this.updateLabels(store);
        
    },
    
    updateLabels: function(store) {
        
        console.log('updateLabels', arguments);
        
        var me = this,
            btnTotalCompleted = me.lookup('btnTotalCompleted'),
            lblTotal = me.lookup('lblTotal'),
            totalCompleted = 0,
            totalItems = 0;
        
        store.each(function(record) {
            
            if(record.data.completed) {
                
                ++totalCompleted;
                
            }
            
            ++totalItems;
            
        }, me, {
            /* Necessary to include all records */
            filtered: true
        });
        
        lblTotal.setData({
            total: totalItems
        });
        
        btnTotalCompleted[totalCompleted > 0 ? 'show' : 'hide']();
        
    },
    
    updateColumnText: function(record) {
        
        var grid = this.getView().down('grid'),
            rowGrid = grid.getItem(record);
        
        if( !rowGrid) {
            
            return;
            
        }
        
        if( record.data.completed) {
            
            rowGrid.cells[1].addCls('completed');
            
        } else {
            
            rowGrid.cells[1].removeCls('completed');
            
        }
        
    },
    
    onUpdateRecord: function(store, record, operation, modifiedFieldNames) {
        
        console.log('onUpdateRecord', arguments);
        
        this.updateColumnText(record);
        
        if( !modifiedFieldNames) {
            
            return;
        }
        
        if( modifiedFieldNames.indexOf('completed') !== -1) {
            
            console.log('update completed');
            record.set('active', !record.data.completed);
            store.sync();
            this.updateLabels(store);
            
        }
        
    },
    
    onTapBtnAll: function() {
        
        this.redirectTo('/');
        
    },
    
    onTapBtnActive: function() {
        
        this.redirectTo('active');
        
    },
    
    showAllItems: function() {
        
        var store = this.getStore();
        
        store.clearFilter();
        
    },
    
    showActiveItems: function() {
        
        var store = this.getStore();
        
        store.clearFilter();
        store.filter('active', true);
        
    },
    
    showCompletedItems: function() {
        
        var store = this.getStore();
        
        store.clearFilter();
        store.filter('completed', true);
        
    },
    
    onTapBtnCompleted: function() {
        
        this.redirectTo('completed');
        
    },
    
    onTapBtnClearCompleted: function() {
        
        var me = this,
            store = me.getStore();
        
        store.each(function(record) {
            
            if(record.data.completed) {
                
                record.erase();
                
            }
            
        }, me, {
            /* Necessary to include all records */
            filtered: true
        });
        
        me.updateLabels(store);
        
    },
    
    getStore: function() {
        
        return this.getViewModel().getStore('todomvc');
        
    }
    
});
