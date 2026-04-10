<!-- 批量检索表单 -->
<template>
  <div class="batch-form-panel">
    <CommonPanel title="信息采集">
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content">
        <CommonForm ref="commonFormRef" :form-config="formConfig" />
      </div>
      <template #footer-buttons>
        <a-button type="primary" @click="onConfirm">确认</a-button>
      </template>
    </CommonPanel>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CommonPanel from './common/CommonPanel.vue'
import CommonForm from './common/CommonForm.vue'
import type { CommonFormConfig } from './common/CommonForm.vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useToolStore } from '@/store/tool'
import { useChatStore } from '@/store/chat'
import { searchPatents } from '@/apis'
import { TABLE_COLUMNS } from '../constants/index'
import { useSearchStore } from '@/store/search'
import { useUserStore } from '@/store/user'

const toolStore = useToolStore()
const searchStore = useSearchStore()
const userStore = useUserStore()

function onClose() {
  toolStore.closeAllPanels()
}

// 定义 state
const commonFormRef = ref<InstanceType<typeof CommonForm>>()
const formConfig = ref<CommonFormConfig>({
  fields: [
    {
      key: 'content',
      name: 'content',
      label: '专利号',
      rules: [{ required: true, message: '专利号是必填项' }],
      placeholder: '请批量输入专利号，以逗号分割',
      type: 'textarea'
    }
  ]
})

async function handleBatchQuery(ids: string[]) {
  try {
    const q = `(${ids.map((id) => `an=${id}`).join(' or ')})`
    console.log('q', q)
    const { userEmail = '' } = userStore.getUserInfo() || {}
    if (userEmail) {
      searchStore.addSearchHistory(userEmail, q)
    }
    const { data: res } = await searchPatents({ page: 1, q })
    const {
      data: { list, total }
    } = res as { success: boolean; data: { list: unknown[]; total: number } }
    console.log('万象云查询到的条数：', total)
    return { list, total }
  } catch (error) {
    console.warn(error)
  }
}

const chatStore = useChatStore()

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { content } = formData || {}
    console.log('content: ', content)
    const { list = [] } = (await handleBatchQuery(content.split(','))) || {}
    console.log('list: ', list)
    chatStore.addMessage({
      role: 'assistant',
      type: 'list',
      data: {
        name: '查询结果',
        columns: TABLE_COLUMNS as ColumnItem[],
        dataSource: list.map((item: any) => {
          const {
            id,
            title: { original },
            applicants,
            application_number,
            application_date,
            earliest_publication_date,
            inventors,
            assignees,
            main_ipc,
            pav
          } = item
          return {
            id,
            // 专利名称
            patentName: original,
            // 初始申请人
            initialApplicant: applicants[0].name.original,
            // 申请号
            applicationNumber: application_number,
            // 申请日
            applicationDate: application_date,
            // 公开号/公开日
            publicationDate: earliest_publication_date,
            // 发明人
            inventors: inventors
              .map((i: { name: { original: string } }) => i.name.original)
              .join(','),
            // 当前权利人
            currentAssignee: assignees[0].name.original,
            // 主分类号
            mainIpc: main_ipc.ipc,
            // 价值评分
            valueScore: pav
          }
        }),
        pagination: { total: 0, pageNum: 1, pageSize: 10 }
      }
    })
    onClose()
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.batch-form-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
