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

interface Content {
  code: string
  content: string
}

type PreviewData = string | Content[] | ListData | null
