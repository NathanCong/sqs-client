export const SELECTOR_OPTIONS = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]

export const TABLE_COLUMNS = [
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
    key: 'relevanceScore',
    dataIndex: 'relevanceScore',
    title: '相关性评分'
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
