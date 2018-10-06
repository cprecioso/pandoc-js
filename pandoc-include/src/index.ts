import execa from "execa"
import { resolve } from "path"
import * as AST from "../types/pandoc-ast"

async function collectAsyncGenerator<T>(iter: AsyncIterable<T>) {
  const ret: T[] = []
  for await (const item of iter) ret.push(item)
  return ret
}

async function parseBlocks(path: string, lang = "markdown") {
  const { stdout } = await execa(
    "pandoc",
    ["-f", lang, "-t", "json", resolve(path)],
    {
      stdio: ["ignore", "pipe", "inherit"]
    }
  )
  const ast: AST.JSON = JSON.parse(stdout)
  return ast.blocks
}

export async function* transformBlocks(
  blocks: AST.Block[] | Promise<AST.Block[]>
): AsyncIterableIterator<AST.Block> {
  for (const block of await Promise.resolve(blocks)) {
    if (
      block.t !== "CodeBlock" ||
      block.c[0 /* attrs */][1 /* classes */][0 /* lang */] !== "include"
    ) {
      yield block
      continue
    }

    const files = (block as AST.Block.CodeBlock).c[1 /* content */]
      .trim()
      .split("\n")

    for (const filePath of files) {
      const [path, lang = "markdown"] = filePath
        .trim()
        .split("!")
        .map(str => str.trim())

      yield* transformBlocks(parseBlocks(path, lang))
    }
  }
}

export async function transformFile(input: AST.JSON): Promise<AST.JSON> {
  input.blocks = await collectAsyncGenerator(transformBlocks(input.blocks))
  return input
}

export default transformFile
