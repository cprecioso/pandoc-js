import { Block, Inline, Node } from "./ast"

type ArgsType<T extends Function> = T extends (...args: infer U) => any
  ? U
  : never

interface Constructor<T extends Node> {
  (...content: T["c"] extends any[] ? T["c"] : [T["c"]]): T
}

function createConstructor<T extends keyof Node._All>(
  type: T
): Constructor<Node._All[T]> {
  return (...content) =>
    ({
      t: type,
      c: content.length === 1 ? content[0] : content
    } as Node._All[T])
}

export function createNode<T extends keyof Node._All>(
  type: T,
  ...content: ArgsType<Constructor<Node._All[T]>>
): Node._All[T] {
  return createConstructor(type)(...content)
}

export const createPlain: Constructor<Block.Plain> = createConstructor("Plain")
export const createPara: Constructor<Block.Para> = createConstructor("Para")
export const createLineBlock: Constructor<Block.LineBlock> = createConstructor(
  "LineBlock"
)
export const createCodeBlock: Constructor<Block.CodeBlock> = createConstructor(
  "CodeBlock"
)
export const createRawBlock: Constructor<Block.RawBlock> = createConstructor(
  "RawBlock"
)
export const createBlockQuote: Constructor<
  Block.BlockQuote
> = createConstructor("BlockQuote")
export const createOrderedList: Constructor<
  Block.OrderedList
> = createConstructor("OrderedList")
export const createBulletList: Constructor<
  Block.BulletList
> = createConstructor("BulletList")
export const createDefinitionList: Constructor<
  Block.DefinitionList
> = createConstructor("DefinitionList")
export const createHeader: Constructor<Block.Header> = createConstructor(
  "Header"
)
export const createHorizontalRule: Constructor<
  Block.HorizontalRule
> = createConstructor("HorizontalRule")
export const createTable: Constructor<Block.Table> = createConstructor("Table")
export const createDiv: Constructor<Block.Div> = createConstructor("Div")
export const createNull: Constructor<Block.Null> = createConstructor("Null")
export const createStr: Constructor<Inline.Str> = createConstructor("Str")
export const createEmph: Constructor<Inline.Emph> = createConstructor("Emph")
export const createStrong: Constructor<Inline.Strong> = createConstructor(
  "Strong"
)
export const createStrikeout: Constructor<Inline.Strikeout> = createConstructor(
  "Strikeout"
)
export const createSuperscript: Constructor<
  Inline.Superscript
> = createConstructor("Superscript")
export const createSubscript: Constructor<Inline.Subscript> = createConstructor(
  "Subscript"
)
export const createSmallCaps: Constructor<Inline.SmallCaps> = createConstructor(
  "SmallCaps"
)
export const createQuoted: Constructor<Inline.Quoted> = createConstructor(
  "Quoted"
)
export const createCite: Constructor<Inline.Cite> = createConstructor("Cite")
export const createCode: Constructor<Inline.Code> = createConstructor("Code")
export const createSpace: Constructor<Inline.Space> = createConstructor("Space")
export const createSoftBreak: Constructor<Inline.SoftBreak> = createConstructor(
  "SoftBreak"
)
export const createLineBreak: Constructor<Inline.LineBreak> = createConstructor(
  "LineBreak"
)
export const createMath: Constructor<Inline.Math> = createConstructor("Math")
export const createRawInline: Constructor<Inline.RawInline> = createConstructor(
  "RawInline"
)
export const createLink: Constructor<Inline.Link> = createConstructor("Link")
export const createImage: Constructor<Inline.Image> = createConstructor("Image")
export const createNote: Constructor<Inline.Note> = createConstructor("Note")
export const createSpan: Constructor<Inline.Span> = createConstructor("Span")
