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

  type Values<T extends {}> = T[keyof T]

  /** A wrapper for a `pandoc` node. */
  type DataType<T extends string, U = undefined> = U extends undefined
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
  [key: string]: MetaValue
}

export type MetaValue = _.Values<MetaValue._All>

export namespace MetaValue {
  export interface _All {
    MetaMap: MetaMap
    MetaList: MetaList
    MetaBool: MetaBool
    MetaString: MetaString
    MetaInlines: MetaInlines
    MetaBlocks: MetaBlocks
  }

  export interface MetaMap
    extends _.DataType<"MetaMap", { [key: string]: MetaValue }> {}
  export interface MetaList extends _.DataType<"MetaList", MetaValue[]> {}
  export interface MetaBool extends _.DataType<"MetaBool", boolean> {}
  export interface MetaString extends _.DataType<"MetaString", string> {}
  export interface MetaInlines extends _.DataType<"MetaInlines", Inline[]> {}
  export interface MetaBlocks extends _.DataType<"MetaBlocks", Block[]> {}
}

/** Block element */
export type Block = _.Values<Block._All>

export namespace Block {
  export interface _All {
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
  export interface Plain extends _.DataType<"Plain", Inline[]> {}

  /** Paragraph */
  export interface Para extends _.DataType<"Para", Inline[]> {}

  /** Multiple non-breaking lines */
  export interface LineBlock extends _.DataType<"LineBlock", Inline[][]> {}

  /** Code block (literal) with attributes */
  export interface CodeBlock
    extends _.DataType<
      "CodeBlock",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Content */ 1: string
      }>
    > {}

  /** Raw block */
  export interface RawBlock
    extends _.DataType<
      "RawBlock",
      _.Tuple<{
        /** Format */ 0: Format
        /** Content */ 1: string
      }>
    > {}

  /** Block quote (list of `Block`s) */
  export interface BlockQuote extends _.DataType<"BlockQuote", Block[]> {}

  /** Ordered list (attributes and a list of items, each a list of `Block`s) */
  export interface OrderedList
    extends _.DataType<
      "OrderedList",
      _.Tuple<{
        /** List Attributes */ 0: ListAttributes
        /** Content */ 1: Block[][]
      }>
    > {}

  /** Bullet list (list of items, each a list of `Block`s) */
  export interface BulletList extends _.DataType<"BulletList", Block[][]> {}

  /** Definition list. Each list item is a pair consisting of a term (a list of `Inline`s) and one or more definitions (each a list of `Block`s) */
  export interface DefinitionList
    extends _.DataType<
      "DefinitionList",
      Array<
        _.Tuple<{
          /** Term */ 0: Inline[]
          /** Definition */ 1: Block[][]
        }>
      >
    > {}

  /** Header - level (`number`) and text (`Inline`s) */
  export interface Header
    extends _.DataType<
      "Header",
      _.Tuple<{
        /** Level */ 0: number
        /** Attributes */ 1: Attr
        /** Text */ 2: Inline[]
      }>
    > {}

  /** Horizontal rule */
  export interface HorizontalRule extends _.DataType<"HorizontalRule"> {}

  /** Table, with caption, column alignments (required), relative column widths (0 = default), column headers (each a list of `Block`s), and rows (each a list of lists of `Block`s) */
  export interface Table
    extends _.DataType<
      "Table",
      _.Tuple<{
        /** Caption */ 0: Inline[]
        /** Column alignments */ 1: Alignment[]
        /** Relative column width */ 2: number[]
        /** Column headers */ 3: TableCell[]
        /** Rows */ 4: TableCell[][]
      }>
    > {}

  /** Generic block container with attributes */
  export interface Div
    extends _.DataType<
      "Div",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Content */ 1: Block[]
      }>
    > {}

  /** Nothing */
  export interface Null extends _.DataType<"Null"> {}
}

/** Inline elements */
export type Inline = _.Values<Inline._All>

export namespace Inline {
  export interface _All {
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
  export interface Str extends _.DataType<"Str", string> {}

  /** Emphasized text (list of `Inline`s) */
  export interface Emph extends _.DataType<"Emph", Inline[]> {}

  /** Strongly emphasized text (list of `Inline`s) */
  export interface Strong extends _.DataType<"Strong", Inline[]> {}

  /** Strikeout text (list of `Inline`s) */
  export interface Strikeout extends _.DataType<"Strikeout", Inline[]> {}

  /** Superscripted text (list of `Inline`s) */
  export interface Superscript extends _.DataType<"Superscript", Inline[]> {}

  /** Subscripted text (list of `Inline`s) */
  export interface Subscript extends _.DataType<"Subscript", Inline[]> {}

  /** Small caps text (list of `Inline`s) */
  export interface SmallCaps extends _.DataType<"SmallCaps", Inline[]> {}

  /** Quoted text (list of `Inline`s) */
  export interface Quoted
    extends _.DataType<
      "Quoted",
      _.Tuple<{
        /** Quote type */ 0: QuoteType
        /** Text */ 1: Inline[]
      }>
    > {}

  /** Citation (list of `Inline`s) */
  export interface Cite
    extends _.DataType<
      "Cite",
      _.Tuple<{
        /** Reference */ 0: Citation[]
        /** Text */ 1: Inline[]
      }>
    > {}

  /** Inline code (literal) */
  export interface Code
    extends _.DataType<
      "Code",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Code */ 1: string
      }>
    > {}

  /** Inter-word space */
  export interface Space extends _.DataType<"Space"> {}

  /** Soft line break */
  export interface SoftBreak extends _.DataType<"SoftBreak"> {}

