import { Block, Inline } from "@pandoc/types"
import { nodeIsOfType, TypeOfNode } from "./util"
import { walkBlocks, walkInlines } from "./walkers"

export function* walkBlock<T extends Block>(
  type: TypeOfNode<T>,
  blocks: Block[],
  inInlines = false
): IterableIterator<T> {
  for (const block of walkBlocks(blocks, inInlines)) {
    if (nodeIsOfType(block, type)) yield block
  }
}

export function* walkInline<T extends Inline>(
  type: TypeOfNode<T>,
  inlines: Inline[],
  inBlocks = false
): IterableIterator<T> {
  for (const inline of walkInlines(inlines, inBlocks)) {
    if (nodeIsOfType(inline, type)) yield inline
  }
}
