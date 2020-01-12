import * as AST from "@pandoc/types"
import getStdin from "get-stdin"

export type Filter = (ast: AST.Document) => AST.Document | Promise<AST.Document>

export function createPlugin(filter: Filter) {
  getStdin()
    .then(JSON.parse)
    .then(filter)
    .then(JSON.stringify)
    .then(console.log.bind(console), console.error.bind(console))
}
