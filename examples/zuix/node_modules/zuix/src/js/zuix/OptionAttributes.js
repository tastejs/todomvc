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
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

const OptionAttributes = Object.freeze({
    dataBindModel:
        'data-bind-model',
    dataBindTo:
        'data-bind-to',
    dataUiComponent:
        'data-ui-component',
    dataUiContext:
        'data-ui-context',
    dataUiField:
        'data-ui-field',
    dataUiInclude:
        'data-ui-include',
    dataUiLazyload:
        'data-ui-lazyload',
    dataUiLoad:
        'data-ui-load',
    dataUiLoaded:
        'data-ui-loaded',
    dataUiOptions:
        'data-ui-options',
    dataUiPriority:
        'data-ui-priority',
    dataUiView:
        'data-ui-view',
    zuixLoaded:
        'zuix-loaded'
});

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function(root) {
    return OptionAttributes;
};
