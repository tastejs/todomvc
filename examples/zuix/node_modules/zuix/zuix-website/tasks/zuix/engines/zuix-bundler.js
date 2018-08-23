/*
 * Copyright 2017-2018 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
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

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

// common
const fs = require('fs');
const path = require('path');
const url = require('url');
const util = require('util');
const request = require('sync-request');
const stringify = require('json-stringify');
// swig-markdown (static-site)
const staticSite = require('./swig-md');
// logging
const tlog = require('../lib/logger');
// ESLint
const linter = require('eslint').linter;
const lintConfig = require(process.cwd()+'/.eslintrc');
// LESS
const less = require('less');
const lessConfig = require(process.cwd()+'/.lessrc');
// config
const config = require('config');
const zuixConfig = config.get('zuix');
// zuix-bundler cli
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
// minifier
const minify = require('html-minifier').minify;

const LIBRARY_PATH_DEFAULT = 'https://genielabs.github.io/zkit/lib';

const zuixBundle = {
    viewList: [],
    styleList: [],
    controllerList: [],
    assetList: []
};
let stats;
let hasErrors;
let localVars;

function createBundle(sourceFolder, page) {
    const virtualConsole = new jsdom.VirtualConsole();
    const dom = new JSDOM(page.content, {virtualConsole});

    // JavaScript resources
    if (zuixConfig.build.bundle && zuixConfig.build.bundle.js) {
        // TODO: check/parse scripts
        const scriptList = dom.window.document.querySelectorAll('script[src]');
        if (scriptList != null) {
            scriptList.forEach(function(el) {
                if (el.getAttribute('defer') != null) {
                    return;
                }
                const resourcePath = el.getAttribute('src');
                let scriptText = fetchResource(resolveResourcePath(page.file, resourcePath), null, false);
                if (scriptText != null) {
                    scriptText = '//{% raw %}\n' + scriptText + '\n//{% endraw %}';
                    el.innerHTML = scriptText;
                    el.removeAttribute('src');
                    zuixBundle.assetList.push({path: resourcePath, content: scriptText, type: 'script'});
                }
            });
        }
    }

    // CSS resources
    if (zuixConfig.build.bundle && zuixConfig.build.bundle.css) {
        // TODO: check/parse css
        const styleList = dom.window.document.querySelectorAll('link[rel="stylesheet"][href]');
        if (styleList != null) {
            styleList.forEach(function(el) {
                const resourcePath = el.getAttribute('href');
                let cssText = fetchResource(resolveResourcePath(page.file, resourcePath), null, false);
                if (cssText != null) {
                    el.outerHTML = '<style>\n/*{% raw %}*/\n'+cssText+'\n/*{% endraw %}*/\n</style>';
                    zuixBundle.assetList.push({path: resourcePath, content: cssText, type: 'style'});
                }
            });
        }
    }

    // zUIx resources
    if (zuixConfig.build.bundle.zuix !== false) {
        const nodeList = dom.window.document.querySelectorAll('[data-ui-include],[data-ui-load]');
        if (nodeList != null) {
            nodeList.forEach(function(el) {
                let skipElement = false;
                let parent = el.parentNode;
                while (parent != null) {
                    if (parent.tagName === 'PRE') {
                        skipElement = true;
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (skipElement) {
                    return;
                }

                let hasJsFile = false;
                let resourcePath = el.getAttribute('data-ui-include');
                if (resourcePath == null || resourcePath === '') {
                    hasJsFile = true;
                    resourcePath = el.getAttribute('data-ui-load');
                }
                // do not process inline views
                if (dom.window.document.querySelectorAll('[data-ui-view="' + resourcePath + '"]').length > 0) {
                    return;
                }

                let content;
                if (hasJsFile) {
                    if (isBundled(zuixBundle.controllerList, resourcePath)) {
                        return;
                    }
                    content = fetchResource(resourcePath + '.js', sourceFolder, true);
                    if (content != null) {
                        zuixBundle.controllerList.push({path: resourcePath, content: content});
                    }
                }
                // HTML
                const item = isBundled(zuixBundle.viewList, resourcePath);
                if (item !== false) {
                    item.count++;
                    return;
                }
                content = fetchResource(resourcePath + '.html', sourceFolder, !hasJsFile);
                if (content != null) {
                    // Run static-site processing
                    content = staticSite.swig({file: resourcePath + '.html', content: content}, localVars)._result.contents;
                    // check markdown option
                    const md = el.getAttribute('data-o-markdown');
                    if (md != null && md.trim() === 'true') {
                        content = staticSite.markdown(content);
                        el.removeAttribute('data-o-markdown');
                    }
                    const d = {
                        file: sourceFolder + '/' + zuixConfig.app.resourcePath + '/' + resourcePath + '.html',
                        content: content
                    };
                    const dm = createBundle(sourceFolder, d);
                    content = dm.window.document.body.innerHTML;
                    if (el.getAttribute('data-ui-mode') === 'unwrap') {
                        // TODO: add HTML comment with file info
                        el.outerHTML = content;
                    } else {
                        zuixBundle.viewList.push({path: resourcePath, content: content, element: el});
                    }
                }
                // CSS
                content = fetchResource(resourcePath + '.css', sourceFolder);
                if (content != null) {
                    if (el.getAttribute('data-ui-mode') === 'unwrap') {
                        // TODO: add // comment with file info
                        content = util.format('\n<style id="%s">\n%s\n</style>\n', resourcePath, content);
                        dom.window.document.querySelector('head').innerHTML += util.format('\n<!--{[%s]}-->\n%s', resourcePath, content);
                    } else {
                        zuixBundle.styleList.push({path: resourcePath, content: content});
                    }
                }
            });
        }
    }
    return dom;
}

function resolveAppPath(sourceFolder, filePath) {
    let isLibraryPath = false;
    if (!isUrl(filePath)) {
        if (filePath.startsWith('@lib/')) {
            const relPath = filePath.substring(5);
            // resolve components library path
            if (zuixConfig.app.libraryPath != null) {
                if (isUrl(zuixConfig.app.libraryPath)) {
                    filePath = url.resolve(zuixConfig.app.libraryPath, relPath);
                } else {
                    filePath = path.join(sourceFolder, zuixConfig.app.libraryPath, relPath);
                }
            } else {
                filePath = url.resolve(LIBRARY_PATH_DEFAULT, relPath);
            }
            isLibraryPath = true;
        }
        filePath = isLibraryPath ? filePath : path.join(sourceFolder, zuixConfig.app.resourcePath, filePath);
    }
    return {
        lib: isLibraryPath,
        path: filePath
    };
}

function resolveResourcePath(file, resourcePath) {
    if (!isUrl(resourcePath)) {
        if (resourcePath.startsWith('.')) {
            resourcePath = path.resolve(path.dirname(file), resourcePath);
        } else {
            resourcePath = path.join(zuixConfig.build.input, resourcePath);
        }
        if (!fs.existsSync(resourcePath)) {
            resourcePath = path.join(zuixConfig.build.output, resourcePath);
        }
    }
    return resourcePath;
}

function isUrl(path) {
    return path.indexOf('://') > 0 || path.startsWith('//');
}

function fetchResource(path, sourceFolder, reportError) {
    let content = null;
    if (sourceFolder != null) {
        path = resolveAppPath(sourceFolder, path).path;
    }
    const error = '   ^#^R^W[%s]^:';
    if (isUrl(path)) {
        if (path.startsWith('//')) {
            path = 'https:'+path;
        }
        tlog.overwrite('   ^C%s^: downloading "%s"', tlog.busyCursor(), path);
        const res = request('GET', path);
        if (res.statusCode === 200) {
            content = res.getBody('utf8');
            tlog.overwrite('');
        } else if (reportError) {
            hasErrors = true;
            tlog.term.previousLine();
            tlog.error(error+' %s', res.statusCode, path)
                .br();
        }
    } else {
        tlog.overwrite('   ^C%s^: reading "%s"', tlog.busyCursor(), path);
        try {
            content = fs.readFileSync(path).toString();
            tlog.overwrite('');
        } catch (e) {
            if (reportError) {
                hasErrors = true;
                tlog.term.previousLine();
                tlog.error(error+' %s', e.code, path)
                    .br();
            }
        }
    }
    return content;
}

function isBundled(list, path) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].path === path) {
            return list[i];
        }
    }
    return false;
}

