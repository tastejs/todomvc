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

// config
const config = require('config');
const zuixConfig = config.get('zuix');
// static-site module helper
module.exports = function (site, cb) {
    site = site.map(function(page) {
        // Add app config to page data
        page.app = zuixConfig.app;
        // Adjust {{root} to relative path
        page.root = page.root.substring(3);
        if (page.root.length > 0)
            page.root += '/';
        return page;
    });
    cb(null, site);
};
