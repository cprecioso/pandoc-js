#!/usr/bin/env node

import getStdin from "get-stdin";
import transformFile from ".";
import * as AST from "../types/pandoc-ast";

void (async () => {
  const input: AST.JSON = JSON.parse(await getStdin())
  const output: AST.JSON = await transformFile(input)
  console.log(JSON.stringify(output))
})()
