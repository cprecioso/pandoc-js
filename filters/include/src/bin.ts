#!/usr/bin/env node

import { createPlugin } from "@pandoc/filter-utils"
import transformFile from "."

createPlugin(ast => transformFile(process.cwd(), ast))