  /** Hard line break */
  export interface LineBreak extends _.DataType<"LineBreak"> {}

  /** TeX math (literal) */
  export interface Math
    extends _.DataType<
      "Math",
      _.Tuple<{
        /** Math type */ 0: MathType
        /** Content */ 1: string
      }>
    > {}

  /** Raw inline */
  export interface RawInline
    extends _.DataType<
      "RawInline",
      _.Tuple<{
        /** Format */ 0: Format._Output
        /** Content */ 1: string
      }>
    > {}

  /** Hyperlink: alt text (list of `Inline`s), `Target` */
  export interface Link
    extends _.DataType<
      "Link",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Text */ 1: Inline[]
        /** Target */ 2: Target
      }>
    > {}

  /** Image: alt text (list of `Inline`s), `Target` */
  export interface Image
    extends _.DataType<
      "Image",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Caption */ 1: Inline[]
        /** Target */ 2: Target
      }>
    > {}

  /** Footnote or endnote */
  export interface Note extends _.DataType<"Note", Block[]> {}

  /** Generic inline container with attributes */
  export interface Span
    extends _.DataType<
      "Span",
      _.Tuple<{
        /** Attributes */ 0: Attr
        /** Text */ 1: Inline[]
      }>
    > {}
}

/** Alignment of a table column */
export type Alignment = _.Values<Alignment._All>

export namespace Alignment {
  export interface _All {
    AlignLeft: AlignLeft
    AlignRight: AlignRight
    AlignCenter: AlignCenter
    AlignDefault: AlignDefault
  }

  export interface AlignLeft extends _.DataType<"AlignLeft"> {}
  export interface AlignRight extends _.DataType<"AlignRight"> {}
  export interface AlignCenter extends _.DataType<"AlignCenter"> {}
  export interface AlignDefault extends _.DataType<"AlignDefault"> {}
}
/** List attributes. */
export interface ListAttributes
  extends _.Tuple<{
    /** Starting number */ 0: number
    /** Number style */ 1: ListNumberStyle
    /** Number delimiter */ 2: ListNumberDelim
  }> {}

/** Style of list numbers. */
export type ListNumberStyle = _.Values<ListNumberStyle._All>

export namespace ListNumberStyle {
  export interface _All {
    DefaultStyle: DefaultStyle
    Example: Example
    Decimal: Decimal
    LowerRoman: LowerRoman
    UpperRoman: UpperRoman
    LowerAlpha: LowerAlpha
    UpperAlpha: UpperAlpha
  }

  export interface DefaultStyle extends _.DataType<"DefaultStyle"> {}
  export interface Example extends _.DataType<"Example"> {}
  export interface Decimal extends _.DataType<"Decimal"> {}
  export interface LowerRoman extends _.DataType<"LowerRoman"> {}
  export interface UpperRoman extends _.DataType<"UpperRoman"> {}
  export interface LowerAlpha extends _.DataType<"LowerAlpha"> {}
  export interface UpperAlpha extends _.DataType<"UpperAlpha"> {}
}

/** Delimiter of list numbers. */
export type ListNumberDelim = _.Values<ListNumberDelim._All>

export namespace ListNumberDelim {
  export interface _All {
    DefaultDelim: DefaultDelim
    Period: Period
    OneParen: OneParen
    TwoParens: TwoParens
  }

  export interface DefaultDelim extends _.DataType<"DefaultDelim"> {}
  export interface Period extends _.DataType<"Period"> {}
  export interface OneParen extends _.DataType<"OneParen"> {}
  export interface TwoParens extends _.DataType<"TwoParens"> {}
}

/** Pandoc formats */
export type Format = Format._Input | Format._Output

export namespace Format {
  /** Pandoc input formats */
  export type _Input =
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
  export type _Output =
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
    /** Key-value pairs */ 2: Array<
      _.Tuple<{
        /** Key */ 0: string
        /** Value */ 1: string
      }>
    >
  }> {}

/** Table cells are list of `Block`s */
export interface TableCell extends Array<Block> {}

/** Type of quotation marks to use in `Quoted` inline. */
export type QuoteType = _.Values<QuoteType._All>

export namespace QuoteType {
  export interface _All {
    SingleQuote: SingleQuote
    DoubleQuote: DoubleQuote
  }

  export interface SingleQuote extends _.DataType<"SingleQuote"> {}
  export interface DoubleQuote extends _.DataType<"DoubleQuote"> {}
}

/** [url, title] */
export interface Target
  extends _.Tuple<{
    /** Url */ 0: string
    /** Title */ 1: string
  }> {}

/** Type of math element (display or inline). */
export type MathType = _.Values<MathType._All>

export namespace MathType {
  export interface _All {
    DisplayMath: DisplayMath
    InlineMath: InlineMath
  }

  export interface DisplayMath extends _.DataType<"DisplayMath"> {}
  export interface InlineMath extends _.DataType<"InlineMath"> {}
}

export interface Citation {
  citationId: string
  citationPrefix: Inline[]
  citationSuffix: Inline[]
  citationMode: CitationMode
  citationNoteNum: number
  citationHash: number
}

export type CitationMode = _.Values<CitationMode._All>

export namespace CitationMode {
  export interface _All {
    AuthorInText: AuthorInText
    SuppressAuthor: SuppressAuthor
    NormalCitation: NormalCitation
  }

  export interface AuthorInText extends _.DataType<"AuthorInText"> {}
  export interface SuppressAuthor extends _.DataType<"SuppressAuthor"> {}
  export interface NormalCitation extends _.DataType<"NormalCitation"> {}
}

export type _Node = _.Values<_Node._All>

export namespace _Node {
  export type _All = Block._All & Inline._All
}
