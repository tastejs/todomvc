app.Content = class Content extends Tb{

    constructor(){
        super();

        let that = this;

        that.handlers = {
            init: that.init
        };

        //store
        that.store = {
            display: 'All',
            data: []
        };

    }

    // omitted if autonomous custom element 
    get namespace(){
        return 'app.Content';
    }

    // content template
    get contentTemplate(){ return `
        <input id="toggle-all" class="toggle-all" type="checkbox">
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list"></ul>
        <footer class="footer">
            <span class="todo-count" style="position:relative;z-index:1"></span>
            <button class="clear-completed" style="position:relative;z-index:1">Clear completed</button>
            <ul class="filters" style="position:relative">
                <li>
                    <a href="#" class="selected">All</a>
                </li>
                <li>
                    <a href="#">Active</a>
                </li>
                <li>
                    <a href="#">Completed</a>
                </li>
            </ul>
        </footer>`;
    }

    // list item template
    get itemTemplate(){ return `
        <li data-id="{id}">
            <input class="toggle" type="checkbox" {checked}>
            <label>{text}</label>
            <button class="destroy"></button>
        </li>`;
    }

    // methods
    init(){

        let that = this;

        // render template
        $(that.target)
            .append($(that.contentTemplate))
            .clean()
            .hide();

        // clear completed items
        $( '#toggle-all', that.target )
            .on(
                'click',
                function( e ){
                    that.toggleAllCompleted();
                    e.stopPropagation();
                }
            );
            
        // clear completed items
        $( 'button.clear-completed', that.target )
            .on(
                'click',
                function( e ){
                    that.clearCompleted();
                    e.stopPropagation();
                }
            );
            
        // toggle css class for footer buttons
        $('footer a', that.target)
            .on(
                'click',
                function(e){
                    
                    $('footer a', that.target)
                        .forEach(function(pNode){
                            if ( pNode !== e.target ){
                                $( pNode ).removeClass('selected');
                            } else {
                                $( pNode ).addClass('selected', true);
                            }
                        });

                    that.filterList( e.target );

                    e.preventDefault();
                    e.stopPropagation();
                }
            );

        //render when store changes
        that.store.observe( that.renderList.bind(that) );

        //render when store changes
        that.store.observe( function(pVal){
            try {
                localStorage.setItem( 'store', JSON.stringify( pVal ) );
            } catch (e){}
        });

        // get data from localStorage
        try {
            let data = JSON.parse( localStorage.getItem( 'store' ) );
            if ( data ){
                that.store = data;
            }
        } catch (e){}

    }

    renderList(){

        let that = this,
            ul = $('ul', that.target)[0];

        $(ul).empty();

        $(that.target).hide();

        that.store.data.forEach(function(pItem){
            
            let li = $( tb.parse( that.itemTemplate.trim(), pItem ) );

            // destroy button
            $( 'button', li[0] )
                .on(
                    'click',
                    function( e ){
                        that.removeItem( pItem.id );
                    }
                );

            // doubleclick -> inline edit
            $( li[0] )
                .on(
                    'dblclick',
                    function( e ){
                        that.editItem( pItem.id, li[0] );
                        e.stopPropagation();
                    }
                );

            // completed checkbox
            $( 'input', li[0] )
                .on(
                    'click',
                    function( e ){
                        that.changeCompleted( pItem.id, e.target );
                    }
                );
            
            if ( pItem.completed ){
                li.addClass('completed');  
            }

            $(ul).append(li);

            $(that.target).show();
        });

        $(ul).clean();

    }

    filterList( pTarget ){

        let that = this,
            type = pTarget.innerText,
            store = that.store,
            ul = $('ul', that.target )[0];

        switch ( type ){

            case 'Active':
            
                $(ul)
                    .children()
                    .hide()
                    .forEach(function(pLi){
                        if ( !$('input', pLi)[0].hasAttribute('checked') ){
                            $(pLi).show();
                        }
                    });

                store.display = 'Active';

                break;

            case 'Completed':
            
                $(ul)
                    .children()
                    .hide()
                    .forEach(function(pLi){
                        if ( $('input', pLi)[0].hasAttribute('checked') ){
                            $(pLi).show();
                        }
                    });

                store.display = 'Completed';

                break;

            default: // ='All'

                $(ul)
                    .children()
                    .show();

                store.display = 'All';

                break;

        }


    }

    addItem(pItemText){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data;

        data.push({
            id: tb.getId(),
            checked: '',
            text: pItemText
        });

        store.data = data;

        that.store = store;

        that.filterList( $('.filters a.selected', that.target)[0] );

        that.count();

    }

    editItem( pItemText, pLi ){

        let that = this,
            text = pLi.innerText;

        $( pLi )
            .addClass('editing')
            .off('dblclick');
        
        $('label,button', pLi).addClass('view');
        
        let input = $('<input class="edit">')
            .val(text)
            .on(
                'keyup',
                function( e ){
                    switch (e.key) {
                        case 'Enter':
                            that.saveEdit( this.value, pLi );
                            break;
                        case 'Escape':
                            that.cancelEdit( pLi );
                            break;
                    }
                }
            )
            .on(
                'blur',
                function( e ){
                    that.cancelEdit( pLi );
                }
            )
            .on(
                'dblclick',
                function( e ){
                    e.stopPropagation();
                }
            )
            .appendTo(pLi)
            [0];    // returns DOM element

        input.focus();
    }

    cancelEdit( pLi ){

        let that = this;

        $( 'input', pLi )[1].remove();

        $( pLi ).removeClass('editing');
        
        $('label,button', pLi).removeClass('view');
        
    }

    saveEdit( pText, pLi ){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data;

        const todos = data.map( pItem => {
            return $(pLi).attr('data-id') === pItem.id ? tb.extend( pItem, { text: pText } ) : pItem;
        });

        store.data = todos;

        that.store = store; // implicit: re-render

    }

    removeItem(pItemId){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data;

        const todos = data.filter(item => {
            return pItemId === item.id ? false : true;
        });

        store.data = todos;

        that.store = store;

        that.filterList( $('.filters a.selected', that.target)[0] );

        that.count();

    }

    changeCompleted(pItemId, pTarget){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data;

        const todos = data.map(item => {
            if ( pItemId === item.id ){
                item.checked = pTarget.checked ? 'checked' : '';
            }
            return item;
        });

        store.data = todos;

        that.store = store;

        that.count();

    }

    toggleAllCompleted(pItemId, pTarget){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data,
            checked = !!that.count() ? 'checked' : '';

        const todos = data.map( pItem => {
            pItem.checked = checked;
            return pItem;
        });

        store.data = todos;

        that.store = store;

        that.count();

        // click 'All'
        $( '.filters a', that.target )[0].click();

    }

    clearCompleted(){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data;

        store.data = data.filter( item => !item.checked ? true : false );

        that.store = store;

        that.count();

        // click 'All'
        $( '.filters a', that.target )[0].click();

    }

    count(){

        let that = this,
            store = tb.extend({}, that.store),
            data = store.data,
            count = 0;

        data.forEach( pData => !!pData.checked ? count : count++ );

        $('.todo-count')
            .html( count + ' item' + (count !== 1 ? 's ' : ' ') + 'left' );

        return count;
    }

};

/* 
Autonomous Custom Element
*/
(function(){ // IIFE hiding ACE class

    class Content extends HTMLElement{

        constructor(){
            super();
        }

        connectedCallback(){
            new tb(
                app.Content,
                {},
                this
            );
        }

    }

    customElements.define('app-content', Content);

})();