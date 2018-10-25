/** The supported `pandoc-types` AST version as a type. */
export type Version = [1, 17, ...number[]]

/** The supported `pandoc-types` AST version. */
export const version: Version = [1, 17]

/** A wrapper for a `pandoc` node. */
type _ASTNode<T extends string, U> = {
  /** Name of the node type */
  t: T

  /** Content of the node */
  c: U
}

/** A redundant wrapper so interfaces can extends type intersections */
type _WrapType<T> = T

/**
 * A full document.
 *
 * This is the JSON that gets emitted from `pandoc -t json`.
 */
export interface Document {
  /**
   * Version of the pandoc AST.
   */
  "pandoc-api-version": Version

  /** Blocks that make up the document. */
  blocks: Block[]

  /**
   * Metadata of the document.
   *
   * Will only be present in case you called pandoc with the `pandoc -s` option.
   */
  meta: Meta
}

export default Document

/** Metadata for the document: title, authors, date */
export interface Meta {
  [key: string]: Meta.Value
}

export declare namespace Meta {
  type Value =
    | Meta.Map
    | Meta.List
    | Meta.Bool
    | Meta.String
    | Meta.Inlines
    | Meta.Blocks

  interface Map extends _ASTNode<"MetaMap", { [key: string]: Meta.Value }> {}
  interface List extends _ASTNode<"MetaList", Meta.Value[]> {}
  interface Bool extends _ASTNode<"MetaBool", boolean> {}
  interface String extends _ASTNode<"MetaString", string> {}
  interface Inlines extends _ASTNode<"MetaInlines", Inline[]> {}
  interface Blocks extends _ASTNode<"MetaBlocks", Block[]> {}
}

/** Block element */
export type Block = Block._All[keyof Block._All]

export declare namespace Block {
  interface _All {
    Plain: Block.Plain
    Para: Block.Para
    LineBlock: Block.LineBlock
    CodeBlock: Block.CodeBlock
    RawBlock: Block.RawBlock
    BlockQuote: Block.BlockQuote
    OrderedList: Block.OrderedList
    BulletList: Block.BulletList
    DefinitionList: Block.DefinitionList
    Header: Block.Header
    HorizontalRule: Block.HorizontalRule
    Table: Block.Table
    Div: Block.Div
    Null: Block.Null
  }

  /** Plain text, not a paragraph */
  interface Plain extends _ASTNode<"Plain", Inline[]> {}
  /** Paragraph */
  interface Para extends _ASTNode<"Para", Inline[]> {}
  /** Multiple non-breaking lines */
  interface LineBlock extends _ASTNode<"LineBlock", Inline[][]> {}
  /** Code block (literal) with attributes */
  interface CodeBlock extends _ASTNode<"CodeBlock", [Attr, string]> {}
  /** Raw block */
  interface RawBlock extends _ASTNode<"RawBlock", [Format, string]> {}
  /** Block quote (list of `Block`s) */
  interface BlockQuote extends _ASTNode<"BlockQuote", Block[]> {}
  /** Ordered list (attributes and a list of items, each a list of `Block`s) */
  interface OrderedList
    extends _ASTNode<"OrderedList", [List.Attributes, Block[][]]> {}
  /** Bullet list (list of items, each a list of `Block`s) */
  interface BulletList extends _ASTNode<"BulletList", Block[][]> {}
  /** Definition list. Each list item is a pair consisting of a term (a list of `Inline`s) and one or more definitions (each a list of `Block`s) */
  interface DefinitionList
    extends _ASTNode<"DefinitionList", [Inline[], Block[][]][]> {}
  /** Header - level (`number`) and text (`Inline`s) */
  interface Header extends _ASTNode<"Header", [number, Attr, Inline[]]> {}
  /** Horizontal rule */
  interface HorizontalRule extends _ASTNode<"HorizontalRule", undefined> {}
  /** Table, with caption, column alignments (required), relative column widths (0 = default), column headers (each a list of `Block`s), and rows (each a list of lists of `Block`s) */
  interface Table
    extends _ASTNode<
        "Table",
        [Inline[], Alignment[], number[], Table.Cell[], Table.Cell[][]]
      > {}
  /** Generic block container with attributes */
  interface Div extends _ASTNode<"Div", [Attr, Block[]]> {}
  /** Nothing */
  interface Null extends _ASTNode<"Null", undefined> {}
}

/** Inline elements */
export type Inline = Inline._All[keyof Inline._All]

export declare namespace Inline {
  interface _All {
    Str: Inline.Str
    Emph: Inline.Emph
    Strong: Inline.Strong
    Strikeout: Inline.Strikeout
    Superscript: Inline.Superscript
    Subscript: Inline.Subscript
    SmallCaps: Inline.SmallCaps
    Quoted: Inline.Quoted
    Cite: Inline.Cite
    Code: Inline.Code
    Space: Inline.Space
    SoftBreak: Inline.SoftBreak
    LineBreak: Inline.LineBreak
    Math: Inline.Math
    RawInline: Inline.RawInline
    Link: Inline.Link
    Image: Inline.Image
    Note: Inline.Note
    Span: Inline.Span
  }

