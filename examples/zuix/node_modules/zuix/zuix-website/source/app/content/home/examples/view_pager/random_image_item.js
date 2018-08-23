zuix.controller(function(cp) {
    cp.create = function() {
        cp.field('image')
            .on('load', function() {
                this.show();
            })
            .hide()
            //.attr('src', 'http://lorempixel.com/420/280/?random&ts='+(new Date().getTime()));
            .attr('src', 'https://picsum.photos/352/288/?random&ts='+(new Date().getTime()));
    };
});
