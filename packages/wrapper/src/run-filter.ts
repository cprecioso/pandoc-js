import { Document } from "@pandoc/ast"
import immer from "immer"

type Filter = (ast: Document) => void | Document

export function runFilters(
  filters: Filter | (Filter[]),
  ast: Document
): Document {
  return (Array.isArray(filters) ? filters : [filters]).reduce(
    (ast, filter) => immer(ast, ast => filter(ast as Document)),
    ast
  )
}
