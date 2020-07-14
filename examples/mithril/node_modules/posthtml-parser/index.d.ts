declare namespace parser {
    type DefaultOptions = {
        /**
         * @default false
         */
        lowerCaseTags: boolean;

        /**
         * @default false
         */
        lowerCaseAttributeNames: boolean;
    };

    type Directive = {
        name: string;
        start: string;
        end: string;
    };

    type Options = {
        /**
         * Adds processing of custom directives.
         * Note: The property `name` in custom directives can be `String` or `RegExp` type.
         *
         * @default
         * [{name: '!doctype', start: '<', end: '>'}]
         */
        directives?: Directive[];

        /**
         * Indicates whether special tags (`<script>` and `<style>`) should get special treatment and if "empty" tags (eg. `<br>`) can have children.
         * If `false`, the content of special tags will be text only.
         * For feeds and other XML content (documents that don't consist of HTML), set this to true.
         *
         * @default false
         */
        xmlMode?: boolean;

        /**
         * If set to `true`, entities within the document will be decoded.
         *
         * @default false
         */
        decodeEntities?: boolean;

        /**
         * If set to `true`, all tags will be lowercased. If `xmlMode` is disabled.
         *
         * @default false
         */
        lowerCaseTags?: boolean;

        /**
         * If set to `true`, all attribute names will be lowercased. This has noticeable impact on speed.
         *
         * @default false
         */
        lowerCaseAttributeNames?: boolean;

        /**
         * If set to true, CDATA sections will be recognized as text even if the `xmlMode` option is not enabled.
         * NOTE: If `xmlMode` is set to `true` then CDATA sections will always be recognized as text.
         *
         * @default false
         */
        recognizeCDATA?: boolean;

        /**
         * If set to `true`, self-closing tags will trigger the `onclosetag` event even if `xmlMode` is not set to `true`.
         * NOTE: If `xmlMode` is set to true then self-closing tags will always be recognized.
         *
         * @default false
         */
        recognizeSelfClosing?: boolean;
    };

    type Tree = Node[];
    type Node = NodeText | NodeTag;
    type NodeText = string;
    type NodeTag = {
        tag: string;
        attrs?: Attributes;
        content?: Node[];
    };

    type Attributes = Record<string, string>;
}

declare const parser: {
    defaultOptions: parser.DefaultOptions;
    defaultDirectives: parser.Directive[];

    (content: string, options?: parser.Options): parser.Tree;
};

export = parser;
