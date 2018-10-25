import { Block, Inline } from "@pandoc/ast"

export function* walkBlocks(
  blocks: Iterable<Block>,
  inInlines = false
): IterableIterator<Block> {
  for (const block of blocks) {
    yield block
    switch (block.t) {
      case "Plain":
      case "Para": {
        if (inInlines) yield* walkBlocksInInlines(block.c)
        break
      }
      case "LineBlock": {
        if (inInlines)
          for (const list of block.c) yield* walkBlocksInInlines(list)
        break
      }
      case "CodeBlock":
      case "RawBlock":
      case "Header":
      case "HorizontalRule":
      case "Null": {
        break
      }
      case "BlockQuote": {
        yield* walkBlocks(block.c, inInlines)
        break
      }
      case "OrderedList": {
        for (const innerBlocks of block.c[1])
          yield* walkBlocks(innerBlocks, inInlines)
        break
      }
      case "BulletList": {
        for (const innerBlocks of block.c)
          yield* walkBlocks(innerBlocks, inInlines)
        break
      }
      case "DefinitionList": {
        for (const [inlines, innerBlocks] of block.c) {
          if (inInlines) yield* walkBlocksInInlines(inlines)
          for (const list of innerBlocks) yield* walkBlocks(list, inInlines)
        }
        break
      }
      case "Table": {
        const [inlines, , , headers, grid] = block.c
        if (inInlines) yield* walkBlocksInInlines(inlines)
        for (const cell of headers) yield* walkBlocks(cell, inInlines)
        for (const row of grid)
          for (const cell of row) yield* walkBlocks(cell, inInlines)
        break
      }
      case "Div": {
        yield* walkBlocks(block.c[1], inInlines)
        break
      }
      default: {
        throw new Error(`Unrecognized block: ${(block as any).t}`)
      }
    }
  }
}

export function* walkInlines(
  inlines: Iterable<Inline>,
  inBlocks = false
): IterableIterator<Inline> {
  for (const inline of inlines) {
    yield inline
    switch (inline.t) {
      case "Str":
      case "Code":
      case "Space":
      case "SoftBreak":
      case "LineBreak":
      case "Math":
      case "RawInline": {
        break
      }
      case "Emph":
      case "Strong":
      case "Strikeout":
      case "Superscript":
      case "Subscript":
      case "SmallCaps": {
        yield* walkInlines(inline.c, inBlocks)
        break
      }
      case "Quoted":
      case "Cite":
      case "Link":
      case "Image":
      case "Span": {
        yield* walkInlines(inline.c[1], inBlocks)
        break
      }
      case "Note": {
        if (inBlocks) yield* walkInlinesInBlocks(inline.c)
        break
      }
      default: {
        throw new Error(`Unrecognized inline: ${(inline as any).t}`)
      }
    }
  }
}

export function* walkBlocksInInlines(
  inlines: Iterable<Inline>
): IterableIterator<Block> {
  for (const inline of inlines) {
    switch (inline.t) {
      case "Str":
      case "Emph":
      case "Strong":
      case "Strikeout":
      case "Superscript":
      case "Subscript":
      case "SmallCaps":
      case "Quoted":
      case "Cite":
      case "Code":
      case "Space":
      case "SoftBreak":
      case "LineBreak":
      case "Math":
      case "RawInline":
      case "Link":
      case "Image":
      case "Span": {
        break
      }
      case "Note": {
        yield* walkBlocks(inline.c, true)
        break
      }
      default: {
        throw new Error(`Unrecognized inline: ${(inline as any).t}`)
      }
    }
  }
}

export function* walkInlinesInBlocks(
  blocks: Iterable<Block>
): IterableIterator<Inline> {
  for (const block of blocks) {
    switch (block.t) {
      case "Plain":
      case "Para": {
        yield* walkInlines(block.c, true)
        break
      }
      case "LineBlock": {
        for (const inlines of block.c) yield* walkInlines(inlines, true)
        break
      }
      case "CodeBlock":
      case "RawBlock": {
        break
      }
      case "BlockQuote": {
        yield* walkInlinesInBlocks(block.c)
        break
      }
      case "OrderedList": {
        for (const innerBlocks of block.c[1])
          yield* walkInlinesInBlocks(innerBlocks)
        break
      }
      case "BulletList": {
        for (const innerBlocks of block.c)
          yield* walkInlinesInBlocks(innerBlocks)
        break
      }
      case "DefinitionList": {
        for (const [inlines, innerBlocks] of block.c) {
          yield* walkInlines(inlines, true)
          for (const list of innerBlocks) yield* walkInlinesInBlocks(list)
        }
        break
      }
      case "Header": {
        yield* walkInlines(block.c[2], true)
        break
      }
      case "HorizontalRule":
      case "Null": {
        break
      }
      case "Table": {
        const [inlines, , , headers, grid] = block.c
        yield* walkInlines(inlines, true)
        for (const innerBlocks of headers)
          yield* walkInlinesInBlocks(innerBlocks)
        for (const row of grid)
          for (const cell of row) yield* walkInlinesInBlocks(cell)
        break
      }
      case "Div": {
        yield* walkInlinesInBlocks(block.c[1])
        break
      }
      default: {
        throw new Error(`Unrecognized block: ${(block as any).t}`)
      }
    }
  }
}
