app.Header = class Header extends Tb{

    constructor(){
        super();

        let that = this;

        that.handlers = {
            init: that.init
        };

    }

    get template(){ return `
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus>`;
    }

    // omitted if autonomous custom element 
    get namespace(){
        return 'app.Header';
    }

    // methods
    init(){

        let that = this;

        $(that.target)
            .append( $(that.template.trim()) )
            .clean();

        $('input', that.target)
            .on(
                'keyup',
                function( e ){
                    switch (e.key) {
                        case 'Enter':
                            
                            let input = $('input', that.target);

                            tb('app-content')[0]
                                .addItem(input.val());

                            input.val('');
                            
                            break;

                        case 'Escape':
                            
                            $('input', that.target).val('');
                            
                            break;

                    }
                }
            );

    }

};

/* 
Autonomous Custom Element
*/
(function(){ // IIFE hiding ACE class

    class Header extends HTMLElement{

        constructor(){
            super();
        }

        connectedCallback(){
            new tb(
                app.Header,
                {},
                this
            );
        }

    }

    customElements.define('app-header', Header);

})();