function getBundleItem(bundle, path) {
    let item = null;
    const AlreadyExistsException = {};
    try {
        bundle.forEach(function(b) {
            if (b.componentId === path) {
                item = b;
                throw AlreadyExistsException;
            }
        });
    } catch (e) {
        if (e === AlreadyExistsException) {
            return item;
        }
    }
    item = {
        componentId: path
    };
    bundle.push(item);
    return item;
}

function generateApp(sourceFolder, page) {
    // reset bundle
    zuixBundle.viewList.length = 0;
    zuixBundle.styleList.length = 0;
    zuixBundle.controllerList.length = 0;
    zuixBundle.assetList.length = 0;
    const dom = createBundle(sourceFolder, page);
    if (dom != null) {
        if (zuixConfig.build.bundle.zuix !== false) {
            let bundleViews = '<!-- zUIx inline resource resourceBundle -->';
            zuixBundle.viewList.forEach(function(v) {
                let resourcePath = resolveAppPath('/', v.path);
                resourcePath = resourcePath.lib ? resourcePath.path : v.path;
                const content = util.format('<div data-ui-view="%s">\n%s\n</div>', resourcePath, v.content);
                bundleViews += util.format('\n<!--{[%s]}-->\n%s', v.path, content);
                stats[v.path] = stats[v.path] || {};
                stats[v.path].view = true;
            });
            let resourceBundle = [];
            zuixBundle.controllerList.forEach(function(s) {
                // TODO: ensure it ends with ';'
                let resourcePath = resolveAppPath('/', s.path);
                resourcePath = resourcePath.lib ? resourcePath.path : s.path;
                getBundleItem(resourceBundle, resourcePath).controller = s.content;
                stats[s.path] = stats[s.path] || {};
                stats[s.path].controller = true;
            });
            zuixBundle.styleList.forEach(function(s) {
                let resourcePath = resolveAppPath('/', s.path);
                resourcePath = resourcePath.lib ? resourcePath.path : s.path;
                getBundleItem(resourceBundle, resourcePath).css = s.content;
                stats[s.path] = stats[s.path] || {};
                stats[s.path].css = true;
            });

            // add style to hide inline views
            const head = dom.window.document.querySelector('head');
            head.innerHTML += '    <style>[data-ui-view]:not([data-ui-include]):not([data-ui-load]) { display: none; }</style>\n';

            // add inline views
            dom.window.document.body.innerHTML += bundleViews;
            // add zuix resource bundle (css,js)
            const json = stringify(resourceBundle, null, 2);
            if (resourceBundle.length > 0) {
                let jsonBundle = '\n<script>zuix.bundle(' + json + ')</script>\n';
                dom.window.document.body.innerHTML += jsonBundle;
            }
        }

        if (zuixConfig.build.bundle.js !== false) {
            // TODO: report in final summary
            zuixBundle.assetList.forEach(function(a) {
                stats[a.path] = stats[a.path] || {};
                stats[a.path].script = true;
            });
        }
        if (zuixConfig.build.bundle.css !== false) {
            // TODO: report in final summary
            zuixBundle.assetList.forEach(function(a) {
                stats[a.path] = stats[a.path] || {};
                stats[a.path].style = true;
            });
        }

        page.content = dom.serialize();
    }
}

