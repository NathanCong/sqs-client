interface ChatHistory {
  [chatId: string]: ChatMessage[]
}

interface ListData {
  columns: ColumnsType | undefined
  dataSource: Array<unknown>
  total?: number
  pageSize?: number
  pageNum?: number
}

type PreviewData = string | ListData | null
