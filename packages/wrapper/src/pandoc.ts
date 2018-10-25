import * as AST from "@pandoc/ast"
import { Format } from "@pandoc/ast"
import execa from "execa"
import toPairs from "lodash.topairs"

const camelCaseToDashes = (str: string) =>
  str.replace(/([A-Z])/g, `-$1`).toLowerCase()
function* argifier(arg: string, val?: string): IterableIterator<string> {
  if (arg.length === 1) {
    yield `-${arg}`
    if (val) yield `${val}`
  } else {
    yield `--${camelCaseToDashes(arg)}` + (val ? `='${val}'` : "")
  }
}

export declare namespace pandoc {
  export interface Options {
    [arg: string]: true | string | string[] | undefined
  }
}

export function pandoc(
  input?:
    | [string | Buffer | NodeJS.ReadableStream, Format.Input]
    | Format.Input,
  outputFormat?: Format.Output,
  options: Partial<pandoc.Options> = {},
  execaOptions?: Partial<execa.Options>
): Promise<AST.Document | null> {
  const cmdOpts: pandoc.Options = {
    from:
      (Array.isArray(input) && input[1]) ||
      (typeof input === "string" && input) ||
      undefined,
    to: outputFormat || undefined,
    ...options
  }

  const execaOpts: execa.Options = {
    stderr: "inherit",
    input: (input && typeof input !== "string" && input[0]) || undefined,
    ...execaOptions
  }

  const cmdArgs: string[] = [
    ...(function*() {
      for (const [arg, val] of toPairs(cmdOpts)) {
        if (val == null) {
          continue
        } else if (val === true) {
          yield* argifier(arg)
        } else if (Array.isArray(val)) {
          for (const i of arg) yield* argifier(arg, i)
        } else if (typeof val === "string") {
          yield* argifier(arg, val)
        } else {
          throw new Error(`Unexpected value for pandoc option ${arg}`)
        }
      }
    })()
  ]

  return execa
    .stdout("pandoc", cmdArgs, execaOpts)
    .then(stdout => (stdout ? JSON.parse(stdout) : null))
}
