/**
 * 表达式类型映射
 */
export const EXPRESSION_TYPE_MAP = {
  SEARCH: '1',
  ANALYSIS: '2'
}

/**
 * 表达式类型选项
 */
export const EXPRESSION_TYPE_OPTIONS = [
  { label: '检索式', value: EXPRESSION_TYPE_MAP.SEARCH },
  { label: '分析式', value: EXPRESSION_TYPE_MAP.ANALYSIS }
]

/**
 * POC 问题类型选项
 */
export const POC_QUESTION_TYPE_OPTIONS = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]

/**
 * 专利预览 Table 列
 */
export const PARENT_PREVIEW_TABLE_COLUMNS = [
  {
    key: 'patentName',
    dataIndex: 'patentName',
    title: '专利名称'
  },
  {
    key: 'initialApplicant',
    dataIndex: 'initialApplicant',
    title: '初始申请人'
  },
  {
    key: 'applicationNumber',
    dataIndex: 'applicationNumber',
    title: '申请号'
  },
  {
    key: 'applicationDate',
    dataIndex: 'applicationDate',
    title: '申请日'
  },
  {
    key: 'publicationDate',
    dataIndex: 'publicationDate',
    title: '公开号/公开日'
  },
  {
    key: 'inventors',
    dataIndex: 'inventors',
    title: '发明人'
  },
  {
    key: 'currentAssignee',
    dataIndex: 'currentAssignee',
    title: '当前权利人'
  },
  {
    key: 'mainIpc',
    dataIndex: 'mainIpc',
    title: '主分类号'
  },
  {
    key: 'valueScore',
    dataIndex: 'valueScore',
    title: '价值评分'
  },
  {
    key: 'actions',
    width: 120,
    fixed: 'right',
    title: '操作'
  }
]

/**
 * 检索历史 Table 列
 */
export const SEARCH_HISTORY_TABLE_COLUMNS = [
  {
    key: 'user',
    dataIndex: 'user',
    title: '用户'
  },
  {
    key: 'q',
    dataIndex: 'q',
    title: '检索词'
  }
]
