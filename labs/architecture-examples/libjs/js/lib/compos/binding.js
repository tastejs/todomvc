void
function() {
    mask.registerHandler('visible', Class({
        Extends: mask.ValueUtils.out,
        refresh: function(values, container) {
            container.style.display = this.isCondition(this.attr.check, values) ? '' : 'none';
        },
        render: function(values, container, cntx) {
            this.refresh(values, container);

            if (this.attr.bind) {
                Object.observe(values, this.attr.bind, this.refresh.bind(this, values, container));
            }
            if (this.nodes) {
                mask.renderDom(this.nodes, values, container, cntx);
            }
        }
    }));

    mask.registerHandler('bind', Class({
        Extends: mask.ValueUtils.out,
        refresh: function(values, container, x) {
			if (this.attr.attr != null) {
                container.setAttribute(this.attr.attr, x);
                return;
            }
			if (this.attr.prop != null){
				container[this.attr.prop] = x;
                return;
			}
            container.innerHTML = x;
        },
        render: function(values, container, cntx) {
            this.refresh(values, container, Object.getProperty(values, this.attr.value));
            Object.observe(values, this.attr.value, this.refresh.bind(this, values, container));

            if (this.nodes) {
                mask.renderDom(this.nodes, values, container, cntx);
            }
        }
    }));

    mask.registerHandler('list', Class({
        Base: Compo,
        render: function(values, container, cntx) {

            values = Object.getProperty(values, this.attr.value);
            if (values instanceof Array === false) return;

            if (this.attr.template != null) {
				var template = this.attr.template;
                if (template[0] == '#') template = document.querySelector(this.attr.template).innerHTML;
                this.nodes = mask.compile(template);
            }
			
			if (this.attr.ref != null){
				this.nodes = Compo.findNode(this.parent, this.attr.ref).nodes;				
			}
			
            for (var i = 0, length = values.length; i < length; i++) {
				mask.renderDom(this.nodes, values[i], container, cntx);
            }

            this.$ = $(container);
        },
        add: function(values){
			var dom = mask.renderDom(this.nodes, values, null, this),
				container = this.$ && this.$.get(0);
			
			if (!container) return;
            if ('id' in values){
				var item = container.querySelector('[data-id="' + values.id + '"]');
                if (item){
					item.parentNode.replaceChild(dom, item);
					return;
				}
            }
			container.appendChild(dom);
        }
    }));

}();