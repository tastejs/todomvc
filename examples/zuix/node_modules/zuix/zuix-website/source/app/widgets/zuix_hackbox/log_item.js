zuix.controller(function (cp) {

    cp.create = function () {
        var args = cp.model().args;
        if (args[1] === 'component:loaded') {
            cp.view().children().eq(0).addClass('linked');
            var sourceView = zuix.$(zuix.context(args[2]).view());
            cp.view().on('mouseenter', function () {
                cp.trigger('item:enter', sourceView);
            }).on('mouseleave', function () {
                cp.trigger('item:leave', sourceView);
            }).on('click', function () {
                cp.trigger('item:click', sourceView);
            });
        }
        cp.update();
    };

    cp.update = function() {
        var level = cp.model().level;
        var args = cp.model().args;
        var time = cp.model().time;
        var elapsed = cp.model().elapsed;

        cp.field('level')
            .addClass(level.toLowerCase())
            .html(level.substring(0, 1).toUpperCase());
        cp.view().addClass(level.toLowerCase());

        cp.field('target').html(args[0]);
        cp.field('state').html(args[1] ? args[1] : '');
        cp.field('info').html(elapsed != null ? elapsed : (args[2] ? args[2] : ''));
        cp.field('time').html(time);
    }

});