module.exports = function(options, template, page, cb) {
    localVars = page;
    // reset globals for every page
    stats = {};
    hasErrors = false;
    // zUIx bundle
    tlog.br().info('^w%s^:', page.file).br();
    let postProcessed = false;
    // Default static-site processing
    tlog.info(' ^r*^: static-site content');
    let html = staticSite.swig(page, localVars)._result.contents;
    let isStaticSite = (html != page.content);
    if (isStaticSite) {
        page.content = html;
    }

    if (page.file.endsWith('.html')) {
        // Generate resources bundle
        tlog.overwrite(' ^r*^: resource bundle');
        generateApp(options.source, page);
        if (Object.keys(stats).length > 0) {
            if (!hasErrors) {
                tlog.overwrite(' ^G\u2713^: resource bundle');
            }
            // output stats
            for (const key in stats) {
                const s = stats[key];
                const ok = '^+^g';
                const ko = '^w';
                tlog.info('   ^w[^:%s^:%s^:%s^:^w]^: %s',
                    s.view ? ok + 'v' : ko + '-',
                    s.css ? ok + 's' : ko + '-',
                    s.controller ? ok + 'c' : ko + '-',
                    '^:' + key
                );
            }
            tlog.info();
            postProcessed = true;
        } else {
            tlog.overwrite();
        }
        if (zuixConfig.build.minify != null && zuixConfig.build.minify !== false && zuixConfig.build.minify.disable !== true) {
            tlog.overwrite(' ^r*^: minify');
            page.content = minify(page.content, zuixConfig.build.minify);
            tlog.overwrite(' ^G\u2713^: minify');
        }
    } else {
        tlog.overwrite();
    }

    if (isStaticSite) {
        tlog.info(' ^G\u2713^: static-site content').br();
        postProcessed = true;
    }

    if (zuixConfig.build.esLint) {
        // run ESlint
        if (page.file.endsWith('.js')) {
            tlog.info(' ^r*^: lint');
            const issues = linter.verify(page.content, lintConfig, page.file);
            issues.forEach(function(m) {
                if (m.fatal || m.severity > 1) {
                    tlog.error('   ^RError^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
                } else {
                    tlog.warn('   ^YWarning^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
                }
            });
            if (issues.length === 0) {
                tlog.overwrite(' ^G\u2713^: lint');
            }
            tlog.info();
            postProcessed = true;
        }
    }

    if (zuixConfig.build.less) {
        // run LESS
        if (page.file.endsWith('.less')) {
            tlog.info(' ^r*^: less');
            less.render(page.content, lessConfig, function(error, output) {
                const baseName = page.dest.substring(0, page.dest.length - 5);
                fs.writeFileSync(baseName + '.css', output.css);
                // TODO: source map generation disabled
                //fs.writeFileSync(baseName+'.css.map', output.map);
                tlog.overwrite(' ^G\u2713^: less');
            });
            tlog.info();
            postProcessed = true;
        }
    }

    cb(null, page.content);
    if (!postProcessed) {
        tlog.info();
    }
    tlog.overwrite(' ^G\u2713^: done');
};