  /** Text (`string`) */
  interface Str extends _ASTNode<"Str", string> {}
  /** Emphasized text (list of `Inline`s) */
  interface Emph extends _ASTNode<"Emph", Inline[]> {}
  /** Strongly emphasized text (list of `Inline`s) */
  interface Strong extends _ASTNode<"Strong", Inline[]> {}
  /** Strikeout text (list of `Inline`s) */
  interface Strikeout extends _ASTNode<"Strikeout", Inline[]> {}
  /** Superscripted text (list of `Inline`s) */
  interface Superscript extends _ASTNode<"Superscript", Inline[]> {}
  /** Subscripted text (list of `Inline`s) */
  interface Subscript extends _ASTNode<"Subscript", Inline[]> {}
  /** Small caps text (list of `Inline`s) */
  interface SmallCaps extends _ASTNode<"SmallCaps", Inline[]> {}
  /** Quoted text (list of `Inline`s) */
  interface Quoted extends _ASTNode<"Quoted", [Quote.Type, Inline[]]> {}
  /** Citation (list of `Inline`s) */
  interface Cite extends _ASTNode<"Cite", [Citation[], Inline[]]> {}
  /** Inline code (literal) */
  interface Code extends _ASTNode<"Code", [Attr, string]> {}
  /** Inter-word space */
  interface Space extends _ASTNode<"Space", undefined> {}
  /** Soft line break */
  interface SoftBreak extends _ASTNode<"SoftBreak", undefined> {}
  /** Hard line break */
  interface LineBreak extends _ASTNode<"LineBreak", undefined> {}
  /** TeX math (literal) */
  interface Math extends _ASTNode<"Math", [MathType, string]> {}
  /** Raw inline */
  interface RawInline extends _ASTNode<"RawInline", [Format.Output, string]> {}
  /** Hyperlink: alt text (list of `Inline`s), `Target` */
  interface Link extends _ASTNode<"Link", [Attr, Inline[], Target]> {}
  /** Image: alt text (list of `Inline`s), `Target` */
  interface Image extends _ASTNode<"Image", [Attr, Inline[], Target]> {}
  /** Footnote or endnote */
  interface Note extends _ASTNode<"Note", Block[]> {}
  /** Generic inline container with attributes */
  interface Span extends _ASTNode<"Span", [Attr, Inline[]]> {}
}

/** Alignment of a table column */
export type Alignment =
  | "AlignLeft"
  | "AlignRight"
  | "AlignCenter"
  | "AlignDefault"

export declare namespace List {
  /** List attributes. */
  interface Attributes
    extends _WrapType<[number, Number.Style, Number.Delim]> {}

  namespace Number {
    /** Style of list numbers. */
    type Style =
      | "DefaultStyle"
      | "Example"
      | "Decimal"
      | "LowerRoman"
      | "UpperRoman"
      | "LowerAlpha"
      | "UpperAlpha"

    /** Delimiter of list numbers. */
    type Delim = "DefaultDelim" | "Period" | "OneParen" | "TwoParens"
  }
}

export type Format = Format.Input | Format.Output

export namespace Format {
  export type Input =
    | "commonmark"
    | "creole"
    | "docbook"
    | "docx"
    | "epub"
    | "fb2"
    | "gfm"
    | "haddock"
    | "html"
    | "jats"
    | "json"
    | "latex"
    | "markdown_github"
    | "markdown_mmd"
    | "markdown_phpextra"
    | "markdown_strict"
    | "markdown"
    | "mediawiki"
    | "muse"
    | "native"
    | "odt"
    | "opml"
    | "org"
    | "rst"
    | "t2t"
    | "textile"
    | "tikiwiki"
    | "twiki"
    | "vimwiki"

  export type Output =
    | "asciidoc"
    | "beamer"
    | "commonmark"
    | "context"
    | "docbook"
    | "docbook5"
    | "docx"
    | "dokuwiki"
    | "dzslides"
    | "epub"
    | "epub2"
    | "fb2"
    | "gfm"
    | "haddock"
    | "html"
    | "html4"
    | "icml"
    | "jats"
    | "json"
    | "latex"
    | "man"
    | "markdown_github"
    | "markdown_mmd"
    | "markdown_phpextra"
    | "markdown_strict"
    | "markdown"
    | "mediawiki"
    | "ms"
    | "muse"
    | "native"
    | "odt"
    | "opendocument"
    | "opml"
    | "org"
    | "plain"
    | "pptx"
    | "revealjs"
    | "rst"
    | "rtf"
    | "s5"
    | "slideous"
    | "slidy"
    | "tei"
    | "texinfo"
    | "textile"
    | "zimwiki"
}

/** Attributes: [identifier, classes, key-value pairs] */
export interface Attr
  extends _WrapType<[string, string[], [string, string][]]> {}

export declare namespace Table {
  /** Table cells are list of `Block`s */
  interface Cell extends _WrapType<Block[]> {}
}

export declare namespace Quote {
  /** Type of quotation marks to use in `Quoted` inline. */
  export type Type = "SingleQuote" | "DoubleQuote"
}

/** [url, title] */
export interface Target extends _WrapType<[string, string]> {}

/** Type of math element (display or inline). */
export type MathType = "DisplayMath" | "InlineMath"

export interface Citation {
  citationId: string
  citationPrefix: Inline[]
  citationSuffix: Inline[]
  citationMode: Citation.Mode
  citationNoteNum: number
  citationHash: number
}

export declare namespace Citation {
  type Mode = "AuthorInText" | "SuppressAuthor" | "NormalCitation"
}

export type Node = Node._All[keyof Node._All]

export declare namespace Node {
  interface _All extends _WrapType<Block._All & Inline._All> {}
}
