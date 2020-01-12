import { Block, Inline } from "@pandoc/types"
import { walkBlocks, walkInlines } from "./walkers"

export function* walkBlock<T extends keyof Block._All>(
  type: T,
  blocks: Block[],
  inInlines = false
): IterableIterator<Block._All[T]> {
  for (const block of walkBlocks(blocks, inInlines)) {
    if (block.t === type) yield block
  }
}

export function* walkInline<T extends keyof Inline._All>(
  type: T,
  inlines: Inline[],
  inBlocks = false
): IterableIterator<Inline._All[T]> {
  for (const inline of walkInlines(inlines, inBlocks)) {
    if (inline.t === type) yield inline
  }
}
