/* globals zuix */
zuix.controller(function(cp) {
    // Private fields
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let updateTimeout = null;

    // This is called once the
    // component is loaded and ready
    cp.create = function() {
        refresh();
    };

    // This is called when eventually
    // the component is disposed
    cp.destroy = function() {
        if (updateTimeout != null) {
            clearTimeout(updateTimeout);
        }
    };

    // the 'cp' object is the instance
    // of this component and that implements
    // the {ContextController} class

    // this is a "private" method
    function refresh() {
        const now = new Date();
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        cp.field('info').html(day);
        cp.field('date').html(month+' '+now.getDate()+', '+now.getFullYear());
        cp.field('time').html(now.toLocaleTimeString());
        updateTimeout = setTimeout(refresh, 1000);
    }
});
