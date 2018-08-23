/*
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
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
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

/**
 * Component cache object interface.
 *
 * @typedef {object} ComponentCache
 * @property {string} componentId The id of the cached component.
 * @property {Element} view The view element.
 * @property {string} css The CSS style text.
 * @property {boolean} css_applied Whether the CSS style has been applied to the view or not.
 * @property {ContextControllerHandler} controller The controller handler function.
 * @property {string} using The url/path if this is a resource loaded with `zuix.using(..)` method.
 */

/**
 * Bundle item object.
 *
 * @typedef {object} BundleItem
 * @property {Element} view
 * @property {string} css
 * @property {ContextControllerHandler} controller
 */

/** */
module.exports = function(root) {
    // dummy module for JsDocs/Closure Compiler
    return null;
};
