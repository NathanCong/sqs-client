interface AnalysisSemanticsResponse {
  code: number
  category: string
}

interface SearchPatentsFromStrategyResponse {
  total: number
  pageSize: number
  pageNum: number
  list: unknown[]
}

interface HistoryItem {
  role: string
  content: unknown
}
