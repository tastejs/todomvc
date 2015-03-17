(function () {
    var addDate = function (date, num) {
        var res = new Date(date);
        res.setDate(res.getDate() + num);
        return res;
    },
    diffDays = function (firstDate, secondDate) {
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        return diffDays;
    },
    parseFormat = function (format) {
        var separator = format.match(/[.\/\-\s].*?/),
            parts = format.split(/\W+/);
        if (!separator || !parts || parts.length === 0){
            throw new Error("Invalid date format.");
        }
        return {separator: separator, parts: parts};
    },
    parseDate = function(date, format) {
        var parts = date.split(format.separator),
            date = new Date(),
            val;
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (parts.length === format.parts.length) {
            var year = date.getFullYear(), day = date.getDate(), month = date.getMonth();
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                val = parseInt(parts[i], 10)||1;
                switch(format.parts[i]) {
                    case 'dd':
                    case 'd':
                        day = val;
                        date.setDate(val);
                        break;
                    case 'mm':
                    case 'm':
                        month = val - 1;
                        date.setMonth(val - 1);
                        break;
                    case 'yy':
                        year = 2000 + val;
                        date.setFullYear(2000 + val);
                        break;
                    case 'yyyy':
                        year = val;
                        date.setFullYear(val);
                        break;
                }
            }
            date = new Date(year, month, day, 0 ,0 ,0);
        }
        return date;
    },
    formatDate = function (date, format) {
        var val = {
            d: date.getDate(),
            m: date.getMonth() + 1,
            yy: date.getFullYear().toString().substring(2),
            yyyy: date.getFullYear()
        };
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        var date = [];
        for (var i=0, cnt = format.parts.length; i < cnt; i++) {
            date.push(val[format.parts[i]]);
        }
        return date.join(format.separator);
    },
    dates = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: html.data(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    };
    
    html.datepicker = function (observer, start, end, defaultFormat) {
        observer.lazyInput = true;
        // we assume that user want to display date-picker under an input
        var input = null,
        format = function () {
            return parseFormat( defaultFormat || 'dd/mm/yyyy' );
        }
        isSelectingDate = false,
        isHeader = false,
        date = html.data(observer() || new Date),
        monthYear = html.data(function () {
            return dates.months[date().getMonth()] + ' ' + date().getFullYear();
        }),
        month = html.data(function () {
            return date().getMonth();
        }),
        year = html.data(function () {
            return date().getFullYear();
        }),
        decade = html.data(function () {
            var yy    = year().toString(),
                begin = year() - yy[yy.length - 1],
                res   = [];
            for (var i = -1; i < 11; i++) res.push(begin+i);
            return res;
        }),
        decadeText = html.data(function () {
            var dc = decade();
            return dc[1] + ' - ' + dc[dc.length - 2];
        }),
        firstDateOfMonth = html.data(function () {
            return new Date(date().getFullYear(), date().getMonth(), 1);
        }),
        firstDate = html.data(function () {
            return addDate(firstDateOfMonth(), -firstDateOfMonth().getDay());
        }),
        lastDateOfMonth = html.data(function () {
            return new Date(date().getFullYear(), date().getMonth() + 1, 0);
        }),
        lastDate = html.data(function () {
            return addDate(firstDate(), 42);
        }),
        weeks = html.data(function () {
            return diffDays(lastDate(), firstDate())/7;
        }),
        addMonthYear = function (num, isYear) {
            var currDate = html.getData(date),
                changed  = new Date(currDate.getFullYear(), currDate.getMonth() + num, 1);
            if (isYear) {
                changed = new Date(currDate.getFullYear() + num, currDate.getMonth(), 1);
            }
            date(changed);
            dates.monthsShort.refresh();
        },
        isSelectDate = html.data(true).subscribe(function (val) {
            if (val === true) {
                isSelectMonth(false);
            }
        }),
        isSelectMonth = html.data(false).subscribe(function (val) {
            if (val === true) {
                isSelectDate(false);
                isSelectYear(false);
                dates.monthsShort.refresh();
            }
        }),
        isSelectYear = html.data(false).subscribe(function (val) {
            if (val === true) {
                isSelectMonth(false);
            }
        }),
        isNextMonth = html.data(function () {
            return end? lastDate() < end : true;
        }),
        isPrevMonth = html.data(function () {
            return start? firstDate() > start : true;
        }),
        isNextYear = html.data(function () {
            return end? year() < end.getFullYear(): true;
        }),
        isPrevYear = html.data(function () {
            return start? year() > start.getFullYear() : true;
        }),
        isNextDecade = html.data(function () {
            var dc = decade();
            return end? dc[dc.length - 1] < end.getFullYear(): true;
        }),
        isPrevDecade = html.data(function () {
            var dc = decade();
            return start? dc[0] > start.getFullYear() : true;
        }),
        div = html.createEleNoParent('div').$$();
        
        document.body.appendChild(div);
        
        html(div).addClass('datepicker dropdown-menu')
            .div().addClass('datepicker-days').css({display: 'block'}).visible(isSelectDate, true)
                .table().addClass('table-condensed')
                    .thead()
                        .tr()
                            .th().addClass('prev').text('&lsaquo;').visible(isPrevMonth).click(function () {
                                addMonthYear(-1);
                            }).$()
                            .th().addClass('switch').attr({colspan: 5}).text(monthYear).click(function () {
                                isSelectMonth(true);
                                dates.monthsShort.refresh();
                            }).$()
                            .th().addClass('next').text('&rsaquo;').visible(isNextMonth).click(function () {
                                addMonthYear(1);
                            }).$()
                        .$() // end of tr
                        .tr().each(dates.daysMin, function (day) {
                            html.th().addClass('dow').text(day);
                        }).$() // end of tr
                    .$('table') // go to table tag
                    
                    .tbody().each(weeks, function (week) {
                        html.tr().each(7, function (day) {
                            var currDate = addDate(firstDate(), week * 7 + day);
                            html.td(currDate.getDate()).addClass('day').click(function () {
                                observer(html(this).expando('date'));
                                html(this).$('table').find('.active').removeClass('active');
                                html(this).addClass('active');
                                date(html(this).expando('date'));
                            }).expando('date', currDate);
                            
                            var selectedDate = html.getData(observer);
                            selectedDate && currDate.getFullYear() === selectedDate.getFullYear()
                                && currDate.getMonth() === selectedDate.getMonth()
                                && currDate.getDate() === selectedDate.getDate()
                                && html.addClass('active');
                            currDate.getMonth() < date().getMonth() && html.addClass('old');
                            currDate.getMonth() > date().getMonth() && html.addClass('new');
                            if ( start && currDate < start || end && currDate > end ) {
                                html.addClass('disabled').unbindAll();
                            }
                        });
                    }).$()
                .$() // end of table
            .$() // end of datepicker-days
        .$(); // end of datepicker
        
        // render month picker
        html(div)
            .div().addClass('datepicker-months').css('display', 'block').visible(isSelectMonth, true)
                .table().addClass('table-condensed')
                    .thead()
                        .tr()
                            .th('&lsaquo;').addClass('prev').visible(isPrevYear).click(function () {
                                addMonthYear(-1, true);
                            }).$()
                            .th(year).addClass('switch').attr({colspan: 5}).click(function () {
                                isSelectYear(true);
                            }).$()
                            .th('&rsaquo;').addClass('next').visible(isNextYear).click(function () {
                                addMonthYear(1, true);
                            }).$()
                        .$() // end of tr
                    .$() // end of thead
                    
                    .tbody()
                        .tr()
                            .td().attr({colspan: 7}).each(dates.monthsShort, function (m) {
                                html.span(m).addClass('month').click(function () {
                                    var mon = html(this).expando('month');
                                    var currDate = date();
                                    date(new Date(currDate.getFullYear(), mon, 1));
                                    isSelectDate(true);
                                });
                                var unwrap = observer();
                                if (html.array.indexOf.call(dates.monthsShort(), m) === month() && unwrap.getFullYear && unwrap.getFullYear() === year())
                                    html.addClass('active');
                                var mon = html.array.indexOf.call(dates.monthsShort(), m);
                                html.expando('month', mon);
                                if ( start && mon < start.getMonth() && year() <= start.getFullYear()
                                    || end && mon > end.getMonth() && year() >= end.getFullYear()) {
                                    html.addClass('disabled').unbindAll();
                                }
                            }).$() // end of td
                        .$() // end of tr
                    .$() // end of tbody
                .$() // end of table
            .$() // end of datepicker-months
        
        // render year picker
        html(div)
            .div().addClass('datepicker-years').css('display', 'block').visible(isSelectYear, true)
                .table().addClass('table-condensed')
                    .thead()
                        .tr()
                            .th('&lsaquo;').addClass('prev').visible(isPrevDecade).click(function () {
                                addMonthYear(-10, true);
                            }).$()
                            .th(decadeText).addClass('switch').attr({colspan: 5}).$()
                            .th('&rsaquo;').addClass('next').visible(isNextDecade).click(function () {
                                addMonthYear(10, true);
                            }).$()
                        .$() // end of tr
                    .$() // end of thead
                    
                    .tbody()
                        .tr()
                            .td().attr({colspan: 7}).each(decade, function (y) {
                                html.span(y).addClass('year').click(function () {
                                    var y = html(this).expando('year');
                                    var currDate = date();
                                    date(new Date(y, currDate.getMonth(), 1));
                                    isSelectMonth(true);
                                });
                                if (y === year()) html.addClass('active');
                                html.expando('year', y);
                                if ( start && y < start.getFullYear() || end && y > end.getFullYear() ) {
                                    html.addClass('disabled').unbindAll();
                                }
                            }).$() // end of td
                        .$() // end of tr
                    .$() // end of tbody
                .$() // end of table
            .$() // end of datepicker-months
        html(div).click(function () {
            var nodeName = this.nodeName.toLowerCase();
            if (nodeName === 'th' || nodeName === 'span') isHeader = true;
            isSelectingDate = true;
        });
        var isDisplayCalendar = html.data(false);
        html(div).css('display', 'none');
        
        var refresh = function () {
            isPrevMonth.refresh();
            isNextMonth.refresh();
            isPrevYear.refresh();
            isNextYear.refresh();
            isPrevDecade.refresh();
            isNextDecade.refresh();
        };
        
        var isInline = false, autoClose = false;
        
        var api = {
            destroy: function () {
                if (html.isInDOM(div)) {
                    html(div).unbindAll();
                    div.parentElement.removeChild(div);
                    div = null;
                }
                return api;
            },
            startDate: function (date) {
                start = date;
                refresh();
                return api;
            },
            endDate: function (date) {
                end = date;
                refresh();
                return api;
            },
            input: function (ele) {
                isInline = false;
                input = html(ele).input(observer).$$();
                html.isInDOM(div) && html(div).css('display', 'none');
                html(document).click(function (e) {
                    if (!div) return;
                    var src = e.target || e.srcElement;
                    if (src === input) return;
                    if (!div.contains(src) && !isSelectingDate) {
                        html(div).css('display', 'none');
                    }
                    if (autoClose && isSelectingDate && !isInline && !isHeader) {
                        html(div).css('display', 'none');
                    }
                    if (isSelectingDate) isSelectingDate = false;
                    if (isHeader) isHeader = false;
                });
                
                var showCalendar = function () {
                    if (!div) return;
                    html(div).css('display', 'block');
                    var offset = html(input).offset();
                    var height = parseInt(html(input).css('height'));
                    
                    html(div).css({
                        top: offset.top + height + 'px',
                        left: offset.left + 'px'
                    });
                };
                
                html(input).click(showCalendar).focus(showCalendar).change(function () {
                    observer(parseDate(this.value, format()));
                });
                observer.subscribe(function (val) {
                    if (input.nodeName.toLowerCase() === 'input') {
                        input.value = formatDate(observer(), format());
                    }
                    html.disposable(input, observer, this);
                    if (!html.isInDOM(input)) input = null;
                });
                return api;
            },
            icon: function (ele) {
                isInline = false;
                html(ele).click(function () {
                    isSelectingDate = true;
                    input && html(input).click();
                });
                return this;
            },
            inline: function (ele) {
                isInline = true;
                html(ele).append(div);
                html(div).css({ top: '', left: '' });
                return this;
            },
            format: function (f) {
                defaultFormat = f;
                observer.refresh();
                return api;
            },
            autoClose: function (isAuto) {
                autoClose = isAuto;
                return this;
            }
        };
        return api;
    };
})();