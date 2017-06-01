Ext.define('TodoMVC.view.Wrapper', {
    extend: 'Ext.Container',
    
    controller: 'todomvc',
    viewModel: {
        type: 'todomvc'
    },
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'titlebar',
            title: 'todos',
            titleAlign: 'center',
            docked: 'top'
        },
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    xtype: 'textfield',
                    placeHolder: 'What needs to be done?',
                    flex: 1,
                    listeners: {
                        keyup: 'onKeyupText'
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            width: '100%',
            flex: 1,
            hideHeaders: false,
            disclosureProperty: 'delete',
            plugins: {
                type: 'grideditable',
                triggerEvent: 'doubletap',
                enableDeleteButton: true,
                formConfig: {
                    defaults: {
                        labelAlign: 'top'
                    },
                    items: [
                        {
                           xtype: 'textfield',
                           name: 'text',
                           label: 'Text'
                        },
                        {
                           xtype: 'checkboxfield',
                           name: 'completed',
                           label: 'Completed'
                        }
                    ]
                }
            },
            columns: [
                {
                    xtype: 'checkcolumn',
                    dataIndex: 'completed',
                    sortable: false
                },
                {
                    dataIndex: 'text',
                    text: 'Text',
                    renderer: 'onRenderColumnText',
                    flex: 1,
                    editable: true
                },
                {
                    width: 20,
                    renderer: 'onRendererDelete'
                }
            ],
            bind: {
                store: '{todomvc}'
            },
            listeners: {
                itemtap: 'onItemTapGrid'
            }
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            defaults: {
                xtype: 'button',
                flex: 1
            },
            items: [
                {
                    xtype: 'label',
                    reference: 'lblTotal',
                    tpl: '{total} item{[values.total > 1 ? "s" : ""]} left',
                    data: {
                        total: 0
                    }
                },
                {
                    text: 'All',
                    align: 'center',
                    listeners: {
                        tap: 'onTapBtnAll'
                    }
                },
                {
                    text: 'Active',
                    listeners: {
                        tap: 'onTapBtnActive'
                    }
                },
                {
                    text: 'Completed',
                    listeners: {
                        tap: 'onTapBtnCompleted'
                    }
                },
                {
                    reference: 'btnTotalCompleted',
                    text: 'Clear completed',
                    textAlign: 'right',
                    hidden: true,
                    listeners: {
                        tap: 'onTapBtnClearCompleted'
                    }
                }
            ]
        }
    ]
});
