// Compatible with pandoc-types as of 1.17.0.5

/** The supported `pandoc-types` AST version as a type. */
export type Version = [1, 17, ...number[]]

/** The supported `pandoc-types` AST version. */
export const version: Readonly<Version> = [1, 17]

/** Type helpers */
declare namespace _ {
  /** A helper to make typed tuples with documentation for specific keys */
  type Tuple<
    T extends Partial<Record<Tuple.MaxLength, never>> & Record<number, unknown>
  > = T &
    (T extends { 4: unknown }
      ? [T[0], T[1], T[2], T[3], T[4]]
      : T extends { 3: unknown }
      ? [T[0], T[1], T[2], T[3]]
      : T extends { 2: unknown }
      ? [T[0], T[1], T[2]]
      : T extends { 1: unknown }
      ? [T[0], T[1]]
      : [T[0]])

  namespace Tuple {
    type MaxLength = 5
  }

  /** A wrapper for a `pandoc` node. */
  type Node<T extends string, U = undefined> = U extends undefined
    ? {
        /** Name of the node type */ t: T
        /** Content of the node */ c?: U
      }
    : U extends boolean // Apparently a wontfix https://github.com/Microsoft/TypeScript/issues/22596
    ? {
        /** Name of the node type */ t: T
        /** Content of the node */ c: boolean
      }
    : {
        /** Name of the node type */ t: T
        /** Content of the node */ c: U
      }
}

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
  type Value = _All[keyof _All]

  interface _All {
    MetaMap: Map
    MetaList: List
    MetaBool: Bool
    MetaString: String
    MetaInlines: Inlines
    MetaBlocks: Blocks
  }

  interface Map extends _.Node<"MetaMap", { [key: string]: Meta.Value }> {}
  interface List extends _.Node<"MetaList", Meta.Value[]> {}
  interface Bool extends _.Node<"MetaBool", boolean> {}
  interface String extends _.Node<"MetaString", string> {}
  interface Inlines extends _.Node<"MetaInlines", Inline[]> {}
  interface Blocks extends _.Node<"MetaBlocks", Block[]> {}
}

/** Block element */
export type Block = Block._All[keyof Block._All]

export declare namespace Block {
  interface _All {
    Plain: Plain
    Para: Para
    LineBlock: LineBlock
    CodeBlock: CodeBlock
    RawBlock: RawBlock
    BlockQuote: BlockQuote
    OrderedList: OrderedList
    BulletList: BulletList
    DefinitionList: DefinitionList
    Header: Header
    HorizontalRule: HorizontalRule
    Table: Table
    Div: Div
    Null: Null
  }

  /** Plain text, not a paragraph */
  interface Plain extends _.Node<"Plain", Inline[]> {}

  /** Paragraph */
  interface Para extends _.Node<"Para", Inline[]> {}

  /** Multiple non-breaking lines */
  interface LineBlock extends _.Node<"LineBlock", Inline[][]> {}

  /** Code block (literal) with attributes */
  interface CodeBlock
    extends _.Node<
      "CodeBlock",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Content */ 1: string
      }>
    > {}

  /** Raw block */
  interface RawBlock
    extends _.Node<
      "RawBlock",
      _.Tuple<{
        /** Format */ 0: Format
        /** Content */ 1: string
      }>
    > {}

  /** Block quote (list of `Block`s) */
  interface BlockQuote extends _.Node<"BlockQuote", Block[]> {}

  /** Ordered list (attributes and a list of items, each a list of `Block`s) */
  interface OrderedList
    extends _.Node<
      "OrderedList",
      _.Tuple<{
        /** List Attributes */ 0: List.Attributes
        /** Content */ 1: Block[][]
      }>
    > {}

  /** Bullet list (list of items, each a list of `Block`s) */
  interface BulletList extends _.Node<"BulletList", Block[][]> {}

  /** Definition list. Each list item is a pair consisting of a term (a list of `Inline`s) and one or more definitions (each a list of `Block`s) */
  interface DefinitionList
    extends _.Node<
      "DefinitionList",
      _.Tuple<{
        /** Term */ 0: Inline[]
        /** Definition */ 1: Block[][]
      }>[]
    > {}

  /** Header - level (`number`) and text (`Inline`s) */
  interface Header
    extends _.Node<
      "Header",
      _.Tuple<{
        /** Level */ 0: number
        /** Attributes */ 1: Attr
        /** Text */ 2: Inline[]
      }>
    > {}

  /** Horizontal rule */
  interface HorizontalRule extends _.Node<"HorizontalRule"> {}

  /** Table, with caption, column alignments (required), relative column widths (0 = default), column headers (each a list of `Block`s), and rows (each a list of lists of `Block`s) */
  interface Table
    extends _.Node<
      "Table",
      _.Tuple<{
        /** Caption */ 0: Inline[]
        /** Column alignments */ 1: Alignment[]
        /** Relative column width */ 2: number[]
        /** Column headers */ 3: Table.Cell[]
        /** Rows */ 4: Table.Cell[][]
      }>
    > {}

  /** Generic block container with attributes */
  interface Div
    extends _.Node<
      "Div",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Content */ 1: Block[]
      }>
    > {}

  /** Nothing */
  interface Null extends _.Node<"Null"> {}
}

