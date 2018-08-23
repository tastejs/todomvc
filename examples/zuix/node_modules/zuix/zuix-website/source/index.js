/**
 * @license
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * Find more details about ZUIX here:
 *   http://zuix.it
 *   https://github.com/genielabs/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */

'use strict';

// Main options and configuration
var main = {
    options: {
        content: {
            mdl: true,
            prism: true
        },
        content_no_css: {
            mdl: true,
            prism: true,
            css: false
        },
        component_no_css: {
            css: false
        }
    },
    // Component 'controllers/paged_view'
    contentPager: {
        css: false,
        html: false,
        lazyLoad: false,
        // actions map
        on: {
            'page:change': function(e, i) {
                // console.log('page:change@PagedView', i);
            }
        },
        // behaviors map
        behavior: {
            // animate entering/exiting pages on page:change event
            'page:change': changePage
        },
        ready: function() {
            // store a reference to this component once it's loaded
            pagedView = this;
            // console.log("zUIx", "INFO", "Paged view ready.", this);
        }
    }

};


// Animate CSS extension method for ZxQuery
zuix.$.ZxQuery.prototype.animateCss = function() { return this; };
zuix.using('component', '@lib/extensions/animate_css', function(res, ctx){
    console.log('AnimateCSS extension loaded.', res, ctx);
});


// Get reference to various elements of the main page

const loaderMessage = zuix.field('loaderMessage');
const mainPage = zuix.field('main').hide();
let splashScreen = zuix.field('splashScreen');
if (!isSplashEnabled()) {
    splashScreen.hide();
    splashScreen = false;
} else {
    splashScreen.show();
}
let revealTimeout = null;
// reference to homepage's cover and features block (used for change-page animation)
let coverBlock = null;
let featuresBlock = null;
zuix.field('content-home').on('component:ready', function (ctx) {
    // these element are available only after the 'content-home' is loaded
    coverBlock = zuix.field('mainCover', this);
    featuresBlock = zuix.field('mainFeatures', this);
});
// Reference to navigation components
let pagedView = null;

// Turn off debug output

window.zuixNoConsoleOutput = true;
// zuix.lazyLoad(false);
// zuix.httpCaching(false);

// Use "scroll_helper" to auto show/hide header and menu button on internal pages

zuix.load('@lib/controllers/scroll_helper', {
    view: zuix.field('page-start'),
    on: {
        'scroll:change': function(e, data) {
            if (pagedView != null && pagedView.getCurrent() === 1) {
                pageScrollChanged(e, data);
            }
        }
    }
});
zuix.load('@lib/controllers/scroll_helper', {
    view: zuix.field('page-docs'),
    on: {
        'scroll:change': function (e, data) {
            if (pagedView != null && pagedView.getCurrent() === 2) {
                pageScrollChanged(e, data);
            }
        }
    }
});
zuix.load('@lib/controllers/scroll_helper', {
    view: zuix.field('page-api'),
    on: {
        'scroll:change': function(e, data) {
            if (pagedView != null && pagedView.getCurrent() === 3) {
                pageScrollChanged(e, data);
            }
        }
    }
});

// Global zUIx event hooks

zuix.hook('load:begin', function(data) {
    if (splashScreen) {
        splashScreen.animateCss('fadeIn').show();
    }
    loaderMessage.html('Loading "<em>'+data.task+'</em>" ...').show();
    if (revealTimeout != null) {
        clearTimeout(revealTimeout);
    }
    loaderMessage.animateCss('bounceInUp', {duration: '1.0s'});
}).hook('load:next', function(data) {
    if (data.task.indexOf('zuix_hackbox') > 0) return;
    if (splashScreen) {
        zuix.field('loader-progress')
            .html(data.task).prev()
            .animateCss('bounce');
    }
    loaderMessage.html('Loading "<em>'+data.task+'</em>" complete.')
        .animateCss('bounceInUp', {duration: '1.0s'});
    if (revealTimeout != null) {
        clearTimeout(revealTimeout);
    }
}).hook('load:end', function(data) {
    revealMainPage();
}).hook('componentize:end', function(data) {
    // revealMainPage();
}).hook('html:parse', function(data) {
    let markdown = (this.options().markdown === true);
    //markdown = markdown || (this.container() != null && this.container().getAttribute('data-o-markdown') === 'true');
    //markdown = markdown || (this.view() != null && this.view().getAttribute('data-o-markdown') === 'true');
    // ShowDown - Markdown compiler
    if (typeof data.content == 'string' && markdown && typeof showdown !== 'undefined') {
        data.content = new showdown.Converter()
            .makeHtml(data.content);
    }
}).hook('css:parse', function(data) {
    // console.log(data);
    // TODO: should post-process with LESS
}).hook('view:process', function(view) {
    // Prism code syntax highlighter
    if (this.options().prism && typeof Prism !== 'undefined') {
        view.find('code').each(function(i, block) {
            Prism.highlightElement(block);
        });
    }
    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]')
        .attr('target', '_blank')
        .attr('rel', 'noreferrer');

    // Material Design Light integration - DOM upgrade
    if (this.options().mdl && typeof componentHandler !== 'undefined')
        componentHandler.upgradeElements(view.get());
});


// URL routing

