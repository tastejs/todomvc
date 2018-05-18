app.Footer = class Footer extends Tb{

    constructor(){
        super();

        let that = this;

        that.handlers = {
            init: that.init
        };

    }

    get template(){ return `
        <p>Double-click to edit a todo</p>
        <p>Written by <a href="http://twitter.com/FrankieThu">Frank Thuerigen</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>`;
    }

    // omitted if autonomous custom element 
    get namespace(){
        return 'app.Footer';
    }

    // methods
    init(){

        let that = this;

        $(that.target)
            .append( $(that.template.trim()) )
            .clean();

    }

};

/* 
Autonomous Custom Element
*/
(function(){ // IIFE hiding ACE class

    class Footer extends HTMLElement{

        constructor(){
            super();
        }

        connectedCallback(){
            new tb(
                app.Footer,
                {},
                this
            );
        }

    }

    customElements.define('app-footer', Footer);

})();