/** Inline elements */
export type Inline = Inline._All[keyof Inline._All]

export declare namespace Inline {
  interface _All {
    Str: Str
    Emph: Emph
    Strong: Strong
    Strikeout: Strikeout
    Superscript: Superscript
    Subscript: Subscript
    SmallCaps: SmallCaps
    Quoted: Quoted
    Cite: Cite
    Code: Code
    Space: Space
    SoftBreak: SoftBreak
    LineBreak: LineBreak
    Math: Math
    RawInline: RawInline
    Link: Link
    Image: Image
    Note: Note
    Span: Span
  }

  /** Text (`string`) */
  interface Str extends _.Node<"Str", string> {}

  /** Emphasized text (list of `Inline`s) */
  interface Emph extends _.Node<"Emph", Inline[]> {}

  /** Strongly emphasized text (list of `Inline`s) */
  interface Strong extends _.Node<"Strong", Inline[]> {}

  /** Strikeout text (list of `Inline`s) */
  interface Strikeout extends _.Node<"Strikeout", Inline[]> {}

  /** Superscripted text (list of `Inline`s) */
  interface Superscript extends _.Node<"Superscript", Inline[]> {}

  /** Subscripted text (list of `Inline`s) */
  interface Subscript extends _.Node<"Subscript", Inline[]> {}

  /** Small caps text (list of `Inline`s) */
  interface SmallCaps extends _.Node<"SmallCaps", Inline[]> {}

  /** Quoted text (list of `Inline`s) */
  interface Quoted
    extends _.Node<
      "Quoted",
      _.Tuple<{
        /**Quote type */ 0: Quote.Type
        /** Text */ 1: Inline[]
      }>
    > {}

  /** Citation (list of `Inline`s) */
  interface Cite
    extends _.Node<
      "Cite",
      _.Tuple<{
        /** Reference */ 0: Citation[]
        /** Text */ 1: Inline[]
      }>
    > {}

  /** Inline code (literal) */
  interface Code
    extends _.Node<
      "Code",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Code */ 1: string
      }>
    > {}

  /** Inter-word space */
  interface Space extends _.Node<"Space"> {}

  /** Soft line break */
  interface SoftBreak extends _.Node<"SoftBreak"> {}

  /** Hard line break */
  interface LineBreak extends _.Node<"LineBreak"> {}

  /** TeX math (literal) */
  interface Math
    extends _.Node<
      "Math",
      _.Tuple<{
        /** Math type */ 0: MathType
        /** Content */ 1: string
      }>
    > {}

  /** Raw inline */
  interface RawInline
    extends _.Node<
      "RawInline",
      _.Tuple<{
        /** Format */ 0: Format.Output
        /** Content */ 1: string
      }>
    > {}

  /** Hyperlink: alt text (list of `Inline`s), `Target` */
  interface Link
    extends _.Node<
      "Link",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Text */ 1: Inline[]
        /** Target */ 2: Target
      }>
    > {}

  /** Image: alt text (list of `Inline`s), `Target` */
  interface Image
    extends _.Node<
      "Image",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Caption */ 1: Inline[]
        /** Target */ 2: Target
      }>
    > {}

  /** Footnote or endnote */
  interface Note extends _.Node<"Note", Block[]> {}

  /** Generic inline container with attributes */
  interface Span
    extends _.Node<
      "Span",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Text */ 1: Inline[]
      }>
    > {}
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
    extends _.Tuple<{
      /** Starting number */ 0: number
      /** Number style */ 1: Number.Style
      /** Number delimiter */ 2: Number.Delim
    }> {}

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

/** Pandoc formats */
export type Format = Format.Input | Format.Output

export namespace Format {
  /** Pandoc input formats */
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

  /** Pandoc output formats */
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
  extends _.Tuple<{
    /** Identifier */ 0: string
    /** Classes */ 1: string[]
    /** Key-value pairs */ 2: _.Tuple<{
      /** Key */ 0: string
      /** Value */ 1: string
    }>[]
  }> {}

export declare namespace Table {
  /** Table cells are list of `Block`s */
  interface Cell extends Array<Block> {}
}

export declare namespace Quote {
  /** Type of quotation marks to use in `Quoted` inline. */
  export type Type = "SingleQuote" | "DoubleQuote"
}

/** [url, title] */
export interface Target
  extends _.Tuple<{
    /** Url */ 0: string
    /** Title */ 1: string
  }> {}

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

export type _Node = _Node._All[keyof _Node._All]

export declare namespace _Node {
  type _All = Block._All & Inline._All
}
