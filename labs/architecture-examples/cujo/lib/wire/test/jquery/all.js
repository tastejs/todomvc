(function(g) {

    var hash = '';
    try {
        hash = g.location.hash;
    } catch(e) {}

    doh.registerUrl('_fake', '../../_fake-doh.html' + hash);

    // wire/jquery/dom
    doh.registerUrl('jquery-dom', '../../jquery/dom-query.html' + hash);

    // Go
    doh.run();

})(this);
