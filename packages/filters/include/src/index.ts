import * as AST from "@pandoc/ast"
import { pandoc } from "@pandoc/wrapper"
import { dirname, resolve } from "path"
import { walkBlock } from "../../../filter-utils/lib"

function parseBlocks(path: string, lang = "markdown") {
  return pandoc(undefined, "markdown", { "": path }).then(json => json!.blocks)
}

export async function transformBlocks(
  baseFolder: string,
  blocks: AST.Block[]
): Promise<void> {
  for (const block of await walkBlock("CodeBlock", blocks, true)) {
    if (block.c[0 /* attrs */][1 /* classes */][0 /* lang */] !== "include")
      continue

    const files = block.c[1 /* content */].trim().split("\n")

    for (const filePath of files) {
      const [path, lang = "markdown"] = filePath
        .trim()
        .split("!")
        .map(str => str.trim())

      const file = resolve(baseFolder, path)
      const folder = dirname(file)

      const blocks = await parseBlocks(file, lang)
      transformBlocks(folder, blocks)

      const div: AST.Block.Div = {
        t: "Div",
        c: [["", ["included"], []], blocks]
      }
      Object.assign(block, div)
    }
  }
}

export async function transformFile(
  baseFolder: string,
  input: AST.Document
): Promise<AST.Document> {
  transformBlocks(baseFolder, input.blocks)
  return input
}

export default transformFile
