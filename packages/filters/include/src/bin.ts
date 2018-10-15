#!/usr/bin/env node

import * as AST from "@pandoc/ast"
import getStdin from "get-stdin"
import transformFile from "."

void (async () => {
  const input: AST.Document = JSON.parse(await getStdin())
  const output: AST.Document = await transformFile(input)
  console.log(JSON.stringify(output))
})()
