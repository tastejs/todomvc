import _ from 'underscore';
import { View } from 'backbone';

const extractPath = () => (window.location.hash.match(/\/?#\/?(.+?)$/)||[undefined, ""])[1];

export default class UrlView extends View {

    _setElement(){
        // Needed to override this. This part is deeply coupled with jQuery, which is absent from this project
    }

    _setAttributes(){
        // Need to override this. This part is deeply coupled with jQuery, which is absent from this project
    }

    initialize({ window }){
        this.win = window;
        this.listenTo(this.model, 'change:filter', this.update);
        window.addEventListener('hashchange', _.compose(this.trigger.bind(this, 'url_change'), extractPath));
        this.update();
    }

    update(){
        this.win.location.hash = `/${{
            "all": "",
            "active": "active",
            "completed": "completed"
        }[this.model.get('filter')] }`;
    }
}