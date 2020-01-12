import { _Node } from "@pandoc/types"

export type TypeOfNode<T extends _Node> = T["t"]

export function nodeIsOfType<T extends _Node>(
  node: _Node,
  type: TypeOfNode<T>
): node is T {
  return node.t === type
}