window.onhashchange = function() {
    routeCurrentUrl(window.location.hash);
};
function routeCurrentUrl(path) {
    // check if pagedView is loaded
    if (pagedView == null) return;
    const anchorIndex = path.lastIndexOf('#');
    let pageAnchor = null;
    if (anchorIndex > 0) {
        pageAnchor = path.substring(anchorIndex + 1);
        path = path.substring(0, anchorIndex);
    }
    switch (path) {
        case '#/start':
            pagedView.setPage(1);
            break;
        case '#/docs':
            pagedView.setPage(2);
            break;
        case '#/api':
            pagedView.setPage(3);
            break;
        case '':
        case '#/':
            pagedView.setPage(0, 0);
            break;
    }
    const p = pagedView.getCurrentPage();
    if (pageAnchor !== null) {
        const a = p.find('a[id=' + pageAnchor+']');
        if (a.length() > 0) {
            setTimeout(function() {
                scrollTo(p.get(), p.get().scrollTop+a.position().y-64, 750);
            }, 500);
        }
    } // else p.get().scrollTop = 0;
}


// Other utility functions

let scrollEndTs;
function scrollTo(element, to, duration) {
    const currentTs = Date.now();
    if (duration != null) {
        scrollEndTs = currentTs + duration;
    }
    duration = scrollEndTs-currentTs;
    const difference = to - element.scrollTop;
    if (duration <= 0) {
        element.scrollTop = to;
        return;
    }
    requestAnimationFrame(function() {
        element.scrollTop = element.scrollTop + (difference / (duration/2));
        scrollTo(element, to);
    });
}

function revealMainPage() {
    loaderMessage.animateCss('bounceOutDown', { duration: '0.0s' }, function() {
        this.hide();
    });
    if (revealTimeout != null)
        clearTimeout(revealTimeout);
    revealTimeout = setTimeout(reveal, 350);
}

function reveal() {
    if ((splashScreen || !isSplashEnabled()) && mainPage.display() === 'none') {
        const s = splashScreen; splashScreen = false;
        // unregister 'componentize:end' hook
        zuix.hook('componentize:end', null);
        // this is only executed once, on app startup
        if (s !== false) {
            s.animateCss('fadeOutUp', function () {
                s.hide();
            });
        }
        // fade in main page
        if (mainPage.display() === 'none') {
            mainPage.animateCss('fadeIn', {duration: '1.2s'}, function () {
                if (s !== false) s.hide();
            }).show();
        }
        routeCurrentUrl(window.location.hash);
    }
}

const coverHeaderTriggerY = 100;
const zxHeader = zuix.$.find('.site-header').hide();
zxHeader.hidden = true;
// TODO: use "scroll_helper" to do this
zuix.$.find('section').eq(0).on('scroll', function(data) {
   checkMenuVisibility();
});

function checkMenuVisibility() {
    const checkPosition = featuresBlock.position();
    if (checkPosition.y < coverHeaderTriggerY) {
        showHeader();
    } else if (checkPosition.y >= coverHeaderTriggerY) {
        hideHeader();
    }
}

function showHeader() {
    if (zxHeader.hidden && !zxHeader.hasClass('animated')) {
        zxHeader.show().animateCss('fadeInDown', {duration: '.5s'}, function() {
            this.show();
            zxHeader.hidden = false;
        });
    }
}

function hideHeader() {
    if (!zxHeader.hidden && !zxHeader.hasClass('animated')) {
        zxHeader.show().animateCss('fadeOutUp', {duration: '.5s'}, function() {
            this.hide();
            zxHeader.hidden = true;
        });
    }
}

function isSplashEnabled() {
// eslint-disable-next-line max-len
    let enabled = true;
    // Check if client is a crawler/bot
    const botPattern = '(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)';
    const re = new RegExp(botPattern, 'i');
    const userAgent = navigator.userAgent;
    enabled = enabled && !re.test(userAgent);
    return enabled;
}

// PagedView `page:change` behavior handler
function changePage(e, i, effectIn, effectOut, dirIn, dirOut) {

    // cover+header animation reveal/hide
    if (i.page == 0) {
        hideHeader();
        coverBlock
            .animateCss('bounceInDown');
        featuresBlock
            .animateCss('bounceInUp', function() {
                checkMenuVisibility();
            });
    } else if (i.old == 0) {
        //showHeader();
        coverBlock
            .animateCss('slideOutUp');
        featuresBlock
            .animateCss('slideOutDown');
    } else if (i.old == 2) {
        zuix.context('menu-docs', function() {
            this.hideButton();
        });
    } else if (i.old == 3) {
        zuix.context('menu-api', function() {
            this.hideButton();
        });
    }

    if (i.page != 0) {
        showHeader();
    }
    if (i.page == 2) {
        zuix.context('menu-docs', function() {
            this.showButton();
        });
    } else if (i.page == 3) {
        zuix.context('menu-api', function() {
            this.showButton();
        });
    }

    // 'page change' animation
    if (effectIn == null) effectIn = 'fadeIn';
    if (effectOut == null) effectOut = 'fadeOut';
    // Animate page changing
    const options = { duration: '1.0s' };
    const pages = this.children();
    if (i.page > i.old) {
        if (dirIn == null) dirIn = ''; //'Right';
        if (dirOut == null) dirOut = ''; //'Left';
        pages.eq(i.page).animateCss(effectIn+dirIn, options)
            .show();
        pages.eq(i.old).animateCss(effectOut+dirOut, options, function () {
            pages.eq(i.old).hide();
        }).show();
    } else {
        if (dirIn == null) dirIn = ''; //'Left';
        if (dirOut == null) dirOut = ''; //'Right';
        pages.eq(i.page).animateCss(effectIn+dirIn, options)
            .show();
        pages.eq(i.old).animateCss(effectOut+dirOut, options, function () {
            pages.eq(i.old).hide();
        }).show();
    }

}

function pageScrollChanged(e, data) {
    switch (data.event) {
        case 'hit-top':
            showHeader();
            break;
        case 'scroll':
            if (data.info.shift.y > 0) {
                // scrolling up
                showHeader();
            } else if (data.info.shift.y < 0) {
                // scrolling down
                hideHeader();
            }
            break;
        case 'hit-bottom':
            showHeader();
            break;
    }
}
