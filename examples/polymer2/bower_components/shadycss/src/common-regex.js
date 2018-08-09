/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const VAR_ASSIGN = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi;
export const MIXIN_MATCH = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
export const VAR_CONSUMED = /(--[\w-]+)\s*([:,;)]|$)/gi;
export const ANIMATION_MATCH = /(animation\s*:)|(animation-name\s*:)/;
export const MEDIA_MATCH = /@media[^(]*(\([^)]*\))/;
export const IS_VAR = /^--/;
export const BRACKETED = /\{[^}]*\}/g;
export const HOST_PREFIX = '(?:^|[^.#[:])';
export const HOST_SUFFIX = '($|[.:[\\s>+~])';