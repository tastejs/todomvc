/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true */
(function ($) {

    var ms = $.mobiscroll,
        date = new Date(),
        defaults = {
            startYear: date.getFullYear() - 100,
            endYear: date.getFullYear() + 1,
            shortYearCutoff: '+10',
            showNow: false,
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1,
            separator: ' '
        },
        /**
         * @class Mobiscroll.datetime
         * @extends Mobiscroll
         * Mobiscroll Datetime component
         */
        preset = function (inst) {
            var that = $(this),
                html5def = {},
                format;
            // Force format for html5 date inputs (experimental)
            if (that.is('input')) {
                switch (that.attr('type')) {
                case 'date':
                    format = 'yy-mm-dd';
                    break;
                case 'datetime':
                    format = 'yy-mm-ddTHH:ii:ssZ';
                    break;
                case 'datetime-local':
                    format = 'yy-mm-ddTHH:ii:ss';
                    break;
                case 'month':
                    format = 'yy-mm';
                    html5def.dateOrder = 'mmyy';
                    break;
                case 'time':
                    format = 'HH:ii:ss';
                    break;
                }
                // Check for min/max attributes
                var min = that.attr('min'),
                    max = that.attr('max');
                if (min) {
                    html5def.minDate = ms.parseDate(format, min);
                }
                if (max) {
                    html5def.maxDate = ms.parseDate(format, max);
                }
            }

            // Set year-month-day order
            var i,
                k,
                keys,
                values,
                wg,
                start,
                end,
                invalid,
                hasTime,
                orig = $.extend({}, inst.settings),
                s = $.extend(inst.settings, defaults, html5def, orig),
                offset = 0,
                wheels = [],
                ord = [],
                o = {},
                f = { y: 'getFullYear', m: 'getMonth', d: 'getDate', h: getHour, i: getMinute, s: getSecond, a: getAmPm },
                p = s.preset,
                dord = s.dateOrder,
                tord = s.timeWheels,
                regen = dord.match(/D/),
                ampm = tord.match(/a/i),
                hampm = tord.match(/h/),
                hformat = p == 'datetime' ? s.dateFormat + s.separator + s.timeFormat : p == 'time' ? s.timeFormat : s.dateFormat,
                defd = new Date(),
                stepH = s.stepHour,
                stepM = s.stepMinute,
                stepS = s.stepSecond,
                mind = s.minDate || new Date(s.startYear, 0, 1),
                maxd = s.maxDate || new Date(s.endYear, 11, 31, 23, 59, 59);

            format = format || hformat;

            if (p.match(/date/i)) {

                // Determine the order of year, month, day wheels
                $.each(['y', 'm', 'd'], function (j, v) {
                    i = dord.search(new RegExp(v, 'i'));
                    if (i > -1) {
                        ord.push({ o: i, v: v });
                    }
                });
                ord.sort(function (a, b) { return a.o > b.o ? 1 : -1; });
                $.each(ord, function (i, v) {
                    o[v.v] = i;
                });

                wg = [];
                for (k = 0; k < 3; k++) {
                    if (k == o.y) {
                        offset++;
                        values = [];
                        keys = [];
                        start = mind.getFullYear();
                        end = maxd.getFullYear();
                        for (i = start; i <= end; i++) {
                            keys.push(i);
                            values.push(dord.match(/yy/i) ? i : (i + '').substr(2, 2));
                        }
                        addWheel(wg, keys, values, s.yearText);
                    } else if (k == o.m) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 0; i < 12; i++) {
                            var str = dord.replace(/[dy]/gi, '').replace(/mm/, i < 9 ? '0' + (i + 1) : i + 1).replace(/m/, (i + 1));
                            keys.push(i);
                            values.push(str.match(/MM/) ? str.replace(/MM/, '<span class="dw-mon">' + s.monthNames[i] + '</span>') : str.replace(/M/, '<span class="dw-mon">' + s.monthNamesShort[i] + '</span>'));
                        }
                        addWheel(wg, keys, values, s.monthText);
                    } else if (k == o.d) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 1; i < 32; i++) {
                            keys.push(i);
                            values.push(dord.match(/dd/i) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.dayText);
                    }
                }
                wheels.push(wg);
            }

            if (p.match(/time/i)) {
                hasTime = true;

                // Determine the order of hours, minutes, seconds wheels
                ord = [];
                $.each(['h', 'i', 's', 'a'], function (i, v) {
                    i = tord.search(new RegExp(v, 'i'));
                    if (i > -1) {
                        ord.push({ o: i, v: v });
                    }
                });
                ord.sort(function (a, b) {
                    return a.o > b.o ? 1 : -1;
                });
                $.each(ord, function (i, v) {
                    o[v.v] = offset + i;
                });

                wg = [];
                for (k = offset; k < offset + 4; k++) {
                    if (k == o.h) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 0; i < (hampm ? 12 : 24); i += stepH) {
                            keys.push(i);
                            values.push(hampm && i == 0 ? 12 : tord.match(/hh/i) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.hourText);
                    } else if (k == o.i) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 0; i < 60; i += stepM) {
                            keys.push(i);
                            values.push(tord.match(/ii/) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.minuteText);
                    } else if (k == o.s) {
                        offset++;
                        values = [];
                        keys = [];
                        for (i = 0; i < 60; i += stepS) {
                            keys.push(i);
                            values.push(tord.match(/ss/) && i < 10 ? '0' + i : i);
                        }
                        addWheel(wg, keys, values, s.secText);
                    } else if (k == o.a) {
                        offset++;
                        var upper = tord.match(/A/);
                        addWheel(wg, [0, 1], upper ? ['AM', 'PM'] : ['am', 'pm'], s.ampmText);
                    }
                }

                wheels.push(wg);
            }

            function get(d, i, def) {
                if (o[i] !== undefined) {
                    return +d[o[i]];
                }
                if (def !== undefined) {
                    return def;
                }
                return defd[f[i]] ? defd[f[i]]() : f[i](defd);
            }

            function addWheel(wg, k, v, lbl) {
                wg.push({
                    values: v,
                    keys: k,
                    label: lbl
                });
            }

            function step(v, st) {
                return Math.floor(v / st) * st;
            }

            function getHour(d) {
                var hour = d.getHours();
                hour = hampm && hour >= 12 ? hour - 12 : hour;
                return step(hour, stepH);
            }

            function getMinute(d) {
                return step(d.getMinutes(), stepM);
            }

            function getSecond(d) {
                return step(d.getSeconds(), stepS);
            }

            function getAmPm(d) {
                return ampm && d.getHours() > 11 ? 1 : 0;
            }

            function getDate(d) {
                var hour = get(d, 'h', 0);
                return new Date(get(d, 'y'), get(d, 'm'), get(d, 'd', 1), get(d, 'a') ? hour + 12 : hour, get(d, 'i', 0), get(d, 's', 0));
            }

            function getIndex(t, v) {
                return $('.dw-li', t).index($('.dw-li[data-val="' + v + '"]', t));
            }

            function getValidIndex(t, v, max, add) {
                if (v < 0) {
                    return 0;
                }
                if (v > max) {
                    return $('.dw-li', t).length;
                }
                return getIndex(t, v) + add;
            }

            // Extended methods
            // ---

            /**
             * Sets the selected date
             *
             * @param {Date} d Date to select.
             * @param {Boolean} [fill=false] Also set the value of the associated input element. Default is true.
             * @param {Number} [time=0] Animation time to scroll to the selected date.
             * @param {Boolean} [temp=false] Set temporary value only.
             * @param {Boolean} [change=fill] Trigger change on input element.
             */
            inst.setDate = function (d, fill, time, temp, change) {
                var i;

                // Set wheels
                for (i in o) {
                    inst.temp[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                }
                inst.setValue(inst.temp, fill, time, temp, change);
            };

            /**
             * Returns the currently selected date.
             *
             * @param {Boolean} [temp=false] If true, return the currently shown date on the picker, otherwise the last selected one.
             * @return {Date}
             */
            inst.getDate = function (temp) {
                return getDate(temp ? inst.temp : inst.values);
            };

            inst.convert = function (obj) {
                var x = obj;

                if (!$.isArray(obj)) { // Convert from old format
                    x = [];
                    $.each(obj, function (i, o) {
                        $.each(o, function (j, o) {
                            if (i === 'daysOfWeek') {
                                if (o.d) {
                                    o.d = 'w' + o.d;
                                } else {
                                    o = 'w' + o;
                                }
                            }
                            x.push(o);
                        });
                    });
                }

                return x;
            };

            inst.format = hformat;
            inst.buttons.now = { text: s.nowText, css: 'dwb-n', handler: function () { inst.setDate(new Date(), false, 0.3, true, true); } };

            if (s.showNow) {
                s.buttons.splice($.inArray('set', s.buttons) + 1, 0, 'now');
            }

            invalid = s.invalid ? inst.convert(s.invalid) : false;

            // ---

            return {
                wheels: wheels,
                headerText: s.headerText ? function (v) {
                    return ms.formatDate(hformat, getDate(inst.temp), s);
                } : false,
                formatResult: function (d) {
                    return ms.formatDate(format, getDate(d), s);
                },
                parseValue: function (val) {
                    var d = ms.parseDate(format, val, s),
                        i,
                        result = [];

                    // Set wheels
                    for (i in o) {
                        result[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                    }
                    return result;
                },
                validate: function (dw, i, time, dir) {
                    var temp = inst.temp, //.slice(0),
                        mins = { y: mind.getFullYear(), m: 0, d: 1, h: 0, i: 0, s: 0, a: 0 },
                        maxs = { y: maxd.getFullYear(), m: 11, d: 31, h: step(hampm ? 11 : 23, stepH), i: step(59, stepM), s: step(59, stepS), a: 1 },
                        steps = { h: stepH, i: stepM, s: stepS, a: 1 },
                        y = get(temp, 'y'),
                        m = get(temp, 'm'),
                        minprop = true,
                        maxprop = true;

                    $.each(['y', 'm', 'd', 'a', 'h', 'i', 's'], function (x, i) {
                        if (o[i] !== undefined) {
                            var min = mins[i],
                                max = maxs[i],
                                maxdays = 31,
                                val = get(temp, i),
                                t = $('.dw-ul', dw).eq(o[i]);

                            if (i == 'd') {
                                maxdays = 32 - new Date(y, m, 32).getDate();
                                max = maxdays;
                                if (regen) {
                                    $('.dw-li', t).each(function () {
                                        var that = $(this),
                                            d = that.data('val'),
                                            w = new Date(y, m, d).getDay(),
                                            str = dord.replace(/[my]/gi, '').replace(/dd/, d < 10 ? '0' + d : d).replace(/d/, d);
                                        $('.dw-i', that).html(str.match(/DD/) ? str.replace(/DD/, '<span class="dw-day">' + s.dayNames[w] + '</span>') : str.replace(/D/, '<span class="dw-day">' + s.dayNamesShort[w] + '</span>'));
                                    });
                                }
                            }
                            if (minprop && mind) {
                                min = mind[f[i]] ? mind[f[i]]() : f[i](mind);
                            }
                            if (maxprop && maxd) {
                                max = maxd[f[i]] ? maxd[f[i]]() : f[i](maxd);
                            }
                            if (i != 'y') {
                                var i1 = getIndex(t, min),
                                    i2 = getIndex(t, max);
                                $('.dw-li', t).removeClass('dw-v').slice(i1, i2 + 1).addClass('dw-v');
                                if (i == 'd') { // Hide days not in month
                                    $('.dw-li', t).removeClass('dw-h').slice(maxdays).addClass('dw-h');
                                }
                            }
                            if (val < min) {
                                val = min;
                            }
                            if (val > max) {
                                val = max;
                            }
                            if (minprop) {
                                minprop = val == min;
                            }
                            if (maxprop) {
                                maxprop = val == max;
                            }
                            // Disable some days
                            if (invalid && i == 'd') {
                                var d, j, k, v,
                                    first = new Date(y, m, 1).getDay(),
                                    idx = [];

                                for (j = 0; j < invalid.length; j++) {
                                    d = invalid[j];
                                    v = d + '';
                                    if (!d.start) {
                                        if (d.getTime) { // Exact date
                                            if (d.getFullYear() == y && d.getMonth() == m) {
                                                idx.push(d.getDate() - 1);
                                            }
                                        } else if (!v.match(/w/i)) { // Day of month
                                            v = v.split('/');
                                            if (v[1]) {
                                                if (v[0] - 1 == m) {
                                                    idx.push(v[1] - 1);
                                                }
                                            } else {
                                                idx.push(v[0] - 1);
                                            }
                                        } else { // Day of week
                                            v = +v.replace('w', '');
                                            for (k = v - first; k < maxdays; k += 7) {
                                                if (k >= 0) {
                                                    idx.push(k);
                                                }
                                            }
                                        }
                                    }
                                }
                                $.each(idx, function (i, v) {
                                    $('.dw-li', t).eq(v).removeClass('dw-v');
                                });

                                val = inst.getValidCell(val, t, dir).val;
                            }

                            // Set modified value
                            temp[o[i]] = val;
                        }
                    });

                    // Invalid times
                    if (hasTime && invalid) {

                        var dd, v, val, str, parts1, parts2, j, v1, v2, i1, i2, prop1, prop2, target, add, remove,
                            spec = {},
                            d = get(temp, 'd'),
                            day = new Date(y, m, d),
                            w = ['a', 'h', 'i', 's'];

                        $.each(invalid, function (i, obj) {
                            if (obj.start) {
                                obj.apply = false;
                                dd = obj.d;
                                v = dd + '';
                                str = v.split('/');
                                if (dd && ((dd.getTime && y == dd.getFullYear() && m == dd.getMonth() && d == dd.getDate()) || // Exact date
                                    (!v.match(/w/i) && ((str[1] && d == str[1] && m == str[0] - 1) || (!str[1] && d == str[0]))) || // Day of month
                                    (v.match(/w/i) && day.getDay() == +v.replace('w', '')) // Day of week
                                    )) {
                                    obj.apply = true;
                                    spec[day] = true; // Prevent applying generic rule on day, if specific exists
                                }
                            }
                        });

                        $.each(invalid, function (i, obj) {
                            if (obj.start && (obj.apply || (!obj.d && !spec[day]))) {

                                parts1 = obj.start.split(':');
                                parts2 = obj.end.split(':');

                                for (j = 0; j < 3; j++) {
                                    if (parts1[j] === undefined) {
                                        parts1[j] = 0;
                                    }
                                    if (parts2[j] === undefined) {
                                        parts2[j] = 59;
                                    }
                                    parts1[j] = +parts1[j];
                                    parts2[j] = +parts2[j];
                                }

                                parts1.unshift(parts1[0] > 11 ? 1 : 0);
                                parts2.unshift(parts2[0] > 11 ? 1 : 0);

                                if (hampm) {
                                    if (parts1[1] >= 12) {
                                        parts1[1] = parts1[1] - 12;
                                    }

                                    if (parts2[1] >= 12) {
                                        parts2[1] = parts2[1] - 12;
                                    }
                                }

                                prop1 = true;
                                prop2 = true;
                                $.each(w, function (i, v) {
                                    if (o[v] !== undefined) {
                                        val = get(temp, v);
                                        add = 0;
                                        remove = 0;
                                        i1 = 0;
                                        i2 = undefined;
                                        target = $('.dw-ul', dw).eq(o[v]);

                                        // Look ahead if next wheels should be disabled completely
                                        for (j = i + 1; j < 4; j++) {
                                            if (parts1[j] > 0) {
                                                add = steps[v];
                                            }
                                            if (parts2[j] < maxs[w[j]]) {
                                                remove = steps[v];
                                            }
                                        }

                                        // Calculate min and max values
                                        v1 = step(parts1[i] + add, steps[v]);
                                        v2 = step(parts2[i] - remove, steps[v]);

                                        if (prop1) {
                                            i1 = getValidIndex(target, v1, maxs[v], 0);
                                        }

                                        if (prop2) {
                                            i2 = getValidIndex(target, v2, maxs[v], 1);
                                        }

                                        // Disable values
                                        if (prop1 || prop2) {
                                            $('.dw-li', target).slice(i1, i2).removeClass('dw-v');
                                        }

                                        // Get valid value
                                        val = inst.getValidCell(val, target, dir).val;

                                        prop1 = prop1 && val == step(parts1[i], steps[v]);
                                        prop2 = prop2 && val == step(parts2[i], steps[v]);

                                        // Set modified value
                                        temp[o[v]] = val;
                                    }
                                });
                            }
                        });
                    }
                }
            };
        };

    ms.i18n.en = $.extend(ms.i18n.en, {
        dateFormat: 'mm/dd/yy',
        dateOrder: 'mmddy',
        timeWheels: 'hhiiA',
        timeFormat: 'hh:ii A',
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthText: 'Month',
        dayText: 'Day',
        yearText: 'Year',
        hourText: 'Hours',
        minuteText: 'Minutes',
        secText: 'Seconds',
        ampmText: '&nbsp;',
        nowText: 'Now'
    });

    $.each(['date', 'time', 'datetime'], function (i, v) {
        ms.presets[v] = preset;
        ms.presetShort(v);
    });

    /**
    * Format a date into a string value with a specified format.
    * @param {String} format Output format.
    * @param {Date} date Date to format.
    * @param {Object} [settings={}] Settings.
    * @return {String} Returns the formatted date string.
    */
    ms.formatDate = function (format, date, settings) {
        if (!date) {
            return null;
        }
        var s = $.extend({}, defaults, settings),
            look = function (m) { // Check whether a format character is doubled
                var n = 0;
                while (i + 1 < format.length && format.charAt(i + 1) == m) {
                    n++;
                    i++;
                }
                return n;
            },
            f1 = function (m, val, len) { // Format a number, with leading zero if necessary
                var n = '' + val;
                if (look(m)) {
                    while (n.length < len) {
                        n = '0' + n;
                    }
                }
                return n;
            },
            f2 = function (m, val, s, l) { // Format a name, short or long as requested
                return (look(m) ? l[val] : s[val]);
            },
            i,
            output = '',
            literal = false;

        for (i = 0; i < format.length; i++) {
            if (literal) {
                if (format.charAt(i) == "'" && !look("'")) {
                    literal = false;
                } else {
                    output += format.charAt(i);
                }
            } else {
                switch (format.charAt(i)) {
                case 'd':
                    output += f1('d', date.getDate(), 2);
                    break;
                case 'D':
                    output += f2('D', date.getDay(), s.dayNamesShort, s.dayNames);
                    break;
                case 'o':
                    output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                    break;
                case 'm':
                    output += f1('m', date.getMonth() + 1, 2);
                    break;
                case 'M':
                    output += f2('M', date.getMonth(), s.monthNamesShort, s.monthNames);
                    break;
                case 'y':
                    output += (look('y') ? date.getFullYear() : (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                    break;
                case 'h':
                    var h = date.getHours();
                    output += f1('h', (h > 12 ? (h - 12) : (h == 0 ? 12 : h)), 2);
                    break;
                case 'H':
                    output += f1('H', date.getHours(), 2);
                    break;
                case 'i':
                    output += f1('i', date.getMinutes(), 2);
                    break;
                case 's':
                    output += f1('s', date.getSeconds(), 2);
                    break;
                case 'a':
                    output += date.getHours() > 11 ? 'pm' : 'am';
                    break;
                case 'A':
                    output += date.getHours() > 11 ? 'PM' : 'AM';
                    break;
                case "'":
                    if (look("'")) {
                        output += "'";
                    } else {
                        literal = true;
                    }
                    break;
                default:
                    output += format.charAt(i);
                }
            }
        }
        return output;
    };

    /**
    * Extract a date from a string value with a specified format.
    * @param {String} format Input format.
    * @param {String} value String to parse.
    * @param {Object} [settings={}] Settings.
    * @return {Date} Returns the extracted date.
    */
    ms.parseDate = function (format, value, settings) {
        var s = $.extend({}, defaults, settings),
            def = s.defaultValue || new Date();

        if (!format || !value) {
            return def;
        }

        value = (typeof value == 'object' ? value.toString() : value + '');

        var shortYearCutoff = s.shortYearCutoff,
            year = def.getFullYear(),
            month = def.getMonth() + 1,
            day = def.getDate(),
            doy = -1,
            hours = def.getHours(),
            minutes = def.getMinutes(),
            seconds = 0, //def.getSeconds(),
            ampm = -1,
            literal = false, // Check whether a format character is doubled
            lookAhead = function (match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            getNumber = function (match) { // Extract a number from the string value
                lookAhead(match);
                var size = (match == '@' ? 14 : (match == '!' ? 20 : (match == 'y' ? 4 : (match == 'o' ? 3 : 2)))),
                    digits = new RegExp('^\\d{1,' + size + '}'),
                    num = value.substr(iValue).match(digits);

                if (!num) {
                    return 0;
                }
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            getName = function (match, s, l) { // Extract a name from the string value and convert to an index
                var names = (lookAhead(match) ? l : s),
                    i;

                for (i = 0; i < names.length; i++) {
                    if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
                        iValue += names[i].length;
                        return i + 1;
                    }
                }
                return 0;
            },
            checkLiteral = function () {
                iValue++;
            },
            iValue = 0,
            iFormat;

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) == "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                case 'd':
                    day = getNumber('d');
                    break;
                case 'D':
                    getName('D', s.dayNamesShort, s.dayNames);
                    break;
                case 'o':
                    doy = getNumber('o');
                    break;
                case 'm':
                    month = getNumber('m');
                    break;
                case 'M':
                    month = getName('M', s.monthNamesShort, s.monthNames);
                    break;
                case 'y':
                    year = getNumber('y');
                    break;
                case 'H':
                    hours = getNumber('H');
                    break;
                case 'h':
                    hours = getNumber('h');
                    break;
                case 'i':
                    minutes = getNumber('i');
                    break;
                case 's':
                    seconds = getNumber('s');
                    break;
                case 'a':
                    ampm = getName('a', ['am', 'pm'], ['am', 'pm']) - 1;
                    break;
                case 'A':
                    ampm = getName('A', ['am', 'pm'], ['am', 'pm']) - 1;
                    break;
                case "'":
                    if (lookAhead("'")) {
                        checkLiteral();
                    } else {
                        literal = true;
                    }
                    break;
                default:
                    checkLiteral();
                }
            }
        }
        if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= (typeof shortYearCutoff != 'string' ? shortYearCutoff : new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10)) ? 0 : -100);
        }
        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                var dim = 32 - new Date(year, month - 1, 32).getDate();
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }
        hours = (ampm == -1) ? hours : ((ampm && hours < 12) ? (hours + 12) : (!ampm && hours == 12 ? 0 : hours));
        var date = new Date(year, month - 1, day, hours, minutes, seconds);
        if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day) {
            return def; // Invalid date
        }
        return date;
    };

})(jQuery);