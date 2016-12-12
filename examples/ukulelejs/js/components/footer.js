/*jshint unused:false */
(function () {
    'use strict';
    return function (uku) {
        this.left = 0;
        this.clear = false;
        this.currentFilterType = 'all';
        this.dofilter = function (filterType, event) {
            this.currentFilterType = filterType;
            this.fire('filtertodos', { message: filterType });
        };

        this.getFilterButtonClass = function (type) {
            if (type === this.currentFilterType) {
                return 'selected';
            }
            return '';
        };

        this.clearCompleted = function () {
            this.fire('clearcompleted', null);
        };

        Object.defineProperty(this, 'count', {
            set: function (value) {
                if (!isNaN(value)) {
                    this.left = value;
                }
            }
        });
        Object.defineProperty(this, 'showClear', {
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.clear = value;
                }
            }
        });
    };
})();