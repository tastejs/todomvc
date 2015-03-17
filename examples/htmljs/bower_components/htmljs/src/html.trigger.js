this.trigger = function (ele, name) {
    if (!ele) {
        throw 'Element must be specified';
    }
    if (!name) {
        throw 'Event name must be specified';
    }
    if(document.createEvent) {
       var evt = new Event("HTMLEvents");
       evt.initEvent(name, false, true);
       ele.dispatchEvent(evt);
		}
		else {
      ele.fireEvent("on" + name);
		}
}