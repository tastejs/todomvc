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
const path = require('path');
// Markdown
const showdown = require('showdown');
const markdown = new showdown.Converter();
// Swig
const Promise = require('es6-promise').Promise;
const swig = require('swig-templates');
const isMarkdown = require(process.cwd()+'/node_modules/static-site/lib/utils/is-markdown');
const markdownTag = require(process.cwd()+'/node_modules/static-site/lib/utils/markdown-tag');
const extras = require('swig-extras');

module.exports = {
    swig: function(page, locals) {
        return swigTemplate(page, locals);
    },
    markdown: function(content) {
        return render(content);
    }
};


/* BEGIN 'static-site' default engine code */

/*
const markdown = MarkdownIt({
    html: true,
    langPrefix: '',
    highlight: function(code, lang) {
        const highlighted = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code);
        return highlighted.value;
    }
});
*/

const filters = ['batch', 'groupby', 'nl2br', 'pluck', 'split', 'trim', 'truncate'];
filters.forEach(function(filter) {
    extras.useFilter(swig, filter);
});

function render(content) {
    return markdown.makeHtml(content);
}

swig.setTag('markdown', markdownTag.parse, markdownTag.compile, true, false);
swig.setExtension('markdown', render);
swig.setDefaults({cache: false});

extras.useTag(swig, 'switch');
extras.useTag(swig, 'case');

// other custom tags
const glitchTag = require('./tags/glitch-tag');
const linkTag = require('./tags/link-tag');
swig.setTag('glitch', glitchTag.parse, glitchTag.compile, false, false);
swig.setTag('link', linkTag.parse, linkTag.compile, false, false);

function swigTemplate(page, locals) {
    let template = isMarkdown(page.file) ? render(page.content) : page.content;

    if (page.template) {
        const templatePath = path.join(this.sourcePath, page.template);
        const block = page.block || 'content';
        const wrapped = '{% block ' + block + '%}' + template + '{% endblock %}';
        template = '{% extends "' + templatePath + '" %}' + wrapped;
    }

    const html = swig.render(template, {
        filename: page.file,
        locals: locals
    });

    return Promise.resolve({
        dest: page.dest,
        contents: html
    });
}

/* END 'static-site' default engine code */
