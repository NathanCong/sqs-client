/**
 * 语义 & 功能映射
 */
export const SEMANTICS_TOOLS_MAP = {
  '-2': '与专利有关的咨询（不触发系统功能）',
  '-1': '与专利无关的咨询（闲聊）',
  '1': '专利普通检索', // 触发 -> 搜索列表
  '2': '专利高级检索', // 触发 -> 高级搜索信息采集
  '3': '专利批量检索', // 触发 -> 批量搜索信息采集
  '4': '专利查新检索', // ?
  '5': '交底书撰写助手', // 触发 -> 交底书相关信息采集
  '6': '专利撰写助手', // 触发 -> 专利相关信息采集
  '7': '专利智能分析' // ?
}

export const PATENT_TABLE_COLUMNS = [
  {
    title: '专利号',
    dataIndex: 'application_number',
    key: 'application_number'
  },
  {
    title: '专利名称',
    dataIndex: 'title.original',
    key: 'title'
  },
  {
    title: '初始申请人',
    dataIndex: ['applicants', 0, 'name', 'original'],
    key: 'applicant'
  },
  {
    title: '申请号',
    dataIndex: 'application_number',
    key: 'application_number_dup'
  },
  {
    title: '申请日',
    dataIndex: 'application_date',
    key: 'application_date'
  },
  {
    title: '公开号/公开日',
    dataIndex: 'publication',
    key: 'publication'
  },
  {
    title: '发明人',
    dataIndex: 'inventors',
    key: 'inventors'
  },
  {
    title: '当前权利人',
    dataIndex: ['assignees', 0, 'name', 'original'],
    key: 'assignee'
  },
  {
    title: '评分指数',
    dataIndex: 'pav_score',
    key: 'pav_score'
  }
]
