type _DataType<T extends string, U> = {
  t: T
  c: U
}

export interface JSON {
  "pandoc-api-version": number[]
  blocks: Block[]
  meta: Meta
}

export type Meta = { [key: string]: Meta.Value }

export declare namespace Meta {
  type Value =
    | Meta.Map
    | Meta.List
    | Meta.Bool
    | Meta.String
    | Meta.Inlines
    | Meta.Blocks

  interface Map extends _DataType<"MetaMap", { [key: string]: Meta.Value }> {}
  interface List extends _DataType<"MetaList", Meta.Value[]> {}
  interface Bool extends _DataType<"MetaBool", boolean> {}
  interface String extends _DataType<"MetaString", string> {}
  interface Inlines extends _DataType<"MetaInlines", Inline[]> {}
  interface Blocks extends _DataType<"MetaBlocks", Block[]> {}
}

export type Block =
  | Block.Plain
  | Block.Para
  | Block.LineBlock
  | Block.CodeBlock
  | Block.RawBlock
  | Block.BlockQuote
  | Block.OrderedList
  | Block.BulletList
  | Block.DefinitionList
  | Block.Header
  | Block.HorizontalRule
  | Block.Table
  | Block.Div
  | Block.Null

export declare namespace Block {
  interface Plain extends _DataType<"Plain", Inline[]> {}
  interface Para extends _DataType<"Para", Inline[]> {}
  interface LineBlock extends _DataType<"LineBlock", Inline[][]> {}
  interface CodeBlock extends _DataType<"CodeBlock", [Attr, string]> {}
  interface RawBlock extends _DataType<"RawBlock", [Format, string]> {}
  interface BlockQuote extends _DataType<"BlockQuote", Block[]> {}
  interface OrderedList
    extends _DataType<"OrderedList", [List.Attributes, Block[][]]> {}
  interface BulletList extends _DataType<"BulletList", Block[][]> {}
  interface DefinitionList
    extends _DataType<"DefinitionList", [Inline[], Block[][]][]> {}
  interface Header extends _DataType<"Header", [number, Attr, Inline[]]> {}
  interface HorizontalRule extends _DataType<"HorizontalRule", undefined> {}
  interface Table
    extends _DataType<
        "Table",
        [Inline[], Alignment[], number[], TableCell[], TableCell[][]]
      > {}
  interface Div extends _DataType<"Div", [Attr, Block[]]> {}
  interface Null extends _DataType<"Null", undefined> {}
}

export type Inline =
  | Inline.Str
  | Inline.Emph
  | Inline.Strong
  | Inline.Strikeout
  | Inline.Superscript
  | Inline.Subscript
  | Inline.SmallCaps
  | Inline.Quoted
  | Inline.Cite
  | Inline.Code
  | Inline.Space
  | Inline.SoftBreak
  | Inline.LineBreak
  | Inline.Math
  | Inline.RawInline
  | Inline.Link
  | Inline.Image
  | Inline.Note
  | Inline.Span

export declare namespace Inline {
  interface Str extends _DataType<"Str", string> {}
  interface Emph extends _DataType<"Emph", Inline[]> {}
  interface Strong extends _DataType<"Strong", Inline[]> {}
  interface Strikeout extends _DataType<"Strikeout", Inline[]> {}
  interface Superscript extends _DataType<"Superscript", Inline[]> {}
  interface Subscript extends _DataType<"Subscript", Inline[]> {}
  interface SmallCaps extends _DataType<"SmallCaps", Inline[]> {}
  interface Quoted extends _DataType<"Quoted", [QuoteType, Inline[]]> {}
  interface Cite extends _DataType<"Cite", [Citation[], Inline[]]> {}
  interface Code extends _DataType<"Code", [Attr, string]> {}
  interface Space extends _DataType<"Space", undefined> {}
  interface SoftBreak extends _DataType<"SoftBreak", undefined> {}
  interface LineBreak extends _DataType<"LineBreak", undefined> {}
  interface Math extends _DataType<"Math", [MathType, string]> {}
  interface RawInline extends _DataType<"RawInline", [Format, string]> {}
  interface Link extends _DataType<"Link", [Attr, Inline[], Target]> {}
  interface Image extends _DataType<"Image", [Attr, Inline[], Target]> {}
  interface Note extends _DataType<"Note", Block[]> {}
  interface Span extends _DataType<"Span", [Attr, Inline[]]> {}
}

export type Alignment =
  | "AlignLeft"
  | "AlignRight"
  | "AlignCenter"
  | "AlignDefault"

export declare namespace List {
  type Attributes = [number, Number.Style, Number.Delim]

  namespace Number {
    type Style =
      | "DefaultStyle"
      | "Example"
      | "Decimal"
      | "LowerRoman"
      | "UpperRoman"
      | "LowerAlpha"
      | "UpperAlpha"

    type Delim = "DefaultDelim" | "Period" | "OneParen" | "TwoParens"
  }
}

export type Format = string

/**
 * [identifier, classes, key-value pairs]
 */
export type Attr = [string, string[], [string, string][]]

export type TableCell = Block[]

export type QuoteType = "SingleQuote" | "DoubleQuote"

/**
 * [url, title]
 */
export type Target = [string, string]

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
