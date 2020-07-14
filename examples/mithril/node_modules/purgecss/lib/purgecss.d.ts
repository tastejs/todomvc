// Type definitions for Purgecss 1.0
// Project: Purgecss
// Definitions by: Ffloriel https://github.com/Ffloriel
//                 JounQin https://github.com/JounQin

export = Purgecss

declare class Purgecss {
  options: Purgecss.Options

  constructor(options: Purgecss.Options | string)

  loadConfigFile(configFile: string): Purgecss.Options

  checkOptions(options: Purgecss.Options): void

  purge(): Array<Purgecss.FileResult>

  extractFileSelector(
    files: Array<string>,
    extractors?: Array<Purgecss.ExtractorsObj>
  ): Set<string>

  extractRawSelector(
    content: Array<Purgecss.RawContent>,
    extractors?: Array<Purgecss.ExtractorsObj>
  ): Set<string>

  getFileExtractor(
    filename: string,
    extractors: Array<Purgecss.ExtractorsObj>
  ): Object

  extractorSelectors(content: string, extractor: Object): Set<string>

  getSelectorsCss(css: string, selectors: Set<string>): string

  isIgnoreAnnotation(node: Object, type: Purgecss.IgnoreType): boolean

  isRuleEmpty(node: Object): boolean

  shouldKeepSelector(
    selectorsInContent: Set<string>,
    selectorsInRule: Array<string>
  ) :boolean
}

declare namespace Purgecss {
  export interface Options {
    content: Array<string | RawContent>
    css: Array<string | RawContent>
    extractors?: Array<ExtractorsObj>
    whitelist?: Array<string>
    whitelistPatterns?: Array<RegExp>
    whitelistPatternsChildren?: Array<RegExp>
    output?: string
    stdout?: boolean
    stdin?: boolean
    keyframes?: boolean
    fontFace?: boolean
    rejected?: boolean
  }

  export interface ExtractorsObj {
    extractor: Object
    extensions: Array<string>
  }

  export interface FileResult {
    file: string | null
    css: string
    rejected: Array<string> | null
  }

  export interface RawContent {
    raw: string
    extension: string
  }

  export type IgnoreType = "next" | "start" | "end"
}
