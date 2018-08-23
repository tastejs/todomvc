"use strict";
zuix.controller(function (cp) {
    let currentPage = -1;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.expose('setPage', setPage);
        cp.expose('getPage', getPage);
        cp.expose('getCurrent', getCurrent);
        cp.expose('getCurrentPage', getCurrentPage);
        cp.view().children().each(function (i, el) {
            if (cp.view().attr('data-ui-relative') != 'true') {
                el.style['position'] = 'absolute';
                el.style['top'] = '0';
                el.style['left'] = '0';
                el.style['bottom'] = '0';
                el.style['right'] = '0';
                el.style['overflow'] = 'auto';
                el.style['overflow-x'] = 'hidden';
                el.style['-webkit-overflow-scrolling'] = 'touch';
            }
            this.hide();
        });
        setPage(0);
    };

    cp.destroy = function () {
        cp.view().children().each(function () {
            // TODO: should restore original container styles
        });
        currentPage = -1;
    };

    // Private Members

    function getPage(p) {
        const pages = cp.view().children();
        return pages.eq(p);
    }

    function getCurrentPage() {
        return getPage(currentPage);
    }

    function getCurrent() {
        return currentPage;
    }

    function setPage(p, anchor) {
        const pages = cp.view().children();
        const oldPage = currentPage;
        if (p != currentPage) {
            currentPage = p;
            pages.eq(p).show();
            zuix.componentize();
            if (oldPage != -1) {
                pages.eq(oldPage).hide();
                cp.trigger('page:change', {
                    old: oldPage,
                    page: currentPage
                });
            }
        }
        if (!isNaN(anchor))
            pages.get(p).scrollTop = anchor;
        else if (anchor != null)
            pages.get(p).scrollTop = pages.eq(p)
                .find('a[id='+anchor+']')
                .position().y;
    }

});
