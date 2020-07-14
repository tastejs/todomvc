// @flow

type RawContent = {
  raw: string,
  extension: string
}

declare type Options = {
  content: Array<string | RawContent>,
  css: Array<string | RawContent>,
  defaultExtractor?: Object,
  extractors?: Array<ExtractorsObj>,
  whitelist?: Array<string>,
  whitelistPatterns?: Array<RegExp>,
  whitelistPatternsChildren?: Array<RegExp>,
  output?: string,
  stdout?: boolean,
  stdin?: boolean,
  keyframes?: boolean,
  fontFace?: boolean,
  rejected?: boolean
}

declare type ExtractorsObj = {
  extractor: Object,
  extensions: Array<string>
}

declare type ResultPurge = {
  file: ?string,
  css: string,
  rejected: ?Array<string>
}

declare type AtRules = {
  keyframes: Array<Object>,
  fontFace: Array<Object>
}

declare type IgnoreType = "next" | "start" | "